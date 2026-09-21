# 22 — Systems Audit — 2026-09-21

Status: **AUDITED / P0 CONTRADICTIONS RECONCILED**

## Overall verdict

The game concept **works as a management game** if it stays deliberately abstract.

The strongest design is not realistic city simulation. It is a readable Fallout-Shelter-like system projected into a free 3D town:

`Housing + Happiness → Population → Workforce → Money`

`Power Plant → Power`

`Water Plant → Water`

`School → Tech`

`Varum Mine → Varum`

`Money + Tech + Varum → advanced military`

`Threat → damage / repair / defense demand`

This creates multiple competing uses for the same finite Workforce and Treasury.

## P0 contradictions found and fixed

### 1. Economy was too realistic / undefined
Old docs mentioned food, construction goods, Raw Varum, Refined Varum, utility networks and logistics at the same time.

That was drifting away from the intended shelter-sim abstraction.

**Fixed:** core v0.1 has only Money, Power, Water and Varum. Tech is progression. Population/Happiness/Workforce are state.

### 2. Varum chain was unnecessary
Raw → refinery → refined was extra complexity before gameplay proof.

**Fixed:** Mine produces Varum directly.

### 3. Power/Water network contradicted the desired fantasy
Explicit pipe/grid simulation would create engineering work with little immediate fun.

**Fixed:** utility buildings produce stored settlement resources. Roads define physical connectivity. Explicit wires/pipes are deferred.

### 4. Construction could deadlock
Construction goods were mentioned but no producer/bootstrap was defined.

**Fixed:** v0.1 construction uses Money + time + optional Varum for advanced structures.

### 5. Population origin was undefined
Housing existed but there was no rule for where residents come from.

**Fixed:** Housing + Happiness generate Growth automatically.

### 6. Money origin was vague
Taxes/trade/wages were mixed without a clear economy.

**Fixed:** citizens assigned to workplaces generate Money according to job type.

### 7. Education had no mechanical output
School had social meaning but no progression contract.

**Fixed:** School produces Tech Points and education coverage.

### 8. Defense progression was disconnected from economy
Vehicles existed as unlock ideas only.

**Fixed:** Tech unlocks military tiers; Money + Varum purchase advanced units; military consumes upkeep/Workforce/Power.

### 9. Road graph and Recast were conflated
A dynamic city cannot make a 3D navmesh the canonical economic graph.

**Fixed:** weighted server road graph is canonical for commute/service/economy. Recast handles local walkability.

### 10. Offline double-simulation race
ACTIVE room and background worker could theoretically advance one world simultaneously.

**Fixed:** exclusive database-backed simulation lease + world revision transaction is now a P0 invariant.

### 11. Pause/logout contradiction
A paused player could otherwise freeze an allegedly persistent world.

**Fixed:** logout returns world speed to 1x.

### 12. Combat had no math
No common stats or offline equivalence existed.

**Fixed:** HP/DPS/Armor model with deterministic armor formula and shared online/offline stats.

## Gameplay risks still requiring playtests

### R1 — Tech may progress too fast offline
One School at baseline creates 24 Tech/hour. This is intentional for testing, but thresholds must be tuned after real session data.

### R2 — Happiness can remain high while Treasury is weak
This is acceptable initially because funding failure later disables services, which then lowers Happiness. Do not directly turn Money into Happiness.

### R3 — Threat scaling can punish success
Threat Pressure rises with Population, Tech and active Varum mining.

The system must create stronger stories, not make growth feel bad. Raid frequency and damage caps need telemetry/playtests.

### R4 — Workforce is currently aggregate
75% Workforce is excellent for MVP but not a permanent life-sim model.

Do not add full demographics until the economic loop is proven.

### R5 — High Tech could become a straight ladder
Auto Tech tiers are easy to understand but create little strategic choice.

Possible post-MVP solution: branch unlock choices while keeping School → Tech as the base rule.

### R6 — Offline world could become “better not to log in”
Storage caps, attack caps and funding limits are required so unattended worlds do not infinitely optimize themselves.

## Gameplay test conclusion

The core loop has a real decision structure:

At low Population:
- Workforce is scarce.

At medium Population:
- Power/Water and Housing become constraints.

At Tech T1/T2:
- School and Mine consume workers that could make Money.

At military tiers:
- defense consumes Money/Varum/Power without producing income.

Therefore the systems generate tradeoffs without needing dozens of resources.

That is the correct foundation.
