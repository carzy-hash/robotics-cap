# CAP AR-native Training: Brief

## Goal

Explain why CAP should train its main strategy layer autoregressively while keeping continuous-generation methods available for lower-level roles where they fit.

## Core thesis

An AR main strategy aligns with the representation and supervision used by strong language and multimodal models: explicit goals, observations, calls, checks and recovery steps. This is a layering choice, not a claim that AR should directly generate every motor command.

## Intended reader

Robotics control researchers, language or multimodal model engineers, and product-route readers comparing AR, Flow Matching and diffusion responsibilities.

## Scope

- In scope: strategy representation, supervision consistency, debugging and layer boundaries.
- Out of scope: declaring one generative family universally superior or replacing continuous low-level control.

## Acceptance criteria

- Define AR in the CAP context.
- Make the three-layer boundary explicit.
- Treat public evidence and proposed route choices separately.
- Present FM and diffusion fairly as useful tools in appropriate layers.
