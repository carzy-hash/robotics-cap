#!/usr/bin/env bash
set -euo pipefail

COMMAND="start"
PORT="4000"

if [[ "${1:-}" =~ ^(start|stop|restart|status)$ ]]; then
  COMMAND="$1"
  PORT="${2:-4000}"
else
  PORT="${1:-4000}"
fi

REPO_NAME="robotics-cap"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLIC_ROOT="$REPO_ROOT/site"
PREVIEW_ROOT="${TMPDIR:-/tmp}/robotics-cap-pages-preview"
SITE_ROOT="$PREVIEW_ROOT/$REPO_NAME"
RUN_ROOT="${TMPDIR:-/tmp}/robotics-cap-review"
PID_FILE="$RUN_ROOT/server-$PORT.pid"
LOG_FILE="$RUN_ROOT/server-$PORT.log"
PREVIEW_URL="http://127.0.0.1:$PORT/$REPO_NAME/"

mkdir -p "$RUN_ROOT"

is_running() {
  [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null
}

port_listener_pid() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null | head -n 1 || true
  fi
}

stop_server() {
  if ! is_running; then
    rm -f "$PID_FILE"
    echo "Preview is not running on port $PORT."
    return
  fi

  local pid
  pid="$(cat "$PID_FILE")"
  kill "$pid"

  for _ in {1..20}; do
    if ! kill -0 "$pid" 2>/dev/null; then
      rm -f "$PID_FILE"
      echo "Stopped preview on port $PORT."
      return
    fi
    sleep 0.1
  done

  echo "Preview process $pid did not stop cleanly." >&2
  exit 1
}

start_server() {
  "$REPO_ROOT/scripts/validate.sh"

  if is_running; then
    echo "Preview is already running:"
    echo "  $PREVIEW_URL"
    return
  fi

  local listener_pid
  listener_pid="$(port_listener_pid)"
  if [[ -n "$listener_pid" ]]; then
    echo "Cannot start preview: port $PORT is already used by PID $listener_pid." >&2
    echo "Stop that process or choose another port, for example: $0 4081" >&2
    exit 1
  fi

  rm -f "$PID_FILE"
  rm -rf "$PREVIEW_ROOT"
  mkdir -p "$SITE_ROOT"
  cp -R "$PUBLIC_ROOT/." "$SITE_ROOT/"
  cp -R "$PUBLIC_ROOT" "$SITE_ROOT/site"
  for workflow_dir in work candidates reviews; do
    if [[ -d "$REPO_ROOT/$workflow_dir" ]]; then
      cp -R "$REPO_ROOT/$workflow_dir" "$SITE_ROOT/$workflow_dir"
    fi
  done

  python3 - "$SITE_ROOT" <<'PY'
import html
import pathlib
import sys

root = pathlib.Path(sys.argv[1])
entries = []
for directory in ("work", "candidates", "reviews"):
    base = root / directory
    if not base.exists():
        continue
    for path in sorted(base.rglob("*")):
        if path.is_file() and path.suffix.lower() in {".html", ".md", ".jsonl"}:
            relative = path.relative_to(root).as_posix()
            entries.append(f'<li><a href="../{html.escape(relative)}">{html.escape(relative)}</a></li>')

hub = root / "_workspace"
hub.mkdir()
(hub / "index.html").write_text(
    "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\">"
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
    "<title>Robotics CAP Review Workspace</title>"
    "<style>body{max-width:960px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui}"
    "code{background:#eee;padding:2px 5px}li{margin:6px 0}</style>"
    "<h1>Robotics CAP Review Workspace</h1>"
    "<p>This local-only index exposes committed work, candidates, and reviews. "
    "GitHub Pages still deploys <code>site/</code> only.</p><ul>"
    + "".join(entries)
    + "</ul></html>",
    encoding="utf-8",
)
PY

  cd "$PREVIEW_ROOT"
  nohup python3 -m http.server "$PORT" --bind 127.0.0.1 \
    </dev/null >"$LOG_FILE" 2>&1 &
  local pid=$!
  echo "$pid" >"$PID_FILE"

  sleep 0.2
  if ! kill -0 "$pid" 2>/dev/null; then
    rm -f "$PID_FILE"
    echo "Could not start preview on port $PORT. See $LOG_FILE" >&2
    exit 1
  fi

  echo "Preview started with the public site at the root:"
  echo "  $PREVIEW_URL"
  echo "  Review workspace: ${PREVIEW_URL}_workspace/"
  echo "  PID: $pid"
  echo "  Log: $LOG_FILE"
}

case "$COMMAND" in
  start) start_server ;;
  stop) stop_server ;;
  restart) stop_server; start_server ;;
  status)
    if is_running; then
      echo "Preview is running: $PREVIEW_URL (PID $(cat "$PID_FILE"))"
    else
      rm -f "$PID_FILE"
      echo "Preview is not running on port $PORT."
      exit 1
    fi
    ;;
esac
