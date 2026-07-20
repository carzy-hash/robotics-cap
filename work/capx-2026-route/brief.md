# CapX 2026 Route: Brief

## Goal

Explain why policy code is a useful intermediate representation between a capable Code Agent and constrained robot action interfaces.

## Core thesis

For suitable robot tasks, readable and auditable strategy code can preserve more of a model's planning and tool-use ability than asking it to emit one long action sequence. Short Action Chunks remain part of the stack, but become constrained outputs of the policy rather than the entire policy representation.

## Intended reader

An AI engineer familiar with coding agents but not necessarily with robot control, plus robotics readers evaluating responsibility boundaries and safety claims.

## Scope

- In scope: policy-code interfaces, short closed-loop execution, supervision, auditability and route prerequisites.
- Out of scope: claiming that language models replace perception, motion planning, low-level control, dynamics or hardware validation.

## Acceptance criteria

- State the thesis and its boundary before the detailed argument.
- Distinguish task understanding, policy code, action interfaces and execution feedback.
- Provide concrete control and evaluation examples without overstating evidence.
