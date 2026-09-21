# 07 — Citizens & Society

## Citizen model

Each citizen has a compact logical model:
- citizen_id
- household
- age/life stage
- home
- job or school
- schedule state
- health
- happiness
- safety perception
- current logical destination

Avoid simulating psychological detail that does not create gameplay.

## Daily state machine

Typical adult:
`Home → Commute → Work → Errand/Recreation → Home`

Typical child:
`Home → School → Recreation → Home`

States are server-authoritative. Client interpolates movement and animation.

## Jobs

MVP jobs:
- farmer
- builder
- shopkeeper/logistics worker
- utility worker
- teacher
- guard
- Varum worker

Jobs emerge from buildings with vacancies.

## Education

School provides:
- child service
- long-term education state
- future qualification gates

Advanced systems such as aviation or high-tier Varum industry can require trained workforce later.

## Happiness

Happiness is influenced by a small readable set:
- housing
- utilities
- commute
- food/basic needs
- safety
- nature/recreation
- services

## Parks

Parks are not decoration-only.

They provide:
- recreation
- nature value
- social gathering
- visible citizen activity

## Safety behavior

During threats citizens can:
- stop normal routines
- seek shelter/home
- avoid danger zones
- resume gradually after all-clear

## Rendering scale

Server never streams per-frame transforms for every citizen.

It sends logical movement/state; client animates locally.

Far citizens use simplified rendering, instancing, impostors, or culling as required.
