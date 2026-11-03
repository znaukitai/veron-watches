/**
 * [ARGON_CORE] 3D Horological Assembly & GLTF/GLB Ready Architecture
 *
 * Node Hierarchy (prepared for drop-in .glb / .gltf replacement or procedural master calibre):
 * - Node_SapphireCrystal (offsetY: +2.15 in exploded mode)
 * - Node_Hands           (offsetY: +1.32 in exploded mode)
 * - Node_Dial            (offsetY: +0.58 in exploded mode)
 * - Node_Movement        (offsetY: -0.22 in exploded mode)
 * - Node_Case            (offsetY: -1.05 in exploded mode)
 * - Node_CaseBack        (offsetY: -1.95 in exploded mode)
 * - Node_Strap           (attached to Case assembly)
 */

import * as THREE from 'three';
import type {
  CaseOption,
  DialOption,
  StrapOption,
  HandsOption,
  WatchModelId,
} from '../../store/watchStore';
import {
  createSunrayDialTexture,
  createGuillocheNormalMap,
  createHorologicalDialFaceTexture,
  createCotesDeGeneveTexture,
  createAlligatorLeatherTexture,
  createCasebackEngravingTexture,
} from '../proceduralTextures';

export interface WatchAssemblyRefs {
  rootGroup: THREE.Group;
  crystalGroup: THREE.Group;
  handsGroup: THREE.Group;
  dialGroup: THREE.Group;
  movementGroup: THREE.Group;
  caseGroup: THREE.Group;
  caseBackGroup: THREE.Group;
  strapGroup: THREE.Group;

  // Animated mechanical parts
  hourHand: THREE.Object3D;
  minuteHand: THREE.Object3D;
  secondHand: THREE.Object3D;
  balanceWheel: THREE.Object3D;
  escapementGear: THREE.Object3D;
  centerWheel: THREE.Object3D;

  // Dynamic materials for real-time configurator updates without scene reload
  materials: {
    casePolished: THREE.MeshPhysicalMaterial;
    caseBrushed: THREE.MeshStandardMaterial;
    dialBase: THREE.MeshStandardMaterial;
    dialSubring: THREE.MeshStandardMaterial;
    indicesMetal: THREE.MeshStandardMaterial;
    handsPrimary: THREE.MeshPhysicalMaterial;
    strapMaterial: THREE.MeshStandardMaterial;
    stitchingMaterial: THREE.MeshStandardMaterial;
    crystalGlass: THREE.MeshPhysicalMaterial;
    movementBridge: THREE.MeshStandardMaterial;
    movementPerlage: THREE.MeshStandardMaterial;
    movementGoldGear: THREE.MeshStandardMaterial;
    rubyJewel: THREE.MeshPhysicalMaterial;
    bluedScrew: THREE.MeshStandardMaterial;
    engravingPlaneMat: THREE.MeshBasicMaterial;
  };

  // Helper methods
  updateConfiguration: (config: {
    modelId: WatchModelId;
    caseMaterial: CaseOption;
    dialColor: DialOption;
    strapType: StrapOption;
    handsStyle: HandsOption;
    engravingText: string;
  }) => void;
  setExplodedState: (progress: number, verticalScale?: number) => void;
  tickMechanics: (elapsedSeconds: number, delta: number) => void;
  dispose: () => void;
}

/**
 * Creates a finely toothed horological gear wheel geometry with chamfered spokes
 */
function createGearGeometry(
  innerRadius: number,
  outerRadius: number,
  teeth: number,
  thickness: number,
  spokes = 5
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  const toothRoot = outerRadius * 0.89;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.45;
    const a3 = a0 + step * 0.72;

    if (i === 0) {
      shape.moveTo(Math.cos(a0) * toothRoot, Math.sin(a0) * toothRoot);
    } else {
      shape.lineTo(Math.cos(a0) * toothRoot, Math.sin(a0) * toothRoot);
    }
    shape.lineTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius);
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
    shape.lineTo(Math.cos(a3) * toothRoot, Math.sin(a3) * toothRoot);
  }
  shape.closePath();

  if (innerRadius > 0.08 && spokes > 0) {
    const windowSpread = (Math.PI * 2) / spokes;
    for (let s = 0; s < spokes; s++) {
      const hole = new THREE.Path();
      const sa0 = s * windowSpread + 0.16;
      const sa1 = (s + 1) * windowSpread - 0.16;
      const rIn = innerRadius * 0.34;
      const rOut = innerRadius * 0.92;

      hole.moveTo(Math.cos(sa0) * rIn, Math.sin(sa0) * rIn);
      hole.lineTo(Math.cos(sa0) * rOut, Math.sin(sa0) * rOut);
      hole.absarc(0, 0, rOut, sa0, sa1, false);
      hole.lineTo(Math.cos(sa1) * rIn, Math.sin(sa1) * rIn);
      hole.absarc(0, 0, rIn, sa1, sa0, true);
      shape.holes.push(hole);
    }
  }

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.004,
    bevelThickness: 0.004,
  });
  geom.rotateX(Math.PI / 2);
  geom.center();
  return geom;
}

/**
 * Creates a true 3D diamond-faceted Dauphine hand geometry with a central longitudinal ridge
 * so light splits sharply across the left and right halves of each hand (authentic Haute Horlogerie).
 */
function createFacetedDauphineHandGeometry(
  length: number,
  tailLength: number,
  halfWidth: number,
  ridgeHeight: number,
  isSkeleton: boolean
): THREE.BufferGeometry {
  if (isSkeleton && length > 0.6) {
    // Openworked architectural skeleton hand with central cutout
    const shape = new THREE.Shape();
    shape.moveTo(0, -tailLength);
    shape.lineTo(halfWidth, 0);
    shape.lineTo(0, length);
    shape.lineTo(-halfWidth, 0);
    shape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(0, length * 0.14);
    hole.lineTo(halfWidth * 0.46, length * 0.28);
    hole.lineTo(0, length * 0.74);
    hole.lineTo(-halfWidth * 0.46, length * 0.28);
    hole.closePath();
    shape.holes.push(hole);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: ridgeHeight * 0.7,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: halfWidth * 0.14,
      bevelThickness: ridgeHeight * 0.35,
    });
    geom.rotateX(-Math.PI / 2);
    return geom;
  }

  // True 4-plane diamond-cut Dauphine hand with raised central spine along Y
  const positions = new Float32Array([
    // Left top facet (Tip -> Left Flank -> Center Spine)
    0, 0.005, -length,
    -halfWidth, 0.004, 0,
    0, ridgeHeight, 0,

    // Right top facet (Tip -> Center Spine -> Right Flank)
    0, 0.005, -length,
    0, ridgeHeight, 0,
    halfWidth, 0.004, 0,

    // Left tail facet (Tail -> Center Spine -> Left Flank)
    0, 0.005, tailLength,
    0, ridgeHeight, 0,
    -halfWidth, 0.004, 0,

    // Right tail facet (Tail -> Right Flank -> Center Spine)
    0, 0.005, tailLength,
    halfWidth, 0.004, 0,
    0, ridgeHeight, 0,
  ]);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates a sculpted curved watch lug (Corne) that flows organically from the outer middle case band
 * down toward the wrist with a beveled outer chamfer, without protruding inside the dial opening.
 */
function createSculptedLugGeometry(isRightSide: boolean, isBottomSide: boolean): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  // Profile in XY (Width x Length) — starts at -0.08 on the outer case wall (r ≈ 1.94)
  shape.moveTo(-0.20, -0.08);
  shape.lineTo(0.20, -0.08);
  shape.lineTo(0.19, 0.08);
  shape.quadraticCurveTo(0.17, 0.42, 0.105, 0.66);
  shape.lineTo(-0.105, 0.66);
  shape.quadraticCurveTo(-0.17, 0.42, -0.19, 0.08);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 4,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });

  geom.rotateX(Math.PI / 2);
  // Apply ergonomic downward wrist curvature safely (clamp t >= 0 to prevent NaN)
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i);
    const y = pos.getY(i);
    const x = pos.getX(i);
    const t = Math.max(0, (z + 0.08) / 0.76);
    const drop = Math.pow(t, 1.65) * 0.24;
    const taperX = x * (1 - t * 0.18);
    pos.setY(i, y - drop);
    pos.setX(i, taperX + (isRightSide ? -0.03 * t : 0.03 * t));
    if (!isBottomSide) {
      pos.setZ(i, -z);
    }
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  geom.computeBoundingSphere();
  return geom;
}

export function buildHorologicalWatchAssembly(): WatchAssemblyRefs {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'VERON_Master_Assembly';

  const sunrayTex = createSunrayDialTexture();
  const guillocheNormalTex = createGuillocheNormalMap();
  const cotesTex = createCotesDeGeneveTexture();
  const leatherTex = createAlligatorLeatherTexture();
  let currentDialFaceTex = createHorologicalDialFaceTexture('obsidian', 'no-01-classic');
  let currentEngravingTex = createCasebackEngravingTexture('EST. MMXXVI', 'VÉRON No. 01');

  // 1. Physically Based Materials (Calibrated for PMREM Studio Environment)
  const materials = {
    casePolished: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D5BA88'),
      metalness: 1.0,
      roughness: 0.08,
      clearcoat: 0.4,
      clearcoatRoughness: 0.06,
      reflectivity: 1.0,
      envMapIntensity: 2.1,
    }),
    caseBrushed: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C2A572'),
      metalness: 0.94,
      roughness: 0.26,
      bumpMap: sunrayTex,
      bumpScale: 0.004,
      envMapIntensity: 1.55,
    }),
    dialBase: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0D0C0A'),
      normalMap: guillocheNormalTex,
      normalScale: new THREE.Vector2(0.38, 0.38),
      metalness: 0.38,
      roughness: 0.32,
      envMapIntensity: 0.25,
    }),
    dialSubring: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4BA8A'),
      metalness: 0.98,
      roughness: 0.10,
      envMapIntensity: 2.15,
    }),
    indicesMetal: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F0D9A8'),
      metalness: 1.0,
      roughness: 0.04,
      envMapIntensity: 2.85,
    }),
    handsPrimary: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F5E0B2'),
      metalness: 1.0,
      roughness: 0.03,
      clearcoat: 0.85,
      clearcoatRoughness: 0.02,
      envMapIntensity: 3.1,
      side: THREE.DoubleSide,
    }),
    strapMaterial: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1B1715'),
      metalness: 0.08,
      roughness: 0.44,
      bumpMap: leatherTex,
      bumpScale: 0.018,
      envMapIntensity: 0.95,
    }),
    stitchingMaterial: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B49A70'),
      metalness: 0.18,
      roughness: 0.52,
    }),
    crystalGlass: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      transparent: true,
      opacity: 1.0,
      metalness: 0.0,
      roughness: 0.01,
      transmission: 0.94,
      thickness: 1.4,
      ior: 1.77, // Sapphire Corundum
      attenuationColor: new THREE.Color('#d4e8ff'),
      attenuationDistance: 2.5,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      envMapIntensity: 3.0,
      side: THREE.FrontSide,
      depthWrite: false,
    }),
    movementBridge: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C4C2BC'),
      metalness: 0.91,
      roughness: 0.22,
      bumpMap: cotesTex,
      bumpScale: 0.007,
      envMapIntensity: 1.65,
    }),
    movementPerlage: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#6E6C66'),
      metalness: 0.86,
      roughness: 0.34,
      bumpMap: sunrayTex,
      bumpScale: 0.006,
      envMapIntensity: 1.25,
    }),
    movementGoldGear: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D2B274'),
      metalness: 0.96,
      roughness: 0.14,
      envMapIntensity: 1.95,
    }),
    rubyJewel: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#B8143E'),
      metalness: 0.08,
      roughness: 0.05,
      transparent: true,
      opacity: 0.92,
      ior: 1.76,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.1,
      side: THREE.FrontSide,
    }),
    bluedScrew: new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1E4682'),
      metalness: 0.96,
      roughness: 0.12,
      envMapIntensity: 1.85,
    }),
    engravingPlaneMat: new THREE.MeshBasicMaterial({
      map: currentEngravingTex,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    }),
  };

  // Eliminate redundant RTT multi-sample blur passes on sapphire crystal per frame
  (materials.crystalGlass as THREE.MeshPhysicalMaterial & { samples?: number }).samples = 0;

  // Sub-Groups matching Exploded View Architecture
  const crystalGroup = new THREE.Group();
  crystalGroup.name = 'sapphire-crystal';

  const handsGroup = new THREE.Group();
  handsGroup.name = 'hands';

  const dialGroup = new THREE.Group();
  dialGroup.name = 'dial';

  const movementGroup = new THREE.Group();
  movementGroup.name = 'movement';

  const caseGroup = new THREE.Group();
  caseGroup.name = 'case';

  const caseBackGroup = new THREE.Group();
  caseBackGroup.name = 'case-back';

  const strapGroup = new THREE.Group();
  strapGroup.name = 'strap';

  // ============================================================================
  // LAYER 01: SAPPHIRE CRYSTAL (Box-Domed Glace Saphir via LatheGeometry)
  // ============================================================================
  const crystalPoints: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const r = t * 1.74;
    // Box-domed profile: subtle arch across the dial, then steep box wall at the perimeter
    const arch = Math.cos(t * Math.PI * 0.5) * 0.095;
    crystalPoints.push(new THREE.Vector2(r, 0.34 + arch));
  }
  const crystalDomeGeom = new THREE.LatheGeometry(crystalPoints, 84);
  const crystalMesh = new THREE.Mesh(crystalDomeGeom, materials.crystalGlass);
  crystalGroup.add(crystalMesh);

  // Precision Chamfered Corundum Bevel Ring around the Sapphire Perimeter (Ensures clear silhouette in Exploded View)
  const crystalBevelRingGeom = new THREE.TorusGeometry(1.735, 0.02, 20, 84);
  crystalBevelRingGeom.rotateX(Math.PI / 2);
  const crystalBevelMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#dceaff'),
    transparent: true,
    opacity: 0.42,
    roughness: 0.02,
    metalness: 0.1,
    ior: 1.77,
    clearcoat: 1.0,
    envMapIntensity: 2.5,
    depthWrite: false,
  });
  const crystalBevelRing = new THREE.Mesh(crystalBevelRingGeom, crystalBevelMat);
  crystalBevelRing.position.y = 0.34;
  crystalGroup.add(crystalBevelRing);

  crystalGroup.traverse((obj) => {
    obj.userData = { partId: 'sapphire-crystal', label: 'Sapphire Crystal' };
  });

  // ============================================================================
  // LAYER 02: HANDS (3D Diamond-Faceted Dauphine & Counterpoised Seconds)
  // ============================================================================
  const hourHand = new THREE.Group();
  const minuteHand = new THREE.Group();
  const secondHand = new THREE.Group();

  const buildHandsMeshes = (style: HandsOption) => {
    hourHand.clear();
    minuteHand.clear();
    secondHand.clear();

    const isSkel = style === 'skeleton';
    const hGeom = createFacetedDauphineHandGeometry(0.96, 0.22, 0.098, 0.038, isSkel);
    const mGeom = createFacetedDauphineHandGeometry(1.42, 0.27, 0.074, 0.034, isSkel);

    const hMesh = new THREE.Mesh(hGeom, materials.handsPrimary);
    hourHand.add(hMesh);

    const mMesh = new THREE.Mesh(mGeom, materials.handsPrimary);
    minuteHand.add(mMesh);

    // Sweeping Seconds Hand with Breguet open counterweight ring
    const sShaftGeom = new THREE.CylinderGeometry(0.006, 0.013, 1.86, 12);
    sShaftGeom.rotateX(Math.PI / 2);
    sShaftGeom.translate(0, 0, -0.52);
    const sShaft = new THREE.Mesh(sShaftGeom, materials.dialSubring);
    secondHand.add(sShaft);

    const sRingGeom = new THREE.TorusGeometry(0.062, 0.011, 14, 32);
    sRingGeom.rotateX(Math.PI / 2);
    sRingGeom.translate(0, 0, 0.31);
    const sRing = new THREE.Mesh(sRingGeom, materials.dialSubring);
    secondHand.add(sRing);
  };

  buildHandsMeshes('classic');

  hourHand.position.y = 0.21;
  minuteHand.position.y = 0.242;
  secondHand.position.y = 0.272;

  // Central mirror-polished cannon pinion cap, collet & coaxial drive tube
  const pinionColletGeom = new THREE.CylinderGeometry(0.088, 0.105, 0.095, 32);
  const pinionCollet = new THREE.Mesh(pinionColletGeom, materials.indicesMetal);
  pinionCollet.position.y = 0.238;

  const pinionTubeGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.13, 24);
  const pinionTube = new THREE.Mesh(pinionTubeGeom, materials.caseBrushed);
  pinionTube.position.y = 0.16;

  const pinionCapGeom = new THREE.SphereGeometry(0.062, 24, 16);
  pinionCapGeom.scale(1, 0.38, 1);
  const pinionCap = new THREE.Mesh(pinionCapGeom, materials.casePolished);
  pinionCap.position.y = 0.286;

  handsGroup.add(hourHand, minuteHand, secondHand, pinionCollet, pinionTube, pinionCap);
  handsGroup.traverse((obj) => {
    obj.userData = { partId: 'hands', label: 'Hands' };
  });

  // ============================================================================
  // LAYER 03: MULTI-TIERED DIAL (Cadran Multi-Niveaux)
  // ============================================================================
  // Solid machined brass/gold dial plate carrier
  const dialCarrierGeom = new THREE.CylinderGeometry(1.74, 1.74, 0.056, 84);
  const dialCarrierMesh = new THREE.Mesh(dialCarrierGeom, materials.caseBrushed);
  dialCarrierMesh.position.y = 0.13;
  dialGroup.add(dialCarrierMesh);

  // Top Dial Face Plane (CircleGeometry rotated -PI/2 ensures 12 o'clock on CanvasTexture is strictly at -Z)
  const dialFaceGeom = new THREE.CircleGeometry(1.735, 84);
  dialFaceGeom.rotateX(-Math.PI / 2);
  const dialPlateMesh = new THREE.Mesh(dialFaceGeom, materials.dialBase);
  dialPlateMesh.position.y = 0.16;
  dialGroup.add(dialPlateMesh);

  // Silk-Screened Horological Typography & Chemin de Fer Overlay (Crisp contrast over #0D0C0A guilloché base)
  const dialPrintMat = new THREE.MeshBasicMaterial({
    map: currentDialFaceTex,
    transparent: true,
    depthWrite: false,
  });
  const dialPrintMesh = new THREE.Mesh(dialFaceGeom, dialPrintMat);
  dialPrintMesh.position.y = 0.1612;
  dialGroup.add(dialPrintMesh);

  // Sloped Rehaut (Internal Chapter Tension Ring)
  const rehautGeom = new THREE.CylinderGeometry(1.75, 1.64, 0.11, 84, 1, true);
  const rehautMesh = new THREE.Mesh(rehautGeom, materials.caseBrushed);
  rehautMesh.position.y = 0.21;
  dialGroup.add(rehautMesh);

  // Skeleton Chapter Ring (Remains visible even when main dial plate is hidden on No. 02 Skeleton)
  const skeletonChapterRingGeom = new THREE.RingGeometry(1.36, 1.72, 84);
  skeletonChapterRingGeom.rotateX(-Math.PI / 2);
  const skeletonChapterRing = new THREE.Mesh(skeletonChapterRingGeom, materials.movementPerlage);
  skeletonChapterRing.position.y = 0.161;
  skeletonChapterRing.visible = false;
  dialGroup.add(skeletonChapterRing);

  // Classic Dial Architecture (No. 01): Concentric Inner Medallion Ring + 6 o'clock Petite Seconde Subdial
  const classicSubdialGroup = new THREE.Group();

  const innerMedallionRingGeom = new THREE.TorusGeometry(1.11, 0.011, 16, 84);
  innerMedallionRingGeom.rotateX(Math.PI / 2);
  const innerMedallionRing = new THREE.Mesh(innerMedallionRingGeom, materials.dialSubring);
  innerMedallionRing.position.set(0, 0.165, 0);
  classicSubdialGroup.add(innerMedallionRing);

  const petiteSecondeRingGeom = new THREE.TorusGeometry(0.352, 0.015, 20, 64);
  petiteSecondeRingGeom.rotateX(Math.PI / 2);
  const petiteSecondeRing = new THREE.Mesh(petiteSecondeRingGeom, materials.dialSubring);
  petiteSecondeRing.position.set(0, 0.167, 0.63);
  classicSubdialGroup.add(petiteSecondeRing);

  // 3D Petite Seconde Hand at 6 o'clock
  const petiteSecondeHand = new THREE.Group();
  petiteSecondeHand.position.set(0, 0.175, 0.63);
  const psHandGeom = createFacetedDauphineHandGeometry(0.28, 0.07, 0.026, 0.014, false);
  const psHandMesh = new THREE.Mesh(psHandGeom, materials.handsPrimary);
  psHandMesh.rotation.y = 0.85;
  const psPinionGeom = new THREE.CylinderGeometry(0.025, 0.028, 0.025, 16);
  const psPinion = new THREE.Mesh(psPinionGeom, materials.casePolished);
  petiteSecondeHand.add(psHandMesh, psPinion);
  classicSubdialGroup.add(petiteSecondeHand);

  dialGroup.add(classicSubdialGroup);

  // Chronograph Twin Registers (Visible on No. 03 Chronograph — exact 1:1 match with ±218px texture offset)
  const chronoRegistersGroup = new THREE.Group();
  chronoRegistersGroup.visible = false;

  [-0.738, 0.738].forEach((rx, idx) => {
    const regRingGeom = new THREE.TorusGeometry(0.352, 0.015, 18, 64);
    regRingGeom.rotateX(Math.PI / 2);
    const regRing = new THREE.Mesh(regRingGeom, materials.dialSubring);
    regRing.position.set(rx, 0.167, 0);
    chronoRegistersGroup.add(regRing);

    const regHand = new THREE.Group();
    regHand.position.set(rx, 0.175, 0);
    const rhGeom = createFacetedDauphineHandGeometry(0.27, 0.06, 0.026, 0.014, false);
    const rhMesh = new THREE.Mesh(rhGeom, materials.handsPrimary);
    rhMesh.rotation.y = idx === 0 ? -0.45 : 1.15;
    const rhPinion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.024, 0.028, 0.025, 16),
      materials.casePolished
    );
    regHand.add(rhMesh, rhPinion);
    chronoRegistersGroup.add(regHand);
  });
  dialGroup.add(chronoRegistersGroup);

  // 12 Diamond-Beveled Applied Baton Hour Indices + 60 Gold Perlage Beads
  const indicesContainer = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const isDoubleBaton = i === 0;

    if (isDoubleBaton) {
      [-0.048, 0.048].forEach((offset) => {
        const batonGeom = new THREE.BoxGeometry(0.048, 0.036, 0.25);
        const baton = new THREE.Mesh(batonGeom, materials.indicesMetal);
        baton.position.set(offset, 0.178, -1.39);
        indicesContainer.add(baton);
      });
    } else {
      const batonGeom = new THREE.BoxGeometry(0.052, 0.034, 0.23);
      const baton = new THREE.Mesh(batonGeom, materials.indicesMetal);
      const radius = 1.40;
      baton.position.set(Math.sin(angle) * radius, 0.178, -Math.cos(angle) * radius);
      baton.rotation.y = -angle;
      indicesContainer.add(baton);
    }
  }

  const pearlGeom = new THREE.SphereGeometry(0.013, 10, 10);
  for (let m = 0; m < 60; m++) {
    if (m % 5 === 0) continue;
    const angle = (m / 60) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeom, materials.dialSubring);
    pearl.position.set(Math.sin(angle) * 1.54, 0.166, -Math.cos(angle) * 1.54);
    indicesContainer.add(pearl);
  }
  dialGroup.add(indicesContainer);
  dialGroup.traverse((obj) => {
    obj.userData = { partId: 'dial', label: 'Dial' };
  });

  // ============================================================================
  // LAYER 04: MECHANICAL MOVEMENT CALIBRE (Calibre Manufacture VR)
  // Cohesive Horological Engineering: Every gear, arbor, ruby chaton, and blued
  // screw is physically seated on the Mainplate and Sculpted Geneva Bridges.
  // ============================================================================
  // 1. Recessed Dark Rhodium Perlage Mainplate (Platine) + Outer Seating Flange
  const mainplateGeom = new THREE.CylinderGeometry(1.66, 1.66, 0.09, 84);
  const mainplate = new THREE.Mesh(mainplateGeom, materials.movementPerlage);
  mainplate.position.y = -0.015;
  movementGroup.add(mainplate);

  const mainplateRimGeom = new THREE.TorusGeometry(1.62, 0.042, 18, 84);
  mainplateRimGeom.rotateX(Math.PI / 2);
  mainplateRimGeom.scale(1, 0.65, 1);
  const mainplateRim = new THREE.Mesh(mainplateRimGeom, materials.movementBridge);
  mainplateRim.position.y = 0.035;
  movementGroup.add(mainplateRim);

  // Coaxial Central Cannon Pinion Arbor (Connects Movement -> Dial -> Hands)
  const centralArborGeom = new THREE.CylinderGeometry(0.038, 0.044, 0.22, 20);
  const centralArbor = new THREE.Mesh(centralArborGeom, materials.indicesMetal);
  centralArbor.position.set(0, 0.08, 0);
  movementGroup.add(centralArbor);

  // 2. Mainspring Barrel at 12 o'clock (x: 0, z: -0.58)
  const barrelDrumGeom = new THREE.CylinderGeometry(0.50, 0.50, 0.06, 56);
  const barrelDrum = new THREE.Mesh(barrelDrumGeom, materials.movementBridge);
  barrelDrum.position.set(0, 0.042, -0.58);
  movementGroup.add(barrelDrum);

  const ratchetWheelGeom = createGearGeometry(0.12, 0.36, 32, 0.022, 0);
  const ratchetWheel = new THREE.Mesh(ratchetWheelGeom, materials.movementGoldGear);
  ratchetWheel.position.set(0, 0.078, -0.58);
  movementGroup.add(ratchetWheel);

  // 3. Meshed Horological Gear Train (Center, Third, Fourth & Escapement Wheels)
  const centerWheelGeom = createGearGeometry(0.42, 0.54, 42, 0.032, 5);
  const centerWheel = new THREE.Mesh(centerWheelGeom, materials.movementGoldGear);
  centerWheel.position.set(0, 0.058, 0);
  movementGroup.add(centerWheel);

  const escapementGearGeom = createGearGeometry(0.28, 0.39, 30, 0.03, 4);
  const escapementGear = new THREE.Mesh(escapementGearGeom, materials.movementGoldGear);
  escapementGear.position.set(-0.56, 0.062, -0.24);
  movementGroup.add(escapementGear);

  const thirdWheelGeom = createGearGeometry(0.30, 0.41, 32, 0.03, 5);
  const thirdWheel = new THREE.Mesh(thirdWheelGeom, materials.movementGoldGear);
  thirdWheel.position.set(0.56, 0.062, -0.24);
  movementGroup.add(thirdWheel);

  // Steel Pinion Arbors connecting every gear down to the mainplate and up to its bridge jewel
  [
    [0, -0.58],
    [-0.56, -0.24],
    [0.56, -0.24],
    [0, 0.66],
  ].forEach(([ax, az]) => {
    const arborGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.13, 16);
    const arbor = new THREE.Mesh(arborGeom, materials.casePolished);
    arbor.position.set(ax, 0.055, az);
    movementGroup.add(arbor);
  });

  // 4. Sculpted Openworked Côtes de Genève Calibre Bridges (With Skeleton Windows exposing Gear Train)
  const upperBridgeShape = new THREE.Shape();
  upperBridgeShape.moveTo(-1.12, 0.36);
  upperBridgeShape.quadraticCurveTo(-0.65, 1.15, 0, 1.24);
  upperBridgeShape.quadraticCurveTo(0.65, 1.15, 1.12, 0.36);
  upperBridgeShape.lineTo(0.84, 0.22);
  upperBridgeShape.quadraticCurveTo(0, 0.38, -0.84, 0.22);
  upperBridgeShape.closePath();

  // Left & Right Skeleton Cutout Windows in Upper Barrel Bridge (Exposes Golden Ratchet & Train Gears)
  [-1, 1].forEach((side) => {
    const win = new THREE.Path();
    win.absellipse(side * 0.42, 0.64, 0.24, 0.18, 0, Math.PI * 2, false, side * -0.35);
    upperBridgeShape.holes.push(win);
  });

  const bridgeExtrudeOpts = {
    depth: 0.032,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.006,
  };
  const upperBridgeGeom = new THREE.ExtrudeGeometry(upperBridgeShape, bridgeExtrudeOpts);
  upperBridgeGeom.rotateX(-Math.PI / 2);
  const upperBridge = new THREE.Mesh(upperBridgeGeom, materials.movementBridge);
  upperBridge.position.y = 0.082;
  movementGroup.add(upperBridge);

  // Central Gear Train Bridge (Pont de Rouage) with Skeletonized Arms
  const trainBridgeShape = new THREE.Shape();
  trainBridgeShape.moveTo(-1.02, 0.28);
  trainBridgeShape.quadraticCurveTo(-0.56, 0.36, 0, 0.14);
  trainBridgeShape.quadraticCurveTo(0.56, 0.36, 1.02, 0.28);
  trainBridgeShape.lineTo(0.94, -0.10);
  trainBridgeShape.quadraticCurveTo(0.52, 0.04, 0, -0.14);
  trainBridgeShape.quadraticCurveTo(-0.52, 0.04, -0.94, -0.10);
  trainBridgeShape.closePath();

  [-1, 1].forEach((side) => {
    const tWin = new THREE.Path();
    tWin.absellipse(side * 0.28, 0.08, 0.14, 0.07, 0, Math.PI * 2, false, side * 0.2);
    trainBridgeShape.holes.push(tWin);
  });

  const trainBridgeGeom = new THREE.ExtrudeGeometry(trainBridgeShape, bridgeExtrudeOpts);
  trainBridgeGeom.rotateX(-Math.PI / 2);
  const trainBridge = new THREE.Mesh(trainBridgeGeom, materials.movementBridge);
  trainBridge.position.y = 0.082;
  movementGroup.add(trainBridge);

  // 5. Oscillating Free-Sprung Balance Wheel & Double-Ended Balance Cock at 6 o'clock (z: +0.66)
  const balanceWheel = new THREE.Group();
  balanceWheel.position.set(0, 0.062, 0.66);

  const balanceRimGeom = createGearGeometry(0.35, 0.41, 24, 0.026, 3);
  const balanceRim = new THREE.Mesh(balanceRimGeom, materials.movementGoldGear);
  balanceWheel.add(balanceRim);

  for (let w = 0; w < 8; w++) {
    const wa = (w / 8) * Math.PI * 2;
    const weightGeom = new THREE.CylinderGeometry(0.017, 0.017, 0.032, 8);
    const weight = new THREE.Mesh(weightGeom, materials.indicesMetal);
    weight.position.set(Math.cos(wa) * 0.38, 0.008, Math.sin(wa) * 0.38);
    balanceWheel.add(weight);
  }

  for (let r = 0.075; r <= 0.195; r += 0.04) {
    const hairspringGeom = new THREE.TorusGeometry(r, 0.0055, 8, 36);
    hairspringGeom.rotateX(Math.PI / 2);
    const hairspring = new THREE.Mesh(hairspringGeom, materials.bluedScrew);
    balanceWheel.add(hairspring);
  }
  movementGroup.add(balanceWheel);

  // Sculpted Double-Ended Balance Cock Bridge (Pont de Balancier)
  const cockShape = new THREE.Shape();
  cockShape.moveTo(-0.82, -0.56);
  cockShape.quadraticCurveTo(-0.42, -0.58, -0.16, -0.58);
  cockShape.absarc(0, -0.66, 0.18, Math.PI * 0.75, Math.PI * 0.25, true);
  cockShape.quadraticCurveTo(0.42, -0.58, 0.82, -0.56);
  cockShape.lineTo(0.74, -0.78);
  cockShape.quadraticCurveTo(0.38, -0.74, 0.16, -0.74);
  cockShape.absarc(0, -0.66, 0.18, -Math.PI * 0.25, -Math.PI * 0.75, true);
  cockShape.quadraticCurveTo(-0.38, -0.74, -0.74, -0.78);
  cockShape.closePath();

  const balanceCockGeom = new THREE.ExtrudeGeometry(cockShape, bridgeExtrudeOpts);
  balanceCockGeom.rotateX(-Math.PI / 2);
  const balanceCock = new THREE.Mesh(balanceCockGeom, materials.movementBridge);
  balanceCock.position.y = 0.084;
  movementGroup.add(balanceCock);

  const balanceColletRingGeom = new THREE.TorusGeometry(0.13, 0.02, 16, 36);
  balanceColletRingGeom.rotateX(Math.PI / 2);
  const balanceColletRing = new THREE.Mesh(balanceColletRingGeom, materials.casePolished);
  balanceColletRing.position.set(0, 0.122, 0.66);
  movementGroup.add(balanceColletRing);

  // 6. Flush-Mounted Synthetic Ruby Jewels in Gold Chatons (Strictly coaxial with Gear Arbors on Bridges)
  const rubyLocations: [number, number][] = [
    [0, 0],          // Center Wheel Bearing on trainBridge
    [0, -0.58],      // Barrel Arbor Bearing on upperBridge
    [-0.56, -0.24],  // Escapement Wheel Bearing on trainBridge
    [0.56, -0.24],   // Third Wheel Bearing on trainBridge
    [0, 0.66],       // Balance Shock Bearing on balanceCock
  ];
  const rubyGeom = new THREE.CylinderGeometry(0.052, 0.052, 0.018, 24);
  const chatonGeom = new THREE.TorusGeometry(0.062, 0.013, 14, 24);
  chatonGeom.rotateX(Math.PI / 2);

  rubyLocations.forEach(([rx, rz]) => {
    const ruby = new THREE.Mesh(rubyGeom, materials.rubyJewel);
    ruby.position.set(rx, 0.118, rz);
    const chaton = new THREE.Mesh(chatonGeom, materials.movementGoldGear);
    chaton.position.set(rx, 0.121, rz);
    movementGroup.add(ruby, chaton);
  });

  // 7. Flush-Mounted Heat-Blued Slotted Bridge Screws (Strictly seated on Bridge Pads at y = 0.116)
  const screwLocations: [number, number][] = [
    [-0.86, -0.44],  // Left pad of upperBridge
    [0.86, -0.44],   // Right pad of upperBridge
    [0, -0.96],      // Top pad of upperBridge
    [-0.86, -0.06],  // Left pad of trainBridge
    [0.86, -0.06],   // Right pad of trainBridge
    [-0.64, 0.66],   // Left anchor pad of balanceCock
    [0.64, 0.66],    // Right anchor pad of balanceCock
  ];
  const screwGeom = new THREE.CylinderGeometry(0.036, 0.036, 0.016, 16);
  const slotGeom = new THREE.BoxGeometry(0.058, 0.008, 0.009);

  screwLocations.forEach(([sx, sz], idx) => {
    const screwGroup = new THREE.Group();
    const screw = new THREE.Mesh(screwGeom, materials.bluedScrew);
    const slot = new THREE.Mesh(slotGeom, materials.movementPerlage);
    slot.position.y = 0.009;
    slot.rotation.y = idx * 0.75;
    screwGroup.add(screw, slot);
    screwGroup.position.set(sx, 0.116, sz);
    movementGroup.add(screwGroup);
  });

  movementGroup.traverse((obj) => {
    obj.userData = { partId: 'movement', label: 'Movement' };
  });

  // ============================================================================
  // LAYER 05: SCULPTED WATCH CASE (3-Tier Stepped Carrure, Bezel, Lugs & Crown)
  // ============================================================================
  const caseLathePoints: THREE.Vector2[] = [
    new THREE.Vector2(1.66, -0.22), // Lower inner seating
    new THREE.Vector2(1.88, -0.22), // Lower case bevel
    new THREE.Vector2(1.96, -0.12), // Lower carrure flank
    new THREE.Vector2(1.94, 0.0),   // Recessed satin case band waist
    new THREE.Vector2(1.97, 0.12),  // Upper carrure lip
    new THREE.Vector2(1.91, 0.21),  // Stepped bezel base
    new THREE.Vector2(1.82, 0.31),  // Mirror-polished upper bezel crest
    new THREE.Vector2(1.74, 0.32),  // Crystal seating bezel lip
    new THREE.Vector2(1.68, 0.20),  // Inner rehaut wall
  ];
  const sculptedCaseGeom = new THREE.LatheGeometry(caseLathePoints, 84);
  const sculptedCaseMesh = new THREE.Mesh(sculptedCaseGeom, materials.casePolished);
  caseGroup.add(sculptedCaseMesh);

  // Satin-Brushed Middle Case Band Accent Ring
  const brushedBandGeom = new THREE.CylinderGeometry(1.955, 1.955, 0.21, 84, 1, true);
  const brushedBandMesh = new THREE.Mesh(brushedBandGeom, materials.caseBrushed);
  brushedBandMesh.position.y = 0.0;
  caseGroup.add(brushedBandMesh);

  // 4 Ergonomic Sculpted Curved Lugs (Cornes) anchored strictly to the outer case wall (r ≈ 1.94..2.05)
  const lugCoords: { x: number; z: number; right: boolean; bottom: boolean }[] = [
    { x: -1.06, z: -1.75, right: false, bottom: false },
    { x: 1.06, z: -1.75, right: true, bottom: false },
    { x: -1.06, z: 1.75, right: false, bottom: true },
    { x: 1.06, z: 1.75, right: true, bottom: true },
  ];

  lugCoords.forEach(({ x, z, right, bottom }) => {
    const lugGeom = createSculptedLugGeometry(right, bottom);
    const lugMesh = new THREE.Mesh(lugGeom, materials.casePolished);
    lugMesh.position.set(x, 0.05, z);
    caseGroup.add(lugMesh);
  });

  // Crown Guards & Fluted Winding Crown at 3 o'clock (Couronne de Remontoir)
  const crownAssembly = new THREE.Group();
  crownAssembly.position.set(2.04, 0.02, 0);
  crownAssembly.rotation.z = Math.PI / 2;

  const crownCollarGeom = new THREE.CylinderGeometry(0.13, 0.15, 0.18, 28);
  const crownCollar = new THREE.Mesh(crownCollarGeom, materials.caseBrushed);
  crownAssembly.add(crownCollar);

  const crownHeadGeom = createGearGeometry(0.04, 0.25, 24, 0.2, 0);
  const crownHead = new THREE.Mesh(crownHeadGeom, materials.casePolished);
  crownHead.position.y = -0.14;
  crownAssembly.add(crownHead);

  // Domed Crown Cabochon Cap
  const crownCapGeom = new THREE.SphereGeometry(0.18, 24, 16);
  crownCapGeom.scale(1, 0.35, 1);
  const crownCap = new THREE.Mesh(crownCapGeom, materials.casePolished);
  crownCap.position.y = -0.24;
  crownAssembly.add(crownCap);

  caseGroup.add(crownAssembly);
  caseGroup.traverse((obj) => {
    obj.userData = { partId: 'case', label: 'Case' };
  });

  // ============================================================================
  // LAYER 06: EXHIBITION CASE BACK & BESPOKE ENGRAVING (Fond Saphir Gravé)
  // ============================================================================
  const caseBackRingGeom = new THREE.TorusGeometry(1.76, 0.13, 24, 72);
  caseBackRingGeom.rotateX(Math.PI / 2);
  caseBackRingGeom.scale(1, 0.52, 1);
  const caseBackRing = new THREE.Mesh(caseBackRingGeom, materials.casePolished);
  caseBackRing.position.y = -0.23;
  caseBackGroup.add(caseBackRing);

  // 6 Caseback Perimeter Locking Screws
  for (let s = 0; s < 6; s++) {
    const sa = (s / 6) * Math.PI * 2 + 0.3;
    const cbScrewGeom = new THREE.CylinderGeometry(0.036, 0.036, 0.025, 16);
    const cbScrew = new THREE.Mesh(cbScrewGeom, materials.caseBrushed);
    cbScrew.position.set(Math.cos(sa) * 1.76, -0.28, Math.sin(sa) * 1.76);
    caseBackGroup.add(cbScrew);
  }

  // Rear Exhibition Sapphire Crystal
  const rearCrystalGeom = new THREE.CylinderGeometry(1.64, 1.64, 0.04, 64);
  const rearCrystal = new THREE.Mesh(rearCrystalGeom, materials.crystalGlass);
  rearCrystal.position.y = -0.24;
  caseBackGroup.add(rearCrystal);

  // Bespoke Curved Engraving Plane on Caseback Perimeter
  const engravingPlaneGeom = new THREE.PlaneGeometry(3.8, 3.8);
  engravingPlaneGeom.rotateX(Math.PI / 2);
  const engravingPlane = new THREE.Mesh(engravingPlaneGeom, materials.engravingPlaneMat);
  engravingPlane.position.y = -0.285;
  caseBackGroup.add(engravingPlane);

  caseBackGroup.traverse((obj) => {
    obj.userData = { partId: 'case-back', label: 'Case Back' };
  });

  // ============================================================================
  // LAYER 07: CONTOURED ALLIGATOR STRAP / 5-LINK INTEGRATED BRACELET
  // ============================================================================
  const buildStrapSides = () => {
    [-1, 1].forEach((dir) => {
      // Polished Springbar connecting between the lugs
      const springbarGeom = new THREE.CylinderGeometry(0.068, 0.068, 1.96, 20);
      springbarGeom.rotateZ(Math.PI / 2);
      const springbar = new THREE.Mesh(springbarGeom, materials.casePolished);
      springbar.position.set(0, -0.02, dir * 1.90);
      strapGroup.add(springbar);

      // 6 Overlapping Contoured Segments with Domed Padded Bolster
      for (let seg = 0; seg < 6; seg++) {
        const segGroup = new THREE.Group();
        const segWidth = 1.76 - seg * 0.055;
        const segLen = 0.44;
        const segThick = 0.15 - seg * 0.008;

        // Unified full-width strap base + raised central alligator pillow bolster
        const baseStrapGeom = new THREE.BoxGeometry(segWidth, segThick * 0.82, segLen);
        const baseStrap = new THREE.Mesh(baseStrapGeom, materials.strapMaterial);

        const bolsterGeom = new THREE.BoxGeometry(segWidth * 0.68, segThick * 1.08, segLen * 0.96);
        const bolster = new THREE.Mesh(bolsterGeom, materials.strapMaterial);
        bolster.position.y = segThick * 0.12;

        // Subtle Saddle-Stitching Dots along Left & Right Edges
        const stitchGeom = new THREE.BoxGeometry(0.022, segThick * 0.92, segLen * 0.56);
        const leftStitch = new THREE.Mesh(stitchGeom, materials.stitchingMaterial);
        leftStitch.position.set(-segWidth * 0.42, segThick * 0.05, 0);

        const rightStitch = leftStitch.clone();
        rightStitch.position.set(segWidth * 0.42, segThick * 0.05, 0);

        segGroup.add(baseStrap, bolster, leftStitch, rightStitch);

        const zDist = 1.92 + seg * 0.36 - Math.pow(seg * 0.18, 2.1) * 0.22;
        const yDrop = -0.05 - Math.pow(seg * 0.32, 1.75) * 0.44;
        segGroup.position.set(0, yDrop, dir * zDist);
        segGroup.rotation.x = dir * (0.20 + seg * 0.14);

        strapGroup.add(segGroup);
      }
    });
  };
  buildStrapSides();
  caseGroup.add(strapGroup);

  // Add all 6 Horological Groups to Root Assembly
  rootGroup.add(
    crystalGroup,
    handsGroup,
    dialGroup,
    movementGroup,
    caseGroup,
    caseBackGroup
  );

  // ============================================================================
  // REAL-TIME CONFIGURATION UPDATER (No Scene Reload)
  // ============================================================================
  const updateConfiguration: WatchAssemblyRefs['updateConfiguration'] = (config) => {
    // 1. Case Material
    if (config.caseMaterial === 'gold') {
      materials.casePolished.color.set('#D5BA88');
      materials.casePolished.roughness = 0.08;
      materials.caseBrushed.color.set('#B89A67');
      materials.caseBrushed.roughness = 0.25;
      materials.indicesMetal.color.set('#E6CFA2');
      materials.dialSubring.color.set('#D4BA8A');
    } else if (config.caseMaterial === 'steel') {
      materials.casePolished.color.set('#E6E6E2');
      materials.casePolished.roughness = 0.07;
      materials.caseBrushed.color.set('#C2C2BE');
      materials.caseBrushed.roughness = 0.24;
      materials.indicesMetal.color.set('#F0F0EC');
      materials.dialSubring.color.set('#C8AE7D');
    } else if (config.caseMaterial === 'titanium') {
      materials.casePolished.color.set('#9E9FA2');
      materials.casePolished.roughness = 0.18;
      materials.caseBrushed.color.set('#7A7C7F');
      materials.caseBrushed.roughness = 0.34;
      materials.indicesMetal.color.set('#D8D6D0');
      materials.dialSubring.color.set('#B49A70');
    }

    // 2. Dial Color & Model Architecture (Skeleton vs Classic vs Chronograph)
    const isSkeletonModel = config.modelId === 'no-02-skeleton';
    const isChronoModel = config.modelId === 'no-03-chronograph';
    const isClassicModel = config.modelId === 'no-01-classic';

    dialPlateMesh.visible = !isSkeletonModel;
    dialPrintMesh.visible = !isSkeletonModel;
    dialCarrierMesh.visible = !isSkeletonModel;
    skeletonChapterRing.visible = isSkeletonModel;
    classicSubdialGroup.visible = isClassicModel;
    chronoRegistersGroup.visible = isChronoModel;

    // Update physical guilloché dialBase tone (#0D0C0A for Obsidian)
    if (config.dialColor === 'obsidian') {
      materials.dialBase.color.set('#0D0C0A');
      materials.dialBase.metalness = 0.38;
      materials.dialBase.roughness = 0.32;
      materials.dialBase.envMapIntensity = 0.25;
    } else if (config.dialColor === 'ivory') {
      materials.dialBase.color.set('#F3EFE6');
      materials.dialBase.metalness = 0.14;
      materials.dialBase.roughness = 0.34;
      materials.dialBase.envMapIntensity = 0.75;
    } else if (config.dialColor === 'midnight') {
      materials.dialBase.color.set('#162438');
      materials.dialBase.metalness = 0.78;
      materials.dialBase.roughness = 0.26;
      materials.dialBase.envMapIntensity = 0.45;
    }

    // Regenerate High-Resolution Horological Dial Texture for active model & dial color
    const nextDialTex = createHorologicalDialFaceTexture(config.dialColor, config.modelId);
    dialPrintMat.map?.dispose();
    dialPrintMat.map = nextDialTex;
    dialPrintMat.needsUpdate = true;
    currentDialFaceTex = nextDialTex;

    // 3. Strap / Bracelet Material
    if (config.strapType === 'black-leather') {
      materials.strapMaterial.color.set('#181513');
      materials.strapMaterial.metalness = 0.08;
      materials.strapMaterial.roughness = 0.44;
      materials.strapMaterial.bumpMap = leatherTex;
      materials.stitchingMaterial.color.set('#645A4D');
    } else if (config.strapType === 'brown-leather') {
      materials.strapMaterial.color.set('#4D2B1E');
      materials.strapMaterial.metalness = 0.08;
      materials.strapMaterial.roughness = 0.42;
      materials.strapMaterial.bumpMap = leatherTex;
      materials.stitchingMaterial.color.set('#B49A70');
    } else if (config.strapType === 'steel-bracelet') {
      materials.strapMaterial.color.copy(materials.caseBrushed.color);
      materials.strapMaterial.metalness = 0.94;
      materials.strapMaterial.roughness = 0.22;
      materials.strapMaterial.bumpMap = sunrayTex;
      materials.stitchingMaterial.color.copy(materials.casePolished.color);
    }
    materials.strapMaterial.needsUpdate = true;

    // 4. Hands Style
    buildHandsMeshes(config.handsStyle);
    if (config.dialColor === 'ivory' && config.caseMaterial === 'steel') {
      materials.handsPrimary.color.set('#1C3554'); // Heat-blued hands on Warm Ivory + Steel
    } else {
      materials.handsPrimary.color.copy(materials.indicesMetal.color);
    }

    // 5. Caseback Engraving Texture Update
    const modelLabel =
      config.modelId === 'no-01-classic'
        ? 'VÉRON No. 01'
        : config.modelId === 'no-02-skeleton'
        ? 'VÉRON No. 02'
        : 'VÉRON No. 03';
    const nextTex = createCasebackEngravingTexture(config.engravingText, modelLabel);
    materials.engravingPlaneMat.map?.dispose();
    materials.engravingPlaneMat.map = nextTex;
    materials.engravingPlaneMat.needsUpdate = true;
    currentEngravingTex = nextTex;
  };

  // ============================================================================
  // SCROLL-DRIVEN EXPLODED VIEW KINEMATICS (6 Distinct Non-Overlapping Layers)
  // Perspective-compensated vertical intervals guarantee clean air gaps between
  // every single layer from top (1. Sapphire Crystal) to bottom (6. Case Back).
  // ============================================================================
  const setExplodedState: WatchAssemblyRefs['setExplodedState'] = (
    progress,
    verticalScale = 1
  ) => {
    const p = THREE.MathUtils.clamp(progress, 0, 1);
    const py = p * verticalScale;
    crystalGroup.position.y = py * 2.95;
    handsGroup.position.y = py * 1.98;
    dialGroup.position.y = py * 0.96;
    movementGroup.position.y = py * -0.32;
    caseGroup.position.y = py * -1.85;
    caseBackGroup.position.y = py * -3.55;

    // Smoothly detach and hide strap during Exploded Calibre Inspection so the 6 layers
    // have pure architectural isolation without the strap colliding with the Case Back
    strapGroup.visible = p < 0.14;
    if (p > 0 && p < 0.14) {
      const s = 1 - p * 4.5;
      strapGroup.scale.set(s, s, s);
    } else {
      strapGroup.scale.set(1, 1, 1);
    }
  };

  // ============================================================================
  // LIVE MECHANICAL ESCAPEMENT & REAL-TIME HANDS TICKING
  // ============================================================================
  const tickMechanics: WatchAssemblyRefs['tickMechanics'] = (elapsedSeconds) => {
    balanceWheel.rotation.y = Math.sin(elapsedSeconds * 18.0) * 0.65;
    escapementGear.rotation.y = -elapsedSeconds * 0.45;
    centerWheel.rotation.y = elapsedSeconds * 0.12;

    const baseHourAngle = ((10 + 10 / 60) / 12) * Math.PI * 2;
    const baseMinuteAngle = (10 / 60) * Math.PI * 2;
    const liveSecondAngle = ((elapsedSeconds % 60) / 60) * Math.PI * 2;

    hourHand.rotation.y = -baseHourAngle;
    minuteHand.rotation.y = -baseMinuteAngle - elapsedSeconds * 0.0005;
    secondHand.rotation.y = -liveSecondAngle;
  };

  const dispose = () => {
    sunrayTex.dispose();
    guillocheNormalTex.dispose();
    cotesTex.dispose();
    leatherTex.dispose();
    currentDialFaceTex.dispose();
    currentEngravingTex.dispose();
    dialPrintMat.dispose();
    crystalBevelMat.dispose();
    Object.values(materials).forEach((mat) => mat.dispose());
    rootGroup.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).geometry.dispose();
      }
    });
  };

  return {
    rootGroup,
    crystalGroup,
    handsGroup,
    dialGroup,
    movementGroup,
    caseGroup,
    caseBackGroup,
    strapGroup,
    hourHand,
    minuteHand,
    secondHand,
    balanceWheel,
    escapementGear,
    centerWheel,
    materials,
    updateConfiguration,
    setExplodedState,
    tickMechanics,
    dispose,
  };
}
