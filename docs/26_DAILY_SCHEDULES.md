# 26 — Automated Daily Schedules

## Visual day

Target visual day at 1x: **24 real minutes**.

Schedules are staggered with seeded offsets so the town never moves like synchronized robots.

## Adult day worker

Typical:
- 06:30–07:30 wake/home
- 07:30–08:30 commute
- 08:30–12:00 work
- 12:00–13:00 break
- 13:00–17:00 work
- 17:00–18:00 commute
- 18:00–21:00 park/shop/social/home
- 21:00–06:30 home/sleep

Seeded jitter: ±10–25 visual minutes.

## Child

Typical:
- 07:00–08:00 home
- 08:00–09:00 school commute
- 09:00–15:30 school
- 15:30–18:00 play/park/home
- 18:00–21:00 home
- 21:00–07:00 sleep

## Shift jobs

Guards, utilities and later advanced industry may use alternate shifts.

## Automation

Assignments are automatic.

If a workplace has vacancies and a reachable worker exists, the scheduler may assign them according to job priority.

If school exists and is reachable, eligible children attend automatically.

## Failure behavior

If a route breaks:
- citizen does not teleport
- activity fails or falls back
- server records cause
- relevant Happiness/employment/service effects can apply
