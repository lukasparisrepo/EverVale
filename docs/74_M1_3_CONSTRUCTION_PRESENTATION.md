# 74 — M1.3 Construction Presentation Runtime Contract

Status: **IMPLEMENTED / BROWSER-PROVEN**

Date: 2026-09-21

## Goal

Construction must visibly look like an active town process instead of a completed building fading in while a timer counts down.

The simulation remains simple:
- Money
- optional Varum
- construction slot
- time

No construction-goods commodity is introduced.

## Persistent progress contract

Every BuildingInstance now stores:

- constructionRemainingSeconds
- constructionTotalSeconds

Why:
- visual progress survives save/reload
- progress is stable if balance changes after a project was queued
- old saves can be migrated safely

Legacy migration:
- completed building -> total 0
- active legacy project -> infer canonical total from its definition, never below remaining time

## Visual stages

Runtime presentation authority:

`apps/client/src/world/construction-visual.ts`

Stages:

1. FOOTPRINT
2. FOUNDATION
3. FRAME
4. SHELL
5. FINISHING
6. COMPLETE (normal building renderer)

Current thresholds:

- 0–12%: footprint
- 12–32%: foundation
- 32–62%: frame
- 62–88%: shell
- 88–100%: finishing

These are presentation thresholds, not new domain states.

## Construction site art

Procedural M1 site includes:
- marked footprint
- stakes
- concrete foundation
- timber frame
- scaffold
- partial shell
- material stacks
- progress flag

Final authored buildings may replace these elements later while preserving the stage contract.

## Builder actor

Each active M1 project may show a builder actor.

Source:
1. completed Builder's Yard if available
2. otherwise Town Center

Builder behavior:
- routes to construction site through the actual road graph
- does not teleport through disconnected terrain
- moves around the site after arrival
- simple hammer animation while working

Builder is visual presentation only.

Construction progression remains server/domain time authority.

## HUD

Status panel shows:
- building title
- current visual stage
- percent complete
- remaining seconds

## Automated browser proof

The M1 browser scenario verifies after placing Hearth Cottage:

- state = BUILDING
- constructionTotalSeconds = 1200
- remaining > 0
- HUD Construction section appears
- initial visual stage = FOOTPRINT
- WorldView reports one active construction project
- save/reload preserves project state

All previous gates remain enabled:
- road routing
- Decor persistence
- offline catch-up
- combat
- repair
- renderer budgets
- page error detection

## Architecture rule

Do not add frame/foundation/shell as separate persisted domain states unless gameplay later needs stage-specific rules.

For M1:
`timer state -> deterministic visual stage`

## Decision

**M1.3 CONSTRUCTION PRESENTATION: IMPLEMENTED**
