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
  if is_running; then
    echo "Preview is already running:"
    echo "  $PREVIEW_URL"
    return
  fi

  rm -f "$PID_FILE"
  rm -rf "$PREVIEW_ROOT"
  mkdir -p "$SITE_ROOT"

  cp README.md index.html .nojekyll "$SITE_ROOT/"
  cp -R assets docs ideas "$SITE_ROOT/"

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

  echo "Preview started in the background:"
  echo "  $PREVIEW_URL"
  echo "  PID: $pid"
  echo "  Log: $LOG_FILE"
}

case "$COMMAND" in
  start)
    start_server
    ;;
  stop)
    stop_server
    ;;
  restart)
    stop_server
    start_server
    ;;
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
