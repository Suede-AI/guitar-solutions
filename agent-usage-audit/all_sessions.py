#!/usr/bin/env python3
"""One table: every Claude Code session with time, agents, model, and cost.

Usage:
    python3 all_sessions.py              # all sessions on disk
    python3 all_sessions.py --days 3     # only files modified in last 3 days
    python3 all_sessions.py --csv > sessions.csv
"""

import argparse
import collections
import csv
import datetime as dt
import glob
import json
import os
import sys

# USD per million tokens: (input, output). Cache read = 0.1x input,
# cache write = 1.25x input (5-min TTL) or 2x input (1-hour TTL).
RATES = {
    "claude-fable-5": (10.0, 50.0),
    "claude-mythos-5": (10.0, 50.0),
    "claude-opus-5": (5.0, 25.0),
    "claude-opus-4-8": (5.0, 25.0),
    "claude-opus-4-7": (5.0, 25.0),
    "claude-sonnet-5": (2.0, 10.0),   # introductory, through 2026-08-31
    "claude-sonnet-4-6": (3.0, 15.0),
    "claude-haiku-4-5": (1.0, 5.0),
}
SPAWN_TOOLS = {"Task", "Agent", "Workflow"}
SHORT = {
    "claude-fable-5": "fable-5",
    "claude-mythos-5": "mythos-5",
    "claude-opus-5": "opus-5",
    "claude-opus-4-8": "opus-4.8",
    "claude-opus-4-7": "opus-4.7",
    "claude-sonnet-5": "sonnet-5",
    "claude-sonnet-4-6": "sonnet-4.6",
    "claude-haiku-4-5": "haiku-4.5",
}


def parse_ts(raw):
    if not raw:
        return None
    try:
        return dt.datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except ValueError:
        return None


def cost(bucket, model):
    """Return (cost_5m, cost_1h) for one model's token counts."""
    rate = RATES.get(model)
    if not rate:
        return 0.0, 0.0
    rin, rout = rate
    base = (
        bucket["input_tokens"] / 1e6 * rin
        + bucket["cache_read_input_tokens"] / 1e6 * rin * 0.1
        + bucket["output_tokens"] / 1e6 * rout
    )
    w = bucket["cache_creation_input_tokens"] / 1e6 * rin
    return base + w * 1.25, base + w * 2.0


def scan(path):
    models = collections.defaultdict(collections.Counter)
    spawns = 0
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
        usage = msg.get("usage") or {}
        if usage:
            b = models[msg.get("model", "?")]
            for f in (
                "input_tokens",
                "cache_creation_input_tokens",
                "cache_read_input_tokens",
                "output_tokens",
            ):
                b[f] += usage.get(f, 0) or 0
        for blk in msg.get("content") or []:
            if isinstance(blk, dict) and blk.get("type") == "tool_use":
                if blk.get("name") in SPAWN_TOOLS:
                    spawns += 1
    return models, spawns, times


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=float, default=None)
    ap.add_argument("--csv", action="store_true")
    ap.add_argument("--root", default=os.path.expanduser("~/.claude/projects"))
    args = ap.parse_args()

    paths = glob.glob(os.path.join(args.root, "*", "*.jsonl"))
    if args.days is not None:
        import time as _t
        cut = _t.time() - args.days * 86400
        paths = [p for p in paths if os.path.getmtime(p) >= cut]
    if not paths:
        sys.exit("no transcripts found")

    rows = []
    for p in paths:
        models, spawns, times = scan(p)
        if not times:
            continue
        start, end = min(times), max(times)
        mins = (end - start).total_seconds() / 60
        c5 = c1 = 0.0
        out = inp = 0
        for m, b in models.items():
            a, z = cost(b, m)
            c5 += a
            c1 += z
            out += b["output_tokens"]
            inp += (
                b["input_tokens"]
                + b["cache_creation_input_tokens"]
                + b["cache_read_input_tokens"]
            )
        named = [m for m in models if m in RATES]
        label = "+".join(
            SHORT.get(m, m)
            for m in sorted(named, key=lambda k: -models[k]["output_tokens"])
        ) or "-"
        rows.append(
            {
                "session": os.path.basename(p)[:12],
                "start": start.astimezone(),
                "end": end.astimezone(),
                "mins": mins,
                "agents": spawns,
                "models": label,
                "in": inp,
                "out": out,
                "c5": c5,
                "c1": c1,
            }
        )

    rows.sort(key=lambda r: -r["c1"])

    if args.csv:
        w = csv.writer(sys.stdout)
        w.writerow(
            ["session", "start", "end", "minutes", "hours", "agents",
             "models", "input_tokens", "output_tokens", "cost_5m", "cost_1h"]
        )
        for r in rows:
            w.writerow([
                r["session"], f"{r['start']:%Y-%m-%d %H:%M}", f"{r['end']:%Y-%m-%d %H:%M}",
                f"{r['mins']:.0f}", f"{r['mins']/60:.1f}", r["agents"], r["models"],
                r["in"], r["out"], f"{r['c5']:.2f}", f"{r['c1']:.2f}",
            ])
        return

    hdr = (
        f"{'session':<14}{'started':<18}{'duration':>12}{'agents':>7}  "
        f"{'model':<20}{'cost 5m':>11}{'cost 1h':>11}"
    )
    print(hdr)
    print("-" * len(hdr))
    for r in rows:
        dur = f"{int(r['mins']//60)}h {int(r['mins']%60):02d}m"
        print(
            f"{r['session']:<14}{r['start']:%Y-%m-%d %H:%M}  {dur:>12}{r['agents']:>7}  "
            f"{r['models']:<20}${r['c5']:>10,.2f}${r['c1']:>10,.2f}"
        )
    print("-" * len(hdr))
    tot_min = sum(r["mins"] for r in rows)
    span_h = (
        max(r["end"] for r in rows) - min(r["start"] for r in rows)
    ).total_seconds() / 3600
    print(
        f"{len(rows)} sessions{'':<5}{'':<18}{tot_min/60:>10,.1f} h"
        f"{sum(r['agents'] for r in rows):>7}  {'':<20}"
        f"${sum(r['c5'] for r in rows):>10,.2f}${sum(r['c1'] for r in rows):>10,.2f}"
    )
    print(f"\nwall-clock span: {span_h:,.1f} h   cumulative session time: {tot_min/60:,.1f} h")
    print(f"input tokens: {sum(r['in'] for r in rows):,}   output tokens: {sum(r['out'] for r in rows):,}")

    per = collections.defaultdict(lambda: [0.0, 0.0])
    for p in paths:
        models, _, times = scan(p)
        if not times:
            continue
        for m, b in models.items():
            a, z = cost(b, m)
            per[m][0] += a
            per[m][1] += z
    print("\nby model:")
    for m, (a, z) in sorted(per.items(), key=lambda kv: -kv[1][1]):
        if a or z:
            print(f"  {m:<20} ${a:>10,.2f} (5m)  ${z:>10,.2f} (1h)")


if __name__ == "__main__":
    main()
