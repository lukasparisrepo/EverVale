# 47 — Citizen Actor Catalog

Status: **CANONICAL LIVING-ACTOR BASELINE v0.1**

## Principle

EverVale citizens are **not named heroes**.

They are autonomous town inhabitants generated from:
- age band
- job role
- household
- outfit set
- body/face seed
- current activity
- season/weather variant

The player may inspect a citizen, but the game does not require authored names or biography content.

The visual goal is:

> dozens of recognizable everyday roles moving through the same world automatically.

## Citizen identity model

A visible citizen can be reconstructed from:

```
CitizenVisualSeed {
  citizenId
  ageBand
  bodyVariant
  faceVariant
  hairVariant
  outfitPalette
  jobRole
  weatherVariant
}
```

No runtime AI prompt is required to create a person.

## Age bands

### Child
Visual:
- smaller proportions
- school bag
- colorful coat/shirt variants

Automation:
- home
- school
- schoolyard
- park
- return home
- shelter during danger

### Teen / Student
Visual:
- slightly taller
- backpack
- bicycle variants

Automation:
- school/academy
- park
- café
- errands
- future part-time visual jobs if desired

### Adult
Main Workforce population.

### Senior
Visual:
- slower gait
- coat/hat variants
- cane optional

Automation:
- home
- park
- market
- café
- clinic
- civic spaces

Seniors need not be an economic demographic system in v0.1.

# Work-role actor sets

## Builder
Visual:
- work vest
- gloves
- tool belt
- hard hat / cloth cap variants

Activities:
- construction
- blocker clearing
- repair
- scaffolding
- road work

## Workshop Worker
Visual:
- apron
- rolled sleeves
- gloves

Activities:
- workshop arrival
- machine/workbench loop
- crate carrying
- break

## Utility Technician
Visual:
- darker overalls
- tool bag
- utility helmet/cap

Activities:
- Power Plant shift
- Water Plant shift
- inspection
- emergency maintenance

## Farmer
Visual:
- field clothes
- boots
- hat variants

Activities:
- field work
- barn
- tractor/cart
- animal care

## Shop / Market Worker
Visual:
- apron
- basket/crate props

Activities:
- stall setup
- customer interaction
- stock movement

## Café / Restaurant Worker
Visual:
- apron
- simple cap
- tray prop

Activities:
- table service
- kitchen/service loop
- cleaning
- customer interaction

## Teacher
Visual:
- tidy civilian clothes
- book/tablet prop

Activities:
- school arrival
- classroom
- schoolyard supervision
- school departure

## Researcher
Visual:
- warm coat/lab apron hybrid
- goggles optional
- notebook/instrument props
- restrained Varum teal accent

Activities:
- console
- instrument check
- Varum Research House

## Medic
Visual:
- light coat
- medical bag

Activities:
- clinic
- injured citizen recovery
- emergency response

## Firefighter
Visual:
- stylized protective coat
- helmet
- hose/extinguisher prop

Activities:
- station idle
- vehicle departure
- fire response
- cleanup

## Service Crew
Visual:
- practical workwear
- broom/toolbox/trap kit variants

Activities:
- litter cleanup
- pest response
- minor maintenance
- fallen branch cleanup

## Guard
Visual:
- friendly stylized town militia
- dark coat/vest
- compact helmet/cap
- shield/rifle-like fictional Varum carbine only when needed

Activities:
- patrol
- gate watch
- threat response
- escort

## Pilot
Visual:
- flight suit
- scarf/helmet
- light Varum tech accents

Activities:
- Airfield
- walk to aircraft
- scramble
- return

## Vehicle Mechanic
Visual:
- grease-stained overalls
- gloves
- welding mask optional

Activities:
- Motor Works
- armored depot
- vehicle repair

## Weather Observer
Visual:
- coat
- notebook/instrument case

Activities:
- Cloudglass Weather House
- instrument check
- storm warning state

# Leisure / ambient citizen sets

These are not jobs.

## Dog Walker
Can be any adult/senior with pet seed.

## Cyclist
Can represent commute or leisure.

## Parent + Child Pair
Visual activity cluster.

## Park Reader
Bench/book activity.

## Jogger / Walker
Park or road path activity.

## Shopper
Market/café/restaurant visitor.

## Picnic Group
2–5 low-cost actors generated as one activity cluster.

# Weather variants

Rain:
- umbrella
- raincoat
- hood

Winter:
- coat
- scarf
- hat

Summer:
- lighter clothing
- rolled sleeves

Storm:
- optional civilian outdoor activities suppressed

# Animation vocabulary

Shared clips should cover most citizens:

- idle
- walk
- brisk_walk
- run
- sit
- talk
- wave
- carry_box
- carry_bag
- inspect
- work_bench
- sweep
- dig
- repair
- read
- eat_drink
- point
- shelter
- injured_walk

Role-specific clips are additive, not separate full animation systems.

# Performance

Near camera:
- full rig/animation

Mid:
- reduced update rate

Far:
- simplified clips / instanced impostor / hidden

Do not simulate a unique expensive controller for every citizen.

# Art direction

Citizens should be:
- stylized
- friendly
- readable at isometric scale
- slightly oversized head/hands/tools for readability
- not realistic military/survival characters

Silhouette and action matter more than face detail.
