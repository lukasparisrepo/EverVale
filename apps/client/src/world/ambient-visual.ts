import * as THREE from "three";

export interface AmbientVisualRig {
  motes: THREE.Points;
  fireflies: THREE.Points;
}

function makePoints(count: number, radius: number, yMin: number, yMax: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const a = i * 2.399963229728653;
    const r = radius * (0.22 + ((i * 37) % 83) / 100);
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = yMin + (((i * 53) % 97) / 96) * (yMax - yMin);
    positions[i * 3 + 2] = Math.sin(a) * r;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

export function createAmbientVisuals(scene: THREE.Scene): AmbientVisualRig {
  const moteMaterial = new THREE.PointsMaterial({
    color: 0xe9dec0,
    size: 0.09,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
    sizeAttenuation: true,
  });
  moteMaterial.userData.sharedMaterial = true;
  const motes = new THREE.Points(makePoints(46, 40, 0.8, 7.5), moteMaterial);
  motes.userData.ambientVisual = true;
  scene.add(motes);

  const fireflyMaterial = new THREE.PointsMaterial({
    color: 0xffd57b,
    size: 0.16,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    sizeAttenuation: true,
  });
  fireflyMaterial.userData.sharedMaterial = true;
  const fireflies = new THREE.Points(makePoints(22, 29, 0.45, 3.2), fireflyMaterial);
  fireflies.userData.ambientVisual = true;
  scene.add(fireflies);

  return { motes, fireflies };
}

export function updateAmbientVisuals(
  rig: AmbientVisualRig,
  time: number,
  nightFactor: number,
): void {
  rig.motes.rotation.y = time * 0.000018;
  rig.motes.position.y = Math.sin(time * 0.00042) * 0.18;

  rig.fireflies.rotation.y = -time * 0.000025;
  rig.fireflies.position.y = Math.sin(time * 0.00075) * 0.12;
  const material = rig.fireflies.material as THREE.PointsMaterial;
  material.opacity = Math.max(0, (nightFactor - 0.28) * 0.72);
}
