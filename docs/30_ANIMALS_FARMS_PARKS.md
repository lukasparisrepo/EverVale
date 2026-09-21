# 30 — Animals, Farms & Parks

## Purpose

Cozy life needs non-economic motion.

Animals and civic spaces create the feeling that the town exists for its inhabitants, not only for resource production.

## Animal classes

### Household pets
- cats
- dogs

Generated from occupied houses using seeded probability.

Possible behavior:
- porch idle
- yard wander
- follow owner on leisure walk
- sleep
- park visit

### Farm animals
- chickens
- ducks
- later sheep/cows if art scope expands

Behavior:
- bounded roaming zone
- feeding cluster
- barn return
- pond edge
- flee briefly from nearby threat/noise

### Wildlife
- birds
- butterflies
- occasional woodland animals

Pure ambient layer unless a future event promotes one into gameplay.

## Farm

Farm is allowed in v0.1 **without creating a Food resource**.

Role:
- Money-producing workplace
- rural visual identity
- Happiness/landscape diversity
- source of farm ambience

This avoids reopening the Food economy while still giving the world farms, chickens and tractors.

Suggested Farm baseline:
- 3 workers
- moderate Money per worker
- modest Water use
- larger footprint than Workshop
- small recreation/beauty contribution nearby
- farm animal anchors

## Farm visual routine

Morning:
- farmer arrives
- chickens leave coop
- tractor/cart may move

Midday:
- field work
- animals roam
- farmer break

Evening:
- worker leaves
- animals cluster near barn/coop

Night:
- very low activity

## Park

Park is a Happiness building and major living-world stage.

Activities:
- bench sitting
- children playing
- walking
- jogging
- dog walking
- duck feeding
- picnic
- cycling
- fountain watching

Usage depends on:
- Happiness
- weather
- time
- threat
- nearby Population

## Pond

Park/farm pond can support:
- ducks
- ripples
- birds
- reflections
- fishing visual later

No fishing economy is needed.

## Cats

Cats favor:
- houses
- alleys
- workshops
- sunny spots

They should not all follow road paths like citizens.

## Dogs

Dogs favor:
- houses
- owners
- parks
- paths

Some can visually accompany citizen leisure trips.

## Threat response

Active danger:
- pets return toward home or despawn into safe state
- farm animals cluster in safe zones
- birds scatter
- parks empty

## Server cost

Persist only stable pet ownership if desired.

Ordinary animal wandering is client-side and reconstructed from seed/time.

## Art requirement

Animals should be stylized, low-cost and readable at diorama zoom.

Animation can be simple:
- walk
- idle
- eat
- sleep
- flap/run

Rich behavior matters more than skeletal complexity.
