#!/usr/bin/env python3
"""Report duration, per-model token usage, and cost for one Claude Code session.

Usage:
    python3 session_cost.py 00a6ec4b
    python3 session_cost.py 00a6ec4b cdc1c547 fa59f7cf
"""

import collections
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


def parse_ts(raw):
    if not raw:
        return None
    try:
        return dt.datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except ValueError:
        return None


def report(prefix):
    paths = [
        p
        for p in glob.glob(os.path.expanduser("~/.claude/projects/*/*.jsonl"))
        if os.path.basename(p).startswith(prefix)
    ]
    if not paths:
        print(f"{prefix}: no transcript found")
        return

    models = collections.defaultdict(collections.Counter)
    spawns = collections.Counter()
    times = []
    cwd = None

    for path in paths:
        for line in open(path, errors="replace"):
            try:
                rec = json.loads(line)
            except (json.JSONDecodeError, TypeError):
                continue
            if cwd is None and rec.get("cwd"):
                cwd = rec["cwd"]
            ts = parse_ts(rec.get("timestamp"))
            if ts:
                times.append(ts)
            msg = rec.get("message")
            if not isinstance(msg, dict) or msg.get("role") != "assistant":
                continue
            usage = msg.get("usage") or {}
            if usage:
                bucket = models[msg.get("model", "?")]
                for field in (
                    "input_tokens",
                    "cache_creation_input_tokens",
                    "cache_read_input_tokens",
                    "output_tokens",
                ):
                    bucket[field] += usage.get(field, 0) or 0
            for block in msg.get("content") or []:
                if isinstance(block, dict) and block.get("type") == "tool_use":
                    if block.get("name") in SPAWN_TOOLS:
                        label = (block.get("input") or {}).get("subagent_type") or block["name"]
                        spawns[label] += 1

    print(f"\n=== {prefix} ===")
    if cwd:
        print(f"cwd: {cwd}")
    if times:
        start, end = min(times), max(times)
        mins = (end - start).total_seconds() / 60
        print(f"start:    {start.astimezone():%Y-%m-%d %H:%M}")
        print(f"end:      {end.astimezone():%Y-%m-%d %H:%M}")
        print(f"duration: {mins:,.0f} min ({int(mins // 60)} h {int(mins % 60)} m)")
    total_spawns = sum(spawns.values())
    if total_spawns:
        kinds = ", ".join(f"{k} x{v}" for k, v in spawns.most_common())
        print(f"agents:   {total_spawns} ({kinds})")
    else:
        print("agents:   0")

    grand_5m = grand_1h = 0.0
    for model, b in sorted(models.items(), key=lambda kv: -kv[1]["output_tokens"]):
        rate = RATES.get(model)
        fresh, write = b["input_tokens"], b["cache_creation_input_tokens"]
        read, out = b["cache_read_input_tokens"], b["output_tokens"]
        print(f"\n  {model}")
        print(f"    fresh {fresh:,}   cache-write {write:,}   cache-read {read:,}   out {out:,}")
        if not rate:
            if fresh or write or read or out:
                print("    (no rate on file — cost not computed)")
            continue
        rin, rout = rate
        c_fresh = fresh / 1e6 * rin
        c_read = read / 1e6 * rin * 0.1
        c_w5 = write / 1e6 * rin * 1.25
        c_w1h = write / 1e6 * rin * 2.0
        c_out = out / 1e6 * rout
        t5, t1h = c_fresh + c_read + c_w5 + c_out, c_fresh + c_read + c_w1h + c_out
        grand_5m += t5
        grand_1h += t1h
        print(
            f"    fresh ${c_fresh:,.2f}   read ${c_read:,.2f}   "
            f"write ${c_w5:,.2f}/${c_w1h:,.2f}   out ${c_out:,.2f}"
        )
        print(f"    subtotal: ${t5:,.2f} (5m TTL) / ${t1h:,.2f} (1h TTL)")

    print(f"\n  SESSION TOTAL: ${grand_5m:,.2f} (5m TTL) / ${grand_1h:,.2f} (1h TTL)")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: python3 session_cost.py <session-id-prefix> [more ids...]")
    for arg in sys.argv[1:]:
        report(arg)
