# Handoff — Claude subagent usage audit

Investigation into unexpected Claude usage attributed to a subagent fleet.
Nothing here relates to the guitar.solutions site; it lives on this branch only
because the branch was created for this task and the container is ephemeral.

**Status: analysis complete. Support message written but NOT sent.**

---

## What was asked

Refund for API usage burned by a Fable agent fleet that was supposed to
orchestrate Codex (OpenAI) agents instead.

## What was found

The premise changed twice during investigation.

**1. It was not API billing.** The usage consumed a Claude *subscription*
allowance, not prepaid API credits. No money was charged, so there is no refund
to obtain. The available remedy is a usage-limit reset.

**2. It was not one runaway incident.** Transcripts show 1,254 subagents across
703 sessions spanning 72 days, with `claude-fable-5` in continuous rotation since
May. The subagent types spawned — `Frontend Developer`, `UI Designer`,
`Mobile App Builder`, `seo-geo`, `seo-technical`, `seo-content`, `seo-schema`,
`vercel:performance-optimizer` — are custom agents that were deliberately
configured and invoked. This is a usage pattern, not a malfunction signature.

**3. There is a real rate spike worth reporting.** Peak consumption was
**$209.24 of API-equivalent usage in a 10-minute window** (session `174221fd`,
2026-07-04 22:54), almost entirely Fable. 18 of the top 20 burn windows are
Fable. Mechanism is pricing x parallelism: Fable at $10/$50 per MTok fanning out
across parallel subagents produces roughly a $1,250/hour consumption rate.

---

## Figures

Reconstructed from `~/.claude/projects/*/*.jsonl` `usage` fields on the user's
local machine. All dollar amounts are **API-equivalent value at published rates**,
not amounts charged. Ranges span 5-minute vs 1-hour prompt-cache TTL, which is
not recorded client-side.

| Metric | Value |
|---|---:|
| Sessions | 703 |
| Subagents spawned | 1,254 |
| Wall-clock span | 1,740.2 h (72.5 days), 2026-05-17 -> 07-28 |
| Cumulative session time | 9,942.0 h |
| Input tokens | 57,680,580,456 |
| Output tokens | 182,097,907 |
| Total API-equivalent | $36,305 - $41,901 |

| Model | 5m TTL | 1h TTL | Share |
|---|---:|---:|---:|
| claude-fable-5 | $16,169.00 | $18,834.57 | 44.9% |
| claude-sonnet-5 | $9,574.01 | $10,758.06 | 25.7% |
| claude-opus-5 | $5,860.59 | $6,860.10 | 16.4% |
| claude-opus-4-8 | $3,742.41 | $4,314.76 | 10.3% |
| claude-opus-4-7 | $499.34 | $599.15 | 1.4% |
| claude-sonnet-4-6 | $460.27 | $534.82 | 1.3% |

**Fleet subset** (sessions spawning >=5 subagents): 86 sessions, 1,055 subagents,
1,554.4 h, $11,197 - $12,923. That is 12% of sessions and 84% of subagents but
only 31% of consumption — meaning **69% (~$29K) comes from ordinary non-fleet
sessions and was never investigated.**

**Peak 10-minute burn windows:**

| Session | Window start | Duration | Burn | Model |
|---|---|---:|---:|---|
| 174221fd | 2026-07-04 22:54 | 10.0 min | $209.24 | fable-5 $206 + sonnet-5 $3 |
| 12a83f86 | 2026-07-02 23:41 | 9.9 min | $158.33 | fable-5 |
| 9d0b7842 | 2026-07-16 17:27 | 9.6 min | $147.47 | fable-5 |
| fcaf1162 | 2026-07-11 05:56 | 9.3 min | $119.39 | fable-5 |
| 9c2dc5d1 | 2026-07-27 00:02 | 10.0 min | $90.33 | fable-5 |

**Subagent types spawned** (fleet sessions): general-purpose 520, Agent 185,
Workflow 109, Frontend Developer 63, Explore 46, seo-geo 19, UI Designer 18,
Mobile App Builder 14, seo-technical 7, seo-content 7, seo-schema 7,
vercel:performance-optimizer 6.

---

## Tools in this directory

All are stdlib-only, read-only, and run against `~/.claude/projects/*/*.jsonl`
on the user's local machine. They do nothing useful inside a remote container,
which has no transcript history.

| Script | Purpose |
|---|---|
| `audit_agent_usage.py` | Per-session spawn counts and token totals. `--days N`, `--session ID`, `--all` |
| `session_cost.py` | One or more sessions: duration, model, agents, cost. Takes ID prefixes |
| `all_sessions.py` | Every session in one table: time, agents, model, cost. `--days N`, `--csv` |
| `fleet_sessions.py` | Filters to agent-spawning sessions. `--min-agents N`, `--model SUBSTR`, `--since DATE`, `--csv` |

Rate tables are embedded in each script and will need updating when pricing
changes. Cache read = 0.1x input; cache write = 1.25x (5m TTL) or 2x (1h TTL).

The peak-burn analysis (sliding 10-minute window) was run inline and is not
saved as a script — see the figures above for its output.

---

## Support message

`anthropic-message.md` holds the final text. Framed as a **limit-reset request,
not a refund**, with three asks:

1. Can usage limits be reset for the affected periods?
2. Is there a supported way to cap subagent spawn count or pin subagents to a
   specific model?
3. Is this consumption rate expected for parallel Fable subagents?

Subject: `Subagent fleet consumed usage allowance in minutes — requesting limit reset`

Submit at https://support.claude.com while signed in — the portal attaches the
ticket to the account, which email does not. The support email address could not
be verified from this container (both support.claude.com and anthropic.com
returned 403 through the proxy); do not assert one without checking.

`anthropic-refund-request.md` is the earlier draft written before the
subscription/API distinction was established. **It is superseded and wrong** —
it asks for a monetary refund that does not apply. Kept only for its data tables.

---

## Open items

- **Send the support message.** Not sent as of this handoff.
- **Pin models on mechanical subagents.** Setting `model: sonnet` and
  `effort: low` in the frontmatter of `.claude/agents/*.md` for roles like
  `Explore`, `seo-technical`, `seo-schema`, and bulk `general-purpose` fan-out
  cuts the burn rate roughly 5x. Available immediately, no support needed. This
  is the highest-value remaining action.
- **Investigate the non-fleet 69%.** ~$29K of consumption comes from ordinary
  sessions and was never examined.
- Gmail connector authorized late in the session; `create_draft` is available but
  there is no send tool.
