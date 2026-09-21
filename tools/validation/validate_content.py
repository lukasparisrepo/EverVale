#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import sys
import yaml

ROOT = Path(__file__).resolve().parents[2]

class UniqueKeyLoader(yaml.SafeLoader):
    pass

def construct_mapping(loader, node, deep=False):
    mapping = {}
    for key_node, value_node in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in mapping:
            raise ValueError(f"duplicate key: {key}")
        mapping[key] = loader.construct_object(value_node, deep=deep)
    return mapping

UniqueKeyLoader.add_constructor(
    yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG,
    construct_mapping,
)

def load(rel):
    p = ROOT / rel
    with p.open("r", encoding="utf-8") as f:
        data = yaml.load(f, Loader=UniqueKeyLoader)
    if not isinstance(data, dict):
        raise ValueError(f"{rel}: expected mapping")
    if "version" not in data:
        raise ValueError(f"{rel}: missing version")
    return data

def fail(errors, msg):
    errors.append(msg)

def main():
    errors = []

    content = load("data/content/v0.2/buildings.yaml")["buildings"]
    balance = load("data/balance/v0.2/buildings.yaml")["buildings"]
    starter = load("data/world/v0.1/starter_world.yaml")
    incidents = load("data/incidents/v0.1/incidents.yaml")["incidents"]
    tech = load("data/balance/v0.1/tech.yaml")["tiers"]
    defenders = load("data/combat/v0.2/defense_units.yaml")["units"]
    enemies = load("data/combat/v0.2/enemies.yaml")["enemies"]
    production = load("data/combat/v0.2/production.yaml")["production"]
    special = load("data/combat/v0.2/special_behaviors.yaml")["behaviors"]
    early = load("data/combat/v0.2/early_levels_01_10.yaml")["levels"]
    footprint_data = load("data/content/v0.2/build_footprints.yaml")
    footprints = footprint_data["footprints"]
    props = load("data/content/v0.2/props.yaml")["props"]

    content_ids = set(content)
    balance_ids = set(balance)
    defender_ids = set(defenders)
    enemy_ids = set(enemies)

    missing_balance = sorted(content_ids - balance_ids)
    missing_content = sorted(balance_ids - content_ids)
    if missing_balance:
        fail(errors, f"content buildings without numeric balance: {missing_balance}")
    if missing_content:
        fail(errors, f"numeric buildings without content definition: {missing_content}")

    footprint_ids = set(footprints)
    missing_footprints = sorted(content_ids - footprint_ids)
    orphan_footprints = sorted(footprint_ids - content_ids)
    if missing_footprints:
        fail(errors, f"buildings without footprint metadata: {missing_footprints}")
    if orphan_footprints:
        fail(errors, f"footprints without building definition: {orphan_footprints}")

    grid_cell = footprint_data.get("grid_cell_meters")
    if not isinstance(grid_cell, (int, float)) or grid_cell <= 0:
        fail(errors, "grid_cell_meters must be positive")

    for bid, footprint in footprints.items():
        x = footprint.get("cells_x")
        z = footprint.get("cells_z")
        if not isinstance(x, int) or not isinstance(z, int) or x <= 0 or z <= 0:
            fail(errors, f"invalid footprint for {bid}: cells_x/cells_z must be positive integers")

    for pid, pdef in props.items():
        title = pdef.get("title")
        sx = pdef.get("size_x_m")
        sz = pdef.get("size_z_m")
        if not isinstance(title, str) or not title.strip():
            fail(errors, f"prop {pid} missing title")
        if not isinstance(sx, (int, float)) or sx <= 0:
            fail(errors, f"prop {pid} invalid size_x_m")
        if not isinstance(sz, (int, float)) or sz <= 0:
            fail(errors, f"prop {pid} invalid size_z_m")

    for bid in starter["starting_buildings"]:
        if bid not in content_ids:
            fail(errors, f"starter building missing content definition: {bid}")
        if bid not in balance_ids:
            fail(errors, f"starter building missing numeric balance: {bid}")

    world_object_ids = {
        "road_dirt", "road_stone", "road_main", "bridge", "hill_lift",
        "service_tunnel", "water_available", "maintenance", "builders_yard",
        "service_yard", "farm_workers", "spare_power_capacity", "clinic",
        "research_lab", "radar",
    }
    for iid, idef in incidents.items():
        for bid in idef.get("eligible", []):
            if bid not in content_ids and bid not in world_object_ids:
                fail(errors, f"incident {iid} references unknown eligible id: {bid}")

    for uid, pdef in production.items():
        if uid not in defender_ids:
            fail(errors, f"production references unknown defender: {uid}")
        src = pdef.get("source")
        if src and src not in content_ids:
            fail(errors, f"production {uid} source missing building: {src}")
        if src in content_ids:
            src_tier = int(content[src].get("tech_tier", 0))
            unit_tier = int(pdef.get("tech_tier", defenders.get(uid, {}).get("tier", 0)))
            if src_tier > unit_tier:
                fail(errors, f"production source unlocks after unit: {uid} source={src}")

    for eid in special:
        if eid not in enemy_ids and eid != "mothership_fragment":
            fail(errors, f"special behavior has no enemy: {eid}")

    for level, ldef in early.items():
        for eid in ldef.get("enemy_pool", []):
            if eid not in enemy_ids:
                fail(errors, f"early level {level} unknown enemy: {eid}")
        for template in ldef.get("templates", []):
            for eid in template:
                if eid not in enemy_ids:
                    fail(errors, f"early level {level} template unknown enemy: {eid}")
        for uid in ldef.get("expected_defense", {}):
            if uid not in defender_ids:
                fail(errors, f"early level {level} unknown defender: {uid}")

    unlockables = content_ids | defender_ids | {
        "ranger_training", "heavy_guard_training", "motor_pool",
        "heavy_hangar", "ufo_interceptor", "beam_tank",
    }
    for tier, tdef in tech.items():
        for unlock in tdef.get("unlocks", []):
            if unlock not in unlockables:
                fail(errors, f"tech tier {tier} unknown unlock: {unlock}")

    deprecated = [
        "data/balance/v0.1/buildings.yaml",
        "data/balance/v0.1/combat.yaml",
        "data/balance/v0.1/waves.yaml",
        "data/worldgen/v0.1/generation.yaml",
        "data/content/v0.1/decor_catalog.yaml",
    ]
    for rel in deprecated:
        data = load(rel)
        if data.get("status") != "DO_NOT_USE":
            fail(errors, f"deprecated SSOT not marked DO_NOT_USE: {rel}")

    if errors:
        print("CONTENT VALIDATION FAILED")
        for e in errors:
            print(" -", e)
        return 1

    print("CONTENT VALIDATION PASS")
    print(f" buildings={len(content_ids)} footprints={len(footprint_ids)} props={len(props)} defenders={len(defender_ids)} enemies={len(enemy_ids)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
