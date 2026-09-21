# 44 — Content Authority Index

Status: **CANONICAL NAVIGATION**

When documents overlap, use the authority below.

| Subject | Authority |
|---|---|
| Product constitution | `docs/00_CANON.md` |
| Core gameplay loop | `docs/03_GAMEPLAY_LOOP.md` |
| Economy/resources | `docs/04_ECONOMY_RESOURCES.md` |
| Infrastructure/access | `docs/05_INFRASTRUCTURE.md` + `docs/41_WORLD_CONNECTIVITY_AND_LEVELS.md` |
| Construction | `docs/06_BUILDINGS_CONSTRUCTION.md` + `docs/74_M1_3_CONSTRUCTION_PRESENTATION.md` |
| Citizens/workforce | `docs/07_CITIZENS_SOCIETY.md` + `docs/32_AUTOMATIC_WORKFORCE.md` |
| Threat/combat cadence | `docs/08_THREATS_DEFENSE.md` + `docs/34_THREAT_CADENCE.md` + `docs/49_ENEMY_UFO_WAVE_PROGRESSION.md` |
| Offline/anti-idle | `docs/09_OFFLINE_SIMULATION.md` + `docs/42_ANTI_IDLE_PROGRESSION.md` |
| Client/server | `docs/10_CLIENT_SERVER_ARCHITECTURE.md` |
| Living-world automation | `docs/25_AMBIENT_LIFE_SIMULATION.md` + `docs/26_DAILY_SCHEDULES.md` + `docs/30_WORLD_ACTIVITY_DIRECTOR.md` + `docs/47_CITIZEN_ACTOR_CATALOG.md` |
| Traffic | `docs/27_TRAFFIC_AND_TRANSPORT.md` + `docs/73_M1_2_ROAD_ROUTING.md` |
| Parks/social life | `docs/28_PARKS_AND_SOCIAL_LIFE.md` |
| Animals/farms/pets | `docs/29_ANIMALS_FARMS_PETS.md` |
| Visual actor contracts | `docs/31_VISUAL_STATE_CONTRACTS.md` |
| Building catalogue/art | `docs/37_BUILDING_CATALOG_AND_ART.md` |
| Visual identity / anti-clone / world dialect | `docs/79_VISUAL_IDENTITY_VARIATION_SYSTEM.md` + `data/presentation/v0.1/visual_identities.yaml` |
| Visual quality audit / implementation gate | `docs/80_VISUAL_QUALITY_AUDIT_2026-09-21.md` |
| Incidents/maintenance | `docs/38_MAINTENANCE_AND_LOCAL_INCIDENTS.md` |
| Procedural player maps | `docs/39_PROCEDURAL_PLAYER_MAPS.md` |
| Starting world | `docs/40_STARTER_WORLD_AND_EARLY_GAME.md` |
| Terraces/blockers/access | `docs/41_WORLD_CONNECTIVITY_AND_LEVELS.md` |
| Decor/world dressing | `docs/43_DECOR_AND_WORLD_DRESSING.md` + `docs/72_M1_1_DECOR_MODE.md` |
| Seasons/weather | `docs/46_SEASONS_WEATHER_NATURAL_HAZARDS.md` |
| Architecture | `docs/35_LAYERED_ARCHITECTURE.md` |
| Persistence/data contracts | `docs/14_PERSISTENCE_MULTIPLAYER.md` + `docs/20_DATA_CONTRACTS.md` + `docs/76_M1_5_PERSISTENCE_CONCURRENCY_HARDENING.md` |
| Three.js/dependencies | `docs/11_THREEJS_STACK.md` + `docs/18_LIBRARY_REFERENCE_MATRIX.md` |
| Blender/assets | `docs/12_BLENDER_PIPELINE.md` + `docs/19_ASSET_STANDARDS.md` |
| Whistlevale reference | `docs/36_WHISTLEVALE_REFERENCE_AUDIT.md` |
| HUD / combat UI | `docs/50_HUD_COMBAT_UI.md` + `docs/71_HUD_AUDIO_ASSET_PIPELINE.md` |
| Settings / controls / accessibility | `docs/51_SETTINGS_ACCESSIBILITY_CONTROLS.md` |
| Story / campaign | `docs/52_STORY_CAMPAIGN_AND_WORLD_LORE.md` |
| Combat command / deployment / win-loss | `docs/53_COMBAT_COMMAND_DEPLOYMENT_WIN_LOSS.md` |
| Animation / VFX state machines | `docs/54_ANIMATION_VFX_STATE_MACHINES.md` |
| Early combat levels 1–10 | `docs/55_EARLY_COMBAT_SIMULATION_01_10.md` |
| 24h online wave cadence | `docs/56_ONLINE_24H_WAVE_SIMULATION.md` |
| Ambient threat activity | `docs/57_AMBIENT_THREAT_ACTIVITY.md` |
| Long-run integrated simulation | `docs/60_LONG_RUN_SIMULATION_CONTRACT.md` |
| Spatial combat simulation | `docs/61_SPATIAL_COMBAT_SIMULATION_CONTRACT.md` |
| Worldgen validation | `docs/62_WORLDGEN_VALIDATION_CONTRACT.md` |
| Content/schema validation | `docs/63_CONTENT_SCHEMA_VALIDATION.md` |
| Persistence DB contract | `docs/64_PERSISTENCE_DATABASE_CONTRACT.md` |
| Performance budgets | `docs/65_PERFORMANCE_BUDGETS.md` |
| Pre-engineering lock | `docs/66_PRE_ENGINEERING_DESIGN_LOCK.md` |
| M1 runtime quality | `docs/69_M1_RUNTIME_QUALITY_AUDIT.md` |
| Build grid / footprints / Props | `docs/70_BUILD_GRID_FOOTPRINT_PROP_CONTRACT.md` |
| HUD/audio asset pipeline | `docs/71_HUD_AUDIO_ASSET_PIPELINE.md` |
| M1.1 Decor runtime | `docs/72_M1_1_DECOR_MODE.md` |
| M1.2 road routing | `docs/73_M1_2_ROAD_ROUTING.md` |
| M1.3 construction presentation | `docs/74_M1_3_CONSTRUCTION_PRESENTATION.md` |
| M1.4 stress / memory | `docs/75_M1_4_STRESS_MEMORY_AUDIT.md` |
| M1.5 persistence / concurrency | `docs/76_M1_5_PERSISTENCE_CONCURRENCY_HARDENING.md` |
| Studio readiness audit | `docs/58_STUDIO_READINESS_AUDIT_2026-09-21.md` |
| Implementation start gate | `docs/59_IMPLEMENTATION_START_GATE.md` |
| Citizen visual roster | `docs/46_CITIZEN_VISUAL_ROSTER.md` |
| Military roster/art | `docs/47_MILITARY_ROSTER_AND_ART.md` |
| Enemy/UFO roster & wave ladder | `docs/48_ENEMY_UFO_WAVE_LADDER.md` |

## Machine-readable numeric/content authority

When prose disagrees with machine-readable balance/content data, the versioned data wins unless an audit explicitly changes it.

- Building balance: `data/balance/v0.2/buildings.yaml`
- Building footprints/grid: `data/content/v0.2/build_footprints.yaml`
- Prop/decor metadata: `data/content/v0.2/props.yaml`
- Workforce: `data/balance/v0.1/workforce.yaml`
- Tech: `data/balance/v0.1/tech.yaml`
- Threat cadence: `data/balance/v0.1/threats.yaml`
- Combat units: `data/combat/v0.2/defense_units.yaml`
- Combat enemies: `data/combat/v0.2/enemies.yaml`
- Combat waves: `data/combat/v0.2/waves.yaml`
- Combat control/outcomes: `data/combat/v0.2/control.yaml`
- Combat production/readiness: `data/combat/v0.2/production.yaml`
- Combat structure durability/objectives: `data/combat/v0.2/structures.yaml`
- Combat special behaviors: `data/combat/v0.2/special_behaviors.yaml`
- Ambient threat activity: `data/combat/v0.2/ambient_threats.yaml`
- Early combat levels 1–10: `data/combat/v0.2/early_levels_01_10.yaml`
- Legacy building draft: `data/balance/v0.1/buildings.yaml` is DEPRECATED
- Legacy combat draft: `data/balance/v0.1/combat.yaml` is DEPRECATED
- Simulation constants: `data/balance/v0.1/simulation.yaml`
- Citizen visual archetypes: `data/life/v0.1/citizen_archetypes.yaml`
- Visual identity / authored variant presentation: `data/presentation/v0.1/visual_identities.yaml`
- Activity profiles: `data/life/v0.1/activity_profiles.yaml`
- Routine windows: `data/life/v0.1/routines.yaml`
- Ambient life: `data/life/v0.1/ambient.yaml`
- Activity anchors: `data/life/v0.1/anchor_types.yaml`
- Campaign/story: `data/story/v0.1/campaign.yaml`
- Music state/asset slots: `data/audio/v0.1/music.yaml`
- Map generation: `data/world/v0.1/map_generation.yaml`
- Blockers: `data/world/v0.1/blockers.yaml`
- Starter world: `data/world/v0.1/starter_world.yaml`
- Planned buildables: `data/content/v0.1/building_catalog.yaml`
- Prop/decor gameplay: `data/content/v0.2/props.yaml`
- Legacy decor catalog: `data/content/v0.1/decor_catalog.yaml` is DEPRECATED
- Legacy wave draft: `data/balance/v0.1/waves.yaml` is DEPRECATED; use combat v0.2

## Agent rule

Before implementing a subsystem:
1. read this index
2. read `docs/00_CANON.md`
3. read `AGENTS.md`
4. read the authority file(s)
5. read corresponding machine-readable data
6. do not merge superseded rules back into code
