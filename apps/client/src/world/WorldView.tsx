import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { WorldState } from "@evervale/domain/world.types";

interface Props {
  world: WorldState;
  mode: "SELECT" | "BUILD" | "ROAD";
  onGroundClick(position: { x: number; z: number }): void;
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
      group.add(tree);
    }
  }

  if (building.damageState === "DISABLED") {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.35),
      new THREE.MeshStandardMaterial({ color: 0xe05b48, emissive: 0x551000 }),
    );
    marker.position.set(0, height + 0.7, 0);
    group.add(marker);
  }

  group.position.set(building.position.x, 0, building.position.z);
  group.rotation.y = building.rotationY;
  return group;
}

export function WorldView({ world, mode, onGroundClick }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef(world);
  const clickRef = useRef(onGroundClick);
  const modeRef = useRef(mode);
  const dynamicRef = useRef<THREE.Group | null>(null);
  const citizensRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => { worldRef.current = world; }, [world]);
  useEffect(() => { clickRef.current = onGroundClick; }, [onGroundClick]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

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
      new THREE.PlaneGeometry(110, 110),
      new THREE.MeshStandardMaterial({ color: 0x88a875, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);

    const dynamic = new THREE.Group();
    scene.add(dynamic);
    dynamicRef.current = dynamic;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointer = (event: PointerEvent) => {
      if (modeRef.current === "SELECT") return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObject(ground)[0];
      if (hit) clickRef.current({ x: Math.round(hit.point.x), z: Math.round(hit.point.z) });
    };
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
      const current = worldRef.current;

      for (const road of current.roads) {
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

      current.buildings.forEach((b) => dynamic.add(makeBuilding(b.definitionId, b)));

      const homes = current.buildings.filter((b) => b.definitionId === "house_small" && b.constructionState === "COMPLETE");
      const jobs = current.buildings.filter((b) => ["workshop","power_plant","water_plant","school","guard_post"].includes(b.definitionId) && b.constructionState === "COMPLETE");
      const park = current.buildings.find((b) => b.definitionId === "park" && b.constructionState === "COMPLETE");

      for (let i = 0; i < Math.min(40, current.society.population); i += 1) {
        const child = i % 5 === 0;
        const citizen = new THREE.Mesh(
          new THREE.CapsuleGeometry(child ? 0.25 : 0.32, child ? 0.55 : 0.8, 4, 8),
          new THREE.MeshStandardMaterial({ color: child ? 0xd7a86e : 0x6f7f8d }),
        );
        citizen.castShadow = true;
        citizen.userData.index = i;
        citizen.userData.home = homes[i % Math.max(1, homes.length)]?.position ?? { x: 0, y: 0, z: 0 };
        const school = current.buildings.find((b) => b.definitionId === "school" && b.constructionState === "COMPLETE");
        citizen.userData.target = child && school
          ? school.position
          : park && i % 4 === 1
            ? park.position
            : jobs[i % Math.max(1, jobs.length)]?.position ?? { x: 0, y: 0, z: 0 };
        dynamic.add(citizen);
        citizensRef.current.push(citizen);
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
    renderer.setAnimationLoop((time) => {
      const current = worldRef.current;
      if (current.revision !== lastRevision || frame % 120 === 0) {
        rebuild();
        lastRevision = current.revision;
      }

      const combatActive = current.combat && current.combat.status !== "RESOLVED";
      citizensRef.current.forEach((mesh) => {
        const i = Number(mesh.userData.index);
        const home = mesh.userData.home as {x:number;z:number};
        const target = combatActive ? { x: 0, z: 0 } : mesh.userData.target as {x:number;z:number};
        const phase = ((current.simulationSeconds / 70) + i * 0.137 + time / 140000) % 1;
        const ping = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
        mesh.position.x = home.x + (target.x - home.x) * ping;
        mesh.position.z = home.z + (target.z - home.z) * ping;
        mesh.position.y = 0.65 + Math.sin(time / 220 + i) * 0.035;
      });

      dynamic.children.forEach((obj, i) => {
        if (obj.userData.combatBob) obj.position.y = 0.7 + Math.sin(time / 130 + i) * 0.12;
      });

      const day = (current.simulationSeconds % (24 * 60)) / (24 * 60);
      sun.intensity = 0.7 + Math.max(0, Math.sin(day * Math.PI)) * 2.1;

      controls.update();
      renderer.render(scene, camera);
      frame += 1;
    });

    return () => {
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointer);
      renderer.setAnimationLoop(null);
      controls.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="world-view" ref={hostRef} />;
}
