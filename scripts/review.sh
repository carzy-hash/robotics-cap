#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-4000}"
REPO_NAME="robotics-cap"
PREVIEW_ROOT="${TMPDIR:-/tmp}/robotics-cap-pages-preview"
SITE_ROOT="$PREVIEW_ROOT/$REPO_NAME"

rm -rf "$PREVIEW_ROOT"
mkdir -p "$SITE_ROOT"

cp README.md index.html roadmap.html concepts.html .nojekyll "$SITE_ROOT/"
cp -R assets docs ideas previews proposals "$SITE_ROOT/"

echo "Previewing the GitHub Pages site locally:"
echo "  http://127.0.0.1:$PORT/$REPO_NAME/"
echo
echo "This serves the same static files from the same project path shape used by GitHub Pages."
echo "Press Ctrl+C to stop."

cd "$PREVIEW_ROOT"
python3 -m http.server "$PORT" --bind 127.0.0.1
