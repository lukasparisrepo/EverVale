# 06 — Buildings & Construction

## Categories

### Residential
Homes, apartments, later specialized housing.

### Civic
School, clinic, park, plaza, shelter, administration.

### Utility
Generator, pump, water treatment, reservoir, substation.

### Economy
Farm, shop/market, storage, workshop, logistics depot.

### Varum industry
Mine, refinery, secure storage, advanced factory.

### Defense
Guard post, wall/gate, watchtower, radar, vehicle depot, airfield, anti-air, shield infrastructure.

## Building contract

Every building definition contains:
- id/type
- footprint
- build cost
- build time
- workers
- electricity demand/production
- water demand/production
- road requirement
- input/output
- storage
- service effect
- upkeep
- upgrade path
- visual variants

## Construction

Construction is visible.

Preferred stages:
1. surveyed footprint
2. foundations
3. frame
4. shell
5. completed
6. operational commissioning

Workers and delivered materials should appear where budget permits.

## Placement

Placement preview must validate:
- terrain
- collision
- road access
- forbidden overlap
- utility constraints when relevant

Server revalidates final placement.

## Upgrades

Upgrades should alter the physical asset or attach visible modules.

Do not silently turn a cottage into a factory through stat-only level changes.

## Damage and repair

Damage states should be visible and repairable.

Buildings can be:
- healthy
- degraded
- damaged
- disabled
- repairing

Offline attacks may damage buildings, but safety budgets prevent unreasonable total destruction.
