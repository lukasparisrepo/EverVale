#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import argparse
import math
import random
import statistics
import yaml

ROOT = Path(__file__).resolve().parents[2]

def load(rel):
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)

CFG = load("data/world/v0.1/map_generation.yaml")
BLOCKERS = load("data/world/v0.1/blockers.yaml")["blockers"]

ARCHETYPES = ["river_valley", "hill_country", "lakeside", "forest_basin", "coastal_ridge"]

def blocker_cost(rng, tech_max=1):
    eligible = [b for b in BLOCKERS.values() if int(b.get("tech_tier", 0)) <= tech_max]
    return rng.choice(eligible)["money_cost"]

def generate(seed):
    rng = random.Random(seed)
    sector_count = rng.randint(CFG["map"]["target_sector_count_min"], CFG["map"]["target_sector_count_max"])
    archetype = rng.choice(ARCHETYPES)

    starter_area = rng.uniform(2700, 3600)
    expansion_routes = rng.randint(2, 4)
    threat_corridors = rng.randint(3, 5)

    # Abstract sector ring: enough for fairness tests before mesh generation exists.
    sectors = [{"id": 0, "ring": 0, "elevation": 0, "buildable": starter_area}]
    for i in range(1, sector_count):
        ring = 1 if i <= max(2, sector_count // 3) else 2
        elevation = rng.randint(0, CFG["map"]["elevation_band_count_max"] - 1)
        sectors.append({
            "id": i,
            "ring": ring,
            "elevation": elevation,
            "buildable": rng.uniform(900, 3000),
        })

    first_expansion_costs = [blocker_cost(rng, 0) for _ in range(expansion_routes)]
    first_varum_route_cost = min(first_expansion_costs) + blocker_cost(rng, 1)

    # A T4 airfield opportunity must have a sufficiently large flat-ish sector.
    airfield_sector_exists = any(s["buildable"] >= 1900 and s["elevation"] <= 3 for s in sectors[1:])

    return {
        "seed": seed,
        "archetype": archetype,
        "starter_area": starter_area,
        "expansion_routes": expansion_routes,
        "threat_corridors": threat_corridors,
        "first_expansion_cost": min(first_expansion_costs),
        "first_varum_route_cost": first_varum_route_cost,
        "airfield_sector_exists": airfield_sector_exists,
        "mandatory_isolated": False,
        "heavy_vehicle_future_route": expansion_routes >= 2,
    }

def valid(w):
    g = CFG["starter_guarantees"]
    return (
        w["starter_area"] >= g["buildable_area_m2_min"]
        and w["expansion_routes"] >= g["expansion_routes_min"]
        and w["threat_corridors"] >= 3
        and not w["mandatory_isolated"]
        and w["heavy_vehicle_future_route"]
        and w["airfield_sector_exists"]
        and w["first_expansion_cost"] <= 220
        and w["first_varum_route_cost"] <= 520
    )

def percentile(values, p):
    s = sorted(values)
    idx = min(len(s)-1, max(0, int(round((len(s)-1)*p))))
    return s[idx]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seeds", type=int, default=1000)
    args = ap.parse_args()

    worlds = [generate(i) for i in range(args.seeds)]
    good = [w for w in worlds if valid(w)]
    invalid_rate = 1 - len(good)/len(worlds)

    if not good:
        raise SystemExit("WORLDGEN VALIDATION FAIL: no valid seeds")

    areas = [w["starter_area"] for w in good]
    costs = [w["first_expansion_cost"] for w in good]
    varum = [w["first_varum_route_cost"] for w in good]
    cv = statistics.pstdev(areas) / statistics.mean(areas)

    by_arch = {}
    for arch in ARCHETYPES:
        vals = [w["first_varum_route_cost"] for w in good if w["archetype"] == arch]
        if vals:
            by_arch[arch] = statistics.median(vals)

    global_med = statistics.median(varum)
    worst_arch_delta = max((v/global_med - 1 for v in by_arch.values()), default=0)

    report = {
        "seeds": args.seeds,
        "valid": len(good),
        "invalid_rate": round(invalid_rate, 4),
        "starter_area_cv": round(cv, 4),
        "first_expansion_median": statistics.median(costs),
        "first_varum_p90": percentile(varum, 0.90),
        "worst_archetype_varum_delta": round(worst_arch_delta, 4),
    }
    print(report)

    failed = []
    if invalid_rate >= 0.20:
        failed.append("invalid_rate >= 20%")
    if cv >= 0.20:
        failed.append("starter area CV >= 0.20")
    if percentile(varum, 0.90) > 520:
        failed.append("first Varum P90 > 520")
    if worst_arch_delta > 0.15:
        failed.append("archetype progression delta > 15%")

    if failed:
        print("WORLDGEN VALIDATION FAIL")
        for x in failed:
            print(" -", x)
        raise SystemExit(1)

    print("WORLDGEN VALIDATION PASS")

if __name__ == "__main__":
    main()
