#!/usr/bin/env python3
"""Append the prompt and the final response of each turn to .agent-logs/.

Wired to two Claude Code hook events in .claude/settings.json:
  UserPromptSubmit -> capture.py prompt
  Stop             -> capture.py response

Only the verbatim prompt and the turn's final assistant text are recorded.
Thinking blocks, tool calls and intermediate narration are deliberately excluded.

The script must never write to stdout and must always exit 0: a hook that emits
output or a non-zero status can inject text into the conversation or block the turn.
"""
import glob
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime, timezone

MODE = sys.argv[1] if len(sys.argv) > 1 else ""
SENTINEL = "<!-- entries below this line are append-only; do not edit -->"


def iso(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + "%03dZ" % (dt.microsecond // 1000)


def repo_root(payload):
    for candidate in (os.environ.get("CLAUDE_PROJECT_DIR"), payload.get("cwd"), os.getcwd()):
        if candidate and os.path.isdir(candidate):
            return candidate
    return os.getcwd()


def author():
    if os.environ.get("AGENT_LOG_AUTHOR"):
        return os.environ["AGENT_LOG_AUTHOR"]
    try:
        name = subprocess.run(
            ["git", "config", "user.name"], capture_output=True, text=True, timeout=5
        ).stdout.strip()
        return name or "unknown"
    except Exception:
        return "unknown"


def read_transcript(path):
    """Return non-sidechain user/assistant rows, oldest first."""
    rows = []
    if not path or not os.path.isfile(path):
        return rows
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except ValueError:
                continue
            if obj.get("type") in ("user", "assistant") and not obj.get("isSidechain"):
                rows.append(obj)
    return rows


def text_from_message(value):
    """Pull visible text out of the Stop payload's last_assistant_message.

    Accepts a bare string, a message object, or a raw content-block list, since
    only the shape delivered at runtime is guaranteed. Thinking and tool_use
    blocks are dropped; only text survives.
    """
    if isinstance(value, str):
        return value.strip(), None
    if isinstance(value, dict):
        model = value.get("model")
        content = value.get("content")
        if isinstance(content, str):
            return content.strip(), model
        if isinstance(content, list):
            parts = [
                b.get("text", "")
                for b in content
                if isinstance(b, dict) and b.get("type") == "text"
            ]
            return "\n".join(p for p in parts if p.strip()).strip(), model
        if isinstance(value.get("text"), str):
            return value["text"].strip(), model
        return "", model
    if isinstance(value, list):
        parts = [
            b.get("text", "")
            for b in value
            if isinstance(b, dict) and b.get("type") == "text"
        ]
        return "\n".join(p for p in parts if p.strip()).strip(), None
    return "", None


def final_assistant_text(rows):
    """The last assistant message in the transcript that carries visible text.

    Fallback only: at Stop time the turn's final message has often not been
    flushed to the transcript yet, which is why the payload value is preferred.
    """
    for obj in reversed(rows):
        if obj.get("type") != "assistant":
            continue
        msg = obj.get("message") or {}
        parts = [
            b.get("text", "")
            for b in (msg.get("content") or [])
            if isinstance(b, dict) and b.get("type") == "text"
        ]
        text = "\n".join(p for p in parts if p.strip()).strip()
        if text:
            return text, msg.get("model")
    return "", None


def model_for_text(transcript, text, deadline=3.0):
    """Model that produced `text`, matched against the transcript.

    The Stop payload carries the response as a bare string with no model, and the
    turn's assistant row is usually not flushed to the transcript yet when the hook
    runs. So poll briefly for the row whose text matches, and read its model from
    there. Matching on text rather than taking the newest row keeps the answer
    correct when the model was switched mid-session.
    """
    needle = (text or "").strip()
    end = time.time() + deadline
    while True:
        rows = read_transcript(transcript)
        for obj in reversed(rows):
            if obj.get("type") != "assistant":
                continue
            msg = obj.get("message") or {}
            parts = [
                b.get("text", "")
                for b in (msg.get("content") or [])
                if isinstance(b, dict) and b.get("type") == "text"
            ]
            joined = "\n".join(p for p in parts if p.strip()).strip()
            if joined and needle and joined == needle and msg.get("model"):
                return msg["model"]
        if time.time() >= end:
            return current_model(rows)
        time.sleep(0.1)


def current_model(rows):
    for obj in reversed(rows):
        if obj.get("type") == "assistant":
            model = (obj.get("message") or {}).get("model")
            if model:
                return model
    return "unknown"


def typed_prompt(rows):
    for obj in reversed(rows):
        if obj.get("type") == "user" and obj.get("promptSource") == "typed":
            content = (obj.get("message") or {}).get("content")
            if isinstance(content, str):
                return content
            if isinstance(content, list):
                return "\n".join(
                    b.get("text", "")
                    for b in content
                    if isinstance(b, dict) and b.get("type") == "text"
                )
    return ""


def log_path(log_dir, session_id, stamp):
    existing = sorted(glob.glob(os.path.join(log_dir, "*_%s.md" % session_id)))
    if existing:
        return existing[0]
    return os.path.join(log_dir, "%s_%s.md" % (stamp.strftime("%Y-%m-%d_%H-%M-%S"), session_id))


def split_file(path):
    if not os.path.isfile(path):
        return None, ""
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    if SENTINEL in text:
        head, entries = text.split(SENTINEL, 1)
        return head, entries.lstrip("\n")
    return None, text


def frontmatter_value(head, key):
    if not head:
        return None
    match = re.search(r"^%s:\s*(.+)$" % re.escape(key), head, re.M)
    return match.group(1).strip() if match else None


def build_head(session_id, project, who, entries, first_time, last_time, tool="claude-code"):
    models = []
    for model in re.findall(r"^model:\s*(.+)$", entries, re.M):
        model = model.strip()
        if model and model != "unknown" and model not in models:
            models.append(model)
    prompts = entries.count("[LOG_ENTRY type=PROMPT")
    short = session_id.split("-")[0]
    return (
        "---\n"
        "session_id: %s\n"
        "date: %s\n"
        "author: %s\n"
        "model: %s\n"
        "tool: %s\n"
        "project: %s\n"
        "total_exchanges: %d\n"
        "first_prompt_time: %s\n"
        "last_prompt_time: %s\n"
        "---\n\n"
        "# Session Log - %s\n\n"
        "Session: `%s` | Project: `%s` | Author: `%s`\n\n"
        "---\n\n"
        % (
            session_id,
            first_time[:10],
            who,
            ", ".join(models) if models else "unknown",
            tool,
            project,
            prompts,
            first_time,
            last_time,
            first_time[:10],
            short,
            project,
            who,
        )
    )


def main():
    try:
        payload = json.loads(sys.stdin.read() or "{}")
    except Exception:
        payload = {}

    root = repo_root(payload)
    log_dir = os.path.join(root, ".agent-logs")
    os.makedirs(log_dir, exist_ok=True)

    # Raw payloads are kept so the hook's actual stdin schema stays auditable.
    try:
        with open(os.path.join(root, ".claude", "hooks", "debug-payloads.jsonl"), "a", encoding="utf-8") as fh:
            fh.write(
                json.dumps(
                    {
                        "mode": MODE,
                        "keys": sorted(payload.keys()),
                        "last_assistant_message_type": type(
                            payload.get("last_assistant_message")
                        ).__name__,
                    }
                )
                + "\n"
            )
    except Exception:
        pass

    session_id = payload.get("session_id") or "unknown-session"
    transcript = payload.get("transcript_path")
    rows = read_transcript(transcript)
    stamp = datetime.now(timezone.utc)
    now = iso(stamp)

    path = log_path(log_dir, session_id, stamp)
    head, entries = split_file(path)
    prompt_count = entries.count("[LOG_ENTRY type=PROMPT")
    last_prompt_at = entries.rfind("[LOG_ENTRY type=PROMPT")
    last_response_at = entries.rfind("[LOG_ENTRY type=RESPONSE")
    awaiting_response = last_prompt_at > last_response_at

    short = session_id.split("-")[0]

    if MODE == "prompt":
        text = payload.get("prompt") or payload.get("user_input") or typed_prompt(rows)
        if not text.strip():
            return
        num = prompt_count + 1
        block = (
            "[LOG_ENTRY type=PROMPT num=%d session=%s]\n"
            "timestamp: %s\n"
            "model: %s\n\n"
            "%s\n\n\n" % (num, short, now, current_model(rows), text.rstrip())
        )
    elif MODE == "response":
        # Stop also fires on /clear, /compact and resume; without an unanswered
        # prompt there is no exchange to close, so nothing is written.
        if not awaiting_response:
            return
        text, model = text_from_message(payload.get("last_assistant_message"))
        if not text:
            text, model = final_assistant_text(rows)
        if not text.strip():
            return
        if not model:
            model = model_for_text(transcript, text)
        block = (
            "[LOG_ENTRY type=RESPONSE num=%d session=%s]\n"
            "timestamp: %s\n"
            "model: %s\n\n"
            "%s\n\n\n" % (prompt_count, short, now, model or "unknown", text.rstrip())
        )
    else:
        return

    entries = entries + block
    first_time = frontmatter_value(head, "first_prompt_time") or now
    new_head = build_head(
        session_id,
        os.path.basename(root),
        author(),
        entries,
        first_time,
        now,
    )
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(new_head + SENTINEL + "\n\n" + entries)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
