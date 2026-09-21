#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
import argparse
import random
import statistics
import yaml

ROOT = Path(__file__).resolve().parents[2]

def load(rel):
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)

BUILDINGS = load("data/balance/v0.2/buildings.yaml")["buildings"]
SIM = load("data/balance/v0.1/simulation.yaml")
TECH = load("data/balance/v0.1/tech.yaml")["tiers"]

@dataclass
class World:
    population: int = 12
    housing: int = 12
    money: float = 1200
    money_cap: float = 5000
    power: float = 60
    power_cap: float = 120
    water: float = 60
    water_cap: float = 120
    varum: float = 0
    varum_cap: float = 0
    tech: float = 0
    tech_tier: int = 0
    happiness: float = 80
    growth: float = 0
    buildings: dict[str, int] = field(default_factory=lambda: {
        "town_center": 1,
        "house_small": 3,
        "power_plant": 1,
        "water_plant": 1,
        "workshop": 1,
    })

def add_building(w, bid, n=1):
    w.buildings[bid] = w.buildings.get(bid, 0) + n
    b = BUILDINGS[bid]
    w.money_cap += b.get("money_cap_add", 0) * n
    w.power_cap += b.get("power_cap_add", 0) * n
    w.water_cap += b.get("water_cap_add", 0) * n
    w.varum_cap += b.get("varum_cap_add", 0) * n
    w.housing += b.get("housing_add", 0) * n

def workforce(w):
    return int(w.population * 0.75)

def allocate(w):
    requests = []
    for bid, n in w.buildings.items():
        b = BUILDINGS[bid]
        workers = int(b.get("workers", 0))
        for i in range(n):
            if workers:
                requests.append((int(b.get("priority", 0)), bid, workers))
    requests.sort(reverse=True)
    left = workforce(w)
    assigned = {}
    for _, bid, need in requests:
        got = min(left, need)
        assigned[bid] = assigned.get(bid, 0) + got
        left -= got
        if left <= 0:
            break
    return assigned

def step(w, rng):
    assigned = allocate(w)
    pprod = wprod = money_income = tech_gain = varum_gain = 0.0
    p_use = w_use = upkeep = 0.0
    edu = rec = safety = 0.0

    for bid, count in w.buildings.items():
        b = BUILDINGS[bid]
        need = max(1, int(b.get("workers", 0)))
        total_assigned = assigned.get(bid, 0)
        frac = 1.0 if b.get("workers", 0) == 0 else min(1.0, total_assigned / max(1, need * count))
        pprod += b.get("power_production", 0) * count * frac
        wprod += b.get("water_production", 0) * count * frac
        money_income += b.get("money_per_worker", 0) * total_assigned
        tech_gain += b.get("tech_production", 0) * count * frac
        varum_gain += b.get("varum_production", 0) * count * frac
        p_use += b.get("power_use", 0) * count * frac
        w_use += b.get("water_use", 0) * count * frac
        upkeep += b.get("upkeep", 0) * count
        edu += b.get("education_coverage_add", 0) * count * frac
        rec += b.get("recreation_coverage_add", 0) * count * frac
        safety += b.get("safety_add", 0) * count * frac

    p_use += w.population * 0.50
    w_use += w.population * 0.75

    w.power = max(0, min(w.power_cap, w.power + pprod - p_use))
    w.water = max(0, min(w.water_cap, w.water + wprod - w_use))
    power_sat = 1.0 if p_use <= 0 else min(1.0, (pprod + w.power) / p_use)
    water_sat = 1.0 if w_use <= 0 else min(1.0, (wprod + w.water) / w_use)

    w.money = max(0, min(w.money_cap, w.money + money_income - upkeep))
    if w.varum_cap > 0:
        w.varum = min(w.varum_cap, w.varum + varum_gain)

    next_tier = min(5, w.tech_tier + 1)
    threshold = TECH.get(next_tier, {}).get("threshold", 10**9)
    gate = next_tier >= 2
    if not gate or w.tech < threshold:
        w.tech += tech_gain
    if w.tech_tier == 0 and w.tech >= TECH[1]["threshold"]:
        w.tech_tier = 1

    employment = min(1.0, sum(assigned.values()) / max(1, workforce(w)))
    housing_sat = min(1.0, w.housing / max(1, w.population))
    target_h = 20 + 20*power_sat + 20*water_sat + 15*employment + 10*housing_sat + 5*min(1, edu) + 5*min(1, rec) + 10*min(1, 0.5+safety)
    w.happiness += (max(0, min(100, target_h)) - w.happiness) * 0.25

    if w.happiness >= 65 and w.population < w.housing:
        occupied_houses = w.buildings.get("house_small", 0) + w.buildings.get("house_medium", 0) + w.buildings.get("row_housing", 0)
        gain = 0.08 * occupied_houses * max(0, min(1, (w.happiness-60)/40))
        w.growth += min(0.25, gain)
        while w.growth >= 1 and w.population < w.housing:
            w.population += 1
            w.growth -= 1

    # Lightweight incident/repair pressure proxy for long-run balance.
    condition_pressure = 0.0
    if power_sat < 0.8 or water_sat < 0.8:
        condition_pressure += 0.04
    if rng.random() < 0.015 + condition_pressure:
        cost = rng.uniform(5, 30)
        w.money = max(0, w.money - cost)

def scenario(name):
    w = World()
    if name == "healthy":
        add_building(w, "house_small")
        add_building(w, "school")
        add_building(w, "park")
        add_building(w, "guard_post")
    elif name == "overexpanded":
        add_building(w, "house_small", 2)
        add_building(w, "school", 2)
        add_building(w, "park", 2)
        add_building(w, "restaurant", 2)
        add_building(w, "guard_post")
    elif name == "varum":
        add_building(w, "house_small", 2)
        add_building(w, "school")
        add_building(w, "park")
        add_building(w, "guard_post")
        w.tech_tier = 1
        w.tech = 40
        add_building(w, "varum_mine")
    return w

def run(hours, seed, name):
    rng = random.Random(seed)
    w = scenario(name)
    cycles = int(hours * 6)
    for _ in range(cycles):
        step(w, rng)
    return w

def summarize(name, hours, trials):
    worlds = [run(hours, i, name) for i in range(trials)]
    return {
        "scenario": name,
        "hours": hours,
        "population_median": statistics.median(w.population for w in worlds),
        "money_median": round(statistics.median(w.money for w in worlds), 1),
        "power_median": round(statistics.median(w.power for w in worlds), 1),
        "water_median": round(statistics.median(w.water for w in worlds), 1),
        "happiness_median": round(statistics.median(w.happiness for w in worlds), 1),
        "tech_median": round(statistics.median(w.tech for w in worlds), 1),
        "varum_median": round(statistics.median(w.varum for w in worlds), 1),
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trials", type=int, default=500)
    args = ap.parse_args()
    for name in ("starter", "healthy", "overexpanded", "varum"):
        for hours in (2, 8, 24, 48, 168):
            print(summarize(name, hours, args.trials))

if __name__ == "__main__":
    main()
