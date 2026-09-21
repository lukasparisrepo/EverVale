# 70 — Build Grid, Footprint & Prop Metadata Contract

Status: **CANONICAL M1 BUILD UX**

Date: 2026-09-21

## Build grid

Canonical building grid cell:

- **2 meters**
- visible while BUILD or ROAD mode is active
- hidden in normal SELECT mode
- client previews snap to grid
- server repeats the snap authoritatively

A client may never bypass grid rules by sending arbitrary coordinates.

## Building footprint SSOT

Authority:

`data/content/v0.2/build_footprints.yaml`

Every building ID in:

`data/content/v0.2/buildings.yaml`

must have exactly one footprint.

Footprints are expressed as:

- `cells_x`
- `cells_z`

Physical size is:

`cells × 2 meters`

Example:

`house_small = 3 × 2 cells = 6 × 4 meters`

## Placement

Canonical placement sequence:

1. pointer intersects terrain
2. coordinate snaps to 2m grid
3. footprint ghost moves to snapped coordinate
4. client performs approximate validity preview
5. green = locally plausible
6. red = locally invalid
7. command is sent
8. server snaps again
9. server checks Tech/resources
10. server checks footprint collision
11. server checks blocker overlap
12. server checks road access
13. server accepts/rejects

Server result is authoritative.

## Collision

Building collision is no longer radius-based.

Current canonical shape:

**90-degree oriented rectangle footprint**

Rotation step:

**90 degrees**

For 0/180 degrees:
- width = cells_x × grid
- depth = cells_z × grid

For 90/270 degrees:
- width/depth swap.

## M1 UI

Build catalog buttons display:

- human-readable title
- footprint in grid cells
- physical size in meters
- Money cost
- construction cycles

Example:

**Hearth Cottage**
**3×2 grid · 6×4m**
**¤120 · 2 cycles**

The bottom placement hint repeats selected building title + size.

## Graybox rendering

Placed M1 building grayboxes use the same footprint metadata as the placement ghost.

Visual footprint and logical collision footprint must not intentionally diverge.

Final art may contain roof overhang, signs, foliage, etc. outside the collision footprint.

## Roads

M1 road endpoints snap to the same 2m world grid.

Curved/freeform roads can be introduced later without changing building footprint authority.

## Props / decor

Canonical Prop metadata:

`data/content/v0.2/props.yaml`

Every Prop requires:

- stable ID
- human-readable `title`
- `group`
- `size_x_m`
- `size_z_m`

Current default Prop snap:

**1 meter**

Props are smaller than buildings, therefore they do not inherit the 2m building footprint cell.

The Prop catalog is exposed through the server world-view API with:

- title
- group
- physical size
- snap size
- display size title

Prop placement is intentionally not enabled in M1 yet; the metadata contract is ready before the Decor placement tool is introduced.

## Validation

`tools/validation/validate_content.py` fails CI when:

- a building has no footprint
- footprint has invalid cells
- a footprint has no building
- grid cell size is invalid
- a Prop has no title
- a Prop has invalid physical size

The old ID-only catalog:

`data/content/v0.1/decor_catalog.yaml`

is now **DO_NOT_USE**.

## Automated proof

Domain:
- `packages/domain/src/construction-grid.test.ts`

Browser:
- build card displays `3×2 grid · 6×4m`
- grid becomes visible in build mode
- ghost exposes selected footprint size
- server snaps non-grid input to 2m coordinates
- complete persistent gameplay loop still passes

## Decision

**BUILD GRID / BUILDING FOOTPRINT / PROP METADATA: LOCKED**
