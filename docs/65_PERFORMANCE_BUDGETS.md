# 65 — Performance Budgets

Status: **CANONICAL M1 TARGET BUDGET**

## Desktop baseline
- 1920×1080
- DPR cap 1.5
- 60 FPS target
- p95 frame <= 20 ms
- sustained minimum 45 FPS

## Lower-end laptop
- 1280×720 or dynamic scale
- Low preset
- 30 FPS minimum
- p95 frame <= 35 ms

## M1 representative scene
- 20–40 logical citizens
- <=30 animated near/mid citizens
- 8–15 buildings
- pets/animals <=12 visible
- civilian vehicles <=10 visible
- one small combat wave <=12 combat actors

## GPU budgets
Medium/High:
- draw calls <=450
- visible triangles <=1.5M
- dynamic shadow casters <=24
- one realtime shadowed directional light
- texture GPU memory target <=512 MB
- active particle systems <=32

Low:
- draw calls <=300
- visible triangles <=750k
- near animated citizens <=18
- reduced shadows/weather/post FX

## CPU budgets
Client:
- living-world presentation <=2.5 ms average
- local path/avoidance <=2 ms average
- React HUD must not commit every frame
- normal network patch apply <=2 ms

Server:
- ordinary M1 world tick p95 <=10 ms
- 24h cold catch-up p95 <=250 ms target
- 7d catch-up p95 <=1000 ms target
- no Population × FPS server workload

## Memory
- JS heap <=300 MB after 30 min
- GPU resource estimate <=512 MB
- no monotonic growth >5% across 20 equivalent sector load/unload cycles

## Network
- normal town inbound <=10 KB/s average/client
- combat burst inbound <=30 KB/s average/client
- never stream per-frame citizen/projectile transforms

## Deterministic benchmark scenes
starter town; 40-citizen town; rain; night; 12-actor combat; build-mode road editing.