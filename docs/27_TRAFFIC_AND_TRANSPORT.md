# 27 — Automated Traffic & Transport

## Goal

Roads should visibly feel used.

EverVale is not a detailed traffic simulator; traffic exists to make town structure legible and alive.

## Automatic trip types

- worker commute
- school commute
- civilian leisure
- service trip
- repair trip
- delivery/utility trip
- emergency response
- military deployment

## Vehicles

Possible visual civilian vehicles:
- bicycle
- small car
- van
- utility cart
- small truck

Later:
- buses
- armored vehicles
- tanks

## Server

Stores logical trip:
- origin
- destination
- road path/cost
- depart time
- expected arrival

## Client

Handles:
- lane following
- spacing
- stop/start
- wheel animation
- visual turning
- pooled vehicle model

Do not network vehicle transforms every frame.

## Traffic density

Visual traffic density may be lower than logical trip count.

A 100-population town does not require 100 simultaneously rendered cars.

## Congestion

MVP uses simple weighted edge-load modifiers, not car-by-car physics.

Congestion can increase commute cost and therefore affect Happiness indirectly.

## Parking

Detailed parking simulation is deferred.

Vehicles can use authored parking/access anchors or despawn after entering a destination access zone.
