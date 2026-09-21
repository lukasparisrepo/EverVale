# 29 — Animals, Farms & Pets

## Design rule

Animals should make EverVale warm and memorable without becoming another management spreadsheet.

## Pets

Cats and dogs may belong to households automatically.

Server may store only:
- household id
- pet type
- stable seed

Client handles exact appearance and movement.

### Cat behavior
- sleep near house
- sit on wall/window
- wander nearby
- occasionally visit garden/park

### Dog behavior
- idle near home
- follow owner
- walk through park
- react to sirens/threats

## Farm animals

Approved ambient species:
- chickens
- ducks
- cows
- sheep
- goats

Animals stay inside logical farm/pond zones.

Example loops:
- chicken: wander → peck → idle
- duck: walk → swim → group idle
- cow/sheep: graze → move → rest

## Wildlife

Possible:
- birds
- rabbits
- squirrels
- butterflies
- deer near map edge

Most wildlife is presentation-side.

## Farm gameplay

Do not introduce food as a core resource merely because farms exist.

A Farm can later provide:
- Money
- Happiness
- visual identity
- optional specialty production

without breaking the four-resource core.

## Threat response

During danger:
- pets head home
- farm animals cluster near barn/safe anchor
- wildlife flees outward

This makes attacks emotionally visible.
