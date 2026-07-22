#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

"$REPO_ROOT/scripts/validate.sh"

cat <<'MESSAGE'

The site is ready to publish. This script does not stage, commit, or push.
Review the diff, then use the normal Git flow:

  git add -A
  git commit -m "Publish article"
  git push origin main

GitHub Actions will deploy materials/code-as-runtime/article/ after main is updated.
MESSAGE
