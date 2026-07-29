#!/usr/bin/env python3
"""Isolate agent-spawning sessions and total their cost.

Usage:
    python3 fleet_sessions.py                       # every session that spawned >=1 agent
    python3 fleet_sessions.py --min-agents 5        # only sessions with >=5 agents
    python3 fleet_sessions.py --model fable         # only sessions that used a matching model
    python3 fleet_sessions.py --since 2026-07-01    # only sessions starting on/after a date
    python3 fleet_sessions.py --min-agents 5 --model fable --since 2026-07-01
    python3 fleet_sessions.py --csv > fleet.csv

--model filters sessions to those where a matching model ran, and reports ONLY that
model's cost (so `--model fable` gives the Fable share of each mixed session).
"""

import argparse
import collections
import csv
import datetime as dt
import glob
import json
import os
import sys

RATES = {
    "claude-fable-5": (10.0, 50.0),
    "claude-mythos-5": (10.0, 50.0),
    "claude-opus-5": (5.0, 25.0),
    "claude-opus-4-8": (5.0, 25.0),
    "claude-opus-4-7": (5.0, 25.0),
    "claude-sonnet-5": (2.0, 10.0),
    "claude-sonnet-4-6": (3.0, 15.0),
    "claude-haiku-4-5": (1.0, 5.0),
}
SPAWN_TOOLS = {"Task", "Agent", "Workflow"}
SHORT = {k: k.replace("claude-", "") for k in RATES}


def parse_ts(raw):
    if not raw:
        return None
    try:
        return dt.datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except ValueError:
        return None


def cost(b, model):
    rate = RATES.get(model)
    if not rate:
        return 0.0, 0.0
    rin, rout = rate
    base = (
        b["input_tokens"] / 1e6 * rin
        + b["cache_read_input_tokens"] / 1e6 * rin * 0.1
        + b["output_tokens"] / 1e6 * rout
    )
    w = b["cache_creation_input_tokens"] / 1e6 * rin
    return base + w * 1.25, base + w * 2.0


def scan(path):
    models = collections.defaultdict(collections.Counter)
    spawns = collections.Counter()
    times = []
    for line in open(path, errors="replace"):
        try:
            rec = json.loads(line)
        except (json.JSONDecodeError, TypeError):
            continue
        ts = parse_ts(rec.get("timestamp"))
        if ts:
            times.append(ts)
        msg = rec.get("message")
        if not isinstance(msg, dict) or msg.get("role") != "assistant":
            continue
        u = msg.get("usage") or {}
        if u:
            b = models[msg.get("model", "?")]
            for f in ("input_tokens", "cache_creation_input_tokens",
                      "cache_read_input_tokens", "output_tokens"):
                b[f] += u.get(f, 0) or 0
        for blk in msg.get("content") or []:
            if isinstance(blk, dict) and blk.get("type") == "tool_use":
                if blk.get("name") in SPAWN_TOOLS:
                    label = (blk.get("input") or {}).get("subagent_type") or blk["name"]
                    spawns[label] += 1
    return models, spawns, times


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-agents", type=int, default=1)
    ap.add_argument("--model", default=None, help="substring, e.g. 'fable'")
    ap.add_argument("--since", default=None, help="YYYY-MM-DD")
    ap.add_argument("--until", default=None, help="YYYY-MM-DD")
    ap.add_argument("--csv", action="store_true")
    ap.add_argument("--root", default=os.path.expanduser("~/.claude/projects"))
    args = ap.parse_args()

    since = dt.datetime.strptime(args.since, "%Y-%m-%d").date() if args.since else None
    until = dt.datetime.strptime(args.until, "%Y-%m-%d").date() if args.until else None

    rows = []
    for p in glob.glob(os.path.join(args.root, "*", "*.jsonl")):
        models, spawns, times = scan(p)
        total_spawns = sum(spawns.values())
        if total_spawns < args.min_agents or not times:
            continue
        start, end = min(times), max(times)
        d = start.astimezone().date()
        if since and d < since:
            continue
        if until and d > until:
            continue

        if args.model:
            matched = [m for m in models if args.model.lower() in m.lower()]
            if not matched:
                continue
        else:
            matched = [m for m in models if m in RATES]

        c5 = c1 = out = inp = 0
        for m in matched:
            b = models[m]
            a, z = cost(b, m)
            c5 += a
            c1 += z
            out += b["output_tokens"]
            inp += (b["input_tokens"] + b["cache_creation_input_tokens"]
                    + b["cache_read_input_tokens"])

        rows.append({
            "session": os.path.basename(p)[:12],
            "start": start.astimezone(),
            "mins": (end - start).total_seconds() / 60,
            "agents": total_spawns,
            "kinds": ", ".join(f"{k} x{v}" for k, v in spawns.most_common(3)),
            "models": "+".join(SHORT.get(m, m) for m in
                               sorted(matched, key=lambda k: -models[k]["output_tokens"])),
            "in": inp, "out": out, "c5": c5, "c1": c1,
        })

    if not rows:
        sys.exit("no sessions matched those filters")
    rows.sort(key=lambda r: -r["c1"])

    if args.csv:
        w = csv.writer(sys.stdout)
        w.writerow(["session", "start", "minutes", "hours", "agents", "agent_types",
                    "models", "input_tokens", "output_tokens", "cost_5m", "cost_1h"])
        for r in rows:
            w.writerow([r["session"], f"{r['start']:%Y-%m-%d %H:%M}", f"{r['mins']:.0f}",
                        f"{r['mins']/60:.1f}", r["agents"], r["kinds"], r["models"],
                        r["in"], r["out"], f"{r['c5']:.2f}", f"{r['c1']:.2f}"])
        return

    scope = f"model~'{args.model}' " if args.model else ""
    print(f"\nSessions spawning >={args.min_agents} agents  {scope}"
          f"{'since ' + args.since if args.since else ''}\n")
    hdr = (f"{'session':<14}{'started':<18}{'dur':>9}{'agents':>7}  "
           f"{'model':<26}{'cost 5m':>11}{'cost 1h':>11}")
    print(hdr)
    print("-" * len(hdr))
    for r in rows:
        dur = f"{int(r['mins']//60)}h{int(r['mins']%60):02d}"
        print(f"{r['session']:<14}{r['start']:%Y-%m-%d %H:%M}  {dur:>9}{r['agents']:>7}  "
              f"{r['models']:<26}${r['c5']:>10,.2f}${r['c1']:>10,.2f}")
    print("-" * len(hdr))
    print(f"{len(rows)} sessions{'':<21}{sum(r['agents'] for r in rows):>7}  {'':<26}"
          f"${sum(r['c5'] for r in rows):>10,.2f}${sum(r['c1'] for r in rows):>10,.2f}")
    print(f"\ncumulative session time: {sum(r['mins'] for r in rows)/60:,.1f} h")
    print(f"input tokens: {sum(r['in'] for r in rows):,}   "
          f"output tokens: {sum(r['out'] for r in rows):,}")

    kinds = collections.Counter()
    for r in rows:
        for part in r["kinds"].split(", "):
            if " x" in part:
                name, _, n = part.rpartition(" x")
                kinds[name] += int(n)
    if kinds:
        print("\nagent types spawned:")
        for k, v in kinds.most_common(10):
            print(f"  {k:<28} {v:>5}")


if __name__ == "__main__":
    main()
