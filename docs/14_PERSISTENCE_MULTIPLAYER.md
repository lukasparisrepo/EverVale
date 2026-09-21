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

Authentication grants account identity. Authorization determines which worlds may be opened and what commands can be submitted.

Login does not create simulation truth in the browser.

## Persistence

Persist:
- world metadata
- world version
- last simulated timestamp
- resource state
- buildings
- road/infrastructure graphs
- citizens/households
- jobs
- threat state
- event history
- construction/repair
- military assets

## Save strategy

Use periodic snapshots plus enough event/command history for diagnosis.

Critical commands should be transactional.

## Reconnect

Client:
1. authenticates
2. selects world
3. server catches world up
4. server sends current snapshot
5. client builds render state
6. realtime patches begin

## Future co-op

Multiple clients may observe one world.

All commands include:
- user/session identity
- world_id
- expected revision where needed
- command id for idempotency

Conflicting build edits must be rejected or serialized explicitly.

## Future neighboring worlds

Do not make separate player worlds share mutable in-memory objects.

Inter-world trade/conflict should use explicit server events/contracts.

## Security

Browser is untrusted.

Never trust:
- money balance
- build completion
- world time
- inventory/Varum
- damage result
- ownership
sent by the client without server validation.
