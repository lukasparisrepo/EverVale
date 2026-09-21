# 59 — Implementation Start Gate

Status: **GREENLIGHT — M0/M1 ONLY**

## Rule

Do not begin by implementing all buildings, all combat tiers, all animals and all campaign chapters.

The first objective is to prove one complete persistent living-world loop.

---

# M0 — Engineering Foundation

Required before gameplay scale-up:

## Repository scaffold

Target:

```
apps/
  client/
  server/
packages/
  domain/
  application/
  protocol/
  world-data/
  balance-data/
adapters/
  persistence/
  realtime/
  jobs/
  auth/
tools/
  validation/
  simulation/
```

## Mandatory engineering gates

- Node 22.12+ baseline
- workspace package manager locked
- TypeScript strict
- deterministic seeded RNG utility
- content YAML loader + schema validation
- deprecated-SSOT rejection
- unit test runner
- integration test runner
- CI
- lint/format
- server logging convention
- environment config convention
- PostgreSQL migration baseline
- world revision + lease transaction test

## First domain modules

Implement first:
1. IDs/versioning
2. Resources
3. Buildings
4. Workforce allocator
5. Happiness
6. Population Growth
7. World clock
8. Construction
9. Access graph
10. persistence snapshot/catch-up

No Three.js dependency in Domain.

---

# M1 — Vertical Slice Content Freeze

Only these systems/content are required.

## World

- one generated valley seed format
- starter plateau
- roads
- one blocker type
- one expansion route
- no Hill Lift required yet

## Buildings

Implement/balance only:

- Hearth Hall
- Hearth Cottage
- Copperwheel Workshop
- Sunwheel Power Works
- Clearbrook Water Works
- Willowbell School
- Lantern Grove
- Oakwatch Guardhouse

Optional after core works:
- Greenpatch Farm
- Honeybell Kitchen
- Builder's Yard

Do not implement the other 40+ buildings yet.

## Society

- Population 12+
- automatic Workforce
- adult work commute
- child School routine
- Park leisure
- one pet/animal ambient example

## Client

- Three.js terrain
- roads
- building placement
- selection
- simple citizens
- day/night
- minimal weather visual
- React HUD

Graybox art is acceptable initially.

## Persistence

Required demo:

`login → load world → build House → world saves → logout → time passes → reconnect → catch-up → continue`

This is mandatory before adding broad content.

## Combat

M1 uses only:
- Town Warden
- Guard
- Nibbler
- Wobble Slime

Required:
- warning
- auto deployment
- one sector
- HP/DPS/Armor
- CLEAN/COSTLY/BREACH
- repair aftermath

No Tank/UFO required for the first combat proof.

## Living-world reaction

During first threat:
- civilians stop leisure
- civilians use safe Home/Hearth Hall fallback
- Guards deploy
- animals react
- routines resume after all-clear

---

# M1 Exit Gates

M1 passes only when all are true:

1. persistent world survives browser restart
2. offline catch-up is deterministic enough for tests
3. starter economy cannot deadlock
4. Workforce never exceeds available workers
5. building placement is server-authoritative
6. roads affect access
7. 20+ citizens can visibly automate without FPS collapse
8. School/work/Park routines follow real world state
9. first wave is survivable without hidden manual micro
10. damage/repair persists
11. reconnect after attack gives correct history
12. architecture dependency checks pass

---

# M2 after M1 pass

Then add:
- Farm/animals
- incidents
- weather depth
- T1 Varum
- Watchtower
- terrain blockers
- Hill Lift
- Radar
- light-air Scout Drone
- ambient UFO flybys

---

# M3+

Only after M2 is stable:
- vehicles
- Tank/Rocket Rover
- heavy UFO
- aircraft
- full seasons
- dozens of buildings
- campaign chapters
- multiplayer experiments

---

# Agent instruction

If an implementation agent tries to:
- build 78 buildings before M1
- add multiplayer before persistence works
- add advanced UFO combat before Warden/Guard combat works
- merge Domain and Three.js
- skip validation because docs “look complete”

stop and return to this gate.

The vertical slice is the proof that EverVale is a game, not only a large design document.


## Preflight now available

Before substantial M0 coding, CI/preflight must run:
- `python tools/validation/validate_content.py`
- `python tools/validation/validate_worldgen.py --seeds 1000`
- `python tools/simulation/simulate_long_run.py --trials 20`
- `python tools/simulation/simulate_spatial_combat.py --trials 20`

Canonical pre-engineering lock:
`docs/66_PRE_ENGINEERING_DESIGN_LOCK.md`
