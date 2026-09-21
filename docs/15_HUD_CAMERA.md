# 15 — HUD & Camera

## Camera

Primary:
- perspective isometric-style
- pitch approximately 48–55°
- FOV approximately 35–45°
- smooth orbit
- zoom from city management to close diorama
- constrained pan

Camera should preserve depth; do not use true orthographic as default.

## Obstruction

Foreground buildings/trees may fade when blocking selection or important citizens.

## HUD principle

The world is the main screen. HUD stays compact.

### Top bar
- Money
- Electricity
- Water
- Varum
- population
- world time/speed

### Build palette
Categories rather than dozens of permanently visible buttons.

### Inspector
Context-sensitive for building, citizen, road, district, or threat.

### Alerts
Cause-oriented:
- Water shortage: East District
- Refinery stopped: no power
- School capacity full

## Overlays

Toggle overlays:
- power
- water
- roads/logistics
- service coverage
- safety
- Varum/industry

Use world tint/lines/icons carefully so scene remains readable.

## Time controls

Online single-owner:
- pause where permitted
- 1x
- faster simulation modes subject to server rules

Future multiplayer may restrict time acceleration.

## Threat UI

Do not display an exact hidden attack countdown.

Show evidence:
- scout report
- radar contact
- unusual activity
- threat level language
- damaged perimeter

## Mobile

Mobile layout may use collapsible drawers. Do not shrink desktop HUD blindly.
