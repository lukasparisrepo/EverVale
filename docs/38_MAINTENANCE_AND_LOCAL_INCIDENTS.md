# 38 — Maintenance & Local Incidents

Status: **CANONICAL ANTI-IDLE SYSTEM v0.1**

## Goal

Automation must not mean:

`leave game for 48 hours → return richer, stronger, fully researched, automatically victorious`

EverVale uses **soft entropy**.

The town runs automatically, but operation creates:
- wear
- incidents
- capacity pressure
- repair demand
- staffing pressure
- new strategic choices

Prepared towns handle minor problems automatically. Neglected towns plateau or lose efficiency rather than instantly collapsing.

# Building Condition

Each operational building has:

`condition = 0..100`

Bands:
- 85–100 Excellent
- 65–84 Good
- 40–64 Worn
- 20–39 Poor
- 1–19 Critical
- 0 Disabled

Condition changes slowly.

Low Treasury, overload, understaffing, repeated incidents and unresolved damage accelerate deterioration.

# Maintenance

Routine maintenance is automatic if:
- Money is available
- road access exists
- maintenance capacity exists

Player controls:
- maintenance priority
- repair priority
- whether expensive noncritical buildings remain enabled

No repetitive wrench-click mechanic.

# Maintenance Capacity

Hearth Hall supplies small baseline maintenance capacity.

Builder's Yard and Civic Service Yard increase:
- concurrent repairs
- maintenance throughput
- recovery from local incidents

A repair queue creates a management constraint.

# Local Incident Families

## Rats

Eligible:
- Houses
- Workshop
- Restaurant
- Market
- Farm
- School rarely

Effects:
- Happiness penalty
- local efficiency loss
- visible nuisance

Counter:
- maintenance
- Civic Service Yard
- healthy condition

## Fire

Eligible:
- House
- Workshop
- Restaurant
- Farm
- Power Plant
- Vehicle Factory

Effects:
- immediate operation stop
- condition damage
- nearby Happiness/Safety penalty
- visible smoke/flames

Counter:
- Emberwatch Brigade
- road access
- adequate Water
- maintenance

Fire is recoverable and localized.

## Utility Fault

Eligible:
- Power Plant
- Water Plant
- storage buildings
- advanced industry

Effects:
- temporary output loss
- reserve drain
- cascading shortages if town has no headroom

Counter:
- spare capacity
- maintenance
- service crews

## Explosion

Eligible:
- Power Plant
- Varum Mine
- advanced factory

Rare.

Effects:
- heavy local condition damage
- nearby buildings may receive minor splash damage
- temporary closure
- strong visual event

Never deletes the entire settlement.

## Cave-in

Varum Mine only.

Effects:
- output stops
- repair/clearance task
- possible temporary worker injury state

## Storm damage

Eligible:
- roads
- houses
- farms
- parks
- towers

Effects:
- fallen tree
- damaged roof
- blocked path
- local repair tasks

## Animal escape

Farm incident.

Effects:
- comic world event
- temporary farm efficiency loss
- visible animals outside enclosure
- service/farmer recovery task

## Vandalism / litter

Park/market/civic.

Low severity:
- temporary Happiness/beauty penalty
- service crew response

# Incident pressure

Incident chance is not pure flat RNG.

Each building accumulates local risk from:
- low condition
- over-capacity
- low staffing
- relevant utility shortage
- building-specific hazard
- world weather/event modifiers

Prepared buildings therefore fail less often.

# Automatic response

If the town has appropriate service capacity:
- incident can be detected automatically
- response team is dispatched
- Money/repair capacity is consumed
- building returns to operation

Player intervention is only needed when:
- multiple incidents exceed capacity
- Treasury is low
- critical infrastructure is affected
- priorities need changing

# Offline behavior

Offline incidents are simulated, but bounded.

Rules:
- minor incidents can occur and resolve automatically
- unresolved incidents reduce output
- local incidents cannot silently erase critical buildings
- offline incident count uses caps/cooldowns
- after-action report explains important events

The expected result after two days away is:

**“My town continued living, earned something, hit storage/efficiency limits, had some events and may need my decisions.”**

Not:

**“I won the game while sleeping.”**
