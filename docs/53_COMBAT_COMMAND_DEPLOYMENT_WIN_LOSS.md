# 53 — Combat Command, Deployment, Win/Loss & Damage

Status: **CANONICAL COMBAT CONTROL v0.1**

## Key decision

EverVale is **not StarCraft**.

The player does **not** click a barracks during a wave and spam-create individual soldiers.

The player prepares a defense force during normal town play.

During combat, the system deploys that force automatically.

The player's active role is:
- layout
- unit composition
- readiness
- doctrine
- rally sectors
- emergency commands

This matches the automated-society fantasy.

---

# Unit ownership

## Infantry

Guard Post staffing creates defensive squads as part of building function.

The player does not individually purchase every Guard.

Example:
- staffed Guard Post supports 2 Guard actors/squads
- better building/Tech can change supported roster

## Vehicles

Vehicles are explicitly produced before combat:
- Patrol Buggy
- Armored Car
- Tank
- Rocket Rover
- Missile Wagon

Player:
1. queues vehicle
2. pays Money/Varum
3. waits production time
4. vehicle enters reserve/depot

During attack it deploys automatically.

## Aircraft

Aircraft are produced and stored at Airfield.

They require:
- operational Airfield
- available pilot/crew abstraction
- Power
- readiness

The player does not click “spawn Fighter” during combat.

---

# Readiness

Each mobile combat unit has:

- HP
- readiness 0..100
- current location
- target capability
- response speed
- repair state

Readiness affects deployment.

Reference:
- 80–100 READY
- 50–79 AVAILABLE
- 20–49 LIMITED
- 1–19 REPAIR/RESERVE
- 0 DISABLED

Readiness can drop from:
- previous combat
- insufficient maintenance
- recent emergency deployment
- damage

---

# Defense sectors

The map is divided dynamically into tactical sectors derived from:
- access graph
- terrain terraces
- major road junctions
- threat entry corridors
- critical buildings

Examples:
- East Ridge
- River Gate
- North Farm
- Varum Terrace
- Civic Core

Player can place **Defense Rally Anchors** in valid sectors.

These do not command exact unit coordinates.

They bias automated response.

---

# Default doctrine

Available doctrines:

## BALANCED
Protect critical town systems while matching counters normally.

## HOLD CORE
Prioritize Hearth Hall, Power, Water, School/Clinic.

## PROTECT VARUM
Prioritize Mine/Varum storage/research.

## INTERCEPT AIR
Keep more AA/interceptors ready for air contacts.

## OUTER DEFENSE
Engage earlier near perimeter; higher travel/repair exposure.

Doctrine can be changed outside battle freely.

During battle, doctrine change becomes an emergency command with a short lockout to prevent spam.

---

# Deployment algorithm

Server-authoritative.

## Step 1 — Build Threat Contacts

Each hostile group produces:

```
ThreatContact {
  sector
  class
  hp
  dps
  range
  objective
  urgency
}
```

Urgency increases with:
- proximity to objective
- DPS
- special capability
- threat to civilians
- threat to hard-counter gap

## Step 2 — Build Defender Candidates

Each defender has:

```
Defender {
  class
  sector
  hp
  readiness
  moveSpeed
  range
  targetClasses
  doctrineWeight
}
```

## Step 3 — Match counters

Candidate score:

`responseScore = 40×TargetMatch + 20×Readiness + 15×DoctrineFit + 15×DistanceFit + 10×HealthFit`

All normalized to 0..1 before weighting.

Invalid target class = candidate excluded.

Examples:
- Tank cannot shoot heavy air.
- Interceptor strongly prefers air.
- Rocket Rover prefers clustered targets.
- Heavy Turret cannot move.

## Step 4 — Avoid overkill

For each contact, estimate:

`projectedTTK = targetHP / assignedEffectiveDPS`

Stop assigning extra mobile units once:
- projected TTK meets current doctrine target
- or higher-urgency contacts remain

Reference doctrine TTK target:
- BALANCED: 10 s
- HOLD CORE: 8 s near core, 14 s outer
- OUTER DEFENSE: 9 s perimeter
- PROTECT VARUM: 8 s near Varum
- INTERCEPT AIR: 7 s air contact

## Step 5 — Reserve

Keep part of mobile force uncommitted when:
- unrevealed wave phase may exist
- multiple entry corridors are active
- Radar confidence is low

Reference reserve:
- 20% Balanced
- 10% Hold Core emergency
- 30% if multi-phase contact suspected

## Step 6 — Re-evaluate

Re-run assignment when:
- new contact appears
- target dies
- unit disabled
- access route breaks
- doctrine override
- phase change

Do not recalculate every render frame.

---

# Combat damage

Core armor formula remains:

`damageAfterArmor = rawDamage × 100 / (100 + Armor)`

Continuous reference DPS:

`effectiveDPS = BaseDPS × ReadinessFactor × TargetModifier × RangeModifier × DoctrineModifier × WeatherModifier × ArmorMitigation`

## Readiness Factor

Reference:
- 100 readiness → 1.00
- 75 → 0.94
- 50 → 0.82
- 25 → 0.65

Do not let readiness create complete uselessness until disabled.

## Target Modifier

Normally:
- valid normal target: 1.0
- preferred role target: 1.10
- poor-but-valid target: 0.75
- invalid target: cannot attack

## Range

Within effective range:
- 1.0

Too close for artillery minimum range:
- cannot fire or must reposition

## Weather

Weather modifier is intentionally small.

Severe weather may:
- ground aircraft
- reduce spotting
- alter movement modestly

Weather should not decide battle by random multiplier.

---

# Enemy objective model

Not every attacker simply shoots nearest building.

Enemy groups receive objectives.

Examples:

### Nibbler
- damage decor/Farm edge
- flee after enough disruption

### Raider
- reach Money/service structure
- steal small amount / damage target
- retreat

### Brute
- break Gate/Wall
- attack nearby structure

### Drone/UFO Scout
- scan Varum
- harass utility
- retreat if damaged

### UFO Raider
- disable infrastructure

### Carrier
- survive while deploying subunits
- pressure critical sectors

### Story boss
- complete phase-specific objective

This creates different battle shapes.

---

# Wave outcome

## CLEAN REPEL

Requirements:
- all required hostile objectives prevented
- no critical service disabled at end
- town structural damage below 10%

## COSTLY REPEL

Requirements:
- hostiles defeated/retreated
- objective not completed
- but damage/injury threshold exceeded

## BREACH

Any of:
- wave objective completed
- Hearth Hall disabled by hostile action
- critical objective meter reaches 100%
- required story defense objective fails

A Breach does **not** delete the world.

---

# Objective progress

Some waves use an objective meter.

Examples:

## RAID
Progress rises while Raiders occupy target zone.

## ABDUCTION/SCAN
Progress rises while UFO maintains uninterrupted beam.

## SIEGE
Progress rises through destruction of designated defense line.

The meter is visible **after contact**.

This gives the player a readable win/loss state without an attack countdown.

---

# Town Integrity

Combat HUD derives a Town Defense Integrity indicator from:

- Hearth Hall state
- Power availability
- Water availability
- active access routes
- critical services
- shelter safety
- defender availability

This is a HUD/readiness metric, not a spendable resource.

It does not directly decide battle.

---

# Damage and aftermath

On hit:
- unit/building HP changes
- condition damage may be applied
- presentation plays hit state

At 0 combat HP:

### Citizen/Guard
INJURED, not permanently dead in MVP.

### Vehicle
DISABLED.

### Building
DISABLED/DAMAGED.

### Critical core
cannot be silently permanently deleted.

After wave:
- repair queue generated
- injured actors recover
- vehicles tow/repair
- structural condition persists
- Money repair cost is calculated

---

# Player active commands

Maximum 5:

- HOLD CORE
- INTERCEPT AIR
- PROTECT VARUM
- FALL BACK
- ACTIVATE WARD

No select-12-units / attack-move UX.

Optional future advanced mode may expose sector-level rally priorities, never twitch RTS micro as the default.

---

# Offline combat

Offline uses:
- same unit stats
- same target classes
- same doctrine
- same sector/counter model
- coarse deterministic time step

It does not simulate every projectile.

The result should broadly match an equivalent online battle with the same seed/state.
