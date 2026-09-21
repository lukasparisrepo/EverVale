# 04 — Economy & Resources

## Strategic resources

### Money
Global financial capacity.

Sources may include taxes, trade, industry, contracts, and events.

Uses:
- construction
- wages/upkeep
- repairs
- imports
- military procurement

### Electricity
Network capacity, not an inventory currency.

Model:
`generation → network → consumers`

Important concepts:
- capacity
- current load
- priority
- disconnected nodes
- reserve margin

### Water
Produced, stored, distributed, consumed.

Model:
`source → treatment/pump → storage → network → consumers`

### Varum
Strategic mined commodity.

Model:
`deposit → mine → raw storage → refinery → refined storage → advanced production`

## Physical commodities

MVP may use a deliberately small set:
- food
- construction goods
- raw Varum
- refined Varum

Do not add dozens of SKUs before the core loop is proven.

## Money model

Early model:

`income - wages - upkeep - imports - repair - construction = net balance`

Taxes should be understandable rather than actuarially realistic.

## Production contract

Every production building declares:
- required workers
- utility demands
- input rates
- output rates
- storage capacity
- operating cost
- failure/idle reasons

## Logistics

Goods move over the road network.

The player does not manually command every delivery. The simulation assigns transport jobs based on demand, priority, capacity, and distance.

## Bottlenecks

The economy becomes interesting through connections:
- enough Varum but no refinery
- enough refinery capacity but no electricity
- enough production but poor roads
- enough buildings but no workers
- enough food but inadequate distribution

## Military economy

Military power must emerge from civilian systems.

Example:

`power + water + money + refined Varum + educated workforce + factory capacity → aircraft`

No “level 15: tank magically appears” progression.
