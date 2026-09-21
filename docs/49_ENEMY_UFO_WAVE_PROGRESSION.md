# 49 — Enemy, UFO & Wave Progression

Status: **CANONICAL THREAT PROGRESSION v0.1**

## Core fantasy

Early game:
> a few weird creatures wander in and cause trouble.

Mid game:
> organized monsters, strange drones and raiders test the town.

Late game:
> alien craft, walkers, carriers and bizarre mixed waves create miniature spectacle battles.

The enemy escalates with the settlement.

## Threat bracket

Enemy progression is driven by **Settlement Rating**, not only clock time.

The player sees a friendly summarized Town Rating.

The server uses a derived Threat Bracket.

Reference rating inputs:
- Population
- Tech Tier
- completed functional buildings
- Varum infrastructure
- military capability
- cleared/occupied map territory

Avoid using stored Money directly; hoarding should not make the player a bigger target by itself.

## Reference Settlement Rating

Prototype formula:

`rating = Population×2 + TechTier×80 + FunctionalBuildings×8 + VarumSites×25 + MilitaryPower×0.35 + ClearedSectors×15`

The exact coefficients are balance data.

## Threat brackets

### B0 — New Settlement
Rating: 0–99

Enemy:
- Nibbler
- Wobble Slime
- Burrower

Wave shape:
- 2–5 small creatures
- mostly nuisance
- attacks fence/park/Workshop edges
- low structure damage

Purpose:
- teach warning and Guard response
- first battle should be amusing, not scary

### B1 — Growing Hamlet
Rating: 100–219

Enemy:
- larger Critter
- Shellback
- Scrap Gobbler
- occasional raider-like scavenger creature

Wave:
- 4–9 enemies
- one medium enemy possible

Purpose:
- Watchtower starts to matter

### B2 — Established Town
Rating: 220–399

Enemy:
- Brute
- Leaper
- Burrowing Pack
- first hovering Scout Drone

Wave:
- 7–14 mixed enemies
- ground + occasional air

Purpose:
- Radar and Armored Car become valuable

### B3 — Varum Town
Rating: 400–649

Enemy:
- armored beast
- spitter
- drone pack
- small UFO Scout Saucer

Wave:
- 10–18 units
- mixed lanes
- first true air threat

Purpose:
- Tank / Heavy Turret / early AA pressure

### B4 — Advanced City
Rating: 650–949

Enemy:
- heavy beasts
- UFO Raider
- shield drone
- Drop Pod carrying small monsters
- alien walker

Wave:
- 14–24 units
- synchronized ground + air
- one elite possible

Purpose:
- Rocket Rover / AA / Interceptor become meaningful

### B5 — Varum Power
Rating: 950–1399

Enemy:
- UFO strike craft
- shielded walker
- beam drone
- siege beast
- command saucer

Wave:
- 18–30 units
- two-phase waves possible
- elite support combinations

Purpose:
- Airfield and layered defense required

### B6 — High Civilization
Rating: 1400+

Enemy:
- Carrier
- heavy UFO
- giant strange creature
- multiple drop ships
- boss-like anomaly

Wave:
- 20–40 effective combat entities, subject to performance budget
- multi-phase
- carrier may deploy smaller units

Purpose:
- late-game spectacle
- Aurora Ward and complete combined defense

## Enemy visual direction

Enemies should be memorable and slightly funny/weird.

Avoid generic:
- zombie
- realistic soldier
- grey alien with laser rifle

Prefer:
- round jelly creature that bounces into fences
- six-legged crystal animal
- floating saucer with dangling grabber beam
- walking UFO pod with tiny legs
- fat armored creature that rolls downhill
- alien drone shaped like an upside-down teapot
- carrier that releases glowing eggs/pods

Combat is allowed to be visually surprising.

# Enemy archetypes

## Nibbler
Tiny ground creature.
Runs in groups.
Low damage.
Can chew decor/fences.

## Wobble Slime
Slow jelly creature.
Splits visually on hit but does not necessarily create extra authoritative units.

## Shellback
Armored rolling creature.
Good early introduction to Armor.

## Leaper
Jumps small wall/obstacle sections.
Forces layered defense.

## Brute
Large ground attacker.
Slow, high HP.

## Spitter
Ranged monster.
Targets nearby defense/buildings.

## Scout Drone
Small flying alien device.
Low HP.
Teaches air target class.

## UFO Scout Saucer
Small saucer.
Moves unpredictably.
Can briefly scan Varum structures.

## UFO Raider
Medium combat saucer.
Ground attack beam/pulse.

## Drop Pod
Flying delivery object.
Lands and creates ground enemies.

## Alien Walker
Three/four-legged machine.
Slow and visually unusual.

## Shield Drone
Buffs nearby UFO protection.
Creates target-priority variation automatically.

## Command Saucer
Large support UFO.
Improves nearby enemy coordination.

## Carrier
Late-game large UFO.
Deploys smaller craft/pods.
Boss-like but still part of normal late progression.

# Wave generation

A wave is built from a budget.

Budget inputs:
- Threat Bracket
- Settlement Rating
- Tech Tier
- recent win/loss history
- active defense power
- seeded variance

## Fairness modifier

The system may gently adjust future wave budget after results:

If player is repeatedly crushed:
- reduce next budget within a bounded range
- prefer fewer elites

If player is repeatedly winning with near-zero damage:
- increase composition complexity before greatly increasing frequency

Do not rubber-band so strongly that building defense feels pointless.

# Wave templates

Possible templates:

- SWARM
- BRUTE_ESCORT
- BURROWERS
- AIR_SCOUT
- MIXED_GROUND
- DROP_POD
- AIR_ASSAULT
- WALKER_ESCORT
- CARRIER_EVENT
- ANOMALY_BOSS

Template availability is gated by Threat Bracket.

# Cadence

Growth increases **wave complexity/intensity** more than frequency.

Major attacks retain long recovery windows.

Minor nuisance waves may happen between major attacks, especially B0–B2.

No exact visible countdown.

# Spatial entry

Ground threats enter from generated threat corridors.

Air threats enter from map edge/sky lanes.

Burrowers may appear at tagged outer sectors only.

Enemies may never materialize in the protected starter center without an explicit special event.

# Combat resolution

Server owns:
- HP
- DPS
- Armor
- target class
- position/zone abstraction
- wave completion

Client owns:
- projectile visuals
- recoil
- explosions
- beam effects
- hit reactions
- knockback presentation

# Rewards

Threat defense can grant:
- Money bonus
- small Tech bonus
- small Varum fragment reward at higher brackets
- temporary Happiness/Safety boost
- cosmetic salvage chance

Rewards should not make farming attacks the primary economy.

# Defeat

A lost wave:
- damages buildings
- disables vehicles
- creates repair backlog
- lowers Happiness/Safety temporarily

It does not wipe the world.

# Acceptance

Test:
1. B0 never spawns UFO Carrier.
2. B0 first waves remain survivable with starter Guard support.
3. air units do not appear before corresponding warning/defense opportunity.
4. B3+ mixed waves make target classes relevant.
5. wave size stays inside client performance budget.
6. defeat does not permanently destroy critical core settlement.
7. two equal Rating worlds can receive different seeded compositions.
