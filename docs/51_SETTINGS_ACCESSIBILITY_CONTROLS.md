# 51 — Settings, Accessibility & Controls

Status: **CANONICAL SETTINGS v0.1**

# Graphics

Presets:
- Low
- Medium
- High
- Custom

Settings:
- resolution scale / DPR cap
- shadow quality
- shadow distance
- post-processing
- ambient actor density
- civilian traffic density
- animal density
- particles
- weather particles
- vegetation animation
- water quality
- anti-aliasing
- render distance

Simulation truth never changes with graphics quality.

# Accessibility

- UI scale
- text scale
- high-contrast HUD
- color-blind palettes for threat/utility overlays
- reduce camera shake
- disable combat camera impulse
- reduce flashes
- reduce particles
- motion-reduced weather
- subtitle/caption support
- audio cue captions
- larger cursor/selection outline

Combat information must not depend on color alone.

# Gameplay

- auto-pause on first major-contact warning
- auto-focus camera on first attack sector
- restore previous camera after alert
- show qualitative defense assessment
- show advanced combat stats
- construction confirmation
- demolition confirmation
- notification density
- tutorial hints
- follow-citizen camera smoothing

Default:
- auto-pause OFF
- major-wave speed clamp ON
- attack camera focus ON once
- advanced combat stats OFF

# Simulation speed

While owner is online:
- Pause
- 1x
- 2x
- 4x

During active major combat:
- maximum speed = 1x

When final client logs out:
- persistent world returns to 1x

# Audio

Categories:
- master
- music
- ambience
- citizens
- animals
- vehicles
- combat
- UI

Dynamic battle music can layer on top of cozy ambience rather than instantly replacing it with aggressive war music.

# Controls — desktop

Suggested:

- Left click: select / confirm
- Right drag: rotate camera
- Middle drag or modifier drag: pan
- Wheel: zoom
- Esc: cancel / close
- Space: pause/resume
- 1 / 2 / 4: speed
- B: build
- R: roads
- D: defense overlay
- F: focus selected
- Tab: overlays
- F10: settings

Do not make combat depend on twitch keyboard input.

# Camera

Options:
- rotation speed
- pan speed
- zoom speed
- edge pan
- invert rotate
- camera shake
- auto-focus alerts

# Account / persistence

- account
- current world
- logout
- reconnect status
- server save status
- last synchronized timestamp

No manual save button is required for authoritative persistent worlds.

Optional:
- export diagnostic world snapshot for support/dev mode
