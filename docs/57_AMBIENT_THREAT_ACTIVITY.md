# 57 — Ambient Threat Activity

Status: **CANONICAL THREAT AMBIENCE v0.1**

## Goal

Keep the world strange and alive between real battles.

Ambient threat activity is **not a combat wave**. Most events are visual or informational.

## Classes

### A — Visual only
Examples:
- distant UFO flyby
- strange lights behind a ridge
- birds suddenly scatter
- creature silhouette at forest edge
- glowing object crossing the night sky
- distant dust plume
- short radio/static burst

No combat. No direct damage.

### B — Clue
Examples:
- monster tracks
- damaged fence
- scorched grass
- Radar anomaly
- unusual animal behavior
- Varum interference
- distant alien hum

Possible effects:
- reveal likely direction
- reveal broad threat class
- increase warning confidence
- slightly improve preparation information

Never reveal the exact attack time.

### C — Probe
Very small hostile interaction below minor-wave scale.

Examples:
- one Scout Drone scans an outer building
- two Nibblers enter a Farm
- one Burrower appears and retreats
- one Jelly UFO observes Varum infrastructure

A Probe may trigger Guards/Watchtower briefly, but it does not use major-wave rules and does not reset major-threat pressure.

## Cadence

Online reference:
- first ambient event: 10–25 minutes after session/world activity begins
- normal interval: 20–55 minutes
- max: 18 ambient threat events / 24h online
- Probe share: about 15%
- Clue share: about 35%
- Visual-only share: about 50%

Suppress or downgrade ambient events:
- during major combat
- during severe recovery
- immediately after a major wave
- when another important world event already owns player attention

## Level scaling

T0 / early world:
- creature eyes in bushes
- tracks
- Nibbler sighting
- distant movement
- broken fence

T1:
- Varum interference
- unusual night lights
- Scout creature
- short Radar static if Radar exists

T2:
- Scout Drone flyby
- Jelly UFO silhouette
- stronger Radar anomaly
- brief scan beam at town edge

T3+:
- Drop Pod seen far away
- multiple distant UFO lights
- alien formation high overhead
- Walker silhouette on remote ridge

T4+:
- Carrier shadow/cloud break
- formation flyover
- strange gravity/Varum visual events

High-level ambience becomes more spectacular, not constantly more damaging.

## World reactions

Ambient threat events should create visible reactions.

Examples:
- civilians stop and look up
- child points at UFO
- dog barks
- birds scatter
- ducks enter pond
- Guard looks toward ridge
- Radar dish rotates
- nearby cars slow briefly

These reactions are presentation only unless the event escalates.

## Escalation

Most ambient events end harmlessly.

A subset can add a small hidden modifier to the next threat-generation decision.

Examples:
- repeated Scout Drone activity may raise air-composition weight
- monster tracks may raise ground-creature weight
- strong Varum anomaly may increase UFO clue probability

Never guarantee:
`ambient event → attack in N minutes`

The player should notice patterns without solving a countdown.

## Offline

Do not replay every ambient event offline.

Offline catch-up may retain only notable summaries such as:
- “Several strange lights were reported overnight.”
- “Guards found fresh tracks near North Farm.”
- “Radar recorded an unexplained contact.”

Visual-only events need not enter history.

## Architecture

Domain:
- event eligibility
- deterministic seed
- clue/probe classification
- optional composition bias

Client:
- flyby spline
- distant lights
- civilian reaction animation
- audio sting
- temporary world-space visual

Ambient events must never be implemented as random Three.js effects disconnected from server world state.
