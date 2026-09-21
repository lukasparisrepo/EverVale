import * as THREE from "three";
import type { PropCatalogEntryDto } from "@evervale/protocol/world";

const palette = {
  wood: 0x7a5a3e,
  darkWood: 0x5d4432,
  leafA: 0x5f7f55,
  leafB: 0x789267,
  stone: 0x9b9688,
  darkStone: 0x6f7069,
  metal: 0x555b58,
  copper: 0xa77845,
  cream: 0xdacda9,
  flowerA: 0xc98879,
  flowerB: 0xd8b45f,
  water: 0x6fa6ad,
  red: 0xa95e55,
};

const matCache = new Map<string, THREE.MeshStandardMaterial>();

function mat(name: keyof typeof palette, roughness = 0.9): THREE.MeshStandardMaterial {
  const key = `${name}:${roughness}`;
  let value = matCache.get(key);
  if (!value) {
    value = new THREE.MeshStandardMaterial({
      color: palette[name],
      roughness,
      metalness: name === "metal" || name === "copper" ? 0.25 : 0,
    });
    matCache.set(key, value);
  }
  return value;
}

function emissiveLamp(): THREE.MeshStandardMaterial {
  const key = "lamp";
  let value = matCache.get(key);
  if (!value) {
    value = new THREE.MeshStandardMaterial({
      color: 0xffd99a,
      emissive: 0xffb85f,
      emissiveIntensity: 1.1,
      roughness: 0.5,
    });
    matCache.set(key, value);
  }
  return value;
}

function hash(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded01(seed: string, salt: number): number {
  let a = (hash(seed) + salt * 0x9e3779b9) >>> 0;
  a ^= a << 13;
  a ^= a >>> 17;
  a ^= a << 5;
  return (a >>> 0) / 4294967296;
}

function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function addTree(
  group: THREE.Group,
  seed: string,
  kind: "tree_oak" | "tree_pine" | "tree_birch",
): void {
  const lean=(seeded01(seed,71)-0.5)*0.12;
  const pine=kind==="tree_pine";
  const birch=kind==="tree_birch";
  const trunkMaterial=birch ? mat("cream") : mat("wood");
  const trunkHeight=pine ? 2.55 : 2.2;
  const trunk=mesh(
    new THREE.CylinderGeometry(pine ? 0.14 : 0.18,pine ? 0.22 : 0.28,trunkHeight,7),
    trunkMaterial,
    0,
    trunkHeight/2,
    0,
  );
  trunk.rotation.z=lean;
  group.add(trunk);

  if (birch) {
    for (const y of [0.65,1.15,1.62]) {
      const band=mesh(new THREE.CylinderGeometry(0.192,0.192,0.08,7),mat("darkStone"),lean*y,y,0,false);
      group.add(band);
    }
  }

  if (pine) {
    for (let i=0;i<4;i+=1) {
      const radius=1.05-i*0.15;
      const crown=mesh(
        new THREE.ConeGeometry(radius,1.35,8),
        i%2===0 ? mat("leafA") : mat("leafB"),
        (seeded01(seed,i+4)-0.5)*0.12,
        1.72+i*0.55,
        (seeded01(seed,i+12)-0.5)*0.12,
        i<2,
      );
      crown.rotation.y=seeded01(seed,i+30)*Math.PI;
      group.add(crown);
    }
    return;
  }

  const crownLayout=kind==="tree_oak"
    ? [[-0.48,2.2,0.08,1.0],[0.42,2.35,0.16,0.9],[0,2.78,-0.16,1.04],[-0.08,2.5,0.42,0.78]]
    : [[-0.3,2.18,0.08,0.75],[0.32,2.35,-0.02,0.72],[0.03,2.65,-0.18,0.78]];

  crownLayout.forEach(([x,y,z,s],i)=>{
    const crown=mesh(
      new THREE.DodecahedronGeometry(s,0),
      i%2===0 ? mat("leafA") : mat("leafB"),
      x+(seeded01(seed,i)-0.5)*0.16,
      y+(seeded01(seed,i+10)-0.5)*0.12,
      z+(seeded01(seed,i+20)-0.5)*0.16,
      i<2,
    );
    crown.scale.set(
      0.88+seeded01(seed,i+40)*0.2,
      0.82+seeded01(seed,i+50)*0.28,
      0.88+seeded01(seed,i+60)*0.2,
    );
    crown.rotation.y=seeded01(seed,i+70)*Math.PI;
    group.add(crown);
  });
}

function addBench(group: THREE.Group, metal = false): void {
  const main = metal ? mat("metal") : mat("wood");
  const dark = metal ? mat("darkStone") : mat("darkWood");
  const seat = mesh(new THREE.BoxGeometry(1.8, 0.14, 0.5), main, 0, 0.68, 0);
  const back = mesh(new THREE.BoxGeometry(1.8, 0.12, 0.55), main, 0, 1.02, -0.22);
  back.rotation.x = -0.12;
  group.add(seat, back);
  for (const x of [-0.7, 0.7]) {
    group.add(mesh(new THREE.BoxGeometry(0.12, 0.7, 0.12), dark, x, 0.34, 0));
  }
}

function addFlowerBed(group: THREE.Group, seed: string): void {
  const soil = mesh(new THREE.BoxGeometry(2, 0.18, 1), mat("darkWood"), 0, 0.09, 0);
  group.add(soil);
  for (let i = 0; i < 11; i += 1) {
    const x = -0.8 + seeded01(seed, i) * 1.6;
    const z = -0.35 + seeded01(seed, i + 20) * 0.7;
    const stem = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.32, 5), mat("leafA"), x, 0.31, z);
    const blossom = mesh(
      new THREE.OctahedronGeometry(0.10 + seeded01(seed, i + 40) * 0.05, 0),
      i % 2 ? mat("flowerA") : mat("flowerB"),
      x,
      0.5,
      z,
    );
    group.add(stem, blossom);
  }
}

function addLamp(group: THREE.Group): void {
  group.add(mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.7, 8), mat("metal"), 0, 1.35, 0));
  const cap = mesh(new THREE.CylinderGeometry(0.28, 0.18, 0.18, 8), mat("copper"), 0, 2.74, 0);
  group.add(cap);
  const light = mesh(new THREE.SphereGeometry(0.22, 10, 7), emissiveLamp(), 0, 2.52, 0);
  light.userData.propGlow = true;
  group.add(light);
}

function addFountain(group: THREE.Group): void {
  const base = mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.35, 16), mat("stone"), 0, 0.18, 0);
  const basin = mesh(new THREE.CylinderGeometry(1.45, 1.6, 0.28, 16), mat("darkStone"), 0, 0.42, 0);
  const water = mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.05, 20), mat("water", 0.35), 0, 0.58, 0);
  water.userData.propWater = true;
  const column = mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.6, 10), mat("stone"), 0, 1.25, 0);
  const bowl = mesh(new THREE.CylinderGeometry(0.7, 0.5, 0.18, 14), mat("stone"), 0, 2.02, 0);
  group.add(base, basin, water, column, bowl);
}

function addPicnicTable(group: THREE.Group): void {
  const top = mesh(new THREE.BoxGeometry(2.2, 0.16, 0.9), mat("wood"), 0, 0.9, 0);
  group.add(top);
  for (const z of [-0.75, 0.75]) {
    group.add(mesh(new THREE.BoxGeometry(2.2, 0.12, 0.35), mat("wood"), 0, 0.58, z));
  }
  for (const x of [-0.65, 0.65]) {
    const leg = mesh(new THREE.BoxGeometry(0.12, 0.8, 0.12), mat("darkWood"), x, 0.43, 0);
    leg.rotation.z = x < 0 ? -0.22 : 0.22;
    group.add(leg);
  }
}

function addSwing(group: THREE.Group): void {
  const wood = mat("wood");
  for (const x of [-1.2, 1.2]) {
    const post = mesh(new THREE.CylinderGeometry(0.08, 0.11, 2.5, 7), wood, x, 1.25, 0);
    post.rotation.z = x < 0 ? -0.12 : 0.12;
    group.add(post);
  }
  const top = mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 7), wood, 0, 2.38, 0);
  top.rotation.z = Math.PI / 2;
  group.add(top);
  for (const x of [-0.55, 0.55]) {
    for (const dx of [-0.18, 0.18]) {
      const rope = mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.25, 5), mat("darkStone"), x + dx, 1.7, 0);
      group.add(rope);
    }
    const seat = mesh(new THREE.BoxGeometry(0.55, 0.08, 0.28), mat("darkWood"), x, 1.08, 0);
    group.add(seat);
  }
}

function addFence(group: THREE.Group): void {
  const wood = mat("wood");
  for (const x of [-0.9, 0.9]) {
    group.add(mesh(new THREE.BoxGeometry(0.12, 1.15, 0.12), wood, x, 0.57, 0));
  }
  for (const y of [0.42, 0.82]) {
    group.add(mesh(new THREE.BoxGeometry(2, 0.12, 0.12), wood, 0, y, 0));
  }
}

function addHay(group: THREE.Group): void {
  const hay = mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.1, 10), mat("flowerB"), 0, 0.48, 0);
  hay.rotation.z = Math.PI / 2;
  group.add(hay);
  for (const x of [-0.28, 0.28]) {
    const band = mesh(new THREE.TorusGeometry(0.49, 0.025, 5, 12), mat("darkWood"), x, 0.48, 0);
    band.rotation.y = Math.PI / 2;
    group.add(band);
  }
}

function addTrough(group: THREE.Group): void {
  const body = mesh(new THREE.BoxGeometry(2.4, 0.55, 0.95), mat("wood"), 0, 0.36, 0);
  body.scale.y = 0.7;
  group.add(body);
  const water = mesh(new THREE.BoxGeometry(2.0, 0.04, 0.62), mat("water", 0.35), 0, 0.62, 0);
  water.userData.propWater = true;
  group.add(water);
}

function addDuckHouse(group: THREE.Group): void {
  const body = mesh(new THREE.BoxGeometry(1.35, 0.9, 1.25), mat("cream"), 0, 0.68, 0);
  group.add(body);
  const roof = mesh(new THREE.ConeGeometry(1.05, 0.65, 4), mat("red"), 0, 1.45, 0);
  roof.rotation.y = Math.PI / 4;
  group.add(roof);
  const door = mesh(new THREE.BoxGeometry(0.42, 0.55, 0.08), mat("darkWood"), 0, 0.56, 0.66);
  group.add(door);
}

function addGeneric(group: THREE.Group, meta: PropCatalogEntryDto): void {
  const groupMat =
    meta.group === "vegetation" ? mat("leafA") :
    meta.group === "street" ? mat("metal") :
    meta.group === "rural" ? mat("wood") :
    meta.group === "water" ? mat("water", 0.45) :
    meta.group === "seasonal" ? mat("flowerA") :
    mat("stone");

  const box = mesh(
    new THREE.BoxGeometry(
      Math.max(0.25, meta.sizeXMeters * 0.72),
      Math.max(0.25, Math.min(1.6, Math.max(meta.sizeXMeters, meta.sizeZMeters) * 0.55)),
      Math.max(0.25, meta.sizeZMeters * 0.72),
    ),
    groupMat,
    0,
    Math.max(0.18, Math.min(0.8, Math.max(meta.sizeXMeters, meta.sizeZMeters) * 0.28)),
    0,
  );
  group.add(box);
}

export function createPropObject(
  meta: PropCatalogEntryDto,
  instanceSeed: string,
): THREE.Group {
  const group = new THREE.Group();
  group.userData.propDefinitionId = meta.id;

  switch (meta.id) {
    case "tree_oak":
    case "tree_pine":
    case "tree_birch":
      addTree(group, instanceSeed, meta.id);
      break;
    case "flower_bed":
    case "planter":
      addFlowerBed(group, instanceSeed);
      break;
    case "bench_wood":
      addBench(group, false);
      break;
    case "bench_metal":
      addBench(group, true);
      break;
    case "lamp_post":
    case "winter_lantern":
      addLamp(group);
      break;
    case "fountain":
      addFountain(group);
      break;
    case "picnic_table":
    case "festival_table":
      addPicnicTable(group);
      break;
    case "playground_swing":
      addSwing(group);
      break;
    case "farm_fence":
      addFence(group);
      break;
    case "hay_bale":
      addHay(group);
      break;
    case "water_trough":
      addTrough(group);
      break;
    case "duck_house":
      addDuckHouse(group);
      break;
    default:
      addGeneric(group, meta);
      break;
  }

  const variation = 0.96 + seeded01(instanceSeed, 91) * 0.08;
  group.scale.setScalar(variation);
  return group;
}

export function makeSelectionRing(
  sizeX: number,
  sizeZ: number,
  color = 0xf0c76c,
): THREE.LineLoop {
  const x = sizeX / 2 + 0.15;
  const z = sizeZ / 2 + 0.15;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-x, 0.05, -z),
    new THREE.Vector3(x, 0.05, -z),
    new THREE.Vector3(x, 0.05, z),
    new THREE.Vector3(-x, 0.05, z),
  ]);
  return new THREE.LineLoop(
    geometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }),
  );
}
