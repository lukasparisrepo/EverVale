# 31 — Visual Life State Contracts

## Citizen

```
CitizenVisualState {
  citizenId
  archetypeSeed
  homeId
  activity
  originAnchor?
  destinationAnchor?
  departAt
  arriveAt
  presentationSeed
}
```

Activities:
- HOME
- COMMUTE
- WORK
- SCHOOL
- PARK
- SHOP
- SOCIAL
- SHELTER
- EMERGENCY

## Vehicle

```
VehicleTrip {
  tripId
  vehicleClass
  originRoadNode
  destinationRoadNode
  departAt
  expectedArrivalAt
  priority
  presentationSeed
}
```

## Pet

```
PetVisualState {
  petId
  householdId
  type
  activity
  anchorId
  presentationSeed
}
```

## Animal zone

```
AnimalZone {
  zoneId
  species
  visualCount
  bounds
  shelterAnchor?
  presentationSeed
}
```

## Client freedom

Client may vary:
- exact local path
- idle timing
- animation
- look direction
- cosmetic props

Client may not alter:
- attendance
- job assignment
- destination
- resource production
- safety outcome
- combat result

## Networking

Send state changes and timestamps, not 60Hz transforms.
