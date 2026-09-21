# 12 — Blender Asset Production Pipeline

Status: **APPROVED**

Blender is EverVale's offline content factory. Three.js is runtime.

## Tool lanes

### Blender MCP
Use `ahujasid/mcp-for-blender` for interactive AI-assisted:
- scene inspection
- object creation/editing
- materials
- Python execution
- reference-driven iteration
- selection/scene export to GLB

### Blender CLI
Use headless Blender + bpy scripts for repeatable:
- batch import
- transforms
- naming
- origin fixes
- UV checks
- material normalization
- collider generation
- LOD generation
- GLB export
- asset validation

MCP is exploratory/interactive; CLI is deterministic/batchable.

## Asset creation routes

### Route A — procedural Three.js
Use for:
- road mesh
- placement ghosts
- debug geometry
- highly variable simple props
- runtime-generated overlays

### Route B — Blender-authored original
Default for hero buildings, vehicles, distinctive props, citizens, and reusable modular kits.

### Route C — MCP library assets
Poly Haven is preferred for CC0 environment/material reference where suitable.

Poly Pizza can be useful for stylized low-poly references/assets, but license metadata must be preserved. Prefer CC0 filter when possible.

### Route D — AI-generated single asset
MCP for Blender supports text/image-driven generation integrations. Use primarily for individual objects, not as the default way to generate an entire city.

Generated assets are drafts until validated.

## Mandatory post-generation validation

Every generated/imported asset must be checked for:
- bounding box
- scale
- orientation
- origin/pivot
- topology sanity
- triangle budget
- material count
- texture resolution
- UV correctness
- normals
- hidden geometry
- animation clips when present
- collider/footprint
- LOD requirements

## Coordinate/export convention

Canonical world:
- units: meters
- up: +Y at runtime
- predictable forward axis documented per asset type
- origins placed for gameplay use, not arbitrary visual center

Export format:
- GLB/glTF 2.0

Runtime must never load .blend files.

## Suggested asset structure

```
assets-src/
  blender/
  references/
assets/
  glb/
  textures/
  manifests/
tools/blender/
  export_asset.py
  validate_asset.py
  build_lods.py
```

## Asset manifest

Each asset record:
- asset_id
- category
- source blend
- runtime GLB
- dimensions
- triangles per LOD
- materials
- collider type
- license
- source URL
- author
- generated_by
- exported_at
- pipeline_version

## Building kits

Prefer modular kits:
- wall sections
- roofs
- doors/windows
- chimneys
- props
- signs
- utility attachments

Variation may be assembled in Blender or runtime depending draw-call and uniqueness tradeoffs.

## Security

MCP for Blender can execute Python in Blender. Keep the socket local/trusted, enable safe mode where appropriate, and never expose an unauthenticated Blender execution port publicly.
