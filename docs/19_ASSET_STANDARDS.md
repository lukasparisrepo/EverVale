# 19 — Runtime Asset Standards

## Goal

Every runtime asset should be predictable enough that an agent can integrate it without manually repairing scale, pivots, materials, names, or metadata.

## Runtime format

Primary: **GLB / glTF 2.0**.

Do not ship .blend as runtime content.

## Units and transforms

- real-world scale in meters
- apply scale before export unless animation pipeline requires otherwise
- consistent up/forward convention
- meaningful pivot
- avoid unexplained negative scale
- freeze accidental transforms

## Naming

Suggested:
- `bld_house_small_a`
- `bld_school_a`
- `veh_tank_varum_a`
- `prop_bench_wood_a`
- `veg_oak_a`
- `char_citizen_adult_a`

LOD suffix:
- `_lod0`
- `_lod1`
- `_lod2`

Collider suffix:
- `_col`

## Triangle budgets

Budgets are category-specific and must be measured in representative scenes.

Early guidance:
- tiny prop: hundreds, not tens of thousands
- medium prop: low thousands
- building exterior: economical enough for many simultaneous instances
- hero vehicle/building: higher budget allowed, but must have LODs

No asset is approved based only on looking good in Blender.

## Materials

Goals:
- reuse materials
- atlas where helpful
- avoid unique material per mesh part
- avoid excessive transparency
- use PBR maps only when visible benefit justifies memory

Stylized surfaces can use vertex color/procedural runtime variation.

## Textures

Prefer:
- shared palettes
- atlases
- compressed delivery formats when pipeline is established
- sane resolutions by screen size

Do not use 4K textures on small props without explicit justification.

## LOD

Buildings, vehicles, and repeated vegetation need LOD or equivalent simplification when scaling requires it.

LOD generation may be:
- manual
- Blender decimation with validation
- alternate authored mesh
- impostor for distant vegetation

## Colliders and footprints

Gameplay placement does not require visual-mesh precision.

Each building should expose:
- 2D footprint
- clearance
- entrances
- service/logistics access points

3D collider is separate from economic footprint.

## Provenance manifest

Required fields:

```json
{
  "asset_id": "bld_school_a",
  "source": "original",
  "source_url": null,
  "author": "EverVale",
  "license": "project-owned",
  "generator": "Blender MCP/CLI",
  "pipeline_version": 1,
  "dimensions_m": [12, 8, 6],
  "lods": [],
  "materials": [],
  "exported_at": "ISO-8601"
}
```

## Generated asset rule

AI/text/image-to-3D output is never directly production-ready.

Required review:
- silhouette
- topology
- scale
- materials
- UV
- unnecessary internal geometry
- license/service terms
- consistency with art bible
