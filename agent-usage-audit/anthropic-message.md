# Message to Anthropic Support

Submit at: https://support.claude.com  → sign in → "Submit a request"

---

**Subject:** Subagent fleet consumed usage allowance in minutes — requesting limit reset

Hello,

I use Claude Code with a configured set of subagents. On several occasions a subagent
fan-out has consumed a large share of my subscription usage allowance within minutes,
far out of proportion to the task I gave it.

The clearest instance: on **2026-07-04 at 22:54**, session `174221fd` consumed
approximately **$209 of API-equivalent usage in a 10-minute window** — almost entirely
`claude-fable-5`. That single window accounted for roughly 80% of that session's total
consumption. Other comparable bursts:

| Session | Window start | Duration | API-equivalent consumed | Model |
|---|---|---|---|---|
| 174221fd | 2026-07-04 22:54 | 10.0 min | $209.24 | claude-fable-5 |
| 12a83f86 | 2026-07-02 23:41 | 9.9 min | $158.33 | claude-fable-5 |
| 9d0b7842 | 2026-07-16 17:27 | 9.6 min | $147.47 | claude-fable-5 |
| fcaf1162 | 2026-07-11 05:56 | 9.3 min | $119.39 | claude-fable-5 |
| 9c2dc5d1 | 2026-07-27 00:02 | 10.0 min | $90.33 | claude-fable-5 |

18 of my 20 highest-consumption windows are `claude-fable-5` running in parallel
subagent fan-out.

For context, reconstructed from my local Claude Code transcripts: 1,254 subagents
across 703 sessions. 1,055 of those are concentrated in 86 fleet sessions, which
represent 12% of my sessions but roughly 31% of total token consumption.

**To be clear, I am not requesting a billing refund** — I understand this consumed
subscription allowance rather than prepaid API credits, and no charge was made. What
I'm asking is:

1. **Can my usage limits be reset** for the affected periods?
2. **Is there a supported way to cap subagent spawn count**, or to pin subagents to a
   specific model, so that a single fan-out cannot exhaust an allowance in ten minutes?
   Being able to set a per-agent model and a hard concurrency ceiling would prevent
   recurrence.
3. **Is this consumption rate expected** for parallel Fable subagents, or does it
   indicate something misconfigured on my end?

I have per-session token counts, timestamps, and model breakdowns available and am
happy to provide them.

Account: jasoncola1@gmail.com

Thank you,
Jason Colapietro

---

## Supporting figures (attach or paste if asked)

All figures reconstructed from `~/.claude/projects/*/*.jsonl` `usage` fields.
Costs are API-equivalent value at published rates, not amounts charged.

| Metric | Value |
|---|---:|
| Sessions | 703 |
| Subagents spawned | 1,254 |
| Wall-clock span | 1,740.2 h (72.5 days) |
| Cumulative session time | 9,942.0 h |
| Input tokens | 57,680,580,456 |
| Output tokens | 182,097,907 |
| Total API-equivalent | $36,305 – $41,901 |

| Model | API-equivalent (5m TTL) | (1h TTL) |
|---|---:|---:|
| claude-fable-5 | $16,169.00 | $18,834.57 |
| claude-sonnet-5 | $9,574.01 | $10,758.06 |
| claude-opus-5 | $5,860.59 | $6,860.10 |
| claude-opus-4-8 | $3,742.41 | $4,314.76 |
| claude-opus-4-7 | $499.34 | $599.15 |
| claude-sonnet-4-6 | $460.27 | $534.82 |

Fleet sessions only (>=5 subagents): 86 sessions, 1,055 subagents, $11,197 – $12,923.

Subagent types spawned: general-purpose 520, Agent 185, Workflow 109,
Frontend Developer 63, Explore 46, seo-geo 19, UI Designer 18, Mobile App Builder 14,
seo-technical 7, seo-content 7, seo-schema 7, vercel:performance-optimizer 6.
