# 16 — MVP & Roadmap

## MVP question

Can a small 3D town feel worth returning to when the player only manages:

**Money + Power + Water + Varum + Population + Happiness + Tech + priorities?**

## MVP world

- one valley around 300×300m
- 12 starting Population
- growth toward 30–40
- editable roads
- autonomous 3D citizens
- children / School routine
- Park activity
- pets/farm ambience
- civilian traffic
- day/night
- persistent login world

## Core buildings

### T0
- House
- Workshop
- Market
- Farm
- Power Plant
- Water Plant
- School
- Park
- Guard Post

### T1
- Varum Mine
- Café
- Watchtower

### T2
- Radar
- Vehicle Factory
- Armored Car

The first playable combat proof can stop around T2.

## Core resources

Exactly:
- Money
- Power
- Water
- Varum

Progress/state:
- Tech
- Population
- Workforce
- Happiness

Explicitly not in core:
- Food resource
- Raw/Refined Varum
- construction goods
- fuel
- detailed pipe/electric grids

## Required economy loop

`Housing + Happiness → Population`

`Population → Workforce`

`Automatic Workforce → Money / Power / Water / Tech / Varum / Defense`

`Tech + Money + Varum → stronger technology`

## Required living-world loop

The same state must be visible through:
- work commute
- School commute
- Park use
- Farm activity
- cats/dogs
- chickens/ducks
- civilian vehicles
- guards/patrol
- lights by time of day

No per-citizen commands.

## Required threat loop

- hidden pressure
- warning
- autonomous response
- spatial combat
- damage
- repair
- After-Action report

No exact attack countdown.

## Required persistence loop

`login → build → logout → world continues at 1x → reconnect → catch-up → history → continue`

## Phase 0 — architecture and numerical proof

- layered architecture
- dependency boundaries
- balance SSOT
- Workforce allocator test
- economy simulation
- combat simulation
- offline lease/catch-up test
- activity-anchor prototype

## Phase 1 — Living Block

- terrain
- road editing
- Houses
- Workshop
- Power/Water
- autonomous adults
- Money
- save/load
- day/night

## Phase 2 — Society

- Happiness
- Growth
- School
- children
- Tech
- Park
- pets
- traffic
- Market/Farm

## Phase 3 — Varum

- Mine
- storage cap
- T1/T2
- advanced build costs

## Phase 4 — Threat

- Guard
- Watchtower
- Radar
- ground wave
- spatial coverage
- damage/repair/report

## Phase 5 — Advanced military

- Vehicle Factory
- Armored Car
- Tank
- Airfield
- Fighter
- Anti-Air
- UFO

## Phase 6 — Scale / polish

- citizen simulation LOD
- InstancedMesh
- static crowd batching
- more activity profiles
- Blender art pipeline
- dream-loop visual critic
- mobile quality tiers
