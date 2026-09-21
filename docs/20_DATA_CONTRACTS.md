# 20 — Core Data Contracts

These are conceptual contracts, not final TypeScript syntax.

## World

```
World {
  worldId
  ownerId
  seed
  revision
  createdAt
  lastSimulatedAt
  simulationVersion
  state: ACTIVE | WARM | COLD
}
```

## BuildingInstance

```
BuildingInstance {
  id
  definitionId
  position
  rotation
  constructionState
  damageState
  workersAssigned
  utilityConnections
  storage
  operationalState
  operationalReasons[]
}
```

## RoadSegment

```
RoadSegment {
  id
  roadType
  controlPoints[]
  endpoints[]
  revision
}
```

Server stores canonical topology, not render mesh vertices.

## Citizen

```
Citizen {
  id
  householdId
  lifeStage
  homeBuildingId
  jobBuildingId?
  schoolBuildingId?
  logicalState
  destinationId?
  health
  happiness
  safety
}
```

## ResourceLedger

```
ResourceLedger {
  money
  rawVarum
  refinedVarum
  food
}
```

Electricity and water are network state, not simple wallet numbers.

## ThreatState

```
ThreatState {
  pressure
  seed
  activeSignals[]
  activeIncident?
  lastResolvedAt
}
```

Exact hidden attack timing must not leak to clients when uncertainty is intentional.

## WorldCommand

```
WorldCommand {
  commandId
  worldId
  userId
  expectedRevision?
  type
  payload
  clientSentAt
}
```

## CommandResult

```
CommandResult {
  commandId
  accepted
  worldRevision
  rejectionCode?
  patch?
}
```

## Event history

Important events are human-readable and machine-readable.

```
WorldEvent {
  id
  worldId
  eventType
  happenedAt
  severity
  entities[]
  data
  playerSummary
}
```

## Versioning

Persist:
- schema version
- simulation version
- asset data version

Migrations must be explicit.
