# 54 — Animation, VFX & Combat State Machines

Status: **CANONICAL PRESENTATION CONTRACT v0.1**

## Rule

Animation is presentation of authoritative state.

Animation does not decide:
- damage
- economy
- target validity
- win/loss

The server says what happened.

The client makes it look alive.

---

# Citizens

Core locomotion states:
- IDLE
- WALK
- BRISK_WALK
- RUN
- SIT
- CARRY

Routine states:
- HOME
- COMMUTE
- WORK
- SCHOOL
- LEISURE
- ERRAND
- SHELTER

Threat transitions:

`LEISURE/WORK → ALERT_LOOK → RUN/SHELTER → SAFE_IDLE → NORMAL_ROUTINE`

Not every citizen needs ALERT_LOOK if density is high.

## Threat behavior

On siren:
- Park actors stop activities
- children/teachers move toward School safety/home/shelter policy
- civilians leave exposed roads
- cars reduce/stop
- pets return/hide
- farm animals cluster
- birds scatter

After all-clear:
- delay 5–20 visual seconds by seed
- activity gradually returns

Avoid every NPC restarting at the same frame.

---

# Infantry

States:
- IDLE
- PATROL
- ALERT
- MOVE_TO_SECTOR
- AIM
- FIRE
- RELOAD
- HIT
- RETREAT
- INJURED
- RECOVER

Guard presentation:
- weapon/tool appears only in defense states where possible
- recoil exaggerated slightly for isometric readability

Shield Guard:
- shield brace
- hit reaction into shield
- push-back visual only; authoritative position remains server controlled

Rocket Ranger:
- deploy/brace
- aim
- launch
- exaggerated smoke arc
- reload

---

# Wheeled / tracked vehicles

## Shared

- PARKED
- START
- DRIVE
- TURN
- BRAKE
- DEPLOY
- TRACK_TARGET
- FIRE
- RELOAD
- HIT
- SMOKE_DAMAGE
- DISABLED
- TOWED
- REPAIR
- RETURN

## Tank

Visual layers:
- chassis movement
- track/wheel animation
- independent turret rotation
- barrel elevation
- fire recoil
- dust impulse
- smoke damage state

No realistic ballistic simulation required.

## Rocket Rover / Truck

Sequence:

`DRIVE → DEPLOY → OUTRIGGERS/BRACE → TRACK → SALVO → RELOAD → MOVE`

Missiles/rockets are fictional stylized projectiles:
- colorful controlled trail
- readable curved arc
- small cluster explosion

## Armored Car

Fast:
- stronger body roll
- quick brake
- turret follows target independently

---

# Static defense

Watchtower:
- idle scan
- contact acquire
- turret rotate
- burst fire
- cooldown
- hit shake
- damaged sparks

Anti-Air:
- fast tracking
- burst/tracer
- target switch

Varum Shield:
- core warm-up
- ring rotation
- dome appear
- hit ripple
- overload flicker
- shutdown

---

# Aircraft

States:
- HANGAR
- TAXI
- TAKEOFF
- CLIMB
- PATROL
- INTERCEPT
- ATTACK_RUN
- EVADE
- RETURN
- LAND
- TAXI_IN
- REPAIR

Fighter:
- bank turns
- short attack run
- contrail
- small recoil/energy burst

Interceptor:
- sharper acceleration
- fast dash line
- aggressive banking

Weather restriction:
- severe storm can hold aircraft in HANGAR.

---

# Monsters

Shared:
- SPAWN/ENTER
- ADVANCE
- ACQUIRE
- ATTACK
- HIT
- STAGGER
- SPECIAL
- FLEE
- DOWN/DESPAWN

Nibblers:
- hop/run
- chew
- scatter

Slime:
- squash/stretch
- wobble hit

Brute:
- heavy stomp
- gate slam

Burrower:
- dust mound
- emerge
- retreat underground visual

Tripod/Walker:
- asynchronous leg gait
- body stabilization
- pulse charge

---

# UFOs

States:
- SKY_ENTRY
- HOVER
- STRAFE
- TARGET_LOCK
- BEAM
- SHIELD_HIT
- DEPLOY
- STAGGER
- RETREAT
- CRASH/DISABLED
- WARP_EXIT

Jelly UFO:
- wobbling hover
- elastic glow core
- playful unstable beam

UFO Raider:
- more stable hover
- beam sweep
- shield flash

Carrier:
- hatch/open emitter
- drone/drop deployment
- slow rotation
- visible weak-point phase presentation

Mothership Fragment:
- floating sub-pieces
- gravity distortion
- rotating cores
- phase transition pulses

---

# Building combat reactions

House:
- shutters/door close
- residents vanish into safe state

Workshop:
- machinery stops
- workers evacuate

Power Plant:
- status lamps
- overload sparks
- outage state

Water Plant:
- pump/flow stops

School:
- schoolyard clears
- windows/doors safe-state visuals

Farm:
- animals scatter toward shelter anchors

Airfield:
- runway lights
- hangar doors
- scramble sequence

---

# VFX readability hierarchy

Friendly:
- warm amber/cream
- restrained teal Varum

Enemy:
- magenta/violet/red-orange depending archetype

Damage:
- sparks
- dust
- smoke
- shield ripple

Do not fill the whole scene with bloom.

Ground telegraphs and air threats must remain readable at management zoom.

---

# Audio synchronization

Animation events can trigger client-only audio cues:

- footsteps
- turret servo
- launch whoosh
- tank recoil
- UFO hum
- shield ripple
- siren

Authoritative combat never waits on audio/animation completion.

---

# LOD

Near:
- full state machine
- IK/aim offsets if used
- detailed VFX

Mid:
- simplified clips
- reduced update rate

Far:
- coarse motion
- muzzle/impact hints
- no expensive per-bone logic

Battle remains visually understandable from far camera.
