/**
 * [ARGON_CORE] Procedural Horological Texture & Environment Generator
 * Creates physically plausible studio HDR environment maps (processed via PMREMGenerator),
 * high-resolution multi-tiered watch dial textures (Roman numerals, railway minute tracks,
 * guilloché subdials), Côtes de Genève stripes, alligator leather grain, and bespoke caseback engraving.
 */

import * as THREE from 'three';
import type { DialOption, WatchModelId } from '../store/watchStore';

/**
 * Generates an Equirectangular Studio Environment CanvasTexture.
 * Designed to be passed into THREE.PMREMGenerator.fromEquirectangular() so metallic bevels,
 * brushed case flanks, and sapphire crystals exhibit sharp, physically accurate reflections.
 */
export function createStudioEnvTexture(
  mode: 'boutique-warm' | 'obsidian-dramatic' | 'daylight-atelier'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep non-scattering studio obsidian void so dark dials remain dark & contrasty
  ctx.fillStyle = mode === 'daylight-atelier' ? '#10100e' : '#050504';
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle ambient studio falloff
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  if (mode === 'boutique-warm') {
    bgGrad.addColorStop(0, '#181410');
    bgGrad.addColorStop(0.5, '#080807');
    bgGrad.addColorStop(1, '#030303');
  } else if (mode === 'obsidian-dramatic') {
    bgGrad.addColorStop(0, '#0e0d0b');
    bgGrad.addColorStop(0.5, '#050504');
    bgGrad.addColorStop(1, '#020202');
  } else {
    bgGrad.addColorStop(0, '#22211e');
    bgGrad.addColorStop(0.5, '#0d0d0b');
    bgGrad.addColorStop(1, '#050504');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Sharp watch-photography softbox strips (creates crisp specular bands on lugs, bezel & hands)
  const drawStrip = (
    x: number,
    y: number,
    w: number,
    h: number,
    coreColor: string,
    haloColor: string
  ) => {
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.18, haloColor);
    grad.addColorStop(0.5, coreColor);
    grad.addColorStop(0.82, haloColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  };

  if (mode === 'boutique-warm') {
    // Primary Left Rim Softbox
    drawStrip(70, 20, 130, 420, 'rgba(255, 247, 232, 0.98)', 'rgba(198, 168, 118, 0.32)');
    // Upper-Right Grazing Softbox Arc (Long continuous reflection on upper-right bezel rim)
    drawStrip(500, 10, 420, 110, 'rgba(255, 250, 238, 1.0)', 'rgba(218, 188, 134, 0.48)');
    drawStrip(710, 25, 175, 400, 'rgba(255, 248, 235, 0.98)', 'rgba(212, 182, 128, 0.42)');
    // Overhead Hairline Strip
    drawStrip(320, 12, 380, 65, 'rgba(255, 250, 240, 0.95)', 'rgba(195, 168, 120, 0.32)');
  } else if (mode === 'obsidian-dramatic') {
    // Razor-sharp high-contrast rim light
    drawStrip(95, 15, 85, 440, 'rgba(255, 252, 245, 1.0)', 'rgba(180, 154, 112, 0.28)');
    drawStrip(790, 60, 75, 360, 'rgba(220, 202, 170, 0.82)', 'rgba(120, 102, 75, 0.15)');
  } else {
    drawStrip(60, 20, 160, 430, 'rgba(255, 255, 252, 0.98)', 'rgba(215, 212, 204, 0.4)');
    drawStrip(710, 40, 150, 390, 'rgba(245, 244, 240, 0.9)', 'rgba(195, 192, 184, 0.3)');
    drawStrip(320, 10, 380, 70, 'rgba(255, 255, 255, 0.94)', 'rgba(210, 208, 200, 0.3)');
  }

  // Horizon specular accent line for chamfered bevels
  ctx.fillStyle =
    mode === 'boutique-warm'
      ? 'rgba(238, 218, 182, 0.45)'
      : mode === 'obsidian-dramatic'
      ? 'rgba(255, 246, 228, 0.55)'
      : 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(0, 185, 1024, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Generates a radial sunray / circular satiné bump map for brushed metal surfaces.
 */
export function createSunrayDialTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 720; i++) {
    const angle = (i / 720) * Math.PI * 2;
    const shade = 118 + Math.sin(angle * 4) * 14 + ((i * 17) % 15);
    ctx.strokeStyle = `rgb(${shade}, ${shade}, ${shade})`;
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * size * 0.55, cy + Math.sin(angle) * size * 0.55);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

let cachedGuillocheNormalCanvas: HTMLCanvasElement | null = null;

/**
 * Generates a 2K (2048x2048) Tangent-Space Normal Map with traditional Swiss Rose-Engine
 * Guilloché engraving (Ligne Droite / Sine wave modulation, 144 teeth).
 * Replaces flat 2D canvas stripes with genuine micro-faceted surface normals that catch
 * directional Chiaroscuro spotlights across the dial.
 */
export function createGuillocheNormalMap(): THREE.CanvasTexture {
  const size = 2048;

  if (!cachedGuillocheNormalCanvas) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    const half = size * 0.5;
    const teeth = 144; // 144 radial rose-engine cam teeth (Ligne Droite / Sine wave modulation)

    // Pass 1: Compute high-precision 2K rose-engine heightfield H(x, y)
    const heightField = new Float32Array(size * size);

    for (let y = 0; y < size; y++) {
      const dy = y - half;
      const rowOffset = y * size;
      for (let x = 0; x < size; x++) {
        const dx = x - half;
        const r = Math.sqrt(dx * dx + dy * dy);

        if (r < 4 || r > half * 0.98) {
          heightField[rowOffset + x] = 0;
          continue;
        }

        const theta = Math.atan2(dy, dx);
        const toothPhase = theta * teeth;
        const sinTeeth = Math.sin(toothPhase);
        const cosTeeth = Math.cos(toothPhase);

        // Normalize radius to [0..1] across the dial plate
        const rn = r / half;

        // Smooth cartouche reserve plaque at 12 o'clock so VÉRON typography remains razor-sharp
        const cartoucheDx = Math.abs(dx) / (size * 0.14);
        const cartoucheDy = Math.abs(dy + size * 0.16) / (size * 0.042);
        const inCartouche = cartoucheDx < 1.0 && cartoucheDy < 1.0;

        let h = 0;
        if (inCartouche) {
          h = 0;
        } else if (rn < 0.64) {
          // Central Guilloché Medallion: Silky 144-tooth Ligne Droite / Sine wave modulation
          const waveMod = sinTeeth * 1.15 * Math.sin(r * 0.14) + cosTeeth * 0.45;
          const groove = Math.sin(r * 0.28 + waveMod);
          const radialFlute = 0.28 * sinTeeth;
          h = (groove * 0.72 + radialFlute * 0.28) * 0.85;
        } else if (rn < 0.86) {
          // Chapter Ring: Fine Ligne Droite radial 144-tooth sine modulation + circular satiné
          const waveMod = sinTeeth * 0.65;
          const groove = Math.sin(r * 0.36 + waveMod);
          h = (groove * 0.58 + sinTeeth * 0.42) * 0.55;
        } else {
          // Outer Chemin de Fer Minute Track: Precision concentric diamond-turned grooves
          const waveMod = sinTeeth * 0.25;
          h = Math.sin(r * 0.48 + waveMod) * 0.35;
        }

        heightField[rowOffset + x] = h;
      }
    }

    // Pass 2: Central-difference partial derivatives -> Tangent-Space RGB Normals
    const strength = 1.85;
    for (let y = 1; y < size - 1; y++) {
      const rowOffset = y * size;
      for (let x = 1; x < size - 1; x++) {
        const idx = rowOffset + x;
        const dhdx = (heightField[idx + 1] - heightField[idx - 1]) * 0.5 * strength;
        const dhdy = (heightField[idx + size] - heightField[idx - size]) * 0.5 * strength;

        // Tangent space normal (-dh/dx, dh/dy, 1.0) normalized
        const nx = -dhdx;
        const ny = dhdy;
        const nz = 1.0;
        const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);

        const pIdx = idx * 4;
        data[pIdx] = Math.min(255, Math.max(0, Math.round((nx * invLen * 0.5 + 0.5) * 255)));
        data[pIdx + 1] = Math.min(255, Math.max(0, Math.round((ny * invLen * 0.5 + 0.5) * 255)));
        data[pIdx + 2] = Math.min(255, Math.max(128, Math.round((nz * invLen * 0.5 + 0.5) * 255)));
        data[pIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    cachedGuillocheNormalCanvas = canvas;
  }

  const normalTex = new THREE.CanvasTexture(cachedGuillocheNormalCanvas);
  normalTex.colorSpace = THREE.NoColorSpace;
  normalTex.anisotropy = 8;
  normalTex.wrapS = THREE.ClampToEdgeWrapping;
  normalTex.wrapT = THREE.ClampToEdgeWrapping;
  normalTex.needsUpdate = true;
  return normalTex;
}

/**
 * Generates High-Resolution Horological Dial Face Texture (1024x1024).
 * Includes:
 * - Deep sunray / Grand Feu enamel radial gradient
 * - Outer precision railway minute track (Chemin de fer) with 5-minute numerals
 * - VÉRON / GENÈVE typography
 * - Recessed subdial chapter scales (Roman numerals XII, I, II... & seconds/date track like Ref 1)
 */
export function createHorologicalDialFaceTexture(
  dialColor: DialOption,
  modelId: WatchModelId
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  // 1. Base Dial Palette (Deep Velvet #0D0C0A for Obsidian so guilloché relief reveals strictly under directional light)
  let centerHex = '#0D0C0A';
  let edgeHex = '#050504';
  let trackColor = 'rgba(222, 196, 148, 0.88)';
  let mutedTrackColor = 'rgba(180, 154, 112, 0.48)';
  let textPrimary = '#F6F3EC';
  let textAccent = '#DFC492';

  if (dialColor === 'ivory') {
    centerHex = '#F3EFE6';
    edgeHex = '#DFD9CC';
    trackColor = 'rgba(25, 24, 21, 0.82)';
    mutedTrackColor = 'rgba(41, 40, 36, 0.4)';
    textPrimary = '#11110F';
    textAccent = '#8A6F44';
  } else if (dialColor === 'midnight') {
    centerHex = '#142236';
    edgeHex = '#080F1A';
    trackColor = 'rgba(222, 202, 166, 0.82)';
    mutedTrackColor = 'rgba(180, 154, 112, 0.42)';
    textPrimary = '#F2EFE9';
    textAccent = '#D4BA8C';
  }

  ctx.clearRect(0, 0, size, size);

  // Subtle perimeter vignette around the bezel rehaut edge
  const bgGrad = ctx.createRadialGradient(cx, cy, size * 0.32, cx, cy, size * 0.5);
  bgGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bgGrad.addColorStop(0.82, 'rgba(0, 0, 0, 0.14)');
  bgGrad.addColorStop(1, edgeHex);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // 2. Outer Chemin de Fer (Railway Minute Track)
  const outerTrackR = 456;
  const innerTrackR = 440;
  ctx.strokeStyle = trackColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, outerTrackR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = mutedTrackColor;
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.arc(cx, cy, innerTrackR, 0, Math.PI * 2);
  ctx.stroke();

  for (let m = 0; m < 60; m++) {
    const a = (m / 60) * Math.PI * 2 - Math.PI / 2;
    const isFive = m % 5 === 0;
    ctx.strokeStyle = isFive ? textAccent : trackColor;
    ctx.lineWidth = isFive ? 2.4 : 1.1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * innerTrackR, cy + Math.sin(a) * innerTrackR);
    ctx.lineTo(cx + Math.cos(a) * outerTrackR, cy + Math.sin(a) * outerTrackR);
    ctx.stroke();
  }

  // 3. Model-Specific Subdial Chapters & Typography (No overlapping/random circles)
  if (modelId === 'no-01-classic') {
    // Concentric Inner Guilloché Medallion Ring (Strictly centered around main hands)
    const medallionR = 328;
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, cy, medallionR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = mutedTrackColor;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(cx, cy, medallionR - 8, 0, Math.PI * 2);
    ctx.stroke();

    // Upper Hemisphere: Uncluttered Maison VÉRON Signature at 12 o'clock
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 32px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = textPrimary;
    ctx.fillText('V É R O N', cx, cy - 176);

    ctx.font = '600 11px "Manrope", sans-serif';
    ctx.fillStyle = textAccent;
    ctx.fillText('GENÈVE · CHRONOMÈTRE', cx, cy - 144);

    // Lower Hemisphere (6 o'clock): Dedicated Non-Intersecting Petite Seconde Subdial
    const subY = cy + 186;
    const subR = 104;

    // Recessed darker/contrasting subdial well
    const subGrad = ctx.createRadialGradient(cx, subY, 8, cx, subY, subR);
    subGrad.addColorStop(0, edgeHex);
    subGrad.addColorStop(1, centerHex);
    ctx.fillStyle = subGrad;
    ctx.beginPath();
    ctx.arc(cx, subY, subR, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Azurage grooves inside Petite Seconde
    ctx.save();
    ctx.strokeStyle = mutedTrackColor;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 0.75;
    for (let sr = 18; sr < subR - 16; sr += 6) {
      ctx.beginPath();
      ctx.arc(cx, subY, sr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Petite Seconde railway scale
    ctx.strokeStyle = trackColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, subY, subR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = mutedTrackColor;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(cx, subY, subR - 14, 0, Math.PI * 2);
    ctx.stroke();

    for (let s = 0; s < 60; s++) {
      const a = (s / 60) * Math.PI * 2 - Math.PI / 2;
      const isFive = s % 5 === 0;
      ctx.strokeStyle = isFive ? textAccent : mutedTrackColor;
      ctx.lineWidth = isFive ? 1.8 : 0.9;
      ctx.beginPath();
      ctx.moveTo(
        cx + Math.cos(a) * (subR - (isFive ? 14 : 9)),
        subY + Math.sin(a) * (subR - (isFive ? 14 : 9))
      );
      ctx.lineTo(cx + Math.cos(a) * subR, subY + Math.sin(a) * subR);
      ctx.stroke();
    }

    // Cardinal Petite Seconde numerals (60, 15, 30, 45)
    ctx.font = '500 12px "JetBrains Mono", monospace';
    ctx.fillStyle = textPrimary;
    ctx.fillText('60', cx, subY - subR + 25);
    ctx.fillText('30', cx, subY + subR - 24);
    ctx.fillText('15', cx + subR - 26, subY + 1);
    ctx.fillText('45', cx - subR + 26, subY + 1);
  } else if (modelId === 'no-03-chronograph') {
    // Top Brand Signature
    ctx.font = '500 28px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = textPrimary;
    ctx.textAlign = 'center';
    ctx.fillText('V É R O N', cx, cy - 165);

    ctx.font = '400 12px "Manrope", sans-serif';
    ctx.fillStyle = textAccent;
    ctx.fillText('MONOPUSHER CHRONOGRAPH', cx, cy - 138);

    // Left & Right Recessed Chronograph Registers
    [-218, 218].forEach((offsetX, i) => {
      const regX = cx + offsetX;
      const regR = 104;
      ctx.strokeStyle = trackColor;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(regX, cy, regR, 0, Math.PI * 2);
      ctx.stroke();

      for (let t = 0; t < 30; t++) {
        const a = (t / 30) * Math.PI * 2 - Math.PI / 2;
        const major = t % 5 === 0;
        ctx.strokeStyle = major ? textAccent : mutedTrackColor;
        ctx.lineWidth = major ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(regX + Math.cos(a) * (regR - (major ? 14 : 8)), cy + Math.sin(a) * (regR - (major ? 14 : 8)));
        ctx.lineTo(regX + Math.cos(a) * regR, cy + Math.sin(a) * regR);
        ctx.stroke();
      }

      ctx.font = '400 12px "JetBrains Mono", monospace';
      ctx.fillStyle = textPrimary;
      ctx.fillText(i === 0 ? '60 SEC' : '30 MIN', regX, cy + 44);
    });
  } else {
    // Skeleton Outer Chapter Ring Markings
    ctx.font = '500 24px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = textPrimary;
    ctx.textAlign = 'center';
    ctx.fillText('V É R O N', cx, cy - 355);
  }

  // Bottom Swiss / Manufacture Hallmark
  ctx.font = '400 12px "Manrope", sans-serif';
  ctx.fillStyle = trackColor;
  ctx.textAlign = 'center';
  ctx.fillText('MANUFACTURE HORLOGÈRE', cx, cy + 422);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates Côtes de Genève (Geneva Stripes) texture for mechanical movement bridges.
 */
export function createCotesDeGeneveTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const stripeCount = 16;
  const stripeWidth = size / stripeCount;

  for (let i = 0; i < stripeCount; i++) {
    const x = i * stripeWidth;
    const grad = ctx.createLinearGradient(x, 0, x + stripeWidth, 0);
    grad.addColorStop(0, '#585856');
    grad.addColorStop(0.18, '#b0b0ac');
    grad.addColorStop(0.5, '#dcdcd8');
    grad.addColorStop(0.82, '#92928e');
    grad.addColorStop(1, '#4e4e4c');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, stripeWidth, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates Alligator Leather Grain Bump Texture for genuine luxury watch straps.
 */
export function createAlligatorLeatherTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#909090';
  ctx.fillRect(0, 0, size, size);

  // Rectangular alligator scale ridges
  const rows = 10;
  const cols = 6;
  const cellW = size / cols;
  const cellH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = ((r * 7 + c * 13) % 10) - 5;
      const x = c * cellW + jitterX;
      const y = r * cellH;

      const grad = ctx.createRadialGradient(
        x + cellW * 0.5,
        y + cellH * 0.5,
        4,
        x + cellW * 0.5,
        y + cellH * 0.5,
        Math.max(cellW, cellH) * 0.62
      );
      grad.addColorStop(0, '#dadada');
      grad.addColorStop(0.75, '#8a8a8a');
      grad.addColorStop(1, '#323232');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 3, cellW - 6, cellH - 6, 8);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates dynamic Caseback Engraving ring texture with bespoke user inscription.
 */
export function createCasebackEngravingTexture(
  engravingText: string,
  modelCode: string
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const radius = 382;

  ctx.save();
  ctx.font = '500 28px "Cormorant Garamond", Georgia, serif';
  ctx.fillStyle = '#B49A70';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const drawCurvedText = (text: string, startAngle: number, dir: 1 | -1) => {
    const chars = text.split('');
    const angleStep = 0.044 * dir;
    const totalAngle = (chars.length - 1) * angleStep;
    let currentAngle = startAngle - totalAngle / 2;

    chars.forEach((ch) => {
      ctx.save();
      ctx.translate(
        cx + Math.cos(currentAngle) * radius,
        cy + Math.sin(currentAngle) * radius
      );
      ctx.rotate(currentAngle + (dir === 1 ? Math.PI / 2 : -Math.PI / 2));
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      currentAngle += angleStep;
    });
  };

  drawCurvedText(`${modelCode.toUpperCase()} · MANUFACTURE HORLOGÈRE`, -Math.PI / 2, 1);

  const bottomInscription = engravingText.trim()
    ? `BESPOKE EDITION · ${engravingText.trim()}`
    : 'SWISS CALIBRE · HAND-CRAFTED IN LIMITED SERIES';
  drawCurvedText(bottomInscription, Math.PI / 2, -1);

  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
