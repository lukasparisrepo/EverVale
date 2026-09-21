# 33 — Automation Design Constitution

## Player fantasy

The player is a **builder and planner**, not a dispatcher.

The town should keep functioning while watched, while zoomed elsewhere, and while the player is logged out.

## What is automatic

Automatically handled:
- residents appearing through Growth
- housing assignment
- job assignment
- school attendance
- commute
- leisure
- parks
- pets
- farm-animal ambient life
- civilian traffic
- utility production
- Tech production
- Varum production
- guard response
- target selection
- repairs when funded/authorized
- offline progression

## What the player decides

Player decides:
- where to build
- what to build
- road layout
- town expansion
- category priorities
- how much housing
- how much Power/Water capacity
- whether to invest in School/Tech
- whether to mine Varum
- how much defense to maintain
- where defenses are placed
- which technology/building to unlock/build after reaching requirements

## Design test

Before adding a manual control ask:

> Does this decision change strategy, or is it repetitive administration?

If it is repetitive administration, automate it.

## Visible automation

Automation must be visible.

Examples:
- worker is not an invisible +8 Money modifier; the player can see people entering the Workshop.
- School is not merely +4 Tech; children visibly arrive.
- Park Happiness is shown by people actually using the park.
- Guard Post means guards visibly patrol/respond.
- Water/Power shortage visibly changes buildings and citizen behavior.

## No idle-click economy

Avoid mechanics where the optimal play is repeatedly clicking:
- collect Money
- collect Water
- collect Power
- collect Varum

Resources flow automatically while capacity exists.

The player's interaction is planning, not harvesting icons.
