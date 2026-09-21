# 20 — Core Data Contracts

Conceptual contracts; final TypeScript schemas must be versioned and validated.

## World

```
World {
  worldId
  ownerId
  seed
  revision
  simulationVersion
  lastSimulatedAt
  simulationLease?
  speed: 0 | 1 | 2 | 4
  state: ACTIVE | WARM | COLD
}
```

## ResourceState

```
ResourceState {
  money
  moneyCap
  power
  powerCap
  water
  waterCap
  varum
  varumCap
  techPoints
  techTier
}
```

## SocietyState

```
SocietyState {
  population
  housingCapacity
  workforce
  happiness
  growthProgress
  educationCoverage
  recreationCoverage
  safety
}
```

## BuildingInstance

```
BuildingInstance {
  id
  definitionId
  position
  rotation
  connectedRoadNode?
  constructionState
  damageState
  workersAssigned
  priority
  operationalFactor
  operationalReasons[]
}
```

## RoadSegment

```
RoadSegment {
  id
  roadType
  controlPoints[]
  endpointNodes[]
  traversalCost
  revision
}
```

Server stores canonical topology, not render triangles.

## CitizenPresentationState

```
CitizenPresentationState {
  citizenId
  homeBuildingId
  jobBuildingId?
  logicalState
  destinationId?
}
```

The economic model can remain aggregate even while individual visible citizens exist.

## ThreatState

```
ThreatState {
  hiddenPressure
  hiddenThreshold
  cooldownUntil?
  seed
  activeSignals[]
  activeIncident?
  lastResolvedAt?
}
```

Hidden threshold is never serialized to ordinary clients.

## WorldCommand

```
WorldCommand {
  commandId
  worldId
  userId
  expectedRevision?
  type
  payload
}
```

## WorldEvent

```
WorldEvent {
  id
  eventType
  happenedAt
  severity
  entityIds[]
  data
  playerSummary
}
```

## Versioning

Persist:
- schema version
- simulation version
- balance-data version
- asset-data version

Never load a save with silent balance/schema reinterpretation.
