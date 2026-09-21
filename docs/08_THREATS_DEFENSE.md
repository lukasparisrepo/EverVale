# 08 — Threats, Defense & Combat

Status: **COMBAT BASELINE v0.1**

Detailed values: `data/balance/v0.1/combat.yaml` and `threats.yaml`.

## Threat philosophy

Threats create tension inside a cozy game.

They should force preparation and recovery without turning EverVale into an RTS.

There is **no exact attack countdown**.

## Hidden Threat Pressure

Reference pressure gain per 10-minute balance cycle:

`0.50 + 0.02×Population + 0.25×TechTier + 0.30×ActiveVarumMines`

A seeded hidden threshold is normally selected in the range **15–25**.

After a resolved major attack:
- pressure resets
- minimum major-attack cooldown: 6 cycles

The player never sees the threshold.

## Warning

Without Radar:
- environmental clues
- scout / citizen reports
- short warning

With Radar:
- warnings occur earlier
- attacker class information improves

Radar does not magically prevent attacks.

## Wave budget

Reference threat budget:

`20 + 1.2×Population + 15×TechTier + 8×ActiveVarumMines + seeded variance`

Enemy types consume budget points.

This naturally increases danger as the settlement becomes richer and technologically interesting.

## Families

T0:
- Critters
- Raiders

T1:
- Brutes

T2:
- stronger raiders
- early drones

T3:
- heavy ground groups
- UFO scouts

T4:
- UFO assault groups

T5:
- carriers / advanced anomalies

## Combat model

Combat is server-authoritative and automatic.

Core unit stats:
- HP
- DPS
- Armor
- target class
- movement speed
- attack range

Reference armor formula:

`effectiveDPS = rawDPS × 100 / (100 + Armor)`

This has diminishing returns and is easy to audit.

## Defense progression

- Guard Post
- Watchtower
- Radar
- Armored Car
- Tank
- Airfield
- Fighter
- Anti-Air
- Varum Shield

## No micro requirement

The player controls:
- placement
- staffing
- readiness priority
- unit production
- doctrine later

Units select valid targets automatically.

## Defeat without misery

MVP rules:
- citizens/guards at 0 HP become injured rather than permanently deleted
- vehicles become disabled and repairable
- structures become damaged/disabled
- offline simulation never permanently erases critical buildings

Threats should create repair costs and stories, not rage-quit punishment.

## Offline attack

Use the same unit stats and armor formula with coarse deterministic time steps.

Offline safety rules may cap structure damage per absence window.

## Economic purpose

Defense is a resource sink:
- defenders consume Workforce
- military buildings have upkeep
- advanced units consume Money + Varum
- advanced bases consume Power/Water

Over-defending slows economic/Tech growth.
