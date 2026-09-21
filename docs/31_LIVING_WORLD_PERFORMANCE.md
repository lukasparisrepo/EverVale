# 31 — Living World Performance & Density

## Principle

A living town is not the same thing as simulating every visible object at maximum fidelity.

Use **simulation LOD** as aggressively as rendering LOD.

## Distance bands

### Near
Full visible behavior:
- animated citizens
- pets
- vehicle movement
- activity anchors
- detailed props

### Mid
Reduced behavior:
- simplified animation
- less frequent updates
- fewer ambient actors

### Far
World summary:
- buildings
- traffic hints
- smoke/lights
- no individual high-cost actor simulation

## Actor update rates

Suggested starting points:

- near moving citizen: 10–20 visual logic updates/sec + render interpolation
- mid citizen: 2–5 updates/sec
- far citizen: no individual movement update
- ambient animals: 2–10 updates/sec depending distance
- static crowds: zero frame updates

Rendering can still run 60 FPS.

## Static-life batching

Take inspiration from miniature-scene techniques such as Whistlevale:

- static seated people
- permanent cafe scenes
- fixed market groups
- small decorative crowds

can be batched into static scene geometry when they do not need dynamic behavior.

EverVale differs by ensuring dynamic simulation actors remain separate.

## Population presentation budget

Do not require:

`visible actors == total Population`

At large scale:

```
logical Population = authoritative
visible persistent actors = camera budget
ambient actors = visual density budget
```

## Pooling

Pool:
- citizens
- vehicles
- pets
- particles
- labels
- temporary combat actors

## Instancing

Good candidates:
- trees
- rocks
- repeated cars
- chickens/ducks at distance
- street furniture
- simple citizens at far LOD

## Animation

Avoid running a full skeletal mixer for every far citizen.

Possible progression:
- near: skeletal/rigged
- mid: simplified clip/update
- far: impostor/static/hidden

## Scene ownership

Each client module owns creation and disposal of its GPU resources.

Required:
- dispose geometry
- dispose material/texture when unshared
- unregister updates
- release pooled actor

Memory leaks are gameplay bugs in a persistent browser world.

## Quality tiers

Low:
- reduced actor density
- reduced shadows
- minimal post FX
- fewer animals
- lower DPR

Medium:
- standard target

High:
- richer activity
- better shadows
- more ambient actors

Simulation truth must remain identical across graphics tiers.
