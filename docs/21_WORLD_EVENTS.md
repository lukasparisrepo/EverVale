# 21 — World Events

## Purpose

Events make the autonomous world feel alive and prevent optimization from becoming static.

Events must preferably have world-space consequences, not only popups.

## Event classes

### Cozy/civic
- market day
- school fair
- harvest festival
- traveling merchant
- park concert
- new family arrival

### Local / building
- rats
- kitchen fire
- generator fire
- pump failure
- machinery breakdown
- cave-in
- animal escape
- litter/vandalism

### Infrastructure
- local blackout
- damaged bridge
- blocked road
- Hill Lift fault
- Water Plant outage
- Power Plant overload

### Nature
- heavy rain
- drought period
- storm
- unusual wildlife
- seasonal abundance

### Threat
- monster tracks
- raid
- border tension
- radar anomaly
- UFO incursion

## Event model

Each event declares:
- trigger conditions
- probability/pressure contribution
- warning visibility
- duration
- affected entities
- economic consequences
- citizen behavior changes
- offline resolution rules
- player-facing summary

## No exact countdown

For threat events, warnings may escalate, but do not expose a precise timer unless a specific event intentionally uses one.

## Example — Varum anomaly

1. Varum Mine activity or stored Varum reaches a notable level
2. radar records unusual interference
3. citizens mention lights in the sky
4. military sensor confidence increases
5. UFO scout appears
6. possible incursion

The player receives information, not certainty.

## Example — festival

1. civic prerequisites met
2. plaza decorations appear
3. shops gain demand
4. citizens reroute leisure schedules
5. happiness boost occurs
6. event resolves into history

## Offline events

When an event happens during absence:
- simulate outcome at appropriate fidelity
- bound destructive consequences
- preserve key facts
- generate return timeline entry

## Repetition control

Use:
- cooldowns
- world state
- weighted history
- event families

to avoid repetitive random spam.


## Incident vs major event

Not every problem is a major world event.

Local building incidents use `docs/38_MAINTENANCE_AND_LOCAL_INCIDENTS.md`.

Examples:
- rats in a restaurant
- workshop fire
- Water Plant pump fault

Major world events alter broader town behavior:
- storm
- festival
- raid
- UFO incursion

This separation prevents event spam while still keeping the town alive.
