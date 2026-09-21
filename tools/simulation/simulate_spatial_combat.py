#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
import argparse
import heapq
import random
import statistics
import yaml

ROOT = Path(__file__).resolve().parents[2]

def load(rel):
    with (ROOT / rel).open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)

DEF = load("data/combat/v0.2/defense_units.yaml")["units"]
ENEMY = load("data/combat/v0.2/enemies.yaml")["enemies"]
LEVELS = load("data/combat/v0.2/early_levels_01_10.yaml")["levels"]

LAYOUTS = {
    "compact": {
        "edges": {
            "core": {"east": 35, "west": 30, "north": 28},
            "east": {"core": 35},
            "west": {"core": 30},
            "north": {"core": 28},
        },
        "defender_home": "core",
        "objective": "core",
    },
    "stretched": {
        "edges": {
            "core": {"mid": 55},
            "mid": {"core": 55, "east": 55, "west": 50, "north": 60},
            "east": {"mid": 55},
            "west": {"mid": 50},
            "north": {"mid": 60},
        },
        "defender_home": "core",
        "objective": "core",
    },
    "chokepoint": {
        "edges": {
            "core": {"gate": 22},
            "gate": {"core": 22, "east": 25, "west": 25, "north": 30},
            "east": {"gate": 25},
            "west": {"gate": 25},
            "north": {"gate": 30},
        },
        "defender_home": "core",
        "objective": "core",
        "gate_delay_seconds": 8,
    },
}

def shortest(edges, start, end):
    q = [(0.0, start)]
    dist = {start: 0.0}
    while q:
        d, n = heapq.heappop(q)
        if n == end:
            return d
        if d != dist[n]:
            continue
        for nxt, w in edges.get(n, {}).items():
            nd = d + w
            if nd < dist.get(nxt, 1e18):
                dist[nxt] = nd
                heapq.heappush(q, (nd, nxt))
    return 1e9

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

def mitigation(raw, armor):
    return raw * 100.0 / (100.0 + armor)

def instantiate(table, comp, side, entry=None):
    out = []
    for uid, count in comp.items():
        for _ in range(count):
            d = dict(table[uid])
            d["id"] = uid
            d["side"] = side
            d["hp_now"] = float(d["hp"])
            d["ready_at"] = 0.0
            d["entry"] = entry
            out.append(d)
    return out

def simulate(level, layout_name, seed, doctrine="BALANCED", dt=0.5, max_t=180):
    rng = random.Random(seed)
    layout = LAYOUTS[layout_name]
    ldef = LEVELS[level]
    template = rng.choice(ldef["templates"])
    entry = rng.choice(["east", "west", "north"])
    attackers = instantiate(ENEMY, template, "enemy", entry=entry)
    defenders = instantiate(DEF, ldef["expected_defense"], "def")

    distance = shortest(layout["edges"], layout["defender_home"], entry)
    for d in defenders:
        speed = float(d.get("move_speed_mps", 0))
        if speed <= 0:
            # Static defense assumed positioned to cover the relevant sector in this audit.
            d["ready_at"] = 0.0
        else:
            doctrine_mult = 0.85 if doctrine == "OUTER_DEFENSE" else 1.0
            d["ready_at"] = (distance * doctrine_mult) / speed

    objective_progress = 0.0
    initial_def_hp = sum(x["hp"] for x in defenders)
    t = 0.0

    while t < max_t:
        ad = [x for x in defenders if x["hp_now"] > 0 and x["ready_at"] <= t]
        ae = [x for x in attackers if x["hp_now"] > 0]
        if not ae:
            break

        pending = []
        for d in ad:
            valid = [e for e in ae if can_hit(d.get("target", "none"), e["class"])]
            if not valid:
                continue
            # Doctrine preference only changes target selection, not hidden damage.
            if doctrine == "HOLD_CORE":
                valid.sort(key=lambda e: (e.get("dps", 0), e.get("hp_now", 0)), reverse=True)
                target = valid[0]
            else:
                target = rng.choice(valid)
            pending.append((target, mitigation(d.get("dps", 0) * dt, target.get("armor", 0))))

        if ad:
            for e in ae:
                target = rng.choice(ad)
                pending.append((target, mitigation(e.get("dps", 0) * dt, target.get("armor", 0))))
        else:
            objective_progress += sum(e.get("dps", 0) for e in ae) * dt * 0.12

        gate_delay = layout.get("gate_delay_seconds", 0)
        if gate_delay and t < gate_delay:
            objective_progress = max(0.0, objective_progress - 0.5 * dt)

        for target, dmg in pending:
            target["hp_now"] -= dmg

        if objective_progress >= 100:
            break
        t += dt

    alive_enemies = sum(x["hp_now"] > 0 for x in attackers)
    hp_left = sum(max(0, x["hp_now"]) for x in defenders)
    damage_fraction = 1 - hp_left / initial_def_hp if initial_def_hp else 1
    breach = objective_progress >= 100
    repel = alive_enemies == 0 and not breach

    if repel and damage_fraction < 0.25:
        outcome = "CLEAN"
    elif repel:
        outcome = "COSTLY"
    else:
        outcome = "BREACH"

    return outcome, damage_fraction, t

def run(level, layout, trials):
    results = [simulate(level, layout, i + level * 100000) for i in range(trials)]
    counts = {k: sum(1 for r in results if r[0] == k) for k in ("CLEAN","COSTLY","BREACH")}
    return {
        "level": level,
        "layout": layout,
        "clean": counts["CLEAN"] / trials,
        "costly": counts["COSTLY"] / trials,
        "breach": counts["BREACH"] / trials,
        "damage": statistics.mean(r[1] for r in results),
        "time": statistics.mean(r[2] for r in results),
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trials", type=int, default=1000)
    args = ap.parse_args()
    for level in range(1, 11):
        for layout in ("compact","stretched","chokepoint"):
            print(run(level, layout, args.trials))

if __name__ == "__main__":
    main()
