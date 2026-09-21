import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { WorldState } from "@evervale/domain/world.types";

export interface RuntimeMetrics {
  fps: number;
  frameMsP95: number;
  drawCalls: number;
  triangles: number;
  animatedCitizens: number;
}

interface Props {
  world: WorldState;
  mode: "SELECT" | "BUILD" | "ROAD";
  selectedBuildId: string | undefined;
  roadStart: { x: number; z: number } | null;
  onGroundClick(position: { x: number; z: number }): void;
  onMetrics: ((metrics: RuntimeMetrics) => void) | undefined;
}

const buildingColor: Record<string, number> = {
  town_center: 0xd4a55f,
  house_small: 0xe7d8b5,
  workshop: 0x9a6e4f,
  power_plant: 0xc47f4a,
  water_plant: 0x73a8b8,
  school: 0xc9b477,
  park: 0x73a36a,
  guard_post: 0x817d67,
  farm: 0xa3a160,
  restaurant: 0xc98668,
  builders_yard: 0x8b735b,
};

function makeBuilding(definitionId: string, building: WorldState["buildings"][number]): THREE.Object3D {
  const group = new THREE.Group();
  const height = definitionId === "town_center" ? 5 : definitionId.includes("plant") ? 4 : 3;
  const width = definitionId === "park" ? 6 : definitionId === "town_center" ? 7 : 5;

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, Math.max(0.4, height), width * 0.8),
    new THREE.MeshStandardMaterial({
      color: buildingColor[definitionId] ?? 0xb3aa95,
      transparent: building.constructionState === "BUILDING",
      opacity: building.constructionState === "BUILDING" ? 0.45 : 1,
    }),
  );
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  if (definitionId === "park") {
    body.scale.y = 0.08;
    body.position.y = 0.12;
    for (let i = 0; i < 4; i += 1) {
      const tree = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 2.5, 7),
        new THREE.MeshStandardMaterial({ color: 0x66865a }),
      );
      tree.position.set(-2 + (i % 2) * 4, 1.25, -1 + Math.floor(i / 2) * 2);
      tree.castShadow = true;
      group.add(tree);
    }
  }

  if (building.damageState === "DISABLED" || building.damageState === "DAMAGED") {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.35),
      new THREE.MeshStandardMaterial({
        color: building.damageState === "DISABLED" ? 0xe05b48 : 0xe5a14d,
        emissive: building.damageState === "DISABLED" ? 0x551000 : 0x332000,
      }),
    );
    marker.position.set(0, height + 0.7, 0);
    group.add(marker);
  }

  group.position.set(building.position.x, 0, building.position.z);
  group.rotation.y = building.rotationY;
  return group;
}

function makeBlocker(blocker: WorldState["blockers"][number]): THREE.Object3D {
  const group = new THREE.Group();

  if (blocker.definitionId === "fallen_tree") {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 6, 8),
      new THREE.MeshStandardMaterial({ color: 0x795b3d, roughness: 1 }),
    );
    trunk.rotation.z = Math.PI / 2;
    trunk.position.y = 0.55;
    trunk.castShadow = true;
    group.add(trunk);
    for (const x of [-2.4, 2.4]) {
      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(1.3, 2.2, 7),
        new THREE.MeshStandardMaterial({ color: 0x526f49, roughness: 1 }),
      );
      crown.position.set(x, 1.1, 0);
      crown.castShadow = true;
      group.add(crown);
    }
  } else {
    for (let i = 0; i < 5; i += 1) {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.7 + (i % 3) * 0.18, 0),
        new THREE.MeshStandardMaterial({ color: 0x77776e, roughness: 1 }),
      );
      rock.scale.y = 0.7;
      rock.position.set((i % 3) * 1.2 - 1.2, 0.5, Math.floor(i / 3) * 1.2 - 0.5);
      rock.rotation.set(i * 0.4, i * 0.7, 0);
      rock.castShadow = true;
      group.add(rock);
    }
  }

  if (blocker.state === "CLEARING") {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.12, 6, 24),
      new THREE.MeshBasicMaterial({ color: 0xd7aa54 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.12;
    group.add(ring);
  }

  group.position.set(blocker.position.x, 0, blocker.position.z);
  return group;
}

function pointSegmentDistance(
  px: number, pz: number, ax: number, az: number, bx: number, bz: number,
): number {
  const vx = bx - ax;
  const vz = bz - az;
  const wx = px - ax;
  const wz = pz - az;
  const len2 = vx * vx + vz * vz;
  const t = len2 <= 0 ? 0 : Math.max(0, Math.min(1, (wx * vx + wz * vz) / len2));
  return Math.hypot(px - (ax + t * vx), pz - (az + t * vz));
}

function approximatePlacementValid(world: WorldState, x: number, z: number): boolean {
  const collision = world.buildings.some((b) => Math.hypot(b.position.x - x, b.position.z - z) < 5);
  if (collision) return false;
  const blocked = world.blockers.some((b) => Math.hypot(b.position.x - x, b.position.z - z) < 6);
  if (blocked) return false;
  return world.roads.some((road) =>
    pointSegmentDistance(x, z, road.from.x, road.from.z, road.to.x, road.to.z) <= 10,
  );
}

function nearestRoadPoint(world: WorldState, point: { x: number; z: number }): { x: number; z: number } {
  let best = { x: point.x, z: point.z };
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const road of world.roads) {
    for (const endpoint of [road.from, road.to]) {
      const distance = Math.hypot(endpoint.x - point.x, endpoint.z - point.z);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { x: endpoint.x, z: endpoint.z };
      }
    }
  }
  return best;
}

function lerpPoint(a: {x:number;z:number}, b: {x:number;z:number}, t: number): {x:number;z:number} {
  return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
}

function moveAlongRoute(
  home: {x:number;z:number},
  target: {x:number;z:number},
  roadPoint: {x:number;z:number},
  t: number,
): {x:number;z:number} {
  if (t <= 0.35) return lerpPoint(home, roadPoint, t / 0.35);
  if (t <= 0.7) return lerpPoint(roadPoint, { x: 0, z: 2 }, (t - 0.35) / 0.35);
  return lerpPoint({ x: 0, z: 2 }, target, (t - 0.7) / 0.3);
}

function schedulePosition(
  current: WorldState,
  mesh: THREE.Mesh,
): { x: number; z: number; activity: string } {
  const home = mesh.userData.home as {x:number;z:number};
  const work = mesh.userData.work as {x:number;z:number};
  const leisure = mesh.userData.leisure as {x:number;z:number};
  const roadPoint = mesh.userData.roadPoint as {x:number;z:number};
  const child = Boolean(mesh.userData.child);
  const hour = ((current.simulationSeconds % 1440) / 1440) * 24;

  if (current.combat && current.combat.status !== "RESOLVED") {
    return { ...moveAlongRoute(home, {x:0,z:0}, roadPoint, Math.min(1, current.combat.elapsedSeconds / 5)), activity: "SHELTER" };
  }

  const commute = (
    start: number,
    end: number,
    from: {x:number;z:number},
    to: {x:number;z:number},
    activity: string,
  ) => {
    const t = Math.max(0, Math.min(1, (hour - start) / Math.max(0.01, end - start)));
    const p = moveAlongRoute(from, to, roadPoint, t);
    return { ...p, activity };
  };

  if (child) {
    if (hour < 7.5) return { ...home, activity: "HOME" };
    if (hour < 8.5) return commute(7.5, 8.5, home, work, "TO_SCHOOL");
    if (hour < 15) return { ...work, activity: "SCHOOL" };
    if (hour < 16) return commute(15, 16, work, leisure, "TO_PARK");
    if (hour < 18.5) return { ...leisure, activity: "PLAY" };
    if (hour < 19.5) return commute(18.5, 19.5, leisure, home, "HOMEWARD");
    return { ...home, activity: "HOME" };
  }

  if (hour < 6.5) return { ...home, activity: "HOME" };
  if (hour < 8) return commute(6.5, 8, home, work, "TO_WORK");
  if (hour < 17) return { ...work, activity: "WORK" };
  if (hour < 18) return commute(17, 18, work, leisure, "TO_LEISURE");
  if (hour < 20.5) return { ...leisure, activity: "LEISURE" };
  if (hour < 21.5) return commute(20.5, 21.5, leisure, home, "HOMEWARD");
  return { ...home, activity: "HOME" };
}

export function WorldView({
  world,
  mode,
  selectedBuildId,
  roadStart,
  onGroundClick,
  onMetrics,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef(world);
  const clickRef = useRef(onGroundClick);
  const metricsRef = useRef(onMetrics);
  const modeRef = useRef(mode);
  const selectedBuildRef = useRef(selectedBuildId);
  const roadStartRef = useRef(roadStart);
  const dynamicRef = useRef<THREE.Group | null>(null);
  const citizensRef = useRef<THREE.Mesh[]>([]);
  const animalsRef = useRef<THREE.Group[]>([]);

  useEffect(() => { worldRef.current = world; }, [world]);
  useEffect(() => { clickRef.current = onGroundClick; }, [onGroundClick]);
  useEffect(() => { metricsRef.current = onMetrics; }, [onMetrics]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { selectedBuildRef.current = selectedBuildId; }, [selectedBuildId]);
  useEffect(() => { roadStartRef.current = roadStart; }, [roadStart]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1c1);
    scene.fog = new THREE.Fog(0xbfd1c1, 90, 190);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400);
    camera.position.set(48, 55, 58);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.minDistance = 22;
    controls.maxDistance = 130;

    scene.add(new THREE.HemisphereLight(0xf5ecd7, 0x687267, 2.2));
    const sun = new THREE.DirectionalLight(0xfff0ce, 2.7);
    sun.position.set(35, 60, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -55;
    sun.shadow.camera.right = 55;
    sun.shadow.camera.top = 55;
    sun.shadow.camera.bottom = -55;
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(110, 110, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x88a875, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);

    // First terrain-readability pass: raised perimeter ridges, leaving the central starter plateau open.
    const ridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x71856a, roughness: 1 });
    for (const [x, z, sx, sz, height] of [
      [-48, 0, 12, 100, 7],
      [48, 0, 12, 100, 9],
      [0, 49, 84, 12, 6],
    ] as const) {
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(sx, height, sz), ridgeMaterial);
      ridge.position.set(x, height / 2 - 0.2, z);
      ridge.receiveShadow = true;
      ridge.castShadow = true;
      scene.add(ridge);
    }

    const dynamic = new THREE.Group();
    scene.add(dynamic);
    dynamicRef.current = dynamic;

    const preview = new THREE.Group();
    scene.add(preview);

    const ghostMaterial = new THREE.MeshStandardMaterial({
      color: 0x75b76e,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const ghost = new THREE.Mesh(new THREE.BoxGeometry(5, 3, 4), ghostMaterial);
    ghost.position.y = 1.5;
    ghost.visible = false;
    preview.add(ghost);

    const roadPreviewMaterial = new THREE.MeshBasicMaterial({ color: 0x75b76e, transparent: true, opacity: 0.65 });
    const roadPreview = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1), roadPreviewMaterial);
    roadPreview.visible = false;
    preview.add(roadPreview);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const groundPoint = (event: PointerEvent): THREE.Vector3 | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObject(ground)[0]?.point ?? null;
    };

    const onMove = (event: PointerEvent) => {
      const hit = groundPoint(event);
      if (!hit) return;
      const x = Math.round(hit.x);
      const z = Math.round(hit.z);

      ghost.visible = modeRef.current === "BUILD" && !!selectedBuildRef.current;
      roadPreview.visible = modeRef.current === "ROAD" && !!roadStartRef.current;

      if (ghost.visible) {
        const valid = approximatePlacementValid(worldRef.current, x, z);
        host.dataset.placementValid = String(valid);
        ghost.position.set(x, 1.5, z);
        ghostMaterial.color.setHex(valid ? 0x75b76e : 0xd46d61);
      } else {
        delete host.dataset.placementValid;
      }

      if (roadPreview.visible && roadStartRef.current) {
        const start = roadStartRef.current;
        const dx = x - start.x;
        const dz = z - start.z;
        const length = Math.hypot(dx, dz);
        const valid = length >= 2 && length <= 45;
        roadPreview.scale.z = Math.max(0.1, length);
        roadPreview.position.set((start.x + x) / 2, 0.1, (start.z + z) / 2);
        roadPreview.rotation.y = Math.atan2(dx, dz);
        roadPreviewMaterial.color.setHex(valid ? 0x75b76e : 0xd46d61);
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (modeRef.current === "SELECT") return;
      const hit = groundPoint(event);
      if (hit) clickRef.current({ x: Math.round(hit.x), z: Math.round(hit.z) });
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onPointer);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const rebuild = () => {
      dynamic.clear();
      citizensRef.current = [];
      animalsRef.current = [];
      const current = worldRef.current;

      for (const road of current.roads ?? []) {
        const dx = road.to.x - road.from.x;
        const dz = road.to.z - road.from.z;
        const length = Math.hypot(dx, dz);
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.08, length),
          new THREE.MeshStandardMaterial({ color: 0x9b8b74, roughness: 1 }),
        );
        mesh.position.set((road.from.x + road.to.x) / 2, 0.05, (road.from.z + road.to.z) / 2);
        mesh.rotation.y = Math.atan2(dx, dz);
        mesh.receiveShadow = true;
        dynamic.add(mesh);
      }

      (current.blockers ?? []).forEach((b) => dynamic.add(makeBlocker(b)));
      current.buildings.forEach((b) => dynamic.add(makeBuilding(b.definitionId, b)));

      const homes = current.buildings.filter((b) => b.definitionId === "house_small" && b.constructionState === "COMPLETE");
      const jobs = current.buildings.filter((b) =>
        ["workshop","power_plant","water_plant","school","guard_post"].includes(b.definitionId) &&
        b.constructionState === "COMPLETE",
      );
      const school = current.buildings.find((b) => b.definitionId === "school" && b.constructionState === "COMPLETE");
      const park = current.buildings.find((b) => b.definitionId === "park" && b.constructionState === "COMPLETE");
      const fallbackLeisure = park?.position ?? { x: 0, y: 0, z: 0 };

      for (let i = 0; i < Math.min(40, current.society.population); i += 1) {
        const child = i % 5 === 0;
        const citizen = new THREE.Mesh(
          new THREE.CapsuleGeometry(child ? 0.25 : 0.32, child ? 0.55 : 0.8, 4, 8),
          new THREE.MeshStandardMaterial({ color: child ? 0xd7a86e : 0x6f7f8d }),
        );
        citizen.castShadow = i < 18;
        citizen.userData.index = i;
        citizen.userData.child = child;
        const home = homes[i % Math.max(1, homes.length)]?.position ?? { x: 0, y: 0, z: 0 };
        const adultJob = jobs[i % Math.max(1, jobs.length)]?.position ?? home;
        const work = child
          ? (school?.position ?? home)
          : adultJob;
        citizen.userData.home = { x: home.x, z: home.z };
        citizen.userData.work = { x: work.x, z: work.z };
        citizen.userData.leisure = { x: fallbackLeisure.x, z: fallbackLeisure.z };
        citizen.userData.roadPoint = nearestRoadPoint(current, { x: home.x, z: home.z });
        const angle = (i * 2.399963229728653) % (Math.PI * 2);
        const radius = 0.35 + (i % 4) * 0.12;
        citizen.userData.offsetX = Math.cos(angle) * radius;
        citizen.userData.offsetZ = Math.sin(angle) * radius;
        citizen.userData.activity = "HOME";
        dynamic.add(citizen);
        citizensRef.current.push(citizen);
      }

      if (homes.length > 0) {
        const dog = new THREE.Group();
        const fur = new THREE.MeshStandardMaterial({ color: 0x9a6a45, roughness: 1 });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.42), fur);
        body.position.y = 0.45;
        body.castShadow = true;
        dog.add(body);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), fur);
        head.position.set(0.55, 0.55, 0);
        head.castShadow = true;
        dog.add(head);
        const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.55, 6), fur);
        tail.rotation.z = Math.PI / 3;
        tail.position.set(-0.55, 0.62, 0);
        dog.add(tail);
        dog.userData.home = homes[0]?.position ?? { x: 0, y: 0, z: 0 };
        dynamic.add(dog);
        animalsRef.current.push(dog);
      }

      current.combat?.actors.forEach((a) => {
        if (a.hp <= 0) return;
        const hostile = a.side === "ENEMY";
        const mesh = new THREE.Mesh(
          hostile ? new THREE.SphereGeometry(0.65, 12, 8) : new THREE.CapsuleGeometry(0.35, 0.9, 4, 8),
          new THREE.MeshStandardMaterial({
            color: hostile ? 0xa65c83 : 0x566d55,
            emissive: hostile ? 0x2b0e20 : 0x081208,
          }),
        );
        mesh.position.set(a.position.x, hostile ? 0.7 : 0.8, a.position.z);
        mesh.castShadow = true;
        mesh.userData.combatBob = hostile;
        dynamic.add(mesh);
      });
    };

    let lastRevision = -1;
    let frame = 0;
    let lastFrameTime = performance.now();
    let lastMetricEmit = lastFrameTime;
    const frameTimes: number[] = [];

    renderer.setAnimationLoop((time) => {
      const current = worldRef.current;
      if (current.revision !== lastRevision || frame % 120 === 0) {
        rebuild();
        lastRevision = current.revision;
      }

      citizensRef.current.forEach((mesh) => {
        const scheduled = schedulePosition(current, mesh);
        const i = Number(mesh.userData.index);
        const offsetX = Number(mesh.userData.offsetX ?? 0);
        const offsetZ = Number(mesh.userData.offsetZ ?? 0);
        mesh.position.x += (scheduled.x + offsetX - mesh.position.x) * 0.12;
        mesh.position.z += (scheduled.z + offsetZ - mesh.position.z) * 0.12;
        mesh.position.y = 0.65 + Math.sin(time / 220 + i) * 0.035;
        mesh.userData.activity = scheduled.activity;
      });

      dynamic.children.forEach((obj, i) => {
        if (obj.userData.combatBob) obj.position.y = 0.7 + Math.sin(time / 130 + i) * 0.12;
      });

      animalsRef.current.forEach((dog, i) => {
        const home = dog.userData.home as {x:number;z:number};
        const t = current.simulationSeconds / 18 + i * 1.7;
        const combatActive = current.combat && current.combat.status !== "RESOLVED";
        const radius = combatActive ? 1.2 : 4.0;
        dog.position.x = home.x + Math.cos(t) * radius;
        dog.position.z = home.z + Math.sin(t * 0.8) * radius;
        dog.position.y = 0;
        dog.rotation.y = -t + Math.PI / 2;
      });

      const day = (current.simulationSeconds % (24 * 60)) / (24 * 60);
      sun.intensity = 0.7 + Math.max(0, Math.sin(day * Math.PI)) * 2.1;

      controls.update();
      renderer.render(scene, camera);

      const now = performance.now();
      const frameMs = now - lastFrameTime;
      lastFrameTime = now;
      if (frameMs > 0 && frameMs < 250) {
        frameTimes.push(frameMs);
        if (frameTimes.length > 180) frameTimes.shift();
      }

      if (now - lastMetricEmit >= 1000 && frameTimes.length >= 10) {
        const sorted = [...frameTimes].sort((a, b) => a - b);
        const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0;
        const avg = frameTimes.reduce((sum, value) => sum + value, 0) / frameTimes.length;
        metricsRef.current?.({
          fps: Math.round(1000 / Math.max(1, avg)),
          frameMsP95: Math.round(p95 * 10) / 10,
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          animatedCitizens: citizensRef.current.length,
        });
        lastMetricEmit = now;
      }

      frame += 1;
    });

    return () => {
      observer.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onPointer);
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="world-view" ref={hostRef} />;
}
