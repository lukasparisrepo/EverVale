# 34 — Building & Decoration Catalog

Status: **CONTENT TAXONOMY v0.1**

EverVale should contain **dozens of buildables**, but they must share a small number of understandable mechanical systems.

The goal is content richness without adding dozens of currencies.

## Building families

### 1. Residential
Purpose:
- Housing
- Population Growth
- visual neighborhood variety

Planned:
- Small House
- Family House
- Townhouse
- Apartment House
- Cottage
- Senior House
- Residence Block
- Premium Villa

### 2. Income / Work
Purpose:
- employ citizens
- generate Money
- create different street/farm/industrial activity

Planned:
- Workshop
- Market
- Farm
- Café
- Bakery Shop
- General Store
- Carpenter
- Tailor
- Art Studio
- Office
- Bank
- Trading Hall

These are all Money-facing abstractions in the core economy. They differ through:
- worker slots
- Power/Water demand
- footprint
- output efficiency
- Tech Tier
- Happiness/activity side effects

They do **not** create new commodity currencies by default.

### 3. Power
- Small Generator
- Power Plant
- Advanced Power Plant
- Varum Reactor

All produce the same canonical Power resource.

### 4. Water
- Well Station
- Water Plant
- Advanced Water Plant
- Varum Condenser

All produce the same canonical Water resource.

### 5. Education / Tech
- Small School
- School
- Academy
- Research Institute
- Advanced Research Lab
- Observatory

All contribute to Education and/or Tech progression.

### 6. Civic / Happiness
- Small Park
- Large Park
- Playground
- Plaza
- Garden
- Pond Park
- Community Hall
- Clinic
- Library
- Sports Ground
- Pet Park
- Memorial Garden

These improve Happiness/service/activity diversity rather than creating new currencies.

### 7. Varum
- Varum Mine
- Deep Varum Mine
- Varum Storage
- Varum Research Annex

Varum remains one resource.

### 8. Construction / City Services
- Builder Yard
- Repair Depot
- Fire Station
- Maintenance Office
- City Hall Upgrade

These affect:
- construction slots
- repair speed
- service response
- city capacity

### 9. Defense
- Guard Post
- Watchtower
- Gatehouse
- Wall Segment
- Radar
- Bunker/Shelter
- Vehicle Factory
- Armored Car Bay
- Tank Bay
- Heavy Turret
- Anti-Air
- Airfield
- Fighter Hangar
- Varum Shield
- UFO Interceptor Pad

### 10. Transport / Access
- Road
- Paved Road
- Main Road
- Bridge
- Stair
- Ramp
- Lift/Elevator
- Tunnel Entrance later

These alter the Access Graph rather than produce economy resources.

## Decoration

Decor is a first-class build category.

Examples:
- tree
- flower bed
- hedge
- fence
- bench
- lamp post
- fountain
- statue
- sign
- planter
- stone path
- picnic table
- pergola
- gazebo
- bicycle rack
- bus stop prop
- pond reeds
- scarecrow
- farm fence
- hay bale
- crates
- barrels
- market awning
- street banner
- seasonal decor

## Decor rules

Most decor:
- no upkeep
- no worker
- no resource production

Some decor can provide tiny capped local Happiness/beauty effects.

Never allow decoration stacking to become the optimal economy exploit.

Recommended rule:
- local beauty contribution has diminishing returns and category caps

## Variant system

One building definition may have multiple visual variants.

Example:

`house_small`

can have:
- roof A/B/C
- wall color A/B/C
- chimney yes/no
- porch variants
- garden variants

This creates visual richness without multiplying gameplay definitions.

## Upgrade philosophy

Upgrades should preferably change physical form.

Example:

`Power Plant → Advanced Power Plant`

should visibly gain:
- additional module
- larger turbine
- Varum component
- new light/VFX

rather than only changing a number.

## Content target

Long-term target for first broad release:

- 45–60 functional building definitions
- 80–150 decoration definitions
- 3–6 visual variants for common residential/work buildings

Not all must be available in MVP.
