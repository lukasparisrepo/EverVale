# 71 — HUD & Audio Asset Pipeline

Status: **M1 PRESENTATION CONTRACT**

## HUD

Runtime HUD art lives under:

`apps/client/public/ui/`

Current source/crop model:

- `hud-master.svg` — source composition sheet
- `hud-topbar.svg` — runtime crop
- `hud-sidepanel.svg` — runtime crop
- `hud-chip.svg` — runtime crop

The React UI owns:
- text
- numbers
- localization
- buttons
- accessibility
- interaction state

Art assets own:
- frame silhouette
- edge treatment
- texture/grain
- ornamental accents

Do not bake gameplay text/numbers into HUD images.

### AI / Blender HUD workflow

1. create a single target HUD sheet;
2. critique against EverVale palette and gameplay readability;
3. crop stable reusable pieces;
4. commit source sheet and runtime crops separately;
5. wire crops through CSS or atlas UVs;
6. run browser screenshots and performance checks;
7. keep a CSS fallback for accessibility/debug.

This allows later AI-generated raster art or Blender-rendered UI ornaments without rewriting components.

## Music

Canonical manifest:

`data/audio/v0.1/music.yaml`

Music is state-driven, not screen-driven.

States:
- calm day
- calm evening
- rain
- threat warning
- combat
- recovery

Rules:
- no lyrics in baseline;
- no imitation of identifiable copyrighted melodies;
- seamless loops for looping states;
- target around -16 LUFS;
- UI/SFX remain intelligible over music;
- combat stays playful/strange, not grim military realism.

### Generated-audio workflow

1. generate multiple candidates from the canonical brief;
2. retain source prompt/provenance;
3. reject tracks with recognizable copied melody;
4. trim/fade and make seamless loop;
5. normalize loudness;
6. export OGG runtime file;
7. place it in the exact manifest slot;
8. browser-test transition/crossfade;
9. commit only approved runtime assets + provenance metadata.

## Asset ownership

HUD and generated music must be:
- project-owned or licensed for redistribution;
- traceable through a manifest;
- replaceable without gameplay code changes.

Binary music assets are not yet present in M1; the slots and integration contract are locked first.
