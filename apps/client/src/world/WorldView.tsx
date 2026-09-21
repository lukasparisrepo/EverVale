import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { routeAlongRoads, samplePolyline } from "@evervale/domain/road-routing";
import type { WorldState } from "@evervale/domain/world.types";
import type { BuildCatalogEntryDto, PropCatalogEntryDto } from "@evervale/protocol/world";
import { createPropObject, makeSelectionRing } from "./prop-factory";

export interface RuntimeMetrics {
  fps: number;
  frameMsP95: number;
  drawCalls: number;
  triangles: number;
  animatedCitizens: number;
}

interface Props {
  world: WorldState;
  mode: "SELECT" | "BUILD" | "ROAD" | "DECOR" | "MOVE_PROP";
  selectedBuild: BuildCatalogEntryDto | null;
  buildCatalog: BuildCatalogEntryDto[];
  selectedProp: PropCatalogEntryDto | null;
  propCatalog: PropCatalogEntryDto[];
  propRotation: number;
  selectedPropId: string | null;
  movingPropId: string | null;
  roadStart: { x: number; z: number } | null;
  onGroundClick(position: { x: number; z: number }): void;
  onPropSelect(propId: string | null): void;
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

function makeBuilding(
  definitionId: string,
  building: WorldState["buildings"][number],
  meta?: BuildCatalogEntryDto,
): THREE.Object3D {
  const group = new THREE.Group();
  const height = definitionId === "town_center" ? 5 : definitionId.includes("plant") ? 4 : 3;
  const width = meta
    ? meta.footprintCellsX * meta.gridCellMeters
    : definitionId === "town_center" ? 8 : 5;
  const depth = meta
    ? meta.footprintCellsZ * meta.gridCellMeters
    : definitionId === "town_center" ? 8 : 4;

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, Math.max(0.4, height), depth),
    new THREE.MeshStandardMaterial({
      color: buildingColor[definitionId] ?? 0xb3aa95,
      roughness: 0.88,
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
        new THREE.MeshStandardMaterial({ color: 0x66865a, roughness: 1 }),
      );
      tree.position.set(
        -width * 0.25 + (i % 2) * width * 0.5,
        1.25,
        -depth * 0.2 + Math.floor(i / 2) * depth * 0.4,
      );
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
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const vx = bx - ax;
  const vz = bz - az;
  const wx = px - ax;
  const wz = pz - az;
  const len2 = vx * vx + vz * vz;
  const t = len2 <= 0 ? 0 : Math.max(0, Math.min(1, (wx * vx + wz * vz) / len2));
  return Math.hypot(px - (ax + t * vx), pz - (az + t * vz));
}

function approximateBuildingPlacementValid(
  world: WorldState,
  selected: BuildCatalogEntryDto,
  x: number,
  z: number,
): boolean {
  const width = selected.footprintCellsX * selected.gridCellMeters;
  const depth = selected.footprintCellsZ * selected.gridCellMeters;

  const collision = world.buildings.some((b) => (
    Math.abs(b.position.x - x) < (6 + width) / 2 &&
    Math.abs(b.position.z - z) < (5 + depth) / 2
  ));
  if (collision) return false;

  const blocked = world.blockers.some((b) => {
    const dx = Math.max(0, Math.abs(b.position.x - x) - width / 2);
    const dz = Math.max(0, Math.abs(b.position.z - z) - depth / 2);
    return Math.hypot(dx, dz) < 3.5;
  });
  if (blocked) return false;

  return world.roads.some((road) =>
    pointSegmentDistance(x, z, road.from.x, road.from.z, road.to.x, road.to.z) <= 10
  );
}

function approximatePropPlacementValid(
  world: WorldState,
  catalog: PropCatalogEntryDto[],
  selected: PropCatalogEntryDto,
  x: number,
  z: number,
  rotationY: number,
  ignorePropId: string | null,
): boolean {
  const c = Math.abs(Math.cos(rotationY));
  const s = Math.abs(Math.sin(rotationY));
  const width = selected.sizeXMeters * c + selected.sizeZMeters * s;
  const depth = selected.sizeXMeters * s + selected.sizeZMeters * c;

  const buildingCollision = world.buildings.some((building) => (
    Math.abs(building.position.x - x) < 3 + width / 2 &&
    Math.abs(building.position.z - z) < 2.5 + depth / 2
  ));
  if (buildingCollision) return false;

  const propCollision = (world.props ?? []).some((prop) => {
    if (prop.id === ignorePropId) return false;
    const meta = catalog.find((item) => item.id === prop.definitionId);
    if (!meta) return false;
    const pc = Math.abs(Math.cos(prop.rotationY));
    const ps = Math.abs(Math.sin(prop.rotationY));
    const otherW = meta.sizeXMeters * pc + meta.sizeZMeters * ps;
    const otherD = meta.sizeXMeters * ps + meta.sizeZMeters * pc;
    return (
      Math.abs(prop.position.x - x) < (otherW + width) / 2 &&
      Math.abs(prop.position.z - z) < (otherD + depth) / 2
    );
  });
  if (propCollision) return false;

  return !world.blockers.some((blocker) => {
    const dx = Math.max(0, Math.abs(blocker.position.x - x) - width / 2);
    const dz = Math.max(0, Math.abs(blocker.position.z - z) - depth / 2);
    return Math.hypot(dx, dz) < 3.5;
  });
}

interface VisualRoute {
  connected: boolean;
  points: Array<{x:number;z:number}>;
}

function routePoint(
  route: VisualRoute | undefined,
  t: number,
  fallback: {x:number;z:number},
): {x:number;z:number} {
  if (!route?.connected || route.points.length === 0) return fallback;
  return samplePolyline(route.points, t);
}

function schedulePosition(
  current: WorldState,
  mesh: THREE.Mesh,
): { x: number; z: number; activity: string } {
  const home = mesh.userData.home as {x:number;z:number};
  const work = mesh.userData.work as {x:number;z:number};
  const leisure = mesh.userData.leisure as {x:number;z:number};
  const homeToWork = mesh.userData.homeToWork as VisualRoute | undefined;
  const workToLeisure = mesh.userData.workToLeisure as VisualRoute | undefined;
  const leisureToHome = mesh.userData.leisureToHome as VisualRoute | undefined;
  const homeToShelter = mesh.userData.homeToShelter as VisualRoute | undefined;
  const child = Boolean(mesh.userData.child);
  const hour = ((current.simulationSeconds % 1440) / 1440) * 24;

  if (current.combat && current.combat.status !== "RESOLVED") {
    return {
      ...routePoint(
        homeToShelter,
        Math.min(1, current.combat.elapsedSeconds / 5),
        home,
      ),
      activity: homeToShelter?.connected ? "SHELTER" : "SHELTER_BLOCKED",
    };
  }

  const commute = (
    startHour: number,
    endHour: number,
    route: VisualRoute | undefined,
    fallback: {x:number;z:number},
    activity: string,
  ) => {
    const t = Math.max(0, Math.min(1, (hour - startHour) / Math.max(0.01, endHour - startHour)));
    return {
      ...routePoint(route, t, fallback),
      activity: route?.connected ? activity : `${activity}_BLOCKED`,
    };
  };

  if (child) {
    if (hour < 7.5) return { ...home, activity: "HOME" };
    if (hour < 8.5) return commute(7.5, 8.5, homeToWork, home, "TO_SCHOOL");
    if (hour < 15) return { ...work, activity: "SCHOOL" };
    if (hour < 16) return commute(15, 16, workToLeisure, work, "TO_PLAY");
    if (hour < 18.5) return { ...leisure, activity: "PLAY" };
    if (hour < 19.5) return commute(18.5, 19.5, leisureToHome, leisure, "HOMEWARD");
    return { ...home, activity: "HOME" };
  }

  if (hour < 6.5) return { ...home, activity: "HOME" };
  if (hour < 8) return commute(6.5, 8, homeToWork, home, "TO_WORK");
  if (hour < 17) return { ...work, activity: "WORK" };
  if (hour < 18) return commute(17, 18, workToLeisure, work, "TO_LEISURE");
  if (hour < 20.5) return { ...leisure, activity: "LEISURE" };
  if (hour < 21.5) return commute(20.5, 21.5, leisureToHome, leisure, "HOMEWARD");
  return { ...home, activity: "HOME" };
}

export function WorldView({
  world,
  mode,
  selectedBuild,
  buildCatalog,
  selectedProp,
  propCatalog,
  propRotation,
  selectedPropId,
  movingPropId,
  roadStart,
  onGroundClick,
  onPropSelect,
  onMetrics,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef(world);
  const clickRef = useRef(onGroundClick);
  const metricsRef = useRef(onMetrics);
  const modeRef = useRef(mode);
  const selectedBuildRef = useRef(selectedBuild);
  const buildCatalogRef = useRef(buildCatalog);
  const selectedPropRef = useRef(selectedProp);
  const propCatalogRef = useRef(propCatalog);
  const propRotationRef = useRef(propRotation);
  const selectedPropIdRef = useRef(selectedPropId);
  const movingPropIdRef = useRef(movingPropId);
  const propSelectRef = useRef(onPropSelect);
  const roadStartRef = useRef(roadStart);
  const citizensRef = useRef<THREE.Mesh[]>([]);
  const animalsRef = useRef<THREE.Group[]>([]);
  const propWaterRef = useRef<THREE.Mesh[]>([]);
  const propGlowRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => { worldRef.current = world; }, [world]);
  useEffect(() => { clickRef.current = onGroundClick; }, [onGroundClick]);
  useEffect(() => { metricsRef.current = onMetrics; }, [onMetrics]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { selectedBuildRef.current = selectedBuild; }, [selectedBuild]);
  useEffect(() => { buildCatalogRef.current = buildCatalog; }, [buildCatalog]);
  useEffect(() => { selectedPropRef.current = selectedProp; }, [selectedProp]);
  useEffect(() => { propCatalogRef.current = propCatalog; }, [propCatalog]);
  useEffect(() => { propRotationRef.current = propRotation; }, [propRotation]);
  useEffect(() => { selectedPropIdRef.current = selectedPropId; }, [selectedPropId]);
  useEffect(() => { movingPropIdRef.current = movingPropId; }, [movingPropId]);
  useEffect(() => { propSelectRef.current = onPropSelect; }, [onPropSelect]);
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

    const buildGrid = new THREE.GridHelper(110, 55, 0x6f8068, 0x78906f);
    buildGrid.position.y = 0.035;
    buildGrid.material.transparent = true;
    buildGrid.material.opacity = 0.38;
    scene.add(buildGrid);

    const decorGrid = new THREE.GridHelper(110, 110, 0x77896f, 0x81967a);
    decorGrid.position.y = 0.04;
    decorGrid.material.transparent = true;
    decorGrid.material.opacity = 0.22;
    scene.add(decorGrid);

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

    const preview = new THREE.Group();
    scene.add(preview);

    const ghostMaterial = new THREE.MeshStandardMaterial({
      color: 0x75b76e,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const buildGhost = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ghostMaterial);
    buildGhost.position.y = 0.18;
    preview.add(buildGhost);

    const roadPreviewMaterial = new THREE.MeshBasicMaterial({
      color: 0x75b76e,
      transparent: true,
      opacity: 0.65,
    });
    const roadPreview = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1), roadPreviewMaterial);
    preview.add(roadPreview);

    const propPreview = new THREE.Group();
    preview.add(propPreview);
    const propFootprintMaterial = new THREE.MeshBasicMaterial({
      color: 0x75b76e,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const propFootprint = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), propFootprintMaterial);
    propFootprint.rotation.x = -Math.PI / 2;
    propFootprint.position.y = 0.055;
    propPreview.add(propFootprint);

    let previewPropId = "";
    const rebuildPropPreview = (meta: PropCatalogEntryDto) => {
      if (previewPropId === meta.id) return;
      while (propPreview.children.length > 1) {
        propPreview.remove(propPreview.children[propPreview.children.length - 1]!);
      }
      const visual = createPropObject(meta, `preview:${meta.id}`);
      visual.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });
      propPreview.add(visual);
      previewPropId = meta.id;
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const setMouse = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
    };

    const groundPoint = (event: PointerEvent): THREE.Vector3 | null => {
      setMouse(event);
      return raycaster.intersectObject(ground)[0]?.point ?? null;
    };

    const pickProp = (event: PointerEvent): string | null => {
      setMouse(event);
      const hits = raycaster.intersectObjects(dynamic.children, true);
      for (const hit of hits) {
        let object: THREE.Object3D | null = hit.object;
        while (object && object !== dynamic) {
          const propId = object.userData.propId;
          if (typeof propId === "string") return propId;
          object = object.parent;
        }
      }
      return null;
    };

    const hidePreviews = () => {
      buildGhost.visible = false;
      roadPreview.visible = false;
      propPreview.visible = false;
      delete host.dataset.placementValid;
      delete host.dataset.placementSize;
      delete host.dataset.decorValid;
      delete host.dataset.decorSize;
    };

    const onMove = (event: PointerEvent) => {
      const hit = groundPoint(event);
      if (!hit) return;
      hidePreviews();

      if (modeRef.current === "BUILD" && selectedBuildRef.current) {
        const selected = selectedBuildRef.current;
        const grid = selected.gridCellMeters;
        const x = Math.round(hit.x / grid) * grid;
        const z = Math.round(hit.z / grid) * grid;
        const width = selected.footprintCellsX * grid;
        const depth = selected.footprintCellsZ * grid;
        const valid = approximateBuildingPlacementValid(worldRef.current, selected, x, z);
        buildGhost.visible = true;
        buildGhost.scale.set(width, 0.32, depth);
        buildGhost.position.set(x, 0.18, z);
        ghostMaterial.color.setHex(valid ? 0x75b76e : 0xd46d61);
        host.dataset.placementValid = String(valid);
        host.dataset.placementSize = selected.sizeTitle;
        return;
      }

      if (modeRef.current === "ROAD" && roadStartRef.current) {
        const x = Math.round(hit.x / 2) * 2;
        const z = Math.round(hit.z / 2) * 2;
        const start = roadStartRef.current;
        const dx = x - start.x;
        const dz = z - start.z;
        const length = Math.hypot(dx, dz);
        const valid = length >= 2 && length <= 45;
        roadPreview.visible = true;
        roadPreview.scale.z = Math.max(0.1, length);
        roadPreview.position.set((start.x + x) / 2, 0.1, (start.z + z) / 2);
        roadPreview.rotation.y = Math.atan2(dx, dz);
        roadPreviewMaterial.color.setHex(valid ? 0x75b76e : 0xd46d61);
        return;
      }

      if (
        (modeRef.current === "DECOR" || modeRef.current === "MOVE_PROP") &&
        selectedPropRef.current
      ) {
        const selected = selectedPropRef.current;
        const snap = selected.snapMeters;
        const x = Math.round(hit.x / snap) * snap;
        const z = Math.round(hit.z / snap) * snap;
        const rotation = propRotationRef.current;
        const valid = approximatePropPlacementValid(
          worldRef.current,
          propCatalogRef.current,
          selected,
          x,
          z,
          rotation,
          movingPropIdRef.current,
        );
        rebuildPropPreview(selected);
        propPreview.visible = true;
        propPreview.position.set(x, 0, z);
        propPreview.rotation.y = rotation;
        propFootprint.scale.set(selected.sizeXMeters, selected.sizeZMeters, 1);
        propFootprintMaterial.color.setHex(valid ? 0x75b76e : 0xd46d61);
        host.dataset.decorValid = String(valid);
        host.dataset.decorSize = selected.sizeTitle;
      }
    };

    const onPointer = (event: PointerEvent) => {
      if (modeRef.current === "SELECT") {
        propSelectRef.current(pickProp(event));
        return;
      }

      const hit = groundPoint(event);
      if (!hit) return;

      if (
        (modeRef.current === "DECOR" || modeRef.current === "MOVE_PROP") &&
        selectedPropRef.current
      ) {
        const snap = selectedPropRef.current.snapMeters;
        clickRef.current({
          x: Math.round(hit.x / snap) * snap,
          z: Math.round(hit.z / snap) * snap,
        });
        return;
      }

      const grid = selectedBuildRef.current?.gridCellMeters ?? 2;
      clickRef.current({
        x: Math.round(hit.x / grid) * grid,
        z: Math.round(hit.z / grid) * grid,
      });
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
      propWaterRef.current = [];
      propGlowRef.current = [];
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

      (current.blockers ?? []).forEach((blocker) => dynamic.add(makeBlocker(blocker)));

      current.buildings.forEach((building) => {
        const meta = buildCatalogRef.current.find((item) => item.id === building.definitionId);
        dynamic.add(makeBuilding(building.definitionId, building, meta));
      });

      for (const prop of current.props ?? []) {
        const meta = propCatalogRef.current.find((item) => item.id === prop.definitionId);
        if (!meta) continue;
        const object = createPropObject(meta, `${current.seed}:${prop.id}`);
        object.position.set(prop.position.x, 0, prop.position.z);
        object.rotation.y = prop.rotationY;
        object.userData.propId = prop.id;
        object.traverse((child) => {
          child.userData.propId = prop.id;
          const mesh = child as THREE.Mesh;
          if (mesh.userData.propWater) propWaterRef.current.push(mesh);
          if (mesh.userData.propGlow) propGlowRef.current.push(mesh);
        });
        if (prop.id === selectedPropIdRef.current) {
          object.add(makeSelectionRing(meta.sizeXMeters, meta.sizeZMeters));
        }
        dynamic.add(object);
      }

      const homes = current.buildings.filter(
        (b) => b.definitionId === "house_small" && b.constructionState === "COMPLETE",
      );
      const jobs = current.buildings.filter(
        (b) =>
          ["workshop", "power_plant", "water_plant", "school", "guard_post"].includes(b.definitionId) &&
          b.constructionState === "COMPLETE",
      );
      const school = current.buildings.find(
        (b) => b.definitionId === "school" && b.constructionState === "COMPLETE",
      );
      const park = current.buildings.find(
        (b) => b.definitionId === "park" && b.constructionState === "COMPLETE",
      );

      const anchorProps = (current.props ?? []).flatMap((prop) => {
        const meta = propCatalogRef.current.find((item) => item.id === prop.definitionId);
        return meta?.activityAnchor ? [{ prop, meta }] : [];
      });
      const childAnchor = anchorProps.find(({ meta }) => meta.activityAnchor === "child_play")?.prop;
      const adultAnchor = anchorProps.find(({ meta }) =>
        ["sit", "social", "picnic", "read", "gather"].includes(meta.activityAnchor ?? "")
      )?.prop;

      const fallbackLeisure = park?.position ?? { x: 0, y: 0, z: 0 };

      for (let i = 0; i < Math.min(40, current.society.population); i += 1) {
        const child = i % 5 === 0;
        const citizen = new THREE.Mesh(
          new THREE.CapsuleGeometry(child ? 0.25 : 0.32, child ? 0.55 : 0.8, 4, 8),
          new THREE.MeshStandardMaterial({ color: child ? 0xd7a86e : 0x6f7f8d, roughness: 0.92 }),
        );
        citizen.castShadow = i < 18;
        citizen.userData.index = i;
        citizen.userData.child = child;
        const home = homes[i % Math.max(1, homes.length)]?.position ?? { x: 0, y: 0, z: 0 };
        const adultJob = jobs[i % Math.max(1, jobs.length)]?.position ?? home;
        const work = child ? (school?.position ?? home) : adultJob;
        const leisure = child
          ? (childAnchor?.position ?? fallbackLeisure)
          : (adultAnchor?.position ?? fallbackLeisure);

        const homePoint = { x: home.x, z: home.z };
        const workPoint = { x: work.x, z: work.z };
        const leisurePoint = { x: leisure.x, z: leisure.z };
        const shelterPoint = { x: 0, z: 0 };
        const homeToWork = routeAlongRoads(current.roads, homePoint, workPoint);
        const workToLeisure = routeAlongRoads(current.roads, workPoint, leisurePoint);
        const leisureToHome = routeAlongRoads(current.roads, leisurePoint, homePoint);
        const homeToShelter = routeAlongRoads(current.roads, homePoint, shelterPoint);

        citizen.userData.home = homePoint;
        citizen.userData.work = workPoint;
        citizen.userData.leisure = leisurePoint;
        citizen.userData.homeToWork = homeToWork;
        citizen.userData.workToLeisure = workToLeisure;
        citizen.userData.leisureToHome = leisureToHome;
        citizen.userData.homeToShelter = homeToShelter;
        citizen.userData.routingConnected =
          homeToWork.connected &&
          workToLeisure.connected &&
          leisureToHome.connected &&
          homeToShelter.connected;

        const angle = (i * 2.399963229728653) % (Math.PI * 2);
        const radius = 0.35 + (i % 4) * 0.12;
        citizen.userData.offsetX = Math.cos(angle) * radius;
        citizen.userData.offsetZ = Math.sin(angle) * radius;
        citizen.userData.activity = "HOME";
        dynamic.add(citizen);
        citizensRef.current.push(citizen);
      }

      const disconnectedRoutes = citizensRef.current.filter(
        (citizen) => citizen.userData.routingConnected === false,
      ).length;
      host.dataset.disconnectedRoutes = String(disconnectedRoutes);
      host.dataset.routedCitizens = String(citizensRef.current.length);

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

      current.combat?.actors.forEach((actor) => {
        if (actor.hp <= 0) return;
        const hostile = actor.side === "ENEMY";
        const mesh = new THREE.Mesh(
          hostile
            ? new THREE.SphereGeometry(0.65, 12, 8)
            : new THREE.CapsuleGeometry(0.35, 0.9, 4, 8),
          new THREE.MeshStandardMaterial({
            color: hostile ? 0xa65c83 : 0x566d55,
            emissive: hostile ? 0x2b0e20 : 0x081208,
          }),
        );
        mesh.position.set(actor.position.x, hostile ? 0.7 : 0.8, actor.position.z);
        mesh.castShadow = true;
        mesh.userData.combatBob = hostile;
        dynamic.add(mesh);
      });
    };

    let lastPresentationKey = "";
    let frame = 0;
    let lastFrameTime = performance.now();
    let lastMetricEmit = lastFrameTime;
    const frameTimes: number[] = [];

    renderer.setAnimationLoop((time) => {
      const current = worldRef.current;

      buildGrid.visible = modeRef.current === "BUILD" || modeRef.current === "ROAD";
      decorGrid.visible = modeRef.current === "DECOR" || modeRef.current === "MOVE_PROP";
      host.dataset.gridVisible = String(buildGrid.visible || decorGrid.visible);
      host.dataset.gridSize =
        modeRef.current === "DECOR" || modeRef.current === "MOVE_PROP" ? "1" : "2";

      const presentationKey = `${current.revision}:${selectedPropIdRef.current ?? ""}`;
      if (presentationKey !== lastPresentationKey || frame % 120 === 0) {
        rebuild();
        lastPresentationKey = presentationKey;
      }

      citizensRef.current.forEach((mesh) => {
        const scheduled = schedulePosition(current, mesh);
        const i = Number(mesh.userData.index);
        const offsetX = Number(mesh.userData.offsetX ?? 0);
        const offsetZ = Number(mesh.userData.offsetZ ?? 0);
        const targetX = scheduled.x + offsetX;
        const targetZ = scheduled.z + offsetZ;
        const dx = targetX - mesh.position.x;
        const dz = targetZ - mesh.position.z;
        mesh.position.x += dx * 0.12;
        mesh.position.z += dz * 0.12;
        if (Math.hypot(dx, dz) > 0.02) {
          mesh.rotation.y = Math.atan2(dx, dz);
        }
        mesh.position.y = 0.65 + Math.sin(time / 220 + i) * 0.035;
        mesh.userData.activity = scheduled.activity;
      });

      dynamic.children.forEach((object, i) => {
        if (object.userData.combatBob) {
          object.position.y = 0.7 + Math.sin(time / 130 + i) * 0.12;
        }
      });

      animalsRef.current.forEach((dog, i) => {
        const home = dog.userData.home as {x:number;z:number};
        const t = current.simulationSeconds / 18 + i * 1.7;
        const combatActive = current.combat && current.combat.status !== "RESOLVED";
        const radius = combatActive ? 1.2 : 4.0;
        dog.position.x = home.x + Math.cos(t) * radius;
        dog.position.z = home.z + Math.sin(t * 0.8) * radius;
        dog.rotation.y = -t + Math.PI / 2;
      });

      propWaterRef.current.forEach((water, i) => {
        water.rotation.y = Math.sin(time / 1500 + i) * 0.04;
      });

      const day = (current.simulationSeconds % (24 * 60)) / (24 * 60);
      sun.intensity = 0.7 + Math.max(0, Math.sin(day * Math.PI)) * 2.1;
      const nightFactor = 1 - Math.max(0, Math.sin(day * Math.PI));
      propGlowRef.current.forEach((glow) => {
        const material = glow.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.6 + nightFactor * 1.8;
      });

      controls.update();
      renderer.render(scene, camera);

      host.dataset.frameCount = String(frame + 1);
      host.dataset.drawCalls = String(renderer.info.render.calls);
      host.dataset.triangles = String(renderer.info.render.triangles);
      host.dataset.citizens = String(citizensRef.current.length);
      host.dataset.props = String(current.props?.length ?? 0);

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
