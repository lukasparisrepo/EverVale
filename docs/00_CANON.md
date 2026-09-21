# 00 — Canonical Product Constitution

Status: **CANONICAL BASELINE**

## Identity

EverVale is a cozy persistent 3D society builder presented as a living miniature world.

> **You build the town. They live in it. The world keeps moving when you leave.**

The player shapes roads, neighborhoods, infrastructure, services, industry, policy, and defense. Citizens then autonomously live inside the system.

## Non-goals

EverVale is not:
- a stacked-room shelter clone
- a hardcore city traffic simulator
- an RTS requiring unit micro
- a survival game designed to punish absence
- a client-only browser toy

## Canonical strategic resources

Only four strategic resources are canonical for the first complete game loop:

1. **Money**
2. **Electricity**
3. **Water**
4. **Varum**

Population, workforce, education, happiness, health, and safety are social state, not spendable currencies.

Physical commodities may exist, but they must remain understandable and tied to visible production.

## Varum

Varum is a fictional strategic mineral.

Canonical chain:

`Deposit → Mine → Raw Varum → Refinery → Refined Varum → Storage → Advanced Industry`

Advanced industry unlocks sensors, shields, armored vehicles, tanks, aircraft, anti-air, and other high-tier systems.

Varum is economically grounded, not mana.

## Connected infrastructure

Buildings do not operate merely because they exist.

Relevant buildings may depend on:
- road access
- electricity
- water
- workforce
- logistics/storage
- production inputs
- public service coverage

Failures propagate visibly.

Example:

`power failure → pump stops → reservoir falls → district loses water → productivity drops → wellbeing drops`

## Autonomous society

Citizens can:
- live in households
- work
- attend school
- commute
- shop
- use parks
- socialize
- rest
- seek shelter
- react to danger

The player creates conditions rather than issuing constant individual orders.

## Threats

Threat families:
- monsters
- wildlife
- raiders
- hostile neighboring powers
- UFO/alien incursions
- rare anomalies

There is **no exact attack countdown**.

Threats use hidden pressure and observable warning signals.

## Defense

Defense is preparation-first.

The player designs:
- safe infrastructure
- shelters
- guard coverage
- walls/gates
- sensors/radar
- defensive vehicles
- aircraft
- anti-air
- Varum technology

Units can respond autonomously according to doctrine. Direct tactical control may be added later but is not the primary loop.

## Persistent world

World identity is separate from session identity.

Logout disconnects a client; it does not destroy or freeze the world.

The world may move through:
- ACTIVE
- WARM
- COLD

simulation states, but economic and social progression remains logically continuous.

## Multiplayer evolution

Initial play is single-owner. Architecture must support future:
- co-builders
- visitors
- shared worlds
- neighboring player settlements

No simulation code may assume exactly one connected client.

## Technology canon

- TypeScript end-to-end where practical
- Three.js WebGL client
- React HUD only
- authoritative Node.js/TypeScript server
- PostgreSQL persistence
- server-side background simulation
- GLB/glTF runtime assets
- Blender CLI + MCP for Blender authoring

Changes to these require an ADR and explicit canon update.
