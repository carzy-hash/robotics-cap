# To Delete

This file is the human-confirmed cleanup queue for the Robotics CAP portal.

During normal document iterations, do not directly delete pages, sections,
assets, scripts, directories, navigation entries, or old placeholders unless the
user explicitly asks for that cleanup. Instead, list deletion proposals here.

## How to Use

For each proposed cleanup, include:

- Item: file, section, link, directory, or asset to remove
- Location: exact path or page area
- Reason: why removal may improve the portal
- Risk: what could break or become harder to understand
- Replacement: where the reader should go instead, if applicable
- Status: proposed, approved, rejected, or done

## Proposed Cleanups

### 1. Placeholder public preview collection

- Item: `previews/public/index.html`
- Location: `previews/public/`
- Reason: it is currently a placeholder preview collection without real demos or feedback requests, so it may add one extra click before there is content.
- Risk: removing it would break the existing `previews/index.html` link to `public/`.
- Replacement: keep `previews/index.html` as the only preview entry until there is a real public preview.
- Status: proposed

### 2. Proposal process page as a top-level navigation item

- Item: `proposals/index.html` or its top-level navigation entry
- Location: `proposals/` and the shared header navigation
- Reason: the page currently explains process rather than listing real proposals. It may distract readers who are trying to understand the first CapX idea.
- Risk: removing it would reduce the portal's collaboration affordance and break existing navigation links.
- Replacement: keep the page but rename it later to a more explicit "How to propose" page, or remove the top-level nav entry until proposals exist.
- Status: proposed

### 3. Deployment boundary HTML page

- Item: `docs/index.html`
- Location: `docs/`
- Reason: it summarizes `docs/deployment-constraints.md`, so the portal currently has both a Markdown source and an HTML summary for the same boundary.
- Risk: removing it would break the `previews/index.html` link to `../docs/` and make the deployment boundary less discoverable from the site.
- Replacement: link directly to `docs/deployment-constraints.md` from relevant pages, or keep `docs/index.html` as the reader-friendly version.
- Status: proposed
