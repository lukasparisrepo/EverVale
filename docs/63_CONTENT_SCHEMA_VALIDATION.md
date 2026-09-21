# 63 — Content Schema & Cross-Reference Validation

Status: **CANONICAL DATA GATE**

A typo in content data must fail CI.

## Required checks

### YAML structure
Every canonical file parses, has version, uses expected top-level keys, and rejects duplicate mapping keys.

### Building IDs
All numeric building IDs must exist in data/content/v0.2/buildings.yaml. Starter-world IDs must exist.

### Combat
- enemy IDs referenced by waves exist
- defender IDs referenced by production/buildings exist
- production source building exists
- source Tech Tier <= produced unit Tech Tier
- hard-air enemies do not unlock before hard-air counter availability
- special behavior ID matches enemy declaration

### Tech
Every unlock resolves to a building, combat unit, or explicit upgrade ID. Unknown unlocks fail.

### Living world
Every building activity_profile resolves to an activity profile. Every required anchor type resolves to anchor vocabulary.

### Deprecation
Files marked DO_NOT_USE must never be imported by runtime content loader.

Reference validator: tools/validation/validate_content.py
M0 CI must execute it before unit tests.