# 67 — M0/M1 Engineering Status

Status: **M0 FOUNDATION PASS / M1 BROWSER RUNTIME PROOF PASS**

## What is implemented

M0:
- pnpm TypeScript monorepo
- layered domain/application/protocol/adapters/client/server boundaries
- deterministic domain simulation
- PostgreSQL persistence adapter
- JSON local-dev persistence fallback
- DB migration
- engineering CI
- content/worldgen preflight CI
- domain/application tests

M1 graybox:
- dev login
- persistent starter world
- offline catch-up from lastSimulatedAt
- Money / Power / Water / Varum / Tech / Population / Happiness
- automatic Workforce
- School Tech progression to T1
- construction queue
- authoritative road access
- road drawing
- building placement
- Three.js town scene
- autonomous citizen presentation
- work / school / park presentation targets
- day/night lighting
- speed 0x / 1x / 2x / 4x
- surprise test wave
- automatic Town Warden / Guard combat
- Nibbler / Wobble Slime
- CLEAN / COSTLY / BREACH
- combat aftermath damage
- repair command and timed repair
- persisted event history

## Run locally

Requires Node 22.12+.

### Zero-setup local persistence

```bash
npm install --global pnpm@10.15.1
pnpm install
cp .env.example .env
# remove/comment DATABASE_URL to use JSON dev persistence
pnpm dev
```

Client:
- http://localhost:5173

Server:
- http://localhost:2567

### PostgreSQL mode

```bash
docker compose up -d postgres
pnpm dev
```

Keep DATABASE_URL from .env.example.

## Validation

Current main-branch CI:
- EverVale Preflight: PASS
- EverVale Engineering: PASS

Engineering gate runs:
- install
- TypeScript typecheck
- tests
- Vite production build

Preflight runs:
- content cross-reference validation
- 1000-seed worldgen validation
- long-run sim smoke
- spatial-combat sim smoke

## Current limitation

This is a playable engineering graybox, not an art-complete game.

Still intentionally deferred behind M1 playtest:
- final assets/Blender pass
- real Better Auth
- Colyseus realtime room transport
- pg-boss background jobs
- full navmesh/crowd
- T1+ Varum gameplay
- Watchtower/UFO combat
- weather depth
- full incidents
- vehicles/aircraft
- multiplayer

The next gate is not more foundation design. It is to run/play the M1 loop, measure it, and fix runtime issues before M2.


## Browser runtime proof

See:
`docs/68_M1_BROWSER_RUNTIME_PROOF.md`

Playwright verifies the real client/server loop:
login → road/build → reload → offline catch-up → combat → aftermath → repair.

Latest Engineering and Preflight workflows are both PASS.


## Runtime-quality baseline

See:
`docs/69_M1_RUNTIME_QUALITY_AUDIT.md`

Current M1 runtime-quality baseline includes:
- placement ghost feedback
- authoritative terrain blockers
- blocker clearing
- readable citizen schedules
- ambient dog
- world clock
- Three.js renderer telemetry
- browser performance budgets
- Playwright page-error detection

Latest Engineering and Preflight workflows are PASS.


## M1.4 stress / memory baseline

See:
`docs/75_M1_4_STRESS_MEMORY_AUDIT.md`

CI now verifies:
- 40 presented citizens
- 40/40 road routing
- draw-call / triangle budgets
- renderer geometry/texture stability
- bounded post-GC heap growth
- no browser page errors

Target-hardware FPS and a long physical-browser soak remain separate validation gates.
