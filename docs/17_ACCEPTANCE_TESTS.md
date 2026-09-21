# 17 — Acceptance Tests

## A. Persistence

1. Create world.
2. Place road + generator + pump + homes.
3. Disconnect.
4. Advance server time/test clock.
5. Reconnect from a fresh client.
6. World state reflects elapsed progression.
7. Client local storage deletion does not delete world.

PASS required.

## B. Server authority

Attempt client command with insufficient Money.

Expected:
- server rejects
- no building persists
- client preview rolls back

## C. Power cascade

1. Power pump.
2. Confirm reservoir fills.
3. Remove/overload power.
4. Pump stops.
5. Reservoir depletes.
6. dependent consumers report water loss.

## D. Road logistics

Break road connectivity to refinery.

Expected:
- deliveries fail/reroute
- production reason is visible
- no teleporting commodity

## E. Citizen routine

At least one citizen:
- leaves home
- reaches assigned job
- works
- uses recreation
- returns home

State remains consistent after save/load.

## F. School

Children attend school when capacity/path exists. Capacity shortage is visible and affects education service.

## G. Varum chain

Mine produces raw Varum.
Refinery consumes raw Varum plus utilities/workers and outputs refined Varum.
Advanced production cannot consume nonexistent refined Varum.

## H. Threat secrecy

No client payload exposes exact scheduled attack timestamp when design intends uncertainty.

## I. Offline attack fairness

Simulate long absence with threat.

Expected:
- threat may resolve
- defenses matter
- damage/loss recorded
- offline safety budget prevents unreasonable annihilation
- after-action timeline explains outcome

## J. Navigation edit

Edit road/building footprint.

Expected:
- navmesh/path graph updates
- citizens do not permanently walk through new obstruction
- server logical destinations remain valid/recoverable

## K. Asset validation

For production GLB:
- scale valid
- pivot valid
- material count within policy
- license metadata present
- triangle budget passes
- runtime loader succeeds

## L. Performance

Representative MVP scene:
- target desktop frame rate reached at agreed quality
- no unbounded draw-call growth from citizens/vegetation
- DPR cap works
- low-quality profile remains playable

## M. Multiplayer readiness

Connect two read clients to the same test world.

Both receive consistent authoritative revision stream even if only owner may mutate.
