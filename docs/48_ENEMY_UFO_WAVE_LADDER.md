# 48 — Enemy, UFO & Wave Ladder

Status: **CANONICAL THREAT PROGRESSION v0.1**

## Goal

Combat should grow with the player's town.

Early EverVale:
- a few funny creatures create chaos

Mid game:
- tougher monsters, raiders, strange drones

High game:
- UFOs, walkers, carriers, bizarre Varum anomalies

The world becomes more spectacular, not simply more numerically punishing.

## Settlement Score

EverVale uses a **non-spendable Settlement Score** to classify how developed a world is.

This is not a currency and does not unlock purchases directly.

Reference score:

`Population × 2 + OperationalBuildings × 6 + TechTierBonus`

Tech Tier bonus:
- T0: 0
- T1: 60
- T2: 150
- T3: 280
- T4: 450
- T5: 700

Military units are **not** added directly to Score. Building more defense should not itself summon stronger enemies.

## Threat Tier bands

| Threat Tier | Settlement Score | Typical experience |
|---|---:|---|
| 0 | 0–119 | tiny nuisance |
| 1 | 120–249 | small organized attack |
| 2 | 250–449 | mixed monsters + scouts |
| 3 | 450–699 | serious ground + first weird UFO pressure |
| 4 | 700–999 | air/ground combined assault |
| 5 | 1000–1399 | carriers / heavy walkers |
| 6 | 1400+ | rare spectacle / boss-like event |

## Counter-gating rule

A wave may never require a hard counter that the player could not reasonably unlock.

Normal eligible tier is constrained by:
- Settlement Score tier
- Tech Tier
- available canonical counters

Examples:
- no heavy UFO assault before meaningful anti-air can exist
- no giant walker before heavy ground defense tier exists
- early flying scouts must be killable by Watchtower/light-air defense

This matters more than blindly matching Score.

## Enemy cast

### Nibbler
Tiny round creature with huge mouth/ears.

Behavior:
- runs to gardens/decor
- bites things
- scatters when shot

Purpose:
- funny first threat
- low damage

### Critter Pack
Fast colorful creature group.

Behavior:
- swarms weak edges
- creates movement chaos

### Raider
Small stylized hostile humanoid/robotic scavenger.

Behavior:
- attacks Money/service targets
- ranged

### Brute
Big lopsided monster.

Behavior:
- slow
- high HP
- knocks on gates/walls

### Burrower
Rocky worm/beetle creature.

Behavior:
- can bypass one outer wall segment
- emerges with dust burst

### Drone
Small hovering alien machine.

Behavior:
- circles
- fires weak beam
- light-air class

### Jelly UFO
Transparent-ish wobbling mini saucer with squishy energy core.

Behavior:
- erratic movement
- funny beam
- light-air class

### UFO Raider
Classic-but-original chunky saucer.

Behavior:
- stronger beam
- attacks infrastructure
- requires real anti-air investment

### Tripod Walker
Three-legged alien machine.

Behavior:
- crosses rough ground
- pulse attack
- visually strange and readable

### Carrier
Large hovering craft.

Behavior:
- releases drones
- becomes priority target

### Mothership Fragment
Rare late-game event.

Not a full screen-filling realistic spaceship.

Visual:
- broken crescent/organic machine
- floating pieces
- gravity effects
- multiple glowing cores

Behavior:
- mini-boss encounter
- spawns mixed enemies
- changes local gravity/VFX
- should feel like an event, not routine farming

## Wave examples

### Tier 0 — New settlement
Examples:
- 3–5 Nibblers
- 4 Critters
- 2 Critters + 1 weak Raider scout

Desired result:
- amusing disruption
- Guard Post is enough
- player learns warning → response → repair

### Tier 1
Examples:
- 4 Critters + 2 Raiders
- 2 Raiders + 1 Brute
- Nibbler swarm attacking Park/Farm

### Tier 2
Examples:
- 3 Raiders + 1 Brute + 1 Drone
- 2 Burrowers + Critters
- 2 Jelly UFO scouts + ground distraction

### Tier 3
Examples:
- 5 Raiders + 2 Brutes + 2 Drones
- 1 Tripod Walker + escorts
- 2 Jelly UFO + Burrower wave

### Tier 4
Examples:
- 2 UFO Raiders + 3 Drones
- Tripod + UFO Raider + ground pack
- Carrier scout + Drone swarm

### Tier 5
Examples:
- Carrier + 2 UFO Raiders + ground pressure
- 2 Tripods + mixed air
- heavy Varum anomaly wave

### Tier 6
Rare:
- Mothership Fragment
- Carrier escort
- mixed ground/air support

Tier 6 should not become an every-session grind wave.

## Wave composition

Threat Director receives:
- eligible Threat Tier
- wave budget
- world entry corridors
- recent enemy history
- player counter availability
- seed

It selects a composition under budget.

Rules:
- avoid identical consecutive waves
- mix silhouettes/behaviors
- cap simultaneous actor count
- favor readable squads over giant spam
- preserve recovery periods

## Funny destruction

Combat can temporarily disturb cozy scenery:
- chickens scatter
- ducks jump into pond
- citizens run to shelters
- signs wobble
- barrels roll
- lamps bend
- dust clouds bloom

After battle:
- repair crews appear
- civilians return
- animals come back
- disabled vehicles get towed/repaired

That recovery is part of the fun.
