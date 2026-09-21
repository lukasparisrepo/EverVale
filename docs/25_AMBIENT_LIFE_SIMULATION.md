# 25 — Ambient Life Simulation

Status: **CANONICAL v0.1**

## Core rule

EverVale citizens are **fully automated**.

The player does not:
- drag citizens to jobs
- tell children to go to school
- command citizens to visit parks
- manually drive civilian vehicles
- micromanage pets or farm animals

The player builds the town, provides jobs/services, sets priorities, and watches society operate.

## Authoritative life vs visual life

### Server owns
- home assignment
- workplace/school assignment
- logical activity
- destination
- schedule
- attendance
- threat response
- resource/work output

### Client owns
- exact walking animation
- local path smoothing
- idle variation
- talking/looking
- sitting
- cosmetic detours
- pet animation
- traffic presentation

**Server decides why and where. Client decides how it looks.**

## Everyday activities

Adults may automatically:
- wake
- leave home
- commute
- work
- take breaks
- visit park/shop/plaza
- return home
- sleep

Children may automatically:
- leave home
- go to school
- attend school
- play after school
- visit park
- return home

Citizens may also:
- sit on benches
- talk
- sweep
- water plants
- carry objects
- walk dogs
- watch animals
- react to weather

## Emergency override

Priority:
1. attack/shelter
2. emergency response
3. work/school
4. commute
5. social
6. ambient

A threat automatically interrupts normal routines.

## Scaling

Near camera:
- full model + animation

Mid distance:
- simplified animation / lower update rate

Far:
- simplified crowd representation, instancing or culling

Logical citizens continue to exist even when not rendered.
