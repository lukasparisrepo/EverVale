# 35 — Starting World & Expansion Progression

Status: **BOOTSTRAP BASELINE v0.1**

## New world fantasy

A new player does not start with an empty barren map.

They inherit a tiny functioning settlement and expand it.

This avoids a dead first five minutes and immediately demonstrates autonomous life.

## Starter clearing

Each generated map contains a protected starter sector.

It is visually different per seed but mechanically fair.

## Starting buildings

Canonical bootstrap target:

- 1 Town Center
- 3 Small Houses
- 1 Small Power Plant / Power Plant
- 1 Water Plant
- 1 Workshop
- 1 short connected road network
- 1 tiny decorative green / tree cluster
- 12 Population

The starter town is operational at login.

## Starting resources

Reference v0.1:
- Money: 1200
- Power reserve: 60
- Water reserve: 60
- Varum: 0
- Tech: 0
- Happiness: healthy starting value
- construction slots: 1

## First decisions

The first 15–30 minutes should naturally present:

1. Housing is full → build another House.
2. More Population → more Workforce.
3. Build School/Park → improve Growth/Tech.
4. Choose another Money workplace vs utility reserve.
5. Clear first blocker to open new buildable area.
6. Reach T1 → discover/build Varum Mine.
7. First threat warning → build/strengthen defense.

## Map blockers

Near starter area:
- light blockers only
- cheap clear cost
- clear time visible

Farther sectors:
- heavier rock/rubble
- Tech-gated obstacles
- more valuable land/resources

This creates expansion pacing similar to unlocking blocked space in shelter/base games while keeping an outdoor 3D world.

## Discovery

Some map information can begin obscured.

The player should know:
- starter area
- immediate adjacent sectors

Later reveal:
- exact Varum deposit
- threat corridors
- special ruins
- advanced expansion zones

Radar / exploration structures can improve information.

## Expansion cost

Expansion is primarily paid through:

- clearing blocker cost
- connecting road/access
- construction time

There is no separate “land token” currency in v0.1.

## Failure-proof bootstrap

The starter economy must never require the player to build a structure they cannot afford because of the initial structure mix.

Automated simulation must test:
- no-action 30 minutes
- sensible first House
- School-first
- Park-first
- Workshop-first

All must remain recoverable.

## Returning player

When the player returns after logout, the same map remains.

Changes visible:
- construction completed
- Population changed
- resource bars changed
- road/building edits preserved
- blockers previously cleared remain cleared
- threat history applied
