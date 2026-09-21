# EverVale HUD Art Assets

Source concept: `hud-master.svg`

Runtime crops:
- `hud-topbar.svg`
- `hud-sidepanel.svg`
- `hud-chip.svg`

These are project-owned vector placeholders following EverVale's premium cozy miniature direction.

Pipeline rule:
1. AI/generated or Blender-rendered HUD source may replace `hud-master.svg`.
2. Crop/slice into runtime pieces with stable filenames.
3. Components must reference stable runtime pieces, never the temporary source sheet.
4. Keep text out of baked artwork when possible so localization remains HTML/CSS.
5. Preserve 9-slice-like stretch-safe center regions.

Final raster/atlas replacement should be WebP/AVIF where supported, with the SVGs retained as source/reference.
