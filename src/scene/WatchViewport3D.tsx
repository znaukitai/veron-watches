/**
 * [ARGON_CORE] WatchViewport3D
 * High-precision WebGL / Three.js viewport with:
 * - Adaptive Pixel Ratio (capped at 2x for mobile/retina efficiency)
 * - IntersectionObserver lifecycle (pauses GPU rendering when scrolled out of view)
 * - Studio HDR PMREM Environment Lighting + Rim Softboxes
 * - Pointer-driven smooth parallax & user drag-to-orbit inspection
 * - Raycasting for interactive mechanical part selection in Exploded View & Atelier
 * - Strict resource disposal on unmount
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useWatchStore, type CameraAngle } from '../store/watchStore';
import {
  buildHorologicalWatchAssembly,
  type WatchAssemblyRefs,
} from './models/HorologicalWatchModel';
import { createStudioEnvTexture } from './proceduralTextures';

export type ViewportMode = 'hero' | 'exploded' | 'atelier' | 'finale';

export interface ProjectedLeaderNode {
  id: 'sapphire-crystal' | 'hands' | 'dial' | 'movement' | 'case';
  /** Screen X coordinate in percentage (0..100) of the viewport container */
  xPct: number;
  /** Screen Y coordinate in percentage (0..100) of the viewport container */
  yPct: number;
}

interface WatchViewport3DProps {
  mode: ViewportMode;
  className?: string;
  interactiveOrbit?: boolean;
  onPartClick?: (partId: string) => void;
  onLeaderNodesUpdate?: (nodes: ProjectedLeaderNode[], explosionProgress: number) => void;
}

const CAMERA_PRESETS: Record<
  CameraAngle,
  { pos: [number, number, number]; rot: [number, number, number] }
> = {
  'three-quarter': {
    pos: [0, 6.25, 7.6],
    rot: [0.68, -0.38, 0.16],
  },
  'dial-front': {
    pos: [0, 9.2, 1.05],
    rot: [0.06, 0, 0],
  },
  'movement-macro': {
    pos: [0.18, 5.2, 3.65],
    rot: [0.58, 0.24, -0.06],
  },
  caseback: {
    pos: [0, 7.8, 2.65],
    rot: [Math.PI - 0.32, 0.18, 0],
  },
  profile: {
    pos: [0, 2.35, 8.4],
    rot: [1.18, -0.52, 0.14],
  },
};

export const WatchViewport3D: React.FC<WatchViewport3DProps> = ({
  mode,
  className = '',
  interactiveOrbit = true,
  onPartClick,
  onLeaderNodesUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<WatchAssemblyRefs | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const envTexRef = useRef<THREE.Texture | null>(null);
  const pmremRef = useRef<THREE.PMREMGenerator | null>(null);
  const onLeaderNodesUpdateRef = useRef(onLeaderNodesUpdate);
  onLeaderNodesUpdateRef.current = onLeaderNodesUpdate;

  // Store subscriptions
  const activeModelId = useWatchStore((s) => s.activeModelId);
  const caseMaterial = useWatchStore((s) => s.caseMaterial);
  const dialColor = useWatchStore((s) => s.dialColor);
  const strapType = useWatchStore((s) => s.strapType);
  const handsStyle = useWatchStore((s) => s.handsStyle);
  const engravingText = useWatchStore((s) => s.engravingText);
  const cameraAngle = useWatchStore((s) => s.cameraAngle);
  const studioLighting = useWatchStore((s) => s.studioLighting);
  const zoomLevel = useWatchStore((s) => s.zoomLevel);
  const autoRotate = useWatchStore((s) => s.autoRotate);
  const explosionProgress = useWatchStore((s) => s.explosionProgress);

  // Mutable animation target refs so the render loop reads fresh state without re-initializing WebGL
  const stateRef = useRef({
    mode,
    cameraAngle,
    zoomLevel,
    autoRotate,
    explosionProgress,
    pointerX: 0,
    pointerY: 0,
    userRotX: 0,
    userRotY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    pointerDownX: 0,
    pointerDownY: 0,
    touchGestureLock: 'undecided' as 'undecided' | 'horizontal' | 'vertical',
    isVisible: true,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    reducedMotion: false,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.cameraAngle = cameraAngle;
    stateRef.current.zoomLevel = zoomLevel;
    stateRef.current.autoRotate = autoRotate;
    stateRef.current.explosionProgress = explosionProgress;
  }, [mode, cameraAngle, zoomLevel, autoRotate, explosionProgress]);

  // Synchronize 3D materials and geometry whenever configuration changes
  useEffect(() => {
    if (!assemblyRef.current) return;
    assemblyRef.current.updateConfiguration({
      modelId: activeModelId,
      caseMaterial,
      dialColor,
      strapType,
      handsStyle,
      engravingText,
    });
  }, [
    activeModelId,
    caseMaterial,
    dialColor,
    strapType,
    handsStyle,
    engravingText,
  ]);

  // Update Studio Lighting Environment when toggled in Atelier
  useEffect(() => {
    if (!sceneRef.current || !pmremRef.current) return;
    const rawEnv = createStudioEnvTexture(studioLighting);
    const pmremTarget = pmremRef.current.fromEquirectangular(rawEnv);
    rawEnv.dispose();
    envTexRef.current?.dispose();
    envTexRef.current = pmremTarget.texture;
    sceneRef.current.environment = pmremTarget.texture;
  }, [studioLighting]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.reducedMotion = mediaQuery.matches;

    // 1. Initialize Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const initialMobile = window.innerWidth < 768;
    stateRef.current.isMobile = initialMobile;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 60);
    if (mode === 'hero') {
      if (initialMobile) {
        camera.position.set(0, 5.75, 6.75);
        camera.lookAt(0, -0.02, 0);
      } else {
        camera.position.set(1.1, 5.2, 5.8);
        camera.lookAt(0.95, -0.02, 0);
      }
    } else {
      camera.position.set(0, 6.4, 7.8);
      camera.lookAt(0, 0, 0);
    }
    cameraRef.current = camera;

    // 2. Initialize Renderer with universal 1.5x DPR cap & disabled ShadowMaps (Rule 1.1)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = false;
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = 'pan-y';
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Setup with PMREM Prefiltered Environment Map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    pmremRef.current = pmremGenerator;

    const rawInitialEnv = createStudioEnvTexture(studioLighting);
    const initialPmrem = pmremGenerator.fromEquirectangular(rawInitialEnv);
    rawInitialEnv.dispose();
    envTexRef.current = initialPmrem.texture;
    scene.environment = initialPmrem.texture;

    // Chiaroscuro Horological Macro Lighting: ultra-low ambient preserves deep #0D0C0A obsidian shadows
    const ambientLight = new THREE.AmbientLight('#EAE6DD', 0.08);
    scene.add(ambientLight);

    // Primary Razor-Sharp Grazing Key SpotLight (High Upper-Right/Back grazing angle so flat left dial sector stays deep #0D0C0A obsidian)
    const keySpot = new THREE.SpotLight('#FFF5E2', 7.5, 32, Math.PI / 6, 0.34, 0);
    keySpot.position.set(2.8, 8.8, -3.4);
    keySpot.target.position.set(1.1, 0.2, 0.0);
    scene.add(keySpot);
    scene.add(keySpot.target);

    // Secondary High-Contrast Grazing Rim SpotLight (Upper-Right Bezel Arc, Lugs & Dauphine Hand Ridges)
    const rimSpot = new THREE.SpotLight('#FFF4DF', 6.0, 32, Math.PI / 5, 0.32, 0);
    rimSpot.position.set(5.6, 7.4, 2.4);
    rimSpot.target.position.set(1.0, 0.15, -0.2);
    scene.add(rimSpot);
    scene.add(rimSpot.target);

    // Focused Lower-Right Warm Accent SpotLight (Attenuated -20% to preserve deep #0D0C0A obsidian shadow on left dial sector)
    const lowerAccentSpot = new THREE.SpotLight('#D6B886', 2.5, 28, Math.PI / 5, 0.50, 0);
    lowerAccentSpot.position.set(3.4, -5.4, 4.6);
    lowerAccentSpot.target.position.set(1.2, -1.2, 1.2);
    scene.add(lowerAccentSpot);
    scene.add(lowerAccentSpot.target);

    // 4. Build Horological Watch Assembly
    const assembly = buildHorologicalWatchAssembly();
    assemblyRef.current = assembly;
    assembly.updateConfiguration({
      modelId: activeModelId,
      caseMaterial,
      dialColor,
      strapType,
      handsStyle,
      engravingText,
    });
    scene.add(assembly.rootGroup);

    // Initial Orientation & Macro Offset
    if (mode === 'hero') {
      assembly.rootGroup.position.x = initialMobile ? -0.06 : 1.26;
      assembly.rootGroup.rotation.set(0.72, -0.31, 0.18);
    } else {
      assembly.rootGroup.rotation.set(0.68, -0.36, 0.14);
    }

    // 5. Raycaster & Touch-Ergonomic Gesture Separation (pan-y scroll vs horizontal orbit)
    const raycaster = new THREE.Raycaster();
    const pointerVec = new THREE.Vector2();
    let holdTimerId: number | null = null;

    const clearHoldTimer = () => {
      if (holdTimerId !== null) {
        window.clearTimeout(holdTimerId);
        holdTimerId = null;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      stateRef.current.pointerX = nx;
      stateRef.current.pointerY = ny;

      if (!stateRef.current.isDragging || !interactiveOrbit) return;

      const totalDx = e.clientX - stateRef.current.pointerDownX;
      const totalDy = e.clientY - stateRef.current.pointerDownY;

      if (e.pointerType === 'touch') {
        if (stateRef.current.touchGestureLock === 'undecided') {
          const dist = Math.hypot(totalDx, totalDy);
          if (dist < 5) return;
          clearHoldTimer();
          // Vertical swipe -> release orbit drag immediately so native page scroll works without friction
          if (Math.abs(totalDy) > Math.abs(totalDx) * 1.1) {
            stateRef.current.touchGestureLock = 'vertical';
            stateRef.current.isDragging = false;
            return;
          } else {
            stateRef.current.touchGestureLock = 'horizontal';
          }
        }
        if (stateRef.current.touchGestureLock === 'vertical') {
          return;
        }
      }

      const dx = e.clientX - stateRef.current.dragStartX;
      const dy = e.clientY - stateRef.current.dragStartY;
      stateRef.current.userRotY += dx * 0.0075;
      const rotXFactor = e.pointerType === 'touch' ? 0.0038 : 0.0065;
      stateRef.current.userRotX = THREE.MathUtils.clamp(
        stateRef.current.userRotX + dy * rotXFactor,
        -1.1,
        1.1
      );
      stateRef.current.dragStartX = e.clientX;
      stateRef.current.dragStartY = e.clientY;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!interactiveOrbit) return;
      stateRef.current.isDragging = true;
      stateRef.current.dragStartX = e.clientX;
      stateRef.current.dragStartY = e.clientY;
      stateRef.current.pointerDownX = e.clientX;
      stateRef.current.pointerDownY = e.clientY;

      if (e.pointerType === 'touch') {
        stateRef.current.touchGestureLock = 'undecided';
        clearHoldTimer();
        holdTimerId = window.setTimeout(() => {
          if (
            stateRef.current.isDragging &&
            stateRef.current.touchGestureLock === 'undecided'
          ) {
            stateRef.current.touchGestureLock = 'horizontal';
          }
        }, 180);
      } else {
        stateRef.current.touchGestureLock = 'horizontal';
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      clearHoldTimer();
      const wasDragging = stateRef.current.isDragging;
      stateRef.current.isDragging = false;
      stateRef.current.touchGestureLock = 'undecided';

      const moveDist = Math.hypot(
        e.clientX - stateRef.current.pointerDownX,
        e.clientY - stateRef.current.pointerDownY
      );

      if (onPartClick && wasDragging && moveDist < 9) {
        const rect = container.getBoundingClientRect();
        pointerVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerVec, camera);
        const hits = raycaster.intersectObjects(assembly.rootGroup.children, true);
        if (hits.length > 0) {
          const partId = hits[0].object.userData?.partId;
          if (partId) {
            onPartClick(partId);
          }
        }
      }
    };

    const onPointerCancel = () => {
      clearHoldTimer();
      stateRef.current.isDragging = false;
      stateRef.current.touchGestureLock = 'undecided';
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });

    // 6. IntersectionObserver (threshold: 0.01) to sleep off-screen WebGL contexts immediately (Rule 1.3)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stateRef.current.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    // 7. ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      stateRef.current.isMobile = window.innerWidth < 768;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 8. Controlled Animation Loop with Document Visibility & Offscreen Sleep Guard
    let rafId = 0;
    const clock = new THREE.Clock();
    const projVec = new THREE.Vector3();

    const onVisibilityChange = () => {
      if (!document.hidden) {
        clock.getDelta();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const leaderAnchors: {
      id: ProjectedLeaderNode['id'];
      group: THREE.Group;
      localOffset: THREE.Vector3;
    }[] = [
      {
        id: 'sapphire-crystal',
        group: assembly.crystalGroup,
        localOffset: new THREE.Vector3(0.82, 0.36, 0.18),
      },
      {
        id: 'hands',
        group: assembly.handsGroup,
        localOffset: new THREE.Vector3(0.42, 0.25, -0.08),
      },
      {
        id: 'dial',
        group: assembly.dialGroup,
        localOffset: new THREE.Vector3(-0.96, 0.17, 0.28),
      },
      {
        id: 'movement',
        group: assembly.movementGroup,
        localOffset: new THREE.Vector3(0.88, 0.08, 0.22),
      },
      {
        id: 'case',
        group: assembly.caseGroup,
        localOffset: new THREE.Vector3(-1.22, 0.06, 0.42),
      },
    ];

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      // Abort BEFORE renderer.render() if tab is hidden or viewport is scrolled off-screen (Rule 1.3)
      if (document.hidden || !stateRef.current.isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Update Mechanical Escapement & Hands
      if (!st.reducedMotion) {
        assembly.tickMechanics(elapsed, delta);
      }

      // Mode-specific camera & rotation choreography
      if (st.mode === 'hero') {
        assembly.setExplodedState(0);
        const heroOffsetX = st.isMobile ? -0.06 : 1.26;
        assembly.rootGroup.position.x = THREE.MathUtils.lerp(
          assembly.rootGroup.position.x,
          heroOffsetX,
          0.06
        );
        const idleBreath = st.reducedMotion ? 0 : Math.sin(elapsed * 0.35) * 0.06;
        const targetRotX =
          0.72 + st.pointerY * -0.12 + st.userRotX;
        const targetRotY =
          -0.31 + idleBreath + st.pointerX * 0.18 + st.userRotY;
        const targetRotZ = 0.18 + st.pointerX * -0.04;

        assembly.rootGroup.rotation.x = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.x,
          targetRotX,
          0.055
        );
        assembly.rootGroup.rotation.y = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.y,
          targetRotY,
          0.055
        );
        assembly.rootGroup.rotation.z = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.z,
          targetRotZ,
          0.055
        );

        if (st.isMobile) {
          camera.position.lerp(new THREE.Vector3(0, 5.75, 6.75), 0.06);
          camera.lookAt(0, -0.02, 0);
        } else {
          camera.position.lerp(new THREE.Vector3(1.1, 5.2, 5.8), 0.06);
          camera.lookAt(0.95, -0.02, 0);
        }
      } else if (st.mode === 'exploded') {
        // Scroll-driven exploded view (25% reduced Y-axis separation on mobile per Rule 2.2)
        assembly.setExplodedState(st.explosionProgress, st.isMobile ? 0.75 : 1.0);

        // Tilt watch into an architectural oblique elevation so local Y-axis (disassembly axis)
        // is perpendicular to the camera ray — giving each of the 6 layers its own isolated horizontal band
        const exp = st.explosionProgress;
        const explodedOffsetX = st.isMobile ? 0 : 0.55 * exp;
        assembly.rootGroup.position.x = THREE.MathUtils.lerp(
          assembly.rootGroup.position.x,
          explodedOffsetX,
          0.07
        );
        const targetRotX = THREE.MathUtils.lerp(0.66, 0.25, exp) + st.userRotX * 0.5;
        const targetRotY =
          THREE.MathUtils.lerp(-0.36, 0.46, exp) +
          st.pointerX * 0.12 +
          st.userRotY;
        const targetRotZ = THREE.MathUtils.lerp(0.14, -0.09, exp);

        assembly.rootGroup.rotation.x = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.x,
          targetRotX,
          0.07
        );
        assembly.rootGroup.rotation.y = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.y,
          targetRotY,
          0.07
        );
        assembly.rootGroup.rotation.z = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.z,
          targetRotZ,
          0.07
        );

        const maxZ = st.isMobile ? 12.6 : 13.8;
        const camDistZ = THREE.MathUtils.lerp(7.6, maxZ, exp);
        const camDistY = THREE.MathUtils.lerp(6.2, 1.35, exp);
        camera.position.lerp(new THREE.Vector3(0, camDistY, camDistZ), 0.07);
        camera.lookAt(0, -0.15 * exp, 0);
      } else if (st.mode === 'atelier') {
        assembly.setExplodedState(0);
        const preset = CAMERA_PRESETS[st.cameraAngle] || CAMERA_PRESETS['three-quarter'];
        const slowTurn =
          st.autoRotate && !st.isDragging && !st.reducedMotion
            ? Math.sin(elapsed * 0.28) * 0.16
            : 0;

        const targetRotX = preset.rot[0] + st.userRotX + st.pointerY * -0.06;
        const targetRotY =
          preset.rot[1] + slowTurn + st.userRotY + st.pointerX * 0.08;
        const targetRotZ = preset.rot[2];

        assembly.rootGroup.rotation.x = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.x,
          targetRotX,
          0.065
        );
        assembly.rootGroup.rotation.y = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.y,
          targetRotY,
          0.065
        );
        assembly.rootGroup.rotation.z = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.z,
          targetRotZ,
          0.065
        );

        const mobileZoomBoost = st.isMobile ? 0.78 : 1.0;
        const invZoom = mobileZoomBoost / st.zoomLevel;
        const targetCam = new THREE.Vector3(
          preset.pos[0] * invZoom,
          preset.pos[1] * invZoom,
          preset.pos[2] * invZoom
        );
        camera.position.lerp(targetCam, 0.07);
        camera.lookAt(0, 0, 0);
      } else if (st.mode === 'finale') {
        assembly.setExplodedState(0);
        const slowDrift = st.reducedMotion ? 0 : Math.sin(elapsed * 0.25) * 0.1;
        assembly.rootGroup.rotation.x = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.x,
          0.70 + st.pointerY * -0.06,
          0.04
        );
        assembly.rootGroup.rotation.y = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.y,
          -0.42 + slowDrift + st.pointerX * 0.1,
          0.04
        );
        assembly.rootGroup.rotation.z = THREE.MathUtils.lerp(
          assembly.rootGroup.rotation.z,
          0.18,
          0.04
        );
        camera.position.lerp(new THREE.Vector3(0, 7.2, 8.8), 0.05);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);

      // Project 3D anchor coordinates of the 5 key horological assemblies to 2D screen space via vector.project(camera)
      if (st.mode === 'exploded' && onLeaderNodesUpdateRef.current) {
        const projectedNodes: ProjectedLeaderNode[] = leaderAnchors.map((anchor) => {
          projVec.copy(anchor.localOffset).applyMatrix4(anchor.group.matrixWorld);
          projVec.project(camera);
          const xPct = THREE.MathUtils.clamp((projVec.x * 0.5 + 0.5) * 100, 12, 88);
          const yPct = THREE.MathUtils.clamp((-projVec.y * 0.5 + 0.5) * 100, 8, 92);
          return {
            id: anchor.id,
            xPct,
            yPct,
          };
        });
        onLeaderNodesUpdateRef.current(projectedNodes, st.explosionProgress);
      }
    };

    rafId = requestAnimationFrame(animate);

    // 9. Cleanup & Memory Disposal (Rule 3.3)
    return () => {
      clearHoldTimer();
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);

      assembly.dispose();
      envTexRef.current?.dispose();
      pmremRef.current?.dispose();
      renderer.dispose();
    };
  }, []);

  // Reset user drag rotation when switching camera presets in Atelier
  useEffect(() => {
    stateRef.current.userRotX = 0;
    stateRef.current.userRotY = 0;
  }, [cameraAngle]);

  return (
    <div
      ref={containerRef}
      className={`canvas-layer ${className}`}
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'pan-y',
        cursor: interactiveOrbit ? 'grab' : 'default',
      }}
      role="img"
      aria-label={`Interactive 3D visualization of ${activeModelId} mechanical watch`}
    />
  );
};
