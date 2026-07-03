# Deployment Constraints

This repository is a GitHub Pages portal for Robotics CAP ideas. It is not the
main implementation repository, and it should not grow into a heavy preview
deployment system.

## Repository Role

The repository should act as a lightweight project portal:

- list ideas, concepts, project directions, and curated preview entries
- organize public-facing or shareable explanations
- provide stable entry points for people who want to preview or contribute
- link to implementation repositories, demos, documents, and discussions
- preserve a clear editorial structure that is easy to review in pull requests

It should not be used as:

- the source of detailed implementation work
- a mirror of every implementation branch
- a storage location for generated builds from other repositories
- a permission or access-control layer
- a private knowledge base for sensitive project details

## Visibility Boundary

GitHub Pages should be treated as public or shareable by default. Directory names
such as `internal`, `draft`, `working`, or `private` do not provide access
control.

Use this rule when deciding where content belongs:

- Public or intentionally shareable content can live in this repository.
- Work-in-progress content can live here only if accidental discovery is
  acceptable.
- Sensitive, private, partner-specific, or implementation-heavy content should
  stay in a private repository, document system, or protected deployment.

This repository may label sections by audience, but it must not promise real
permission separation.

## Preferred Structure

Use directories to organize ideas and entry points by meaning, not by branch.

Recommended structure:

```text
/
  index.html              Main portal entry
  roadmap.html            Overall project route
  concepts.html           Conceptual narrative

ideas/
  index.html              Idea index
  robotics-cap.html       Example idea page
  policy-runtime.html     Example idea page

previews/
  index.html              Curated preview index

assets/
```

The exact page names can change, but the organizing principle should stay the
same: pages are grouped by purpose, not by implementation branch.

## Branch Preview Constraint

Do not use this repository to maintain full directory snapshots for branches
such as `main`, `dev`, or `feature/*`.

Avoid structures like:

```text
branches/
  main/
  dev/
  feature-a/
```

or:

```text
previews/
  dev/
  feature-a/
  feature-b/
```

unless those pages are curated summaries rather than copied site builds.

Branch-based preview deployment creates poor change tracking in this repository:

- duplicated files make reviews noisy
- generated snapshots hide the editorial changes that matter
- stale branch folders become easy to forget
- this repository becomes responsible for implementation release mechanics

If another repository needs branch previews, that repository should own its own
preview deployment using the right hosting or access-control tool.

## Preview Pages

Preview pages in this repository should be curated entry points. A preview page
may contain:

- a short summary of what is being previewed
- the idea or proposal status
- a link to a live demo, if one exists
- a link to the implementation repository or pull request
- notes about what feedback is requested

It should not contain a copied implementation build unless there is a specific,
small, intentional reason.

## Deployment Guidance

Use GitHub Pages for the portal itself. Keep deployment simple:

1. Publish this repository from the main Pages source.
2. Keep pages as static HTML and assets unless a stronger need appears.
3. Add new idea, proposal, or preview index pages as editorial content.
4. Link outward to implementation repos and protected previews.
5. Do not add GitHub Actions, local branch-sync scripts, or generated preview
   folders unless the repository role is deliberately changed.

If future deployment needs become more complex, choose the smallest tool that
matches the real requirement:

- Public idea portal: this repository on GitHub Pages.
- Public demo for a specific implementation: implementation repository or demo
  hosting should own it.
- Branch or pull-request previews: Vercel, Netlify, Cloudflare Pages, or a
  dedicated deployment workflow in the implementation repository.
- Restricted previews: use a host or gateway with real access control, such as
  team permissions or Cloudflare Access.

## Decision Rule

Before adding deployment machinery to this repository, ask:

1. Is this content an idea portal entry, or is it implementation output?
2. Would a reviewer understand the change by reading a small page diff?
3. Is accidental public access acceptable?
4. Does this make the portal clearer, or does it turn the portal into a release
   system?

If the answer points toward implementation, generated output, or access control,
the work belongs outside this repository.
