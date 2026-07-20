#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <article-id>" >&2
  exit 1
fi

ARTICLE_ID="$1"
if [[ ! "$ARTICLE_ID" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "article-id must use lowercase kebab-case." >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK_DIR="$REPO_ROOT/work/$ARTICLE_ID"
CANDIDATE_DIR="$REPO_ROOT/candidates/$ARTICLE_ID"
REVIEW_DIR="$REPO_ROOT/reviews/$ARTICLE_ID"

for path in "$WORK_DIR" "$CANDIDATE_DIR" "$REVIEW_DIR"; do
  if [[ -e "$path" ]]; then
    echo "Refusing to overwrite existing workflow directory: $path" >&2
    exit 1
  fi
done

mkdir -p "$WORK_DIR" "$CANDIDATE_DIR" "$REVIEW_DIR"

cat >"$WORK_DIR/brief.md" <<EOF
# $ARTICLE_ID: Brief

## Goal

## Core thesis

## Intended reader

## In scope / out of scope

## Acceptance criteria
EOF

cat >"$WORK_DIR/outline.md" <<EOF
# $ARTICLE_ID: Outline

Describe the argument order and the job of each section.
EOF

cat >"$WORK_DIR/evidence.md" <<EOF
# $ARTICLE_ID: Evidence

## Public sources

## Evidence boundaries

## Claims to verify
EOF

cat >"$WORK_DIR/open-questions.md" <<EOF
# $ARTICLE_ID: Open Questions

- Add unresolved questions that materially affect the article.
EOF

: >"$WORK_DIR/iteration-log.jsonl"

cat >"$CANDIDATE_DIR/README.md" <<EOF
# $ARTICLE_ID: Candidates

## Shared baseline

## Candidate positions
EOF

cat >"$REVIEW_DIR/decision.md" <<EOF
# $ARTICLE_ID: Decision

## Canonical selection

## Review decisions

| Feedback | Source perspective | Decision | Destination | Rationale |
| --- | --- | --- | --- | --- |
EOF

echo "Created article workflow for '$ARTICLE_ID'."
