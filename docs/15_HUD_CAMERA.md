# 15 — HUD & Camera

## Camera

Primary:
- perspective isometric-style
- pitch approximately 48–55°
- FOV approximately 35–45°
- smooth orbit
- zoom from management view to close diorama
- constrained pan

## Top resource bar

Always readable:
- Money: current / Treasury cap
- Power: reserve, production and consumption
- Water: reserve, production and consumption
- Varum: current / storage cap
- Population: current / Housing capacity
- Happiness
- Tech Tier + progress

## Resource warning language

Prefer:
- Power +40 / -35
- Reserve 82 / 120

over obscure engineering units.

## Workforce panel

Show:
- available Workforce
- assigned jobs
- unassigned workers
- job priority

Key categories:
- Money
- Utilities
- Education
- Varum
- Defense

## Build palette

Categories:
- Housing
- Economy
- Utility
- Education
- Civic
- Varum
- Defense
- Roads

## Inspector

Explain causes:
- NO_WORKERS
- LOW_POWER
- LOW_WATER
- DISCONNECTED
- TECH_LOCKED
- NO_MONEY
- NO_VARUM
- DAMAGED

## Overlays

- road connectivity
- worker commute
- service coverage
- safety
- threat/radar
- building operation

MVP does not need cable/pipe overlays because Power/Water are settlement resource systems rather than detailed networks.

## Time controls

Single-owner ACTIVE world:
- Pause
- 1x
- 2x
- 4x

Logout always resumes persistent world at 1x.

Future shared multiplayer may restrict speed control.

## Threat UI

Never expose hidden attack threshold or exact event time.

Show:
- rumors/clues
- scout report
- radar contact
- danger direction
- current attack
- after-action report
