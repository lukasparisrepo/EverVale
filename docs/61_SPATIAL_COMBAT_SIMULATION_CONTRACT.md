# 61 — Spatial Combat Simulation Contract

Status: **CANONICAL COMBAT AUDIT GATE**

HP/DPS-only simulation cannot prove that roads, sectors, walls, response time and objectives matter.

## Minimal model
A combat audit world contains sectors, weighted access edges, threat entry nodes, defender home/rally nodes, objective buildings, optional gates/walls, and movement classes.

Reference combat step: 0.25 s online. Audit/offline coarse mode may use 1.0 s when safe.

Travel time = pathCostMeters / moveSpeed. A defender cannot deal damage before reaching effective range. Static defense never moves.

## Assignment
Use docs/53_COMBAT_COMMAND_DEPLOYMENT_WIN_LOSS.md. Response score depends on target compatibility, readiness, doctrine, distance/path cost, and HP state.

## Objectives
Enemy behaviors come from data/combat/v0.2/special_behaviors.yaml.
Explicit objective types include Scan, Disable utility, Break gate, Steal Money, Deploy Drop Pod, and Reach Civic Core.

## Routing
Ground attackers use valid access graph and may attack Gate/Wall when blocked. Burrower can bypass one outer defense per wave. Air ignores roads but still respects target range and anti-air coverage.

## Monte Carlo gates
For each Early Combat Level 1–10 run 1000 seeds with expected defense and one-step-underbuilt defense.

Expected defense target band:
- Repel rate 70–98%
- Clean Repel 20–75%
- Breach 2–30% depending lesson level

One-step-underbuilt must be materially worse, but should not become 0% unless a clearly telegraphed hard counter is missing.

## Layout proof
Same roster, three layouts: compact/good road, stretched/poor response, chokepoint/strong gate. Outcome distributions must differ. If layout does not change outcomes, spatial gameplay is fake.

## Doctrine proof
BALANCED, HOLD_CORE, INTERCEPT_AIR, PROTECT_VARUM, OUTER_DEFENSE must alter assignments and objective protection without hidden large DPS buffs.

## Offline equivalence
Same seed/state online fine-step vs offline coarse-step should match outcome class in >=95% of audit cases.

Reference harness: tools/simulation/simulate_spatial_combat.py