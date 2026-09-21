import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const citizenMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.92,
});
citizenMaterial.userData.sharedMaterial = true;

const animalMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.96,
});
animalMaterial.userData.sharedMaterial = true;

const palettes = [
  { coat: 0x65798b, shirt: 0xd8c89f, trouser: 0x4f5658, hair: 0x4b392f, skin: 0xc99572, accent: 0xa66c58 },
  { coat: 0x6b805e, shirt: 0xe2d5b7, trouser: 0x5f5146, hair: 0x5a4735, skin: 0xd1a17d, accent: 0xb8834f },
  { coat: 0x8a655f, shirt: 0xd9c9b5, trouser: 0x4e5562, hair: 0x3f342d, skin: 0xb98262, accent: 0x637f77 },
  { coat: 0x7b7259, shirt: 0xe7dcc3, trouser: 0x515d50, hair: 0x67503e, skin: 0xd4a27b, accent: 0x985f56 },
] as const;

function colorGeometry(
  geometry: THREE.BufferGeometry,
  color: number,
  matrix: THREE.Matrix4,
): THREE.BufferGeometry {
  const value = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  value.applyMatrix4(matrix);
  const count = value.getAttribute("position").count;
  const c = new THREE.Color(color);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  value.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return value;
}

function part(
  geometry: THREE.BufferGeometry,
  color: number,
  position: THREE.Vector3,
  rotation = new THREE.Euler(),
  scale = new THREE.Vector3(1, 1, 1),
): THREE.BufferGeometry {
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion().setFromEuler(rotation);
  matrix.compose(position, quaternion, scale);
  return colorGeometry(geometry, color, matrix);
}

export function createCitizenVisual(
  index: number,
  child: boolean,
  castShadow: boolean,
): THREE.Mesh {
  const p = palettes[index % palettes.length]!;
  const s = child ? 0.78 : 1;
  const pieces: THREE.BufferGeometry[] = [];

  pieces.push(part(
    new THREE.CapsuleGeometry(0.27 * s, 0.58 * s, 4, 7),
    p.coat,
    new THREE.Vector3(0, 0.9 * s, 0),
  ));

  pieces.push(part(
    new THREE.SphereGeometry(0.245 * s, 9, 7),
    p.skin,
    new THREE.Vector3(0, 1.55 * s, 0),
  ));

  pieces.push(part(
    new THREE.SphereGeometry(0.255 * s, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55),
    p.hair,
    new THREE.Vector3(0, 1.65 * s, -0.015 * s),
  ));

  for (const side of [-1, 1] as const) {
    pieces.push(part(
      new THREE.CapsuleGeometry(0.075 * s, 0.48 * s, 3, 5),
      p.shirt,
      new THREE.Vector3(side * 0.34 * s, 0.94 * s, 0),
      new THREE.Euler(0, 0, side * 0.12),
    ));
    pieces.push(part(
      new THREE.CapsuleGeometry(0.085 * s, 0.44 * s, 3, 5),
      p.trouser,
      new THREE.Vector3(side * 0.13 * s, 0.32 * s, 0),
      new THREE.Euler(0, 0, side * 0.04),
    ));
  }

  if (!child && index % 3 === 0) {
    pieces.push(part(
      new THREE.CylinderGeometry(0.29 * s, 0.35 * s, 0.13 * s, 10),
      p.accent,
      new THREE.Vector3(0, 1.83 * s, 0),
    ));
  }

  if (!child && index % 4 === 1) {
    pieces.push(part(
      new THREE.BoxGeometry(0.24 * s, 0.38 * s, 0.12 * s),
      p.accent,
      new THREE.Vector3(0.31 * s, 0.78 * s, -0.12 * s),
      new THREE.Euler(0, 0, -0.16),
    ));
  }

  const geometry = mergeGeometries(pieces, false);
  pieces.forEach((value) => value.dispose());
  if (!geometry) throw new Error("CITIZEN_VISUAL_MERGE_FAILED");

  const mesh = new THREE.Mesh(geometry, citizenMaterial);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  mesh.userData.visualBaseY = 0;
  mesh.userData.visualScale = s;
  return mesh;
}

export function animateCitizenVisual(
  citizen: THREE.Mesh,
  time: number,
  moving: boolean,
  index: number,
): void {
  const phase = time / (moving ? 145 : 420) + index * 0.73;
  const bob = moving ? Math.abs(Math.sin(phase)) * 0.055 : Math.sin(phase) * 0.012;
  citizen.position.y = bob;
  citizen.rotation.z = moving ? Math.sin(phase) * 0.025 : 0;
}

export function createDogVisual(): THREE.Mesh {
  const fur = 0x9b704d;
  const furDark = 0x5c4333;
  const cream = 0xd9c39f;
  const pieces: THREE.BufferGeometry[] = [];

  pieces.push(part(
    new THREE.CapsuleGeometry(0.23, 0.62, 4, 7),
    fur,
    new THREE.Vector3(0, 0.44, 0),
    new THREE.Euler(0, 0, Math.PI / 2),
  ));
  pieces.push(part(
    new THREE.SphereGeometry(0.27, 8, 6),
    fur,
    new THREE.Vector3(0.47, 0.62, 0),
  ));
  pieces.push(part(
    new THREE.ConeGeometry(0.12, 0.28, 5),
    furDark,
    new THREE.Vector3(0.45, 0.91, -0.16),
    new THREE.Euler(-0.18, 0, -0.3),
  ));
  pieces.push(part(
    new THREE.ConeGeometry(0.12, 0.28, 5),
    furDark,
    new THREE.Vector3(0.45, 0.91, 0.16),
    new THREE.Euler(0.18, 0, -0.3),
  ));
  pieces.push(part(
    new THREE.CylinderGeometry(0.055, 0.075, 0.62, 6),
    furDark,
    new THREE.Vector3(-0.56, 0.67, 0),
    new THREE.Euler(0, 0, -0.86),
  ));

  for (const x of [-0.3, 0.28]) {
    for (const z of [-0.16, 0.16]) {
      pieces.push(part(
        new THREE.CylinderGeometry(0.055, 0.065, 0.38, 6),
        z < 0 ? fur : cream,
        new THREE.Vector3(x, 0.2, z),
      ));
    }
  }

  const geometry = mergeGeometries(pieces, false);
  pieces.forEach((value) => value.dispose());
  if (!geometry) throw new Error("DOG_VISUAL_MERGE_FAILED");
  const dog = new THREE.Mesh(geometry, animalMaterial);
  dog.castShadow = true;
  dog.receiveShadow = true;
  return dog;
}
