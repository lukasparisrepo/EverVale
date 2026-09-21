# 44 — Content Authority Index

Status: **CANONICAL NAVIGATION**

When multiple historical documents cover the same subject, the following file is the authoritative source.

| Subject | Authority |
|---|---|
| Product constitution | `docs/00_CANON.md` |
| Economy/resources | `docs/04_ECONOMY_RESOURCES.md` |
| Construction rules | `docs/06_BUILDINGS_CONSTRUCTION.md` |
| Citizen/economy relationship | `docs/07_CITIZENS_SOCIETY.md` + `docs/32_AUTOMATIC_WORKFORCE.md` |
| Threat/combat | `docs/08_THREATS_DEFENSE.md` + `docs/34_THREAT_CADENCE.md` |
| Offline simulation | `docs/09_OFFLINE_SIMULATION.md` + `docs/42_ANTI_IDLE_PROGRESSION.md` |
| Living-world automation | `docs/25_AMBIENT_LIFE_SIMULATION.md` + `docs/26_DAILY_SCHEDULES.md` + `docs/30_WORLD_ACTIVITY_DIRECTOR.md` |
| Traffic | `docs/29_TRAFFIC_AND_VEHICLES.md` |
| Animals/farms/parks | `docs/30_ANIMALS_FARMS_PARKS.md` |
| Building catalogue/art | `docs/37_BUILDING_CATALOG_AND_ART.md` |
| Incidents/maintenance | `docs/38_MAINTENANCE_AND_LOCAL_INCIDENTS.md` |
| Procedural player maps | `docs/39_PROCEDURAL_PLAYER_MAPS.md` |
| Starting world | `docs/40_STARTER_WORLD_AND_EARLY_GAME.md` |
| Terraces/blockers/access | `docs/41_WORLD_CONNECTIVITY_AND_LEVELS.md` |
| Decor/world dressing | `docs/43_DECOR_AND_WORLD_DRESSING.md` |
| Architecture | `docs/35_LAYERED_ARCHITECTURE.md` |
| Whistlevale reference | `docs/36_WHISTLEVALE_REFERENCE_AUDIT.md` |

## Superseded historical topics

Older files with overlapping subjects may remain in Git history or working docs.

They are non-authoritative if they conflict with the table above.

Examples of superseded subjects:
- older World Map Generation notes
- older Building Catalog taxonomy
- older Starting World notes
- older Blockers/Vertical Access notes
- older Traffic notes
- older Animals/Farms/Pets notes
- older Whistlevale audit

## Agent rule

Before implementing a content/system feature:

1. read this index
2. read the authority file(s)
3. read `00_CANON.md`
4. read `AGENTS.md`
5. do not merge contradictory historical rules into implementation

One subject must have one current source of truth.
