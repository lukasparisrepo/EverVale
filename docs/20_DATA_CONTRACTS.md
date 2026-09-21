# 20 — Core Data Contracts

Conceptual contracts; final TypeScript schemas must be versioned and validated.

## World

```
World {
  worldId
  ownerId

  worldSeed
  worldGeneratorVersion
  schemaVersion
  simulationVersion
  balanceVersion

  revision
  createdAt
  lastSimulatedAt
  simulationLease?

  speed: 0 | 1 | 2 | 4
  state: ACTIVE | WARM | COLD
}
```

## GeneratedWorldState

```
GeneratedWorldState {
  terrainSignature
  sectorIds[]
  terraceIds[]
  depositIds[]
  threatEntryIds[]
  decorSeed
}
```

Generated base topology is versioned by `worldGeneratorVersion`.

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
  terraceId

  accessNodeId?

  constructionState
  condition?
  damageState
  incidentState?

  workersAssigned
  priority
  operationalFactor
  operationalReasons[]
}
```

## AccessNode

```
AccessNode {
  id
  kind
  position
  terraceId
}
```

## AccessEdge

```
AccessEdge {
  id
  type: ROAD | PATH | STAIR | BRIDGE | LIFT | TUNNEL

  fromNodeId
  toNodeId

  traversalCost
  allowedActorClasses[]
  capacityHint?

  operationalState
  emergencyMode?
  revision
}
```

## RoadGeometry

Rendering/edit geometry is stored separately from graph semantics where useful.

```
RoadGeometry {
  edgeId
  roadType
  controlPoints[]
}
```

Server stores canonical topology, not render triangles.

## BlockerState

```
BlockerState {
  blockerId
  definitionId
  sectorId
  position

  state: PRESENT | CLEARING | CLEARED
  clearProgress?
  queuedTaskId?
}
```

## DepositState

```
DepositState {
  depositId
  kind: VARUM
  position
  discovered
  depleted?: false
}
```

Core Varum deposits are not required to deplete in v0.1.

## CitizenPresentationState

```
CitizenPresentationState {
  citizenId
  householdId?
  homeBuildingId
  jobBuildingId?
  schoolBuildingId?

  logicalState
  destinationId?
  presentationSeed
}
```

Economic Population/Workforce can remain aggregate while visible citizens retain stable identity where useful.

## WorkforceAssignmentState

```
WorkforceAssignmentState {
  totalWorkforce
  assigned
  unassigned

  buildingAssignments[]
  categoryPriorities
  allocatorRevision
}
```

Invariant:

`assigned <= totalWorkforce`

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

Examples:
- PLACE_BUILDING
- DRAW_ROAD
- CLEAR_BLOCKER
- CHANGE_PRIORITY
- QUEUE_REPAIR
- QUEUE_VEHICLE

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
- world-generator version
- content-data version
- asset-data version

Never load a save with silent schema/balance/generator reinterpretation.
