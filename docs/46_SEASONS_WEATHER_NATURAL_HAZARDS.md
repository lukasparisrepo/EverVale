# 46 — Seasons, Weather & Natural Hazards

Status: **CANONICAL WORLD CLIMATE v0.1**

## Product goal

EverVale has four real seasons and continuously changing weather.

Weather must do two jobs:

1. make the town visibly alive
2. occasionally create planning pressure

It must **not** turn EverVale into a punishing survival simulator.

The player should remember:

- a rainy spring morning
- children leaving School under umbrellas
- a hot summer afternoon with crowded parks and high Water demand
- autumn leaves blowing across the road
- a winter snowstorm that strains Power and slows traffic

## Four seasons

Canonical order:

`SPRING → SUMMER → AUTUMN → WINTER → SPRING`

Initial baseline:

- one season = **7 real days at 1x persistent world time**
- one full year = **28 real days**

Season progression continues while the player is offline.

The system stores:
- season
- season progress
- climate seed
- current weather
- weather episode seed
- weather start/end timestamps

A future balance pass may tune season duration without changing the architecture.

## Seasonal identity

### Spring

Visual:
- fresh green foliage
- flowers
- wet roads
- light mist
- frequent clouds
- occasional rainbow after rain

Weather bias:
- light rain
- normal rain
- windy rain
- fog
- occasional thunderstorm

Gameplay tendencies:
- outdoor activity remains high between showers
- rain reduces Park usage temporarily
- wet roads slightly reduce traffic speed
- storm/flood risk exists but remains moderate

### Summer

Visual:
- dense green foliage
- bright sun
- dry roads
- longer warm evenings
- insects/butterflies

Weather bias:
- clear
- partly cloudy
- warm wind
- heatwave
- short heavy thunderstorm

Gameplay tendencies:
- Water demand can rise during heat
- Parks and cafés become busier in fair weather
- thunderstorms can produce lightning/fire/power incidents
- air activity is normally favorable outside storms

### Autumn

Visual:
- amber/red foliage
- falling leaves
- damp stone
- stronger wind
- morning mist

Weather bias:
- cloudy
- rain
- strong wind
- windstorm
- fog
- severe storm slightly more likely

Gameplay tendencies:
- fallen-tree incidents become more likely
- roads may receive temporary debris
- wind affects aircraft and outdoor activity
- Park still functions but usage becomes weather-sensitive

### Winter

Visual:
- bare branches / evergreen contrast
- frost
- occasional snow cover
- warm window lights
- visible breath/steam where appropriate

Weather bias:
- cold clear
- cloudy
- fog
- snow
- heavy snow
- cold snap
- winter storm

Gameplay tendencies:
- Power demand rises
- traffic can slow
- outdoor leisure falls
- severe snow/wind can temporarily restrict Airfield operations
- Water system does **not** become a plumbing simulator; freeze effects stay abstract

## Weather states

Approved v0.1 states:

- CLEAR
- PARTLY_CLOUDY
- CLOUDY
- FOG
- LIGHT_RAIN
- RAIN
- HEAVY_RAIN
- THUNDERSTORM
- LIGHT_WIND
- STRONG_WIND
- WINDSTORM
- HEATWAVE
- COLD_SNAP
- LIGHT_SNOW
- SNOW
- HEAVY_SNOW
- SEVERE_STORM

Not every state is valid in every season.

## Weather Director

Weather is authoritative server state.

The Weather Director uses:

- world climate seed
- current season
- previous weather
- seasonal transition matrix
- cooldowns
- recent severe-event history

It must not call unseeded runtime randomness for persistent outcomes.

The server decides:
- weather state
- start/end time
- hazard modifiers
- forecast confidence

The client decides:
- cloud rendering
- rain/snow particles
- wetness
- wind animation
- leaf particles
- fog visuals
- soundscape

## Random but coherent

Weather should feel random without becoming noisy.

Rules:

- avoid switching weather every minute
- normal episodes last long enough to be noticed
- severe events have cooldowns
- transitions prefer plausible neighbors
- CLEAR → SEVERE_STORM should normally pass through warning/cloud/wind states

## Forecast

Weather can be predicted more accurately than enemy attacks.

Base player receives a simple short forecast:

- Clear likely
- Rain possible
- Strong wind approaching
- Snow likely
- Storm risk elevated

A future **Weather Station** may improve:
- forecast horizon
- confidence
- severe-weather warning lead

The forecast does not need an exact second-by-second countdown.

## Natural hazard layer

Weather states can create natural hazards.

### Heavy Rain

Possible effects:
- outdoor Happiness activity reduced
- civilian traffic slower
- low terrain visual puddling
- rare road blockage
- bridge inspection/repair event

### Thunderstorm

Possible effects:
- Power Plant fault risk ↑
- lightning fire risk ↑
- Airfield activity restricted
- civilians reduce optional travel
- pets seek shelter

### Strong Wind

Possible effects:
- Park usage ↓
- bicycle traffic ↓
- aircraft restrictions
- fallen branch/tree risk ↑

### Windstorm

Possible effects:
- tree/roof damage
- road blockage
- Watchtower damage
- Hill Lift temporary fault
- Airfield closed while unsafe

### Heatwave

Possible effects:
- citizen Water consumption +15%
- selected civic/industrial Water use +10%
- Park/fountain usage ↑ if available
- Happiness suffers if Water satisfaction is poor

### Cold Snap

Possible effects:
- citizen Power consumption +10%
- outdoor leisure ↓
- repair speed slightly ↓

### Snow

Possible effects:
- road travel cost +10%
- civilian traffic density ↓
- children/park may create seasonal visual activities

### Heavy Snow

Possible effects:
- road travel cost +25%
- Airfield activity restricted
- Hill Lift fault risk ↑
- Power demand +15%

### Severe Storm

Rare.

Possible effects:
- multiple localized incidents
- temporary road blockage
- bridge/lift fault
- utility output reduction
- roof/tree damage

It is a **town event**, not a settlement wipe.

## Terrain interaction

Procedural maps can react differently to weather without making seeds unfair.

Examples:
- low valley: more puddles/flood visuals
- high ridge: stronger wind visuals
- forest sector: more fallen-tree risk
- lakeside: fog frequency slightly higher

Seed variation may change flavor and route pressure, not create unavoidable catastrophic disadvantage.

## Building interaction

Weather modifies incident risk rather than directly destroying buildings.

Examples:

`THUNDERSTORM + low-condition Power Plant → higher generator/electrical fault risk`

`WINDSTORM + Watchtower → higher storm-damage risk`

`HEAVY_SNOW + Hill Lift → higher lift-fault risk`

Healthy infrastructure and services reduce consequences.

## Citizen life

Weather changes autonomous behavior.

Rain:
- umbrellas/raincoats where assets exist
- Park use ↓
- café/indoor activity ↑
- pets stay closer to home

Heat:
- more fountain/park shade activity
- Water demand ↑
- midday outdoor activity can fall

Snow:
- fewer bicycles
- slower traffic
- optional child snow-play activity
- warmer indoor/café activity

Storm warning:
- optional outdoor activity sharply ↓
- School/work may remain active unless hazard escalates

Severe storm:
- citizens move to safe indoor states
- nonessential traffic nearly stops
- service crews deploy afterward

## Animals

Weather-aware behavior:

- birds shelter during heavy rain/wind
- butterflies disappear in rain/cold
- ducks remain active in light rain
- cats seek porches/indoors
- dogs reduce walks in severe weather
- farm animals move toward barn/shelter during storms

## Combat interaction

Weather affects presentation and a small amount of combat readiness.

Allowed:
- severe wind/storm restricts aircraft launch
- fog can shorten spotting range slightly
- rain/snow changes movement cost modestly

Avoid:
- large random combat multipliers
- weather deciding the battle by itself

Prepared defenses must remain the dominant factor.

## Offline simulation

Offline weather is simulated coarsely.

Do **not** replay every rain particle or minute.

Catch-up resolves:

1. seasonal progression
2. significant weather episodes
3. hazard-triggered incidents
4. resulting repair/resource effects

Offline fairness:

- severe natural-hazard incidents are capped
- weather cannot silently delete critical buildings
- important events appear in return timeline
- normal weather mostly changes aggregate production/consumption/activity

## Player-facing timeline

Examples:

- “Spring rain continued through the morning.”
- “A windstorm knocked a tree across North Road.”
- “Emberwatch Brigade contained a lightning fire at Copperwheel Workshop.”
- “Heavy snow increased Power use for 3 hours.”
- “Cloudstep Airfield suspended flights during the storm.”

## Architecture ownership

### Domain

`simulation/weather`
- season state
- weather transition
- hazard modifiers
- deterministic episode generation

### Application

`application/weather-director`
- schedules episodes
- emits world events
- coordinates offline catch-up

### Client

`client/world/weather`
- clouds
- precipitation
- fog
- wetness
- snow coverage
- wind animation
- seasonal foliage

### Data

`data/weather/v0.1/weather.yaml`

No weather formula belongs inside a Three.js particle system.

## Acceptance

Must test:

1. all four seasons occur in order
2. weather probabilities differ by season
3. severe event cooldown works
4. same seed/time produces same persistent weather outcome
5. rain changes living-world activity
6. heatwave raises Water demand
7. cold/heavy snow raises Power demand
8. storm can produce bounded incidents
9. offline catch-up produces identical significant outcomes
10. no natural hazard can silently erase the player's critical settlement
