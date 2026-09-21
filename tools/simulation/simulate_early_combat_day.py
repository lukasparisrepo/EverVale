#!/usr/bin/env python3
"""
EverVale early-combat audit simulator.

Runs:
1. simple 10-level HP/DPS combat sanity tests
2. 24h online major-wave cadence Monte Carlo
3. optional minor-combat cadence

This is an audit tool, not runtime combat.
"""

from __future__ import annotations
import argparse
import math
import random
import statistics
from collections import Counter
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]

def load(rel):
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)

LEVELS = load("data/combat/v0.2/early_levels_01_10.yaml")["levels"]
DEF = load("data/combat/v0.2/defense_units.yaml")["units"]
ENEMY = load("data/combat/v0.2/enemies.yaml")["enemies"]
THREATS = load("data/balance/v0.1/threats.yaml")

def can_hit(target, enemy_class):
    if target == "ground":
        return enemy_class == "ground"
    if target == "ground_and_light_air":
        return enemy_class in ("ground", "light_air")
    if target == "air":
        return enemy_class in ("light_air", "heavy_air", "heavy_air_delivery")
    if target == "air_and_ground":
        return True
    return False

def armor_damage(raw, armor):
    return raw * 100.0 / (100.0 + armor)

def instantiate(table, comp):
    out = []
    for unit_id, count in comp.items():
        for _ in range(count):
            src = dict(table[unit_id])
            src["id"] = unit_id
            src["hp_now"] = float(src["hp"])
            out.append(src)
    return out

def fight(def_comp, enemy_comp, seed, dt=0.5, max_seconds=180):
    rng = random.Random(seed)
    defenders = instantiate(DEF, def_comp)
    enemies = instantiate(ENEMY, enemy_comp)
    initial_hp = sum(u["hp"] for u in defenders)

    t = 0.0
    while t < max_seconds:
        alive_d = [u for u in defenders if u["hp_now"] > 0]
        alive_e = [u for u in enemies if u["hp_now"] > 0]
        if not alive_d or not alive_e:
            break

        pending = []

        for d in alive_d:
            valid = [e for e in alive_e if can_hit(d.get("target", "none"), e["class"])]
            if not valid:
                continue
            # simple threat-priority approximation
            high = max(e.get("dps", 0) for e in valid)
            candidates = [e for e in valid if e.get("dps", 0) >= high * 0.9]
            target = rng.choice(candidates)
            pending.append((target, armor_damage(d.get("dps", 0) * dt, target.get("armor", 0))))

        for e in alive_e:
            target = rng.choice(alive_d)
            pending.append((target, armor_damage(e.get("dps", 0) * dt, target.get("armor", 0))))

        for target, damage in pending:
            target["hp_now"] -= damage

        t += dt

    win = any(u["hp_now"] > 0 for u in defenders) and not any(u["hp_now"] > 0 for u in enemies)
    hp_left = sum(max(0.0, u["hp_now"]) for u in defenders)
    return {
        "win": win,
        "seconds": t,
        "defender_damage_fraction": 1.0 - hp_left / initial_hp if initial_hp else 1.0,
        "disabled_defenders": sum(u["hp_now"] <= 0 for u in defenders),
        "remaining_enemies": sum(u["hp_now"] > 0 for u in enemies),
    }

def simulate_level(level, trials=1000):
    data = LEVELS[level]
    rng = random.Random(10000 + level)
    results = []
    for _ in range(trials):
        template = rng.choice(data["templates"])
        results.append(fight(data["expected_defense"], template, rng.randrange(10**9)))
    return {
        "level": level,
        "win_rate": sum(r["win"] for r in results) / trials,
        "avg_seconds": statistics.mean(r["seconds"] for r in results),
        "avg_defender_damage": statistics.mean(r["defender_damage_fraction"] for r in results),
        "avg_disabled": statistics.mean(r["disabled_defenders"] for r in results),
    }

def pressure(pop, tech, mines):
    return 0.35 + 0.01 * pop + 0.12 * tech + 0.15 * mines

DEFAULT_DAY = [
    (0, 2, 12, 0, 0),
    (2, 6, 18, 1, 1),
    (6, 12, 26, 2, 1),
    (12, 18, 34, 3, 2),
    (18, 24, 44, 4, 2),
]

def state_at_hour(hour, schedule):
    for start, end, pop, tech, mines in schedule:
        if start <= hour < end:
            return pop, tech, mines
    return schedule[-1][2:]

def simulate_major_day(seed, schedule=DEFAULT_DAY):
    rng = random.Random(seed)
    cfg = THREATS["pressure"]
    threshold = rng.uniform(cfg["first_attack_threshold_min"], cfg["first_attack_threshold_max"])
    pressure_now = 0.0
    cooldown = 0
    waves = []

    for cycle in range(24 * 6):
        hour = cycle / 6.0
        pop, tech, mines = state_at_hour(hour, schedule)

        if cooldown > 0:
            cooldown -= 1
            continue

        pressure_now += pressure(pop, tech, mines)

        if pressure_now >= threshold:
            waves.append(hour + 1/6)
            pressure_now = 0.0
            cooldown = cfg["major_attack_cooldown_cycles"]
            threshold = rng.uniform(cfg["normal_threshold_min"], cfg["normal_threshold_max"])

    return waves

def simulate_minor_day(seed, majors):
    rng = random.Random(seed + 987654321)
    cfg = THREATS["online_minor_combat"]
    out = []
    t = rng.uniform(cfg["first_window_hours_min"], cfg["first_window_hours_max"])

    while t < 24 and len(out) < cfg["max_per_24h_online"]:
        if all(abs(t - m) > cfg["suppress_within_hours_of_major_wave"] for m in majors):
            out.append(t)
        t += rng.uniform(cfg["interval_hours_min"], cfg["interval_hours_max"])

    return out

def simulate_days(trials=5000):
    major_counts = []
    minor_counts = []
    totals = []

    for seed in range(trials):
        majors = simulate_major_day(seed)
        minors = simulate_minor_day(seed, majors)
        major_counts.append(len(majors))
        minor_counts.append(len(minors))
        totals.append(len(majors) + len(minors))

    return {
        "major_mean": statistics.mean(major_counts),
        "minor_mean": statistics.mean(minor_counts),
        "total_mean": statistics.mean(totals),
        "total_min": min(totals),
        "total_max": max(totals),
        "distribution": dict(sorted(Counter(totals).items())),
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trials", type=int, default=1000)
    args = ap.parse_args()

    print("EARLY COMBAT LEVELS")
    for level in range(1, 11):
        r = simulate_level(level, args.trials)
        print(
            f"L{level:02d} win={r['win_rate']:.3f} "
            f"damage={r['avg_defender_damage']:.3f} "
            f"disabled={r['avg_disabled']:.2f} "
            f"time={r['avg_seconds']:.1f}s"
        )

    print("\n24H ONLINE CADENCE")
    day = simulate_days(max(1000, args.trials))
    print(day)

if __name__ == "__main__":
    main()
