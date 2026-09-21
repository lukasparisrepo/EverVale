# 27 — Autonomous Citizens

Status: **NO-MICRO CITIZEN MODEL v0.1**

## Core rule

The player does not drag people into jobs.

The player manages:
- capacity
- priorities
- services
- housing
- utilities
- safety

Citizens are assigned automatically.

## Economic abstraction vs visible citizens

EverVale can keep economy math aggregate while rendering individual citizens.

Economic truth:
- Population
- Workforce
- assigned worker counts

Visual truth:
- named/seeded citizens
- homes
- work/school destinations
- daily routines

Do not force every economic calculation to depend on every animated footstep.

## Citizen age bands

Initial:
- Child
- Adult
- Senior

Children:
- use School when available
- play/recreate
- never count as economic Workforce

Adults:
- eligible for jobs
- commute
- recreate
- defend only if their role requires it

Seniors:
- no default Workforce contribution
- use parks/civic spaces more often

The aggregate `Workforce = floor(Population × 0.75)` remains the v0.1 economic rule.

Age bands are primarily presentation until a demographic system is intentionally introduced.

## Automatic job allocator

Buildings request workers.

Allocator considers:
1. mandatory critical jobs
2. player category priority
3. building priority
4. road connectivity
5. commute cost
6. available Workforce

Suggested default category priority:

1. Power
2. Water
3. essential Money production
4. active defense during threat
5. School
6. Varum
7. advanced production

The player can reorder non-critical priorities.

## Partial staffing

Buildings support `operationalFactor` between 0 and 1.

Example:

A Mine needs 2 workers.

If only 1 is allocated:

```
operationalFactor = 0.5
Varum output = 50%
utility use = 50%
```

Fixed upkeep may still remain fully charged.

This prevents all-or-nothing assignment cliffs.

## Routine states

Citizen presentation state can include:

- SLEEPING
- AT_HOME
- GOING_TO_WORK
- WORKING
- LUNCH
- GOING_TO_SCHOOL
- AT_SCHOOL
- LEISURE
- ERRAND
- RETURNING_HOME
- SHELTERING
- EVACUATING
- INJURED
- RECOVERING

## Household behavior

Households help create believable synchronized behavior:
- children leave for School
- adults may leave near commute time
- family members return home in evening
- pets can originate from occupied homes

Households do not need complex relationship AI in v0.1.

## Happiness behavior

Happiness modifies visible life without changing core schedules unrealistically.

High Happiness:
- more leisure
- more park use
- more social idles
- more decorative activity

Low Happiness:
- less leisure
- more home idling
- fewer optional trips

## Threat override

Safety states override normal routines.

Priority:

```
INJURY > ACTIVE_ATTACK > EVACUATION > ESSENTIAL_JOB > NORMAL_ROUTINE
```

## Follow Citizen

The player may click a visible citizen and use **Follow**.

This is observation only.

It should reveal:
- name/seeded identity
- home
- current activity
- workplace/school
- Happiness summary

The player still does not manually command them.

## Persistence

Persist only data with gameplay or identity value.

Do not save:
- exact left-foot animation frame
- every local avoidance turn
- every pet wander coordinate

Reconstruct presentation from logical state.
