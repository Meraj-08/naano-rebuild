# Capture Test — 8x Assignment

Status: **green**. Prompt and final response are captured automatically, in every
session in this repo, with no manual step.

---

## 1. Setup

| | |
|---|---|
| **Tool** | Claude Code (CLI), version `2.1.268`, macOS (darwin 25.3.0) |
| **Main model** | `claude-opus-5` at `high` effort |
| **Also seen** | `claude-sonnet-5` — the setup session began on Sonnet 5 and switched to Opus 5 partway through. Exactly the kind of switch the log is meant to make visible. |
| **Canary sessions ran on** | `claude-opus-4-8` — headless `claude -p` resolves its own default model, which differs from the interactive session. Recorded per-entry rather than assumed. |
| **Planning vs. execution** | Not split across models. One main model both plans and executes. Sub-agents are dispatched by the main model and run on their own configured models; their turns are sidechains and are deliberately excluded from the log. |
| **Automatic hook mechanism?** | Yes. Verified, not assumed — see below. |

## 2. Mechanism

Claude Code exposes lifecycle hooks that the harness itself executes. Two are wired:

- **`UserPromptSubmit`** — fires when a prompt is submitted. The payload carries the
  raw prompt text in `prompt`.
- **`Stop`** — fires at end of turn. The payload carries `transcript_path` and, as it
  turns out, the final assistant message directly in `last_assistant_message`.

**Config file changed:** `.claude/settings.json` (committed, project-scoped)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command",
        "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/capture.py\" prompt",
        "timeout": 15 } ] }
    ],
    "Stop": [
      { "hooks": [ { "type": "command",
        "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/capture.py\" response",
        "timeout": 15 } ] }
    ]
  }
}
```

**Script:** `.claude/hooks/capture.py` (stdlib Python 3, no dependencies)

It writes nothing to stdout and always exits 0, so it can never inject text into the
conversation or block a turn. It records only the verbatim prompt and the turn's final
assistant text — thinking blocks, tool calls, and intermediate narration are dropped.

**Log location:** `.agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md`, one file per
session. Not gitignored; committed with the code.

## 3. Canary log files

- `.agent-logs/2026-09-11_12-17-44_de8c2692-7dbc-48ef-aaf0-ebbddf3c3853.md`
- `.agent-logs/2026-09-11_12-17-58_73814795-c74e-434f-b815-5023888c7120.md`

Two separate sessions, each with its own file. The second proves the hook is not bound
to the session that installed it.

## 4. Canary entries, raw

### Canary 1 — session `de8c2692`

```
[LOG_ENTRY type=PROMPT num=1 session=de8c2692]
timestamp: 2026-09-11T12:17:44.076Z
model: unknown

CAPTURE TEST — 8x assignment, Meraj


[LOG_ENTRY type=RESPONSE num=1 session=de8c2692]
timestamp: 2026-09-11T12:17:51.485Z
model: claude-opus-4-8

Capture test received, Meraj — this is coming through on the `naano-rebuild` project (branch `main`, clean tree). No task to act on here, so nothing to build or change.

If the 8x assignment involves actual work (cloning a site, inspecting something, code changes), send it over and I'll take it from there.
```

### Canary 2 — session `73814795`

```
[LOG_ENTRY type=PROMPT num=1 session=73814795]
timestamp: 2026-09-11T12:17:58.671Z
model: unknown

CAPTURE TEST — 8x assignment, Meraj (second session)


[LOG_ENTRY type=RESPONSE num=1 session=73814795]
timestamp: 2026-09-11T12:18:04.025Z
model: claude-opus-4-8

This is a capture test — I see the marker "CAPTURE TEST — 8x assignment, Meraj (second session)" and no actual task attached to it.

Nothing to build or investigate here. When you're ready, send the real task (e.g. `/clone-website <url>` or whatever you want to work on) and I'll jump in.
```

## 5. What did not work first

The capture system was built and debugged in a sibling repo (`website-cloner`) before
being ported here. These are the approaches that failed, in the order they happened.

**a. Asked a documentation sub-agent for the hook schema and got wrong answers.**
Before writing anything I dispatched the `claude-code-guide` agent to confirm the
payload shapes against the official docs. It reported three things that were false:

- that the prompt arrives in a field called `user_input` (it is `prompt`);
- that transcript JSONL lines have top-level `role` and `content` (they have top-level
  `type` with a nested `message` object);
- that the model and timestamp are "not in the transcript JSONL itself" (both are —
  `message.model` and `timestamp`).

Caught it by reading a real transcript on disk before trusting the answer. Ground truth
beat the docs summary. The script was then written against the observed schema, and
defensively accepts `prompt` or `user_input` either way.

**b. First canary pair captured prompts but no responses.**
Both log files came out with a `PROMPT` entry and nothing else. The `Stop` hook *was*
firing — a raw-payload dump confirmed it. The bug was that I extracted the response by
parsing the transcript file, and at `Stop` time the turn's final assistant message has
usually **not been flushed to the transcript yet**. Reading the same file seconds later
showed the message present, which is what made it look like a parsing bug rather than a
race.

Fixed by dumping the actual payload keys, which revealed `Stop` already carries the
answer:

```
{"mode": "response", "keys": ["background_tasks", "cwd", "effort", "hook_event_name",
 "last_assistant_message", "permission_mode", "prompt_id", "session_crons",
 "session_id", "stop_hook_active", "transcript_path"]}
```

So the response now comes from `last_assistant_message`, with transcript parsing kept
only as a fallback. (This also disproved the sub-agent's claim that `Stop` has no
`stop_hook_active` field.)

**c. `model:` read `unknown` on every response.**
`last_assistant_message` is a bare string with no model attached. Since the assignment
needs the model recorded so a mid-build switch is visible, the script now polls the
transcript briefly (100 ms steps, 3 s ceiling) for the assistant row whose text matches
the captured response, and reads `message.model` from it. Matching on text rather than
taking the newest row keeps it correct if the model is switched mid-session.

Worth noting: in one canary the model's own reply claimed "I'm Opus 5
(claude-opus-5)" while the transcript recorded `claude-opus-4-8`. The log records the
transcript value. A model's self-description is not a reliable source for this field.

**d. A test failure that was mine, not the script's.**
A pipe-test appeared to silently drop a prompt. Cause: zsh's `echo` expands `\n`, which
turned a literal `\n` inside the test JSON into a real newline and made the payload
invalid JSON. The harness was wrong, not the hook. Retested with properly generated
payloads.

**e. Writing `.claude/settings.json` was blocked twice.**
The auto-mode permission classifier refused the write as `[Self-Modification]` — fair,
since hooks execute shell commands. Resolved by going through the sanctioned
`update-config` skill rather than trying to route around the denial.

**f. Hooks did not apply to the session that installed them.**
The installing session produced no log file at all. Hooks are loaded at session start,
so a session that predates `.claude/settings.json` never picks them up. Confirmed by
the hook's own debug log holding exactly 16 events — all 8 canary sessions × 2, and
nothing from the installing session. This is why capture was re-verified from scratch
in this repo rather than assumed to carry over.

## 6. Known limitation

`model:` on a **`PROMPT`** entry reads `unknown` for the first prompt of a session.
At submit time no assistant message exists yet, and the `UserPromptSubmit` payload does
not carry a model. Later prompts in a session show the last known model. The
authoritative value is always on the paired `RESPONSE` entry, and the frontmatter
aggregates every distinct model seen. Left honest rather than back-filled, since
back-filling would mean editing an entry after the fact.

## 7. Repo provenance

This repo was seeded from the clean, untouched Next.js 16 + shadcn/ui + Tailwind v4
clone template (`website-cloner` commit `6509127`), deliberately excluding an unrelated
in-progress clone that lived in that working tree. Capture was installed and verified
**before** any assignment code was written, so the build is recorded from its first
prompt onward.
