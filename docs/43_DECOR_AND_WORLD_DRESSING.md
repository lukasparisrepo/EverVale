# 43 — Decor & World Dressing

Status: **CANONICAL DESIGN v0.2 — RUNTIME IMPLEMENTED IN M1.1**

Decor is not one undifferentiated category.

EverVale uses three decor classes.

## Class A — Pure Visual

No simulation effect.

Examples:
- flower pot
- barrel
- crate
- signpost
- chimney cap
- banner
- mailbox
- wagon wheel
- wall ivy
- decorative rock
- fence variation
- roof ornament
- window shutter
- scarecrow
- hay bale
- garden tools
- laundry line
- firewood stack

Purpose:
- visual identity
- authored composition
- seeded variation

These should be cheap to render and commonly instanced/merged.

## Class B — Soft Happiness / Beauty

Small bounded local contribution.

Examples:
- flower bed
- fountain
- statue
- ornamental tree
- street lantern
- picnic table
- public planter
- garden arch
- pond
- gazebo

Rules:
- effect is deliberately small
- stacking has diminishing returns / local cap
- decor cannot replace a real Park, Restaurant or civic building

## Class C — Functional Activity Anchor

Creates a place NPCs/animals can visibly use.

Examples:
- bench → sit/read/talk
- playground → child play
- duck pond → ducks / feeding
- dog post / small dog area → dog-walking stop
- market stall → shopper/vendor activity
- bus/vehicle stop → transport waiting
- bike rack → bicycle arrival/departure
- café table → sit/eat/talk
- farm trough → animal gather
- chicken coop → chicken activity
- schoolyard prop → recess activity
- guard bell → patrol/alert activity
- fire hydrant / service point → emergency activity

These anchors improve visible life without needing new strategic resources.

## Roadside decor

Automatic or player-placeable:
- lamp posts
- benches
- trees
- flower beds
- fences
- bollards
- signs
- drainage stones
- tiny bridges
- road milestones

Some roadside dressing may be generated procedurally from road type and district style.

## District visual identity

A district can gradually look different based on its dominant content.

Examples:

### Residential
- gardens
- bicycles
- laundry
- pets
- hedges

### Civic
- banners
- lamps
- plazas
- benches
- flowers

### Industrial
- crates
- utility carts
- warning lamps
- pipes as decorative art
- fenced yards

### Rural
- fences
- hay
- carts
- animals
- crop props

### Military
- barriers
- flags
- sandbag-like stylized defenses
- searchlights
- patrol anchors

## Decoration performance

Rules:
- batch static clusters
- use InstancedMesh for repeated objects
- use LOD/culling
- avoid unique material per small prop
- distant decor can disappear before buildings/citizens do

## Placement ownership

Player may place selected decor manually.

The world may also generate deterministic decorative dressing around buildings and roads.

Automatic dressing must never:
- block required entrances
- block roads
- alter authoritative economy
- obstruct critical camera readability
- create collision unless explicitly functional

## Asset metadata

Decor definitions should include:
- decor_id
- class
- footprint
- snap mode
- district tags
- activity anchor type if any
- Happiness effect if any
- render budget class
- seasonal variants


## Runtime implementation authority

Implemented M1.1 behavior is specified by:

`docs/72_M1_1_DECOR_MODE.md`

Machine-readable Prop authority:

`data/content/v0.2/props.yaml`

Canonical runtime rules now include:
- 1m Prop snap
- persistent place/move/rotate/delete
- 45-degree rotation
- title + physical size metadata
- server-authoritative collision/cost
- deterministic procedural visual variation
- bounded Beauty contribution
- activity anchors for visible citizen life

The old ID-only file `data/content/v0.1/decor_catalog.yaml` is deprecated.
