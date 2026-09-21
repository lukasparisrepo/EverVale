# 24 — Prototype Simulation Results v0.2

Status: **AUDIT-CORRECTED**

These are design simulations against the v0.1 balance data plus Workforce allocator revision 0.2.

They are not final release tuning.

## Important correction

The previous Scenario E incorrectly described an advanced town as if all requested jobs could be staffed even when requested job slots exceeded available Workforce.

That violated the canonical rule:

`assigned workers <= Workforce`

This report replaces that result.

# Economy scenarios

## A — Starter settlement

Population: 12  
Workforce: 9

Buildings:
- 3 Houses
- Power Plant
- Water Plant
- Workshop

Per reference cycle:
- Power production 40 / demand ~14
- Water production 35 / demand ~10
- Money ~+26
- Housing full

Interpretation:
- stable bootstrap
- one worker can remain available
- the obvious first growth action is another House

## B — Civic town

Population: 16  
Workforce: 12

Buildings:
- 4 Houses
- Power
- Water
- Workshop
- School
- Park
- Guard Post

Per cycle:
- Power ~40 / 21
- Water ~35 / 17
- Money ~+19
- Tech +4

Interpretation:
- School/Guard visibly cost economic opportunity
- town remains healthy
- Happiness/Tech become meaningful alternatives to pure income expansion

## C — Varum town

Population: 24  
Workforce: 18

Buildings:
- 6 Houses
- Power
- Water
- 2 Workshops
- School
- Park
- Guard
- Varum Mine

Per cycle:
- Power ~40 / 35
- Water ~35 / 26
- Money ~+45
- Tech +4
- Varum +3

Interpretation:
- first utility ceiling is approaching naturally
- Varum competes for Workforce but does not replace Money

## D — 32 residents

Population: 32  
Workforce: 24

Buildings:
- 8 Houses
- 2 Power Plants
- Water Plant
- 2 Workshops
- School
- 2 Parks
- Guard
- Mine
- Watchtower

Per cycle:
- Power ~80 / 41
- Water ~35 / 33
- Money ~+38
- Tech +4
- Varum +3

Interpretation:
- Water is nearly saturated
- the next few expansion choices naturally force another Water investment

## E — Advanced town with more job slots than workers

Population: 40  
Workforce: 30

Buildings:
- 10 Houses
- 2 Power
- 2 Water
- 3 Workshops
- 2 Schools
- 2 Mines
- 2 Guard Posts
- 2 Watchtowers
- Radar
- idle Vehicle Factory

Requested staffed slots exceed Workforce.

With the phased default allocator:
- utilities receive 8 workers
- income receives enough workers for solvency
- ready defense receives 5
- Schools receive 4
- Mines receive 4
- remaining worker goes to additional income
- total assigned = exactly 30

One Workshop ends around **1/4 staffed** rather than receiving phantom workers.

Approximate result:
- Money **+19/cycle**
- Power **80 / 69**
- Water **70 / 43**
- Tech **+8**
- Varum **+6**

Interpretation:

The failure mode is **understaffing**, not impossible arithmetic.

The player sees a real strategic choice:
- grow Population
- lower School/Mine/Defense priority
- accept reduced income
- stop maintaining unnecessary buildings

## F — Gross overbuild can still become insolvent

Population: 24  
Workforce: 18

Example:
- 6 Houses
- 2 Power
- 2 Water
- only 1 Workshop
- 2 Schools
- 2 Mines
- 2 Guard Posts
- 3 Watchtowers
- Radar
- idle Vehicle Factory
- 2 Parks

Even after the allocator protects utilities and tries to reach the solvency floor, there is not enough income capacity.

Approximate result:
- Money about **-28/cycle**
- School/Varum staffing is heavily starved
- utilities remain functional

Interpretation:

Automation prevents nonsensical assignments; it does **not** make bad city planning harmless.

This is the intended distinction.

# Progression timing

## Population

At roughly 88–90 Happiness with spare Housing:
- early target remains around one resident per ~60 minutes
- Growth is capped to avoid exponential runaway

## Tech

One baseline School:
- +24 Tech/hour
- T1 around 1h40
- T2 around 5h total

More Schools accelerate Tech at the cost of Workforce, utilities and upkeep.

## Varum

One Mine:
- 18 Varum/hour at full operation

Reference material-only accumulation:
- Armored Car 10: ~34 min
- Tank 30: ~100 min
- Fighter 40: ~134 min

Tech and Money remain additional gates.

# Threat cadence audit

Threat model revision 0.2 separates frequency from intensity.

Approximate major-wave cadence:
- starter T0 first onboarding wave: ~1h45–2h30
- Population 24 / T1 / one Mine: ~4–6.5h
- Population 40 / T2 / two Mines: ~2.6–4.1h

Growth mainly raises **wave budget**, avoiding the incentive to stop progressing.

# Combat smoke tests

Canonical armor:

`effectiveDPS = rawDPS × 100 / (100 + Armor)`

### Early ground
2 Guards + Watchtower vs 3 Raiders + Critter:
- defenders should win
- some damage expected

### Mid ground
2 Guards + Watchtower + Armored Car vs 6 Raiders + Brute:
- close but defendable
- meaningful repair expected

### Tank tier
Guards + 2 Towers + Armored Car + Tank vs 8 Raiders + 2 Brutes:
- Tank materially improves outcome

### Air
AA + Fighter vs 2 Drones + UFO Raider:
- prepared defense can win
- ground-only units cannot magically target air

## Next numerical work

Before runtime implementation:
1. implement pure TypeScript Workforce allocator
2. implement economy scenario runner
3. implement seeded threat generator
4. run Monte Carlo combat with spatial response time
5. run 1000-seed map fairness validator

Do not add another resource to solve balance problems that can be solved through capacity, Workforce, upkeep or map access.
