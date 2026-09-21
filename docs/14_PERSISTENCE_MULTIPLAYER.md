# 14 — Persistence, Authentication & Multiplayer Evolution

## Identity model

Separate:
- User
- Session
- World
- WorldMembership

A world exists independently from an active session.

## Initial membership

MVP:
- one OWNER per world

Schema must already allow:
- OWNER
- CO_BUILDER
- VISITOR

## Login

Authentication grants account identity.

Authorization determines:
- which worlds can be opened
- which commands can mutate them

Login does not create simulation truth in the browser.

## World identity

A World has a stable:
- `worldId`
- `worldSeed`
- `worldGeneratorVersion`

The seed does **not** mean the client is free to regenerate authoritative terrain differently.

Generated topology becomes part of persistent world state/versioning.

## Persistence

Persist at minimum:
- world metadata
- world seed
- world generator version
- schema/simulation/balance versions
- last simulated timestamp
- resource state
- society state
- buildings
- roads/access graph mutations
- cleared blocker state
- discovered Varum deposits
- construction/clearance/repair queues
- citizens/households where persistent identity is required
- job assignments/priority state
- threat state
- incident state
- event history
- military assets

Deterministic cosmetic scatter can remain seed-derived if it has no gameplay state.

## Save strategy

Use:
- periodic canonical snapshots
- transactional critical commands
- enough event/command history for diagnosis and After-Action reporting

Do not event-source every animation frame.

## Reconnect

1. authenticate
2. authorize world membership
3. acquire/transfer simulation lease
4. load snapshot
5. catch world up to authoritative time
6. persist resulting revision
7. send snapshot + return timeline
8. begin realtime patches

## Generator upgrades

Existing worlds never silently regenerate because procedural generation code changed.

New generator versions affect newly created worlds unless an explicit migration exists.

A migration must preserve:
- placed buildings
- roads/access
- blockers already cleared
- discovered deposits
- valid progression

## Future co-op

Multiple clients may observe one World.

Commands include:
- user/session identity
- worldId
- commandId
- expected revision where necessary

Concurrent edits must be serialized/rejected explicitly.

## Future neighboring worlds

Separate worlds never share mutable in-memory state.

Inter-world:
- trade
- diplomacy
- raids
- visits

must use explicit server contracts/events.

## Security

Browser is untrusted.

Never accept client claims for:
- Money
- Power/Water/Varum
- Tech
- world time
- generator seed mutation
- cleared blocker state
- build completion
- damage/combat result
- ownership
without authoritative validation.
