# 62 — World Generation Validation Contract

Status: **CANONICAL WORLDGEN GATE**

## Generator output
World seed, terrain archetype, sectors, elevation bands, buildable area, access candidates, blockers, Varum deposits, threat entry corridors, decorative seed.

## Hard validation
Reject/reroll if any fail:
- starter buildable area >= configured minimum
- starter road network can connect all starter buildings
- >=2 distinct expansion routes
- >=1 Varum deposit reachable by T1 clearance/access
- >=3 external threat approach corridors where topology permits
- no mandatory progression sector permanently isolated
- first expansion blocker affordable from early-game economy
- heavy vehicle can eventually reach at least one major defense sector
- Airfield-sized footprint exists on at least one T4-accessible sector

## Fairness over 1000 seeds
- invalid/reroll rate < 20%
- median first-expansion Money cost within ±20% target
- 90th percentile first-Varum route cost <= configured maximum
- starter usable-area coefficient of variation < 0.20
- no archetype >15% worse median progression cost than global median

Different maps should change decisions, not difficulty class.

Reference validator: tools/validation/validate_worldgen.py