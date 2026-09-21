# 26 — Living World Simulation

Status: **CANONICAL LIVING WORLD v0.1**

## Product principle

EverVale should feel like an automated miniature society.

> **The player builds the town. The town lives by itself.**

The world must not require constant character micromanagement.

## Data-to-life rule

Important simulation state should create visible behavior:

```
simulation state
      ↓
actor intent
      ↓
activity selection
      ↓
visual behavior
```

Examples:

- School operating → children travel to school.
- School closed → school traffic disappears.
- High Happiness → park/leisure activity rises.
- Threat warning → public spaces empty.
- Attack → civilians seek safety.
- Night → work traffic falls, house lights rise.
- New Farm → farmers and farm ambience appear.

## Three actor classes

### Persistent actor

Has stable logical identity.

Examples:
- citizen
- guard
- important vehicle
- aircraft

Server persists its important logical state.

### Functional transient actor

Represents a real gameplay task but need not live forever.

Examples:
- repair crew
- construction vehicle
- delivery/service vehicle
- emergency response actor

### Ambient actor

Purely or mostly visual.

Examples:
- birds
- butterflies
- cats
- dogs
- chickens
- ducks
- decorative civilian vehicles
- background cyclists

Ambient actors can be recreated deterministically from:
- world seed
- district seed
- current time window
- activity density

## Server vs client

Server simulates meaning.

Client simulates motion detail.

Server says:

```
Citizen 104:
  state = GOING_TO_WORK
  origin = house_12
  destination = workshop_3
  departAt = 07:42
  arriveAt = 08:03
```

Client handles:
- walk animation
- exact road position
- local avoidance
- pauses
- turning
- footstep VFX

## No fake contradiction

Ambient life must obey current world context.

Forbidden:
- children entering disabled School
- citizens partying during active bombardment
- full street traffic during evacuation
- workers entering a disconnected building
- chickens walking through downtown because random spawn chose it

## Activity density

Do not spawn life uniformly.

Each zone/building generates activity demand.

A Park at 17:00 on a sunny day may have high leisure demand.

An industrial district at 22:00 may have almost none.

## Time windows

Initial visual rhythm:

| Time | Dominant activity |
|---|---|
| 05:30–07:00 | wake / early work |
| 07:00–09:00 | commute / school |
| 09:00–12:00 | work / school |
| 12:00–14:00 | lunch / errands |
| 14:00–16:30 | work / school |
| 16:30–19:00 | school exit / commute / parks |
| 19:00–22:30 | recreation / home |
| 22:30–05:30 | low traffic / patrol / night |

These windows affect presentation, not core Money production formulas.

## Offline worlds

Offline simulation does not replay footsteps.

It advances meaningful state only.

On reconnect:
1. server sends world state + server time
2. client evaluates current activity window
3. actors are reconstructed at plausible routine positions
4. transitions continue naturally

## Living-world acceptance

At any random camera zoom-in, the player should usually see at least one believable sign of current life:
- movement
- work
- recreation
- animal behavior
- service activity
- lights
- construction
- patrol
- traffic

unless the world state explains why it is quiet.
