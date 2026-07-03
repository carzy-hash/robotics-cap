# Document Iteration Goal

This file defines the default workflow for one full iteration on the Robotics
CAP idea document. It is meant to be followed before editing a major idea page,
especially `ideas/capx-2026-route.html`.

## Default Target

- Primary page: `ideas/capx-2026-route.html`
- Supporting pages: `ideas/index.html`, `index.html`
- Summary log: `docs/iteration-summary.jsonl`

## Workflow

### 1. Clean and commit the current workspace baseline

Start by making the workspace clean enough to iterate safely.

Default behavior:

- Review the current changed files.
- Include all appropriate existing changes in a baseline commit.
- Do not revert user work.
- Do not commit unrelated secrets, private notes, generated junk, or broken local artifacts.
- If a change is unclear but appears to belong to the site/documentation work, prefer keeping and committing it.
- If a change is risky or unrelated, leave it unstaged and mention it before continuing.

Suggested baseline commit message:

```text
Save current portal state
```

This step exists so the new iteration has a clear starting point.

### 2. Read the current document and nearby context

Read the current target page from top to bottom. Also read nearby entry points
that affect the reader journey:

- the idea index
- the concept book
- the roadmap
- any relevant preview or proposal page

While reading, note the current argument structure, unexplained terms, missing
transitions, weak examples, and places where a reader may lose the thread.

### 3. Choose a specific reader background

Assume one concrete reader for the iteration. Do not edit for an abstract
general audience.

Example reader backgrounds:

- a robotics researcher who understands control but is skeptical of code agents
- an AI engineer who understands coding agents but not robot embodiment
- a product or funding reader who needs the route explained without equations
- a collaborator who may contribute ideas but not implementation code

Write down the assumed reader before deciding improvements.

The reader background is an internal editing lens. Do not publish it as visible
page content, card copy, headings, or reader-facing notes. It may appear in
working notes, the final response, or the summary JSONL entry so future
iterations know what perspective was used.

### 4. Browse the page as that reader

Walk through the page and supporting pages from that reader's point of view.
Identify improvements that would make the argument clearer or the reading path
more comfortable.

Look for opportunities to add:

- diagrams or visual structure
- analogies and examples
- longer reasoning where a claim jumps too quickly
- shorter wording where a section is overloaded
- code snippets or pseudocode
- definitions of recurring terms
- better section order
- links between idea pages
- explicit evidence gaps and benchmark ideas

### 5. List all candidate improvements

Before editing, list the candidate improvements in working notes or the final
response. Group them by importance:

- Must do: changes needed for the page to be understandable to the chosen reader
- Should do: changes that noticeably improve comfort or flow
- Later: good ideas that deserve their own future iteration

### 6. Complete the chosen improvements one by one

Edit the page and any supporting pages. Keep the repository role in mind:

- This site is a focused idea blog, not an implementation repo.
- Prefer clear explanation, diagrams, examples, and curated links.
- Do not add heavy generated artifacts or branch preview machinery.
- Keep changes reviewable as page diffs.
- Delete obsolete pages, sections, assets, links, or directories directly when
  removing them makes the reading path clearer.
- Do not write the reader lens itself into the published page. Use it to shape
  the explanation, then remove the scaffolding.

After editing, verify that the page still works as a static GitHub Pages site.
When layout changes are made, preview desktop and mobile widths.

### 7. Append a summary JSONL entry

Append one JSON object per iteration to `docs/iteration-summary.jsonl`.

Required fields:

```json
{"date":"YYYY-MM-DD","target":"ideas/capx-2026-route.html","reader":"specific reader background","changes":["short change 1","short change 2"],"followups":["future idea 1","future idea 2"]}
```

Use one line per iteration. Do not rewrite older entries unless correcting a
mistake.

### 8. Commit the completed iteration

End the iteration by committing the completed changes.

Default behavior:

- Stage the edited pages, styles, goal files, and summary JSONL entry.
- Leave unrelated risky files unstaged.
- Commit with a message that names the iteration.

Suggested iteration commit message:

```text
Iterate CapX route idea for reader clarity
```

This final commit is required so the next iteration can start from a clean
baseline instead of cleaning up the previous one.
