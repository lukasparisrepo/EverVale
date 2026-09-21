import * as THREE from "three";
import type { BuildingInstance } from "@evervale/domain/world.types";
import type { BuildCatalogEntryDto } from "@evervale/protocol/world";

export type ConstructionVisualStage =
  | "FOOTPRINT"
  | "FOUNDATION"
  | "FRAME"
  | "SHELL"
  | "FINISHING";

export interface ConstructionVisualState {
  progress: number;
  stage: ConstructionVisualStage;
  stageIndex: number;
}

const materials = {
  soil: new THREE.MeshStandardMaterial({ color: 0x6f5b45, roughness: 1 }),
  concrete: new THREE.MeshStandardMaterial({ color: 0xa5a092, roughness: 0.96 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x856446, roughness: 0.94 }),
  timberDark: new THREE.MeshStandardMaterial({ color: 0x604a37, roughness: 0.98 }),
  scaffold: new THREE.MeshStandardMaterial({ color: 0x686f6a, roughness: 0.72, metalness: 0.2 }),
  shell: new THREE.MeshStandardMaterial({
    color: 0xc9bfa6,
    roughness: 0.9,
    transparent: true,
    opacity: 0.78,
  }),
  tarp: new THREE.MeshStandardMaterial({ color: 0xa77845, roughness: 0.9 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd2ab61, roughness: 0.65 }),
  cloth: new THREE.MeshStandardMaterial({ color: 0xb87952, roughness: 0.95 }),
  worker: new THREE.MeshStandardMaterial({ color: 0x6f7e67, roughness: 0.92 }),
  skin: new THREE.MeshStandardMaterial({ color: 0xc89a77, roughness: 0.95 }),
  wheel: new THREE.MeshStandardMaterial({ color: 0x444843, roughness: 0.9 }),
  water: new THREE.MeshStandardMaterial({ color: 0x6f9fa6, roughness: 0.38 }),
  chalk: new THREE.MeshStandardMaterial({ color: 0xe5d8b8, roughness: 1 }),
};

Object.values(materials).forEach((material) => {
  material.userData.sharedMaterial = true;
});

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const value = new THREE.Mesh(geometry, material);
  value.position.set(x, y, z);
  value.castShadow = true;
  value.receiveShadow = true;
  return value;
}

export function constructionVisualState(
  building: BuildingInstance,
): ConstructionVisualState {
  const total = Math.max(0, building.constructionTotalSeconds);
  const progress =
    building.constructionState === "COMPLETE"
      ? 1
      : total <= 0
        ? 0
        : Math.max(
            0,
            Math.min(1, 1 - building.constructionRemainingSeconds / total),
          );

  if (progress < 0.12) return { progress, stage: "FOOTPRINT", stageIndex: 0 };
  if (progress < 0.32) return { progress, stage: "FOUNDATION", stageIndex: 1 };
  if (progress < 0.62) return { progress, stage: "FRAME", stageIndex: 2 };
  if (progress < 0.88) return { progress, stage: "SHELL", stageIndex: 3 };
  return { progress, stage: "FINISHING", stageIndex: 4 };
}

function addCornerStakes(group: THREE.Group, width: number, depth: number): void {
  for (const x of [-width / 2 + 0.25, width / 2 - 0.25]) {
    for (const z of [-depth / 2 + 0.25, depth / 2 - 0.25]) {
      group.add(
        mesh(
          new THREE.BoxGeometry(0.12, 0.7, 0.12),
          materials.wood,
          x,
          0.35,
          z,
        ),
      );
    }
  }
}

function addFrame(group: THREE.Group, width: number, depth: number, height: number): void {
  const inset = 0.28;
  for (const x of [-width / 2 + inset, width / 2 - inset]) {
    for (const z of [-depth / 2 + inset, depth / 2 - inset]) {
      group.add(
        mesh(
          new THREE.BoxGeometry(0.18, height, 0.18),
          materials.timberDark,
          x,
          height / 2,
          z,
        ),
      );
    }
  }

  const beamY = height - 0.15;
  for (const z of [-depth / 2 + inset, depth / 2 - inset]) {
    group.add(
      mesh(
        new THREE.BoxGeometry(width - inset * 2, 0.18, 0.18),
        materials.wood,
        0,
        beamY,
        z,
      ),
    );
  }
  for (const x of [-width / 2 + inset, width / 2 - inset]) {
    group.add(
      mesh(
        new THREE.BoxGeometry(0.18, 0.18, depth - inset * 2),
        materials.wood,
        x,
        beamY,
        0,
      ),
    );
  }
}

function addScaffold(group: THREE.Group, width: number, depth: number, height: number): void {
  const outerX = width / 2 + 0.45;
  const outerZ = depth / 2 + 0.45;
  for (const x of [-outerX, outerX]) {
    for (const z of [-outerZ, outerZ]) {
      group.add(
        mesh(
          new THREE.CylinderGeometry(0.035, 0.035, height + 0.6, 5),
          materials.scaffold,
          x,
          (height + 0.6) / 2,
          z,
        ),
      );
    }
  }

  for (const y of [0.8, Math.max(1.2, height * 0.55), height]) {
    for (const z of [-outerZ, outerZ]) {
      group.add(
        mesh(
          new THREE.BoxGeometry(width + 0.9, 0.06, 0.08),
          materials.scaffold,
          0,
          y,
          z,
        ),
      );
    }
    for (const x of [-outerX, outerX]) {
      group.add(
        mesh(
          new THREE.BoxGeometry(0.08, 0.06, depth + 0.9),
          materials.scaffold,
          x,
          y,
          0,
        ),
      );
    }
  }
}

function addMaterialStacks(group: THREE.Group, width: number, depth: number): void {
  const x = Math.max(1, width / 2 + 0.9);
  const z = -Math.max(1, depth / 2 - 0.4);

  for (let i = 0; i < 3; i += 1) {
    const crate = mesh(
      new THREE.BoxGeometry(0.55, 0.42, 0.55),
      i % 2 === 0 ? materials.wood : materials.tarp,
      x + (i % 2) * 0.58,
      0.22 + Math.floor(i / 2) * 0.43,
      z,
    );
    crate.castShadow = true;
    group.add(crate);
  }

  const boards = mesh(
    new THREE.BoxGeometry(1.7, 0.18, 0.55),
    materials.wood,
    -x,
    0.18,
    z,
  );
  boards.rotation.y = 0.12;
  group.add(boards);
}

function addSiteClutter(group: THREE.Group, width: number, depth: number): void {
  const tray = mesh(
    new THREE.BoxGeometry(0.9, 0.18, 0.55),
    materials.scaffold,
    width / 2 + 0.92,
    0.58,
    depth / 2 - 0.35,
  );
  tray.rotation.z = -0.08;
  group.add(tray);

  for (const z of [-0.2, 0.2]) {
    const handle = mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.05, 5),
      materials.wood,
      width / 2 + 1.38,
      0.58,
      depth / 2 - 0.35 + z,
    );
    handle.rotation.z = Math.PI / 2;
    group.add(handle);
  }

  const wheel = mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.12, 10),
    materials.wheel,
    width / 2 + 0.5,
    0.24,
    depth / 2 - 0.35,
  );
  wheel.rotation.x = Math.PI / 2;
  group.add(wheel);

  const bucket = mesh(
    new THREE.CylinderGeometry(0.22, 0.18, 0.42, 9),
    materials.tarp,
    -width / 2 - 0.75,
    0.22,
    depth / 2 - 0.55,
  );
  group.add(bucket);

  const water = mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.025, 9),
    materials.water,
    -width / 2 - 0.75,
    0.43,
    depth / 2 - 0.55,
  );
  water.castShadow = false;
  group.add(water);
}

function addFinishingDetails(group: THREE.Group, width: number, depth: number, height: number): void {
  const roofY = height + 0.22;
  for (const z of [-depth * 0.28, 0, depth * 0.28]) {
    const rafter = mesh(
      new THREE.BoxGeometry(width * 0.86, 0.1, 0.12),
      materials.wood,
      0,
      roofY + Math.abs(z) * 0.08,
      z,
    );
    rafter.rotation.z = z < 0 ? -0.05 : z > 0 ? 0.05 : 0;
    group.add(rafter);
  }

  for (const x of [-width * 0.24, width * 0.24]) {
    const opening = mesh(
      new THREE.BoxGeometry(0.62, 0.72, 0.045),
      materials.chalk,
      x,
      height * 0.58,
      depth * 0.455,
    );
    opening.castShadow = false;
    group.add(opening);
  }
}

function addProgressFlag(group: THREE.Group, width: number, progress: number): void {
  const poleX = -width / 2 - 0.65;
  group.add(
    mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.8, 6),
      materials.scaffold,
      poleX,
      0.9,
      0,
    ),
  );
  const flag = mesh(
    new THREE.PlaneGeometry(0.9, 0.45),
    progress > 0.87 ? materials.gold : materials.cloth,
    poleX + 0.46,
    1.55,
    0,
  );
  flag.rotation.y = Math.PI / 2;
  group.add(flag);
}

export function createConstructionObject(
  building: BuildingInstance,
  meta: BuildCatalogEntryDto | undefined,
): THREE.Group {
  const group = new THREE.Group();
  const width = meta ? meta.footprintCellsX * meta.gridCellMeters : 5;
  const depth = meta ? meta.footprintCellsZ * meta.gridCellMeters : 4;
  const height = building.definitionId.includes("plant") ? 4 : building.definitionId === "town_center" ? 5 : 3;
  const state = constructionVisualState(building);

  const ground = mesh(
    new THREE.BoxGeometry(width, 0.08, depth),
    materials.soil,
    0,
    0.04,
    0,
  );
  group.add(ground);
  addCornerStakes(group, width, depth);

  if (state.stageIndex >= 1) {
    group.add(
      mesh(
        new THREE.BoxGeometry(width * 0.94, 0.24, depth * 0.94),
        materials.concrete,
        0,
        0.12,
        0,
      ),
    );
  }

  if (state.stageIndex >= 2) {
    addFrame(group, width, depth, height);
  }

  if (state.stageIndex >= 3) {
    const shellHeight = height * (state.stage === "SHELL" ? 0.72 : 0.95);
    const shell = mesh(
      new THREE.BoxGeometry(width * 0.9, shellHeight, depth * 0.9),
      materials.shell,
      0,
      shellHeight / 2 + 0.15,
      0,
    );
    shell.castShadow = false;
    group.add(shell);
  }

  if (state.stageIndex >= 2) {
    addScaffold(group, width, depth, height);
  }

  addMaterialStacks(group, width, depth);
  addSiteClutter(group, width, depth);
  if (state.stageIndex >= 4) {
    addFinishingDetails(group, width, depth, height);
  }
  addProgressFlag(group, width, state.progress);

  group.position.set(building.position.x, 0, building.position.z);
  group.rotation.y = building.rotationY;
  group.userData.constructionStage = state.stage;
  group.userData.constructionProgress = state.progress;
  group.userData.buildingId = building.id;
  return group;
}

export function createBuilderObject(): THREE.Group {
  const group = new THREE.Group();

  const body = mesh(
    new THREE.CapsuleGeometry(0.28, 0.72, 4, 7),
    materials.worker,
    0,
    0.78,
    0,
  );
  group.add(body);

  const head = mesh(
    new THREE.SphereGeometry(0.22, 8, 6),
    materials.skin,
    0,
    1.42,
    0,
  );
  group.add(head);

  const hat = mesh(
    new THREE.CylinderGeometry(0.3, 0.36, 0.12, 8),
    materials.gold,
    0,
    1.62,
    0,
  );
  group.add(hat);

  const hammer = mesh(
    new THREE.BoxGeometry(0.08, 0.62, 0.08),
    materials.timberDark,
    0.42,
    0.9,
    0,
  );
  hammer.rotation.z = -0.3;
  hammer.userData.builderHammer = true;
  group.add(hammer);

  group.userData.builderActor = true;
  return group;
}
