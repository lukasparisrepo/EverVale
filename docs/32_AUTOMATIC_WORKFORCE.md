# 32 — Automatic Workforce Assignment

Status: **CANONICAL v0.1**

## Core rule

The player does **not** manually drag citizens into buildings.

EverVale automatically assigns available Workforce to reachable jobs.

The player controls strategy through **category priorities**, not individual workers.

## Workforce

`Workforce = floor(Population × 0.75)`

A building exposes job slots.

If total slots exceed Workforce, some buildings operate partially or stop.

## Default automatic policy

The default policy tries to keep the settlement alive and solvent.

Order:

1. **Critical Utilities**
   - Power Plant
   - Water Plant

2. **Minimum Income Reserve**
   - preserve enough Workshop/Business staffing to avoid obvious Treasury collapse where possible

3. **Essential Safety**
   - minimum Guard staffing when threats are enabled

4. **Education**
   - School

5. **Varum**
   - Mine

6. **Advanced Defense / Industry**
   - Radar
   - Vehicle Factory
   - later Airfield

7. **Additional Income**
   - remaining Workshop/Business slots

This is a baseline policy, not a hard-coded permanent doctrine.

## Player priority controls

Player can set category priorities:

- Money
- Utilities
- Education
- Varum
- Defense

Suggested UI:
- Low
- Normal
- High

The server converts those choices into assignment weights.

## Important behavior

If a town has:
- 30 available workers
- 37 requested job slots

then **only 30 workers exist**.

The remaining seven slots are vacant.

No building receives phantom workers.

## Partial staffing

A staffed building uses:

`staffFactor = assignedWorkers / requiredWorkers`

Production generally scales with staffFactor.

Examples:
- School with 1/2 workers produces ~50% Tech.
- Varum Mine with 1/2 workers produces ~50% Varum.
- Workshop with 2/4 workers produces Money from only two workers.

Utility behavior may have minimum staffing thresholds if later playtests need them.

## Reassignment cadence

Do not reshuffle every simulation frame.

Recalculate when:
- Population changes
- building opens/closes
- road connectivity changes
- player changes priority
- threat begins/ends
- worker becomes unavailable
- periodic sanity check occurs

## Commute

Among equally valid jobs, prefer lower road travel cost.

This produces natural-looking local employment without requiring the player to assign residents manually.

## Threat override

During an attack:
- civilians keep civilian job identity
- guard/military readiness can temporarily activate reserve logic
- do not permanently destroy normal assignments unless the underlying building/citizen state changes

## Diagnostics

Every understaffed building exposes:
- required workers
- assigned workers
- staffing factor
- reason for vacancy

The user should immediately understand why output fell.
