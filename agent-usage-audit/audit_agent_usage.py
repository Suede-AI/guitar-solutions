#!/usr/bin/env python3
"""
Audit local Claude Code transcripts for agent-fleet token usage.

Claude Code writes one JSONL transcript per session under
~/.claude/projects/<encoded-cwd>/<session-id>.jsonl. Each assistant turn
carries `message.model` and `message.usage`, so token spend can be
reconstructed exactly -- including turns made by spawned subagents, which
are recorded with isSidechain=true.

Usage:
    python3 audit_agent_usage.py                 # last 3 days
    python3 audit_agent_usage.py --days 7
    python3 audit_agent_usage.py --session 331b08c9   # one session, detailed
"""

import argparse
import collections
import datetime as dt
import glob
import json
import os
import sys

SPAWN_TOOLS = {"Task", "Agent", "Workflow"}
USAGE_FIELDS = (
    "input_tokens",
    "cache_creation_input_tokens",
    "cache_read_input_tokens",
    "output_tokens",
)


def parse_ts(raw):
    if not raw:
        return None
    try:
        return dt.datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
    except ValueError:
        return None


class SessionStats:
    def __init__(self, path):
        self.path = path
        self.session_id = os.path.basename(path)[: -len(".jsonl")]
        self.cwd = None
        self.first_ts = None
        self.last_ts = None
        self.spawns = collections.Counter()      # subagent_type -> count
        self.spawn_total = 0
        self.sidechain_turns = 0
        self.main_turns = 0
        self.by_model = collections.defaultdict(collections.Counter)
        self.bad_lines = 0

    def note_ts(self, ts):
        if ts is None:
            return
        if self.first_ts is None or ts < self.first_ts:
            self.first_ts = ts
        if self.last_ts is None or ts > self.last_ts:
            self.last_ts = ts

    def ingest(self, rec):
        if self.cwd is None and rec.get("cwd"):
            self.cwd = rec["cwd"]
        self.note_ts(parse_ts(rec.get("timestamp")))

        msg = rec.get("message")
        if not isinstance(msg, dict):
            return
        if msg.get("role") != "assistant":
            return

        if rec.get("isSidechain"):
            self.sidechain_turns += 1
        else:
            self.main_turns += 1

        usage = msg.get("usage")
        if isinstance(usage, dict):
            model = msg.get("model") or "unknown"
            bucket = self.by_model[model]
            for field in USAGE_FIELDS:
                value = usage.get(field)
                if isinstance(value, int):
                    bucket[field] += value
            bucket["turns"] += 1

        content = msg.get("content")
        if isinstance(content, list):
            for block in content:
                if not isinstance(block, dict):
                    continue
                if block.get("type") != "tool_use":
                    continue
                if block.get("name") not in SPAWN_TOOLS:
                    continue
                self.spawn_total += 1
                params = block.get("input") or {}
                label = params.get("subagent_type") or block.get("name") or "?"
                self.spawns[label] += 1

    @property
    def total_output(self):
        return sum(b["output_tokens"] for b in self.by_model.values())

    @property
    def total_input(self):
        return sum(
            b["input_tokens"] + b["cache_creation_input_tokens"] + b["cache_read_input_tokens"]
            for b in self.by_model.values()
        )


def load(path):
    stats = SessionStats(path)
    with open(path, "r", errors="replace") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                stats.ingest(json.loads(line))
            except (json.JSONDecodeError, TypeError, AttributeError):
                stats.bad_lines += 1
    return stats


def fmt(n):
    return f"{n:,}"


def window(stats):
    if not stats.first_ts:
        return "unknown"
    start = stats.first_ts.astimezone().strftime("%Y-%m-%d %H:%M")
    if stats.last_ts:
        mins = max(0, round((stats.last_ts - stats.first_ts).total_seconds() / 60))
        return f"{start} (+{mins}m)"
    return start


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--days", type=float, default=3.0, help="look back this many days (default 3)")
    ap.add_argument("--root", default=os.path.expanduser("~/.claude/projects"))
    ap.add_argument("--session", help="show detail for one session (id prefix match)")
    ap.add_argument("--all", action="store_true", help="ignore the age filter")
    args = ap.parse_args()

    if not os.path.isdir(args.root):
        sys.exit(f"No transcript directory at {args.root}")

    paths = glob.glob(os.path.join(args.root, "*", "*.jsonl"))
    if not paths:
        sys.exit(f"No .jsonl transcripts under {args.root}")

    cutoff = dt.datetime.now().timestamp() - args.days * 86400
    selected = []
    for path in paths:
        if args.session:
            if os.path.basename(path).startswith(args.session):
                selected.append(path)
        elif args.all or os.path.getmtime(path) >= cutoff:
            selected.append(path)

    if not selected:
        sys.exit(
            f"No transcripts modified in the last {args.days} days.\n"
            f"Scanned {len(paths)} file(s) under {args.root}. Try --days 7 or --all."
        )

    sessions = sorted(
        (load(p) for p in selected), key=lambda s: s.total_output, reverse=True
    )

    print(f"Scanned {len(selected)} transcript(s) under {args.root}\n")
    header = f"{'session':<14} {'when':<22} {'spawned':>7} {'sub-turns':>9} {'out tok':>12} {'in tok':>14}"
    print(header)
    print("-" * len(header))
    for s in sessions:
        print(
            f"{s.session_id[:12]:<14} {window(s):<22} {s.spawn_total:>7} "
            f"{s.sidechain_turns:>9} {fmt(s.total_output):>12} {fmt(s.total_input):>14}"
        )

    grand_out = sum(s.total_output for s in sessions)
    grand_in = sum(s.total_input for s in sessions)
    grand_spawn = sum(s.spawn_total for s in sessions)
    print("-" * len(header))
    print(
        f"{'TOTAL':<14} {'':<22} {grand_spawn:>7} "
        f"{sum(s.sidechain_turns for s in sessions):>9} "
        f"{fmt(grand_out):>12} {fmt(grand_in):>14}"
    )

    print("\nPer-model breakdown")
    print("-" * 72)
    combined = collections.defaultdict(collections.Counter)
    for s in sessions:
        for model, bucket in s.by_model.items():
            combined[model].update(bucket)
    for model, bucket in sorted(
        combined.items(), key=lambda kv: kv[1]["output_tokens"], reverse=True
    ):
        billable_in = (
            bucket["input_tokens"]
            + bucket["cache_creation_input_tokens"]
            + bucket["cache_read_input_tokens"]
        )
        print(
            f"  {model}\n"
            f"      turns {fmt(bucket['turns'])}   output {fmt(bucket['output_tokens'])}   "
            f"input {fmt(billable_in)}\n"
            f"      (fresh {fmt(bucket['input_tokens'])} / "
            f"cache-write {fmt(bucket['cache_creation_input_tokens'])} / "
            f"cache-read {fmt(bucket['cache_read_input_tokens'])})"
        )

    detailed = [s for s in sessions if s.spawn_total]
    if detailed:
        print("\nAgents spawned, by type")
        print("-" * 72)
        for s in detailed:
            kinds = ", ".join(f"{k}x{v}" for k, v in s.spawns.most_common())
            print(f"  {s.session_id[:12]}  {window(s)}")
            print(f"      cwd: {s.cwd or 'unknown'}")
            print(f"      {kinds}")

    damaged = sum(s.bad_lines for s in sessions)
    if damaged:
        print(f"\nNote: {damaged} unparseable line(s) skipped.")


if __name__ == "__main__":
    main()
