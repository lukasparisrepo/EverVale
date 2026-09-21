# 50 — HUD & Combat UI

Status: **CANONICAL UI FLOW v0.1**

## Core principle

The HUD must support two very different moods without becoming two different games:

1. **Cozy town management**
2. **Sudden defense event**

The world remains visible at all times. Combat UI overlays the town; it does not replace it with a separate battle screen.

---

# Normal town HUD

## Top-left — Town identity

Compact:
- Settlement Rating icon
- Tech Tier
- current season
- current weather

No personal citizen names are required.

## Top-center — Core resources

Always visible:

- Money / Treasury cap
- Power: current reserve + net rate
- Water: current reserve + net rate
- Varum / storage cap
- Population / Housing
- Happiness
- Tech progress

Example:

`⚡ 82/120  +6/cycle`

This is more useful than showing raw engineering units.

## Top-right — World status

- clock
- season
- weather icon
- short forecast
- Pause / 1x / 2x / 4x
- alerts button
- settings

Weather Station improves forecast detail.

## Left side — Event stack

Small cards:
- construction complete
- incident
- worker shortage
- Tech milestone
- threat clue
- weather warning
- repair complete

Cards expire unless important.

Critical cards persist.

## Bottom-center — Build / Management bar

Primary categories:

- Roads
- Housing
- Economy
- Utilities
- Education
- Civic
- Rural
- Varum
- Service
- Defense
- Decor

The bar opens a drawer rather than covering the world with dozens of buttons.

## Bottom-right — Mode tools

- Select
- Build
- Roads
- Demolish
- Overlay
- Defense Planning

## Inspector panel

When selecting an entity:

### Building
- display name
- operational state
- workers
- Power/Water
- income/output
- condition
- current incident
- repair/priority
- activity status

### Citizen
- age/role icon
- home
- workplace/school
- current routine
- simple Happiness state

No biography wall.

### Military unit
- role
- HP
- readiness
- assigned sector
- target capability
- repair state

---

# Threat warning HUD

A major wave does **not** show:

`ATTACK IN 02:00`

Instead, warning escalates.

Possible sequence:

1. unusual activity
2. direction clue
3. threat class clue
4. Radar contact
5. siren / contact

## Warning presentation

Top-center temporary banner:

**Movement detected beyond East Ridge**

Later:

**Radar contact — light air signatures**

Player receives information, not an exact timer.

## Defense Planning panel

Before contact or during warning:

- doctrine
- protected priority
- rally sectors
- unit readiness
- air/ground coverage

Example:

```
Doctrine: BALANCED
Primary protection: CIVIC CORE
Ground coverage: STRONG
Air coverage: WEAK
Mobile reserve: 2 units
```

The HUD never needs to reveal a fake exact “92% win chance.”

Use qualitative assessment:
- Weak
- Fair
- Strong
- Overwhelming

---

# Combat HUD

When hostile contact becomes active:

- simulation speed automatically drops to maximum 1x
- optional setting can auto-pause once at first contact
- camera stays under player control

## Top-center

Wave state:

`EAST RIDGE — MIXED CONTACT`

Under it:

- hostile strength bar
- town defense integrity bar
- wave phase indicator if multi-phase

No exact enemy spawn timer for unrevealed phases.

## Left combat feed

Examples:
- Oakwatch Guards deployed
- Northlight Watchtower engaging
- Hill Gate breached
- Armored Car disabled
- Cloudstep Fighter airborne
- Civilians reached shelter
- Aurora Ward activated

Keep it concise.

## Bottom-center emergency commands

Maximum 4–5 buttons:

### HOLD CORE
Bias mobile defenders toward Hearth Hall / critical utilities.

### INTERCEPT AIR
Bias air/AA toward flying threats.

### PROTECT VARUM
Bias response toward Varum infrastructure.

### FALL BACK
Withdraw damaged mobile units to repair/safe zone.

### ACTIVATE WARD
Manual activation for Varum Shield if available.

These are **doctrine overrides**, not StarCraft unit micro.

## Map/sector overlay

During combat, optional overlay shows:

- attack corridor
- active threat sectors
- defender sectors
- damaged access routes
- civilian shelter flow

Avoid individual path spaghetti.

---

# Battle result panel

Three outcome families:

## REPELLED — CLEAN
- town objective intact
- low damage
- no critical service disabled

## REPELLED — COSTLY
- wave defeated
- meaningful casualties/damage
- one or more services/units disabled

## BREACHED
- hostile wave completed its objective
- town remains playable
- repair/recovery state begins

Show:

- attackers defeated/escaped
- guards injured
- vehicles disabled
- structures damaged
- Money repair estimate
- Varum lost/stolen if event allows
- salvage/reward
- Happiness/Safety impact

One button:

**Return to Town**

No forced loot chest sequence.

---

# Notifications

Priority classes:

P0:
- active attack
- Power reserve exhausted
- Water reserve exhausted
- critical access disconnected

P1:
- major incident
- Tech decision waiting
- critical repair complete
- severe weather

P2:
- construction complete
- population growth
- minor incident resolved

P3:
- flavor/life events

---

# Mobile

Mobile must not copy desktop 1:1.

Combat:
- bottom quick-command wheel
- swipe/select sector
- large alert banner
- compact resource top bar

Build mode:
- category drawer
- two-finger camera
- clear confirm/cancel placement

---

# UI performance

HUD uses React.

Three.js scene owns world-space indicators.

Do not create a React component for every visible citizen/animal.

World-space combat markers should be pooled/capped.
