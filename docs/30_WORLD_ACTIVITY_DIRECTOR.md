# 30 — World Activity Director

## Purpose

Prevent a technically functioning town from looking dead.

The Activity Director creates low-stakes automated life around authoritative schedules.

## Inputs

- time of day
- weather
- Population
- Happiness
- school/work state
- parks
- farms
- active threat
- camera region
- quality setting

## Possible ambient events

- two citizens stop to talk
- child group walks from school
- dog walk
- cat sleeps on porch
- ducks cross a path
- chickens scatter
- worker carries crate
- street cleaner passes
- repair crew works
- delivery van arrives
- farmer tends field
- birds land on roof
- park picnic begins

## Hard boundary

Ambient events do **not** create or remove:
- Money
- Power
- Water
- Varum
- Tech
- combat outcome

unless that event is explicitly promoted into authoritative gameplay.

## Deterministic variation

Use stable seeds from:
- world
- visual day
- region
- entity

This avoids chaotic random behavior and supports screenshot regression.

## Camera bias

The client may choose which already-valid ambient action to visually emphasize near the camera.

It may not teleport a citizen or cancel their real job just to entertain the player.

## Five-minute idle test

If the player leaves the camera stationary for five minutes, the view should visibly evolve through:
- different pedestrians
- traffic
- school start/end
- park occupancy
- pet movement
- farm activity
- light changes
- time/weather
