# 06 — Buildings & Construction

## Core building families

### Residential
**House**
- provides Population capacity
- contributes to Growth when Happiness is high

### Money
**Workshop / Business**
- employs citizens
- primary early Money generator

### Utility
**Power Plant**
- produces Power

**Water Plant**
- produces Water
- consumes some Power

### Education
**School**
- produces Tech Points
- improves education coverage

### Happiness
**Park**
- raises recreation coverage
- creates visible leisure activity

### Varum
**Varum Mine**
- produces Varum directly
- unlocked at Tech T1

### Defense
- Guard Post
- Watchtower
- Radar
- Vehicle Factory
- Airfield
- Anti-Air
- Varum Shield

## Building definition contract

Every building definition declares:
- ID
- Tech requirement
- footprint
- Money cost
- optional Varum cost
- construction time
- worker slots
- Money yield per worker
- Power production/consumption
- Water production/consumption
- Varum production
- Tech production
- upkeep
- housing capacity
- service effects
- storage contribution
- visual variants

## Construction model

MVP construction uses:
- Money
- optional Varum for advanced structures
- construction time

There is **no construction-goods commodity in v0.1**.

This prevents bootstrap deadlocks and keeps the first economy legible.

## Construction stages

Visually:
1. footprint
2. foundation
3. frame
4. shell
5. finished

The simulation may use fewer internal stages while the client interpolates visuals.

## Construction capacity

The settlement has limited concurrent construction capacity.

Initial target:
- 1 active construction slot
- later Town/Builder upgrades can add slots

This creates pacing without adding a material chain.

## Placement

Server validates:
- terrain
- overlap
- road reachability
- Money
- Varum
- Tech
- construction capacity

## Upgrades

Upgrades should visibly change the building or attach modules where practical.

## Damage

States:
- healthy
- damaged
- disabled
- repairing

MVP offline attacks can disable buildings but do not permanently delete critical infrastructure.
