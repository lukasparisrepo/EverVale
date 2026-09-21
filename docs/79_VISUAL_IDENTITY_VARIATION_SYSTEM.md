# 79 — Visual Identity, Authored Variants & World Diversity

Status: **CANONICAL VISUAL PRESENTATION BASELINE v0.1**

Authority scope: presentation only.

Related authorities:
- `docs/02_WORLD_ART.md`
- `docs/36_WHISTLEVALE_REFERENCE_AUDIT.md`
- `docs/37_BUILDING_CATALOG_AND_ART.md`
- `docs/43_DECOR_AND_WORLD_DRESSING.md`
- `docs/46_CITIZEN_VISUAL_ROSTER.md`
- `docs/47_CITIZEN_ACTOR_CATALOG.md`
- `docs/65_PERFORMANCE_BUDGETS.md`
- `data/presentation/v0.1/visual_identities.yaml`

## Purpose

EverVale must not look like one procedural kit repeated across every save.

The canonical presentation equation is:

```
world dialect
+ building-family DNA
+ authored structural variant
+ stable per-instance seed
+ district dressing grammar
+ role/activity presentation
= one coherent but non-cloned miniature world
```

Variation must be deterministic, visually authored and mechanically irrelevant.

It must never change:
- economy
- combat
- pathfinding authority
- footprints/collision authority
- persistence rules
- tech progression
- worldgen fairness

## World dialect

Each persistent world resolves one **visual dialect** from the world seed.

A dialect controls:
- palette bias
- roof language
- trim language
- landscape palette
- vegetation bias
- civic/industrial/rural dressing bias

It does **not** change building stats or terrain fairness.

Approved v0.1 dialects:

### Hearthstone
Warm cream plaster, warm stone, dark timber, weathered brown/slate roofs, copper accents, flower boxes and warm lamps.

### Willowbrook
Pale sage plaster, lighter timber, green-grey slate, mossy stone, copper/brass trim, garden-heavy residential edges.

### Amberfield
Ochre/cream plaster, warm brick, rust-brown roofs, dark timber, brass accents, baskets/crates and dry-stone rural detail.

### Bluebell
Cool cream plaster, pale masonry, blue-grey/green slate, medium timber, restrained copper and blue-green planting.

The dialect is a shared visual language, not a global recolor.

## Deterministic seed policy

Presentation identity must use stable inputs.

### World
`world.seed` resolves the dialect.

### Building
Preferred identity seed:

```
world.seed
+ definitionId
+ quantized placement position
+ rotation bucket
```

A persistent entity ID may be used only as a final tie-breaker.

Reason: two reconstructions of the same seed and layout should resolve the same primary building variant even if persistence IDs differ.

### Citizen
Until persistent per-citizen identities exist, M1 uses:

```
world.seed + stable presentation slot + role
```

When persistent citizens exist, replace the presentation slot with the stable citizen ID without changing the visual grammar.

### Ambient detail
Use:

```
world.seed + region/district key + day key + local anchor
```

No `Math.random()` in deterministic world dressing.

## Anti-clone rule

Nearby instances of the same building family should not resolve the same authored variant when another legal variant exists.

M1 reference radius: **18 m**.

The resolver may rotate to the next deterministic variant, but it must remain stable for the same world/layout.

Anti-clone is not permission for chaotic variation. Repeated structures still share their family DNA.

## Building family DNA

Every building family has:
- silhouette promise
- material promise
- roof language
- facade grammar
- signature prop/activity grammar
- legal variant list

A variant is valid only if it changes at least two of:
- roof profile
- massing/annex
- entrance placement
- window grouping
- chimney/stack location
- porch/canopy
- yard composition
- machinery arrangement
- garden/fence composition
- visible interior hint

Color-only variants do not count.

## M1 authored families

### Hearth Hall — `town_center`
Shared DNA:
- civic landmark
- warm masonry/plaster
- timber trim
- bell/clock/lantern identity
- notice/delivery activity

Variants:
1. **Clock Hall** — central clock tower, symmetrical front, notice zone.
2. **Bell Porch Hall** — offset bell tower, deep civic porch, stronger arrival composition.
3. **Twin-Gable Hall** — split upper frontage, central civic lantern/notice focus.

### Hearth Cottage — `house_small`
Shared DNA:
- plaster/timber
- readable chimney
- domestic garden edge
- warm night windows

Variants:
1. **Flower Gable** — centered entrance, twin flower boxes, left chimney.
2. **Side Porch** — offset entrance, covered porch, woodpile.
3. **Dormer Cottage** — front dormer, taller roof, narrow garden.
4. **Stone-End Cottage** — masonry end wall, side chimney, mailbox/bicycle.
5. **Craft Cottage** — shallow work lean-to, crates/tools.
6. **Laundry Garden** — laundry line, planter/bench, lighter domestic frontage.

### Copperwheel Workshop — `workshop`
Shared DNA:
- brick/timber workshop
- loading/work yard
- visible mechanism
- practical clutter

Variants:
1. **Wheel Yard** — exposed flywheel/gear + compact awning.
2. **Forge Stack** — chimney/forge mass + heat/work zone.
3. **Loading Shed** — side annex + crates/loading composition.
4. **Saw Court** — covered work court + timber stock/saw motif.

### Sunwheel Power Works — `power_plant`
Shared DNA:
- industrial brick hall
- copper mechanism
- short stack language
- amber operational cues

Variants:
1. **Twin Stack** — paired stacks + front flywheel.
2. **Turbine Hall** — one larger stack + dominant turbine silhouette.
3. **Generator Annex** — asymmetrical generator wing + equipment bank.

### Clearbrook Water Works — `water_plant`
Shared DNA:
- pale masonry
- tanks/pools
- pump/pipe cues
- wet paving/water surfaces

Variants:
1. **Twin Cistern** — paired exposed cisterns.
2. **Pump Court** — pipe/gauge frontage + external pump.
3. **Filter House** — filter basins + secondary processing wing.

### Willowbell School — `school`
Shared DNA:
- warm civic facade
- bell/education landmark language
- repeated classroom windows
- schoolyard/bike activity

Variants:
1. **Bell Gable** — central bell feature.
2. **Courtyard School** — side wings framing a small yard.
3. **Classroom Annex** — asymmetrical teaching wing with denser windows.

### Lantern Grove — `park`
Shared DNA:
- framed green space
- mature trees
- social activity anchors
- curved/soft composition

Variants:
1. **Fountain Grove**
2. **Duck Pond**
3. **Play Lawn**
4. **Reading Garden**

### Oakwatch Guardhouse — `guard_post`
Shared DNA:
- stone/timber lodge
- banner/bell
- visible patrol/training edge

Variants:
1. **Lodge Yard**
2. **Watch Court**
3. **Gate Lodge**

### Greenpatch Farm — `farm`
Shared DNA:
- barn/farmhouse
- fence/field edge
- animal/work anchors
- carts/hay/baskets

Variants:
1. **Barnyard**
2. **Silo Farm**
3. **Orchard Edge**
4. **Animal Court**

### Honeybell Kitchen — `restaurant`
Shared DNA:
- warm facade
- social frontage
- awning/porch/sign
- tables/lanterns

Variants:
1. **Awning Terrace**
2. **Courtyard Kitchen**
3. **Corner Café Front**
4. **Lantern Dining Porch**

### Builder's Yard — `builders_yard`
Shared DNA:
- timber shed
- material stacks
- scaffold/hoist/saw language
- visible active work

Variants:
1. **Hoist Yard**
2. **Saw Shed**
3. **Stone Yard**
4. **Scaffold Court**

## District dressing grammar

### Residential
Flower boxes, hedges, bicycles, mailbox, laundry, bench, woodpile, tiny garden tools.

### Civic
Notice boards, banners, benches, lamps, planters, delivery handcart, small plaza details.

### Industrial
Crates, pallets, pipe bundles, wheels/gears, tool benches, covered stock, warning lamps.

### Rural
Fences, hay, troughs, baskets, cart, orchard/crop edge, animal anchors.

### Safety
Bell, banner, training props, barriers, lamp, equipment rack.

Automatic dressing remains non-authoritative and must not block required gameplay access.

## Citizen identity

The existing citizen roster remains authoritative for roles.

Runtime presentation must expose role before facial detail.

M1 minimum silhouettes:

### School child
Small proportions, backpack, brighter outerwear, cap/no-cap.

### Casual resident
Coat/shirt variants, multiple hair shapes, optional hat/satchel/shopping bag.

### Workshop worker
Apron/vest, rolled-sleeve silhouette, tool pouch/crate.

### Utility technician
Dark overalls, utility cap/helmet, tool bag/inspection device.

### Teacher
Tidy coat/cardigan, book/tablet.

### Guard
Padded vest, compact helmet/cap, darker warm uniform, patrol gear.

### Builder
Hard hat/cap, work vest, tool belt, hammer/board/toolbox.

### Farmer
Wide hat/boots, basket/tool.

### Café worker
Apron, tray/towel.

### Service crew
Practical workwear, toolbox/broom.

Variation dimensions:
- body proportions within stylized bounds
- skin tone
- hair style/tone
- outfit palette
- headwear
- accessory
- carried prop
- idle/gait preference

Appearance must not encode social value, competence, economic success or personality.

## Composition rule learned from Whistlevale

Visual quality is hierarchical.

A scene must read in this order:

1. **macro landmark composition** — one or two dominant silhouettes;
2. **mid-scale district rhythm** — varied rooflines, setbacks, water/roads/green breaks;
3. **micro-authored detail** — doors, windows, trim, props, signs, clutter;
4. **life layer** — people, animals, vehicles, activity;
5. **atmosphere** — lighting, shadow, particles, weather.

Adding micro-props cannot repair weak macro composition.

Dense detail must be balanced with negative space.

## Runtime architecture rule

Do not implement all building families inside one giant renderer file.

Required presentation split:

```
world/visual-identity.ts
world/buildings/building-visual-registry.ts
world/buildings/house-small-visual.ts
world/buildings/town-center-visual.ts
world/buildings/workshop-visual.ts
world/buildings/utility-visual.ts
world/buildings/civic-visual.ts
world/buildings/rural-visual.ts
world/actors/citizen-visual.ts
world/environment/environment-visual.ts
```

Exact filenames may vary, but the architecture must preserve:
- family ownership
- registry-based dispatch
- shared material/geometry helpers
- no gameplay rules in presentation modules
- no >500-line visual god-module without explicit review

Hero assets may later replace procedural family renderers with GLB while keeping the same registry and identity contracts.

## GLB transition rule

Procedural geometry is acceptable for:
- M1 proof
- distant detail
- repeated low-cost props
- roads/vegetation
- debug/fallback

For 6/10+ close-diorama quality, hero buildings should progressively move to authored Blender/GLB variants.

Every GLB must follow `docs/19_ASSET_STANDARDS.md`.

## Quality gate: target 6/10

The next visual milestone is accepted only when:

- three visible Hearth Cottages are structurally distinguishable;
- Town Center reads as a landmark without HUD;
- Workshop, Power Works and Water Works read from silhouette;
- at least four citizen roles are distinguishable at diorama zoom;
- world seed changes coherent dialect/scatter, not only colors;
- road/building/terrain transitions do not look like objects sitting on a flat plane;
- close zoom reveals authored frontage detail;
- macro composition has intentional negative space;
- starter and 40-citizen scenes stay inside `docs/65_PERFORMANCE_BUDGETS.md`;
- no presentation change alters authoritative gameplay.

This target is not Whistlevale parity. It is the threshold from “polished procedural prototype” to “authored miniature town.”
