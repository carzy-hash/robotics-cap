#!/usr/bin/env bash
set -euo pipefail

TARGET_BRANCH="main"
REMOTE_NAME="origin"
COMMIT_MESSAGE="${1:-Publish GitHub Pages update}"

current_branch="$(git branch --show-current)"

if [[ "$current_branch" != "$TARGET_BRANCH" ]]; then
  echo "Current branch is '$current_branch'. Switch to '$TARGET_BRANCH' before publishing."
  exit 1
fi

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  echo "Remote '$REMOTE_NAME' is not configured."
  exit 1
fi

git add README.md index.html roadmap.html concepts.html assets docs ideas previews .nojekyll scripts/publish.sh scripts/review.sh

if git diff --cached --quiet; then
  echo "No staged changes. Pushing current '$TARGET_BRANCH' state."
else
  git commit -m "$COMMIT_MESSAGE"
fi

git push "$REMOTE_NAME" "$TARGET_BRANCH"

echo "Published. GitHub Pages will update from '$TARGET_BRANCH' if Pages is configured to deploy from the branch root."
