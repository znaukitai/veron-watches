/**
 * [ARGON_CORE] + [PRO_UI] Section 03: THE ART OF MECHANICS
 * Scroll-driven 3D Exploded View of the 6 horological layers:
 * 01. Sapphire Crystal
 * 02. Hands
 * 03. Dial
 * 04. Movement
 * 05. Case
 * 06. Case Back
 *
 * Technical Features:
 * - Uses GSAP ScrollTrigger scrubbed to scroll position so the 6 real 3D geometry layers separate
 *   into space and re-assemble smoothly on reverse scroll or at the end of the sequence.
 * - Also provides an interactive manual override slider and direct layer inspection buttons for
 *   keyboard / reduced-motion users.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WatchViewport3D, type ProjectedLeaderNode } from '../scene/WatchViewport3D';
import {
  EXPLODED_COMPONENTS,
  useWatchStore,
} from '../store/watchStore';
import { Layers, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface BlueprintCalloutMeta {
  id: ProjectedLeaderNode['id'];
  shortIndex: string;
  layerCode: string;
  side: 'left' | 'right';
  slotYPct: number;
  title: string;
  specLine: string;
  toleranceLine: string;
}

const BLUEPRINT_CALLOUTS: BlueprintCalloutMeta[] = [
  {
    id: 'sapphire-crystal',
    shortIndex: '01',
    layerCode: 'LAYER 01 // CORUNDUM OPTICS',
    side: 'right',
    slotYPct: 16,
    title: 'Sapphire Crystal (Box-Domed Corundum)',
    specLine: 'DOMED SAPPHIRE // 1.77 IOR Double Anti-Reflective',
    toleranceLine: '9 MOHS · THICKNESS 1.40mm · ±0.005mm',
  },
  {
    id: 'hands',
    shortIndex: '02',
    layerCode: 'LAYER 02 // INDICATION',
    side: 'right',
    slotYPct: 43,
    title: 'Hands Assembly (Faceted Dauphine)',
    specLine: '18K GOLD DAUPHINE // Diamond-Cut Central Spine',
    toleranceLine: 'POISE BALANCED · ±0.002mm TOLERANCE',
  },
  {
    id: 'dial',
    shortIndex: '03',
    layerCode: 'LAYER 03 // CADRAN',
    side: 'left',
    slotYPct: 63,
    title: 'Guilloché Dial (Ligne Droite / Solid Brass)',
    specLine: 'ROSE-ENGINE 144T // #0D0C0A Velvet Obsidian',
    toleranceLine: 'APPLIED 18K INDICES · PETITE SECONDE 6H',
  },
  {
    id: 'movement',
    shortIndex: '04',
    layerCode: 'LAYER 04 // CALIBRE MANUFACTURE',
    side: 'right',
    slotYPct: 72,
    title: 'Calibre Movement (Côtes de Genève & Escapement)',
    specLine: 'CALIBRE VR-01 // 21,600 vph · 72h Reserve',
    toleranceLine: '29 RUBY JEWELS · FREE-SPRUNG BALANCE',
  },
  {
    id: 'case',
    shortIndex: '05',
    layerCode: 'LAYER 05 // CARRURE',
    side: 'left',
    slotYPct: 86,
    title: 'Exhibition Case & Flank (Stepped Carrure)',
    specLine: 'STEPPED CARRURE // Ø 39.0mm Satin & Mirror Bevel',
    toleranceLine: '3 ATM SEALED · ERGONOMIC CURVED LUGS',
  },
];

export const MechanicsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageOverlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const diagLineRefs = useRef<Record<string, SVGLineElement | null>>({});
  const horizLineRefs = useRef<Record<string, SVGLineElement | null>>({});
  const dotRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const haloRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const termDotRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const badgeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mobileMarkerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lerpedOpacityRef = useRef(0);

  // Only toggles visibility of the mobile bottom specification sheet on tap (no screen coordinates in React state!)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(true);

  const explosionProgress = useWatchStore((s) => s.explosionProgress);
  const setExplosionProgress = useWatchStore((s) => s.setExplosionProgress);
  const activeExplodedPart = useWatchStore((s) => s.activeExplodedPart);
  const setActiveExplodedPart = useWatchStore((s) => s.setActiveExplodedPart);

  const activeCallout =
    BLUEPRINT_CALLOUTS.find((c) => c.id === activeExplodedPart) || BLUEPRINT_CALLOUTS[0];

  // Zero-React-State direct DOM mutation loop for 60/144Hz SVG Leader Lines & 3D Markers (Rule 2.2)
  const handleLeaderNodesUpdate = useCallback(
    (nodes: ProjectedLeaderNode[], currentExplosion: number) => {
      const overlay = stageOverlayRef.current;
      const svg = svgRef.current;
      if (!overlay || !svg) return;

      const w = overlay.clientWidth || 720;
      const h = overlay.clientHeight || 520;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

      // Smoothly reveal leader lines and badges when explosionProgress > 0.25
      const targetAlpha =
        currentExplosion > 0.25
          ? Math.min(1, (currentExplosion - 0.25) / 0.38)
          : 0;
      lerpedOpacityRef.current += (targetAlpha - lerpedOpacityRef.current) * 0.18;
      const alpha = lerpedOpacityRef.current;

      overlay.style.opacity = alpha.toFixed(3);
      overlay.style.pointerEvents = alpha > 0.35 ? 'auto' : 'none';

      const plaqueWidth = 256;
      const marginX = 34;

      nodes.forEach((node) => {
        const meta = BLUEPRINT_CALLOUTS.find((c) => c.id === node.id);
        if (!meta) return;

        // 2D projected coordinates of the 3D part center/anchor
        const sx = (node.xPct / 100) * w;
        const sy = (node.yPct / 100) * h;

        // Blend vertical plaque position between projected Y and dedicated blueprint slot
        const isLeft = meta.side === 'left';
        const slotY = (meta.slotYPct / 100) * h;
        const ty = isLeft
          ? Math.max(slotY, sy * 0.15 + slotY * 0.85)
          : sy * 0.28 + slotY * 0.72;
        const terminalX = isLeft ? marginX + plaqueWidth : w - marginX - plaqueWidth;
        const elbowX = isLeft ? terminalX + 44 : terminalX - 44;

        // Direct SVG attribute mutations (x1, y1, x2, y2) without React Virtual DOM diffing
        const diagLineEl = diagLineRefs.current[node.id];
        if (diagLineEl) {
          diagLineEl.setAttribute('x1', sx.toFixed(1));
          diagLineEl.setAttribute('y1', sy.toFixed(1));
          diagLineEl.setAttribute('x2', elbowX.toFixed(1));
          diagLineEl.setAttribute('y2', ty.toFixed(1));
        }

        const horizLineEl = horizLineRefs.current[node.id];
        if (horizLineEl) {
          horizLineEl.setAttribute('x1', elbowX.toFixed(1));
          horizLineEl.setAttribute('y1', ty.toFixed(1));
          horizLineEl.setAttribute('x2', terminalX.toFixed(1));
          horizLineEl.setAttribute('y2', ty.toFixed(1));
        }

        const dotEl = dotRefs.current[node.id];
        if (dotEl) {
          dotEl.setAttribute('cx', sx.toFixed(1));
          dotEl.setAttribute('cy', sy.toFixed(1));
        }

        const haloEl = haloRefs.current[node.id];
        if (haloEl) {
          haloEl.setAttribute('cx', sx.toFixed(1));
          haloEl.setAttribute('cy', sy.toFixed(1));
        }

        const termDotEl = termDotRefs.current[node.id];
        if (termDotEl) {
          termDotEl.setAttribute('cx', terminalX.toFixed(1));
          termDotEl.setAttribute('cy', ty.toFixed(1));
        }

        // GPU-composited translate3d for desktop callout plaque
        const badgeEl = badgeRefs.current[node.id];
        if (badgeEl) {
          const badgeX = isLeft ? marginX : w - marginX - plaqueWidth;
          badgeEl.style.width = `${plaqueWidth}px`;
          badgeEl.style.transform = `translate3d(${badgeX.toFixed(1)}px, ${ty.toFixed(1)}px, 0) translateY(-50%)`;
        }

        // GPU-composited translate3d for compact mobile marker (01..05) anchored on 3D part
        const markerEl = mobileMarkerRefs.current[node.id];
        if (markerEl) {
          const clampedX = Math.max(24, Math.min(w - 24, sx));
          const clampedY = Math.max(92, Math.min(h - 135, sy));
          markerEl.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0) translate(-50%, -50%)`;
        }
      });
    },
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setExplosionProgress(0.85);
      return;
    }

    // Scroll-driven kinematic curve:
    // 0% -> 15% scroll: begins separating
    // 15% -> 65% scroll: reaches full exploded view (1.0) while user inspects the 6 components
    // 65% -> 100% scroll: smoothly re-assembles back to 0.0 as user scrolls into Craftsmanship
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 35%',
        end: 'bottom 55%',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          let expValue = 0;
          if (p <= 0.58) {
            expValue = gsap.utils.clamp(0, 1, p / 0.48);
          } else {
            expValue = gsap.utils.clamp(0, 1, 1 - (p - 0.58) / 0.42);
          }
          setExplosionProgress(expValue);

          // Highlight corresponding component along the scroll timeline
          const compIdx = Math.min(
            EXPLODED_COMPONENTS.length - 1,
            Math.floor(p * EXPLODED_COMPONENTS.length)
          );
          setActiveExplodedPart(EXPLODED_COMPONENTS[compIdx].id);
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [setExplosionProgress, setActiveExplodedPart]);

  return (
    <section
      id="mechanics"
      ref={sectionRef}
      className="env-obsidian"
      style={{
        position: 'relative',
        paddingBlock: 'clamp(5.5rem, 9vw, 8.5rem)',
        borderBottom: '1px solid var(--line-dark)',
      }}
    >
      <div className="veron-container">
        {/* Section Header */}
        <div
          className="editorial-grid"
          style={{
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--line-dark)',
            alignItems: 'end',
          }}
        >
          <div style={{ gridColumn: '1 / span 7' }} className="mech-header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <Layers size={14} color="var(--c-gold)" />
              <span className="tech-label" style={{ color: 'var(--c-gold)' }}>
                03 / HOROLOGICAL ANATOMY · EXPLODED VIEW
              </span>
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: 'var(--t-h2)',
                color: 'var(--c-white)',
                fontWeight: 300,
              }}
            >
              THE ART OF MECHANICS
            </h2>
          </div>

          <div style={{ gridColumn: '8 / span 5' }} className="mech-header-right">
            <p
              className="font-display-italic"
              style={{
                fontSize: 'clamp(1.25rem, 1.8vw, 1.65rem)',
                color: 'var(--c-ivory)',
                lineHeight: 1.4,
              }}
            >
              Every component has a purpose.
              <br />
              Every movement tells a story.
            </p>
          </div>
        </div>

        {/* Full-Width Editorial 3D Blueprint Stage (MERIDIAN Architecture) */}
        <div
          className="mechanics-full-stage"
          style={{
            marginTop: '3rem',
            height: 'clamp(580px, 82vh, 770px)',
            backgroundColor: 'var(--surface-dark)',
            border: '1px solid var(--line-dark)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top Stage Status Bar */}
          <div
            style={{
              padding: '1rem 1.75rem',
              borderBottom: '1px solid var(--line-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 4,
              backgroundColor: 'rgba(14, 14, 12, 0.85)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span className="tech-mono" style={{ color: 'var(--c-gold)', fontSize: '0.7rem' }}>
              CALIBRE DISASSEMBLY // {Math.round(explosionProgress * 100)}% SEPARATION
            </span>
            <span className="tech-label" style={{ fontSize: '0.62rem' }}>
              SCROLL OR USE REGULATOR BELOW · CLICK ANY COMPONENT TO INSPECT
            </span>
          </div>

          {/* Full-Width 3D Exploded Canvas + Left Editorial Block + Dynamic SVG Leader Lines */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Left Third Haute Horlogerie Editorial Copy Block (MERIDIAN Reference) */}
            <div
              className="mechanics-editorial-overlay"
              style={{
                position: 'absolute',
                top: '1.5rem',
                left: 'clamp(1.5rem, 2.8vw, 2.5rem)',
                maxWidth: '390px',
                zIndex: 3,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.66rem',
                  letterSpacing: '0.2em',
                  color: 'var(--c-gold)',
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem',
                }}
              >
                — 04 · SERVICEABLE FOREVER
              </div>

              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(2.25rem, 3.4vw, 3.25rem)',
                  color: 'var(--c-white)',
                  fontWeight: 300,
                  lineHeight: 1.02,
                  letterSpacing: '-0.01em',
                  marginBottom: '0.8rem',
                }}
              >
                186 parts.
                <br />
                <span className="font-display-italic" style={{ color: 'var(--c-ivory)' }}>
                  Zero shortcuts.
                </span>
              </h3>

              <p
                style={{
                  fontFamily: 'var(--f-sans)',
                  fontSize: '0.86rem',
                  color: 'var(--c-stone)',
                  lineHeight: 1.58,
                  fontWeight: 300,
                  maxWidth: '37ch',
                }}
              >
                Every bridge, ruby chaton, sapphire gasket, and gear pinion disassembles cleanly.
                Engineered to be serviced and restored for generations.
              </p>
            </div>

            <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
              <WatchViewport3D
                mode="exploded"
                interactiveOrbit={true}
                onLeaderNodesUpdate={handleLeaderNodesUpdate}
                onPartClick={(partId) => {
                  setActiveExplodedPart(partId);
                  setMobileSheetOpen(true);
                  if (explosionProgress < 0.4) {
                    setExplosionProgress(0.85);
                  }
                }}
              />

              {/* Dynamic SVG Leader Lines & Technical Callouts Overlay (Reveals when explosionProgress > 0.25) */}
              <div
                ref={stageOverlayRef}
              aria-hidden={explosionProgress <= 0.25}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <svg
                ref={svgRef}
                className="desktop-leader-svg"
                width="100%"
                height="100%"
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'visible',
                  pointerEvents: 'none',
                }}
              >
                {BLUEPRINT_CALLOUTS.map((callout) => {
                  const isSelected = activeExplodedPart === callout.id;
                  return (
                    <g key={callout.id} opacity={isSelected ? 1 : 0.84}>
                      {/* Diagonal Leader Segment (x1,y1 -> x2,y2 mutated directly in RAF) */}
                      <line
                        ref={(el) => {
                          diagLineRefs.current[callout.id] = el;
                        }}
                        stroke="#B49A70"
                        strokeWidth="1"
                        strokeOpacity={isSelected ? '0.98' : '0.72'}
                      />
                      {/* Horizontal Leader Segment (x1,y1 -> x2,y2 mutated directly in RAF) */}
                      <line
                        ref={(el) => {
                          horizLineRefs.current[callout.id] = el;
                        }}
                        stroke="#B49A70"
                        strokeWidth="1"
                        strokeOpacity={isSelected ? '0.98' : '0.72'}
                      />
                      {/* Subtle outer target ring on 3D component */}
                      <circle
                        ref={(el) => {
                          haloRefs.current[callout.id] = el;
                        }}
                        r="4.5"
                        fill="none"
                        stroke="#B49A70"
                        strokeWidth="0.75"
                        strokeOpacity="0.45"
                      />
                      {/* 3px diameter circular marker dot (r="1.5") anchored on 3D part */}
                      <circle
                        ref={(el) => {
                          dotRefs.current[callout.id] = el;
                        }}
                        r="1.5"
                        fill="#B49A70"
                      />
                      {/* Terminal junction node at plaque edge */}
                      <circle
                        ref={(el) => {
                          termDotRefs.current[callout.id] = el;
                        }}
                        r="1.5"
                        fill="#B49A70"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Desktop Haute Horlogerie Technical Annotation Plaques (Positioned via translate3d) */}
              {BLUEPRINT_CALLOUTS.map((callout) => {
                const isSelected = activeExplodedPart === callout.id;
                const isLeft = callout.side === 'left';
                return (
                  <button
                    key={callout.id}
                    type="button"
                    ref={(el) => {
                      badgeRefs.current[callout.id] = el;
                    }}
                    onClick={() => setActiveExplodedPart(callout.id)}
                    className="blueprint-callout-plaque"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      willChange: 'transform',
                      textAlign: isLeft ? 'left' : 'right',
                      padding: '0.52rem 0.78rem',
                      backgroundColor: isSelected
                        ? 'rgba(20, 18, 15, 0.94)'
                        : 'rgba(11, 11, 10, 0.84)',
                      border: isSelected
                        ? '1px solid rgba(213, 186, 136, 0.88)'
                        : '1px solid rgba(180, 154, 112, 0.36)',
                      backdropFilter: 'blur(6px)',
                      cursor: 'pointer',
                      transition:
                        'border-color 0.25s ease, background-color 0.25s ease',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--f-mono)',
                        fontSize: '0.56rem',
                        letterSpacing: '0.12em',
                        color: '#B49A70',
                        marginBottom: '0.18rem',
                        textTransform: 'uppercase',
                      }}
                    >
                      {callout.layerCode}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--f-sans)',
                        fontSize: '0.70rem',
                        fontWeight: 500,
                        color: '#F2EFE9',
                        lineHeight: 1.25,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {callout.title}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--f-mono)',
                        fontSize: '0.58rem',
                        color: '#D5BA88',
                        letterSpacing: '0.04em',
                        lineHeight: 1.3,
                      }}
                    >
                      {callout.specLine}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--f-mono)',
                        fontSize: '0.52rem',
                        color: 'rgba(166, 162, 152, 0.88)',
                        letterSpacing: '0.06em',
                        marginTop: '0.12rem',
                      }}
                    >
                      {callout.toleranceLine}
                    </div>
                  </button>
                );
              })}

              {/* Mobile Compact Interactive Markers (01..05) Anchored on 3D Components (< 768px) */}
              {BLUEPRINT_CALLOUTS.map((callout) => {
                const isSelected = activeExplodedPart === callout.id;
                return (
                  <button
                    key={`mobile-marker-${callout.id}`}
                    type="button"
                    ref={(el) => {
                      mobileMarkerRefs.current[callout.id] = el;
                    }}
                    onClick={() => {
                      setActiveExplodedPart(callout.id);
                      setMobileSheetOpen(true);
                    }}
                    aria-label={`Inspect ${callout.title}`}
                    className="mobile-blueprint-marker"
                    style={{
                      display: 'none',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      backgroundColor: isSelected
                        ? 'var(--c-gold)'
                        : 'rgba(14, 14, 12, 0.92)',
                      color: isSelected ? 'var(--c-obsidian)' : 'var(--c-gold)',
                      border: isSelected
                        ? '1.5px solid var(--c-white)'
                        : '1px solid rgba(180, 154, 112, 0.85)',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.65)',
                      willChange: 'transform',
                      cursor: 'pointer',
                      zIndex: 5,
                    }}
                  >
                    {callout.shortIndex}
                  </button>
                );
              })}

              {/* Mobile Compact Bottom Specification Sheet (Opens on tapping 01..05 markers) */}
              {mobileSheetOpen && (
                <div
                  className="mobile-spec-sheet"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    left: '0.75rem',
                    right: '0.75rem',
                    bottom: '0.65rem',
                    zIndex: 6,
                    backgroundColor: 'rgba(15, 14, 12, 0.95)',
                    border: '1px solid rgba(180, 154, 112, 0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.7rem 0.85rem',
                    pointerEvents: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {BLUEPRINT_CALLOUTS.map((c) => {
                        const active = c.id === activeCallout.id;
                        return (
                          <button
                            key={`pill-${c.id}`}
                            type="button"
                            onClick={() => setActiveExplodedPart(c.id)}
                            style={{
                              padding: '0.18rem 0.42rem',
                              fontFamily: 'var(--f-mono)',
                              fontSize: '0.58rem',
                              backgroundColor: active ? 'var(--c-gold)' : 'transparent',
                              color: active ? 'var(--c-obsidian)' : 'var(--c-stone)',
                              border: active
                                ? '1px solid var(--c-gold)'
                                : '1px solid var(--line-dark)',
                              cursor: 'pointer',
                            }}
                          >
                            {c.shortIndex}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setMobileSheetOpen(false)}
                      aria-label="Close Component Specification"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--c-stone)',
                        padding: '0.2rem',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.12em',
                      color: 'var(--c-gold)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeCallout.layerCode}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--f-ui)',
                      fontSize: '0.76rem',
                      fontWeight: 500,
                      color: 'var(--c-white)',
                      marginTop: '0.1rem',
                    }}
                  >
                    {activeCallout.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.6rem',
                      color: '#D5BA88',
                      marginTop: '0.12rem',
                    }}
                  >
                    {activeCallout.specLine} · {activeCallout.toleranceLine}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Manual Regulator Control Bar (Touch-Ergonomic 44px Minimum Hit Target) */}
          <div
            className="mechanics-regulator-bar"
            style={{
              padding: '0.85rem 1.75rem',
              borderTop: '1px solid var(--line-dark)',
              backgroundColor: 'rgba(17, 17, 15, 0.92)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              zIndex: 4,
            }}
          >
            <label
              htmlFor="explosion-regulator"
              className="tech-label"
              style={{ color: 'var(--c-ivory)', fontSize: '0.64rem' }}
            >
              MANUAL DISASSEMBLY REGULATOR:
            </label>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                flex: 1,
                maxWidth: '440px',
                minHeight: '44px',
              }}
            >
              <button
                type="button"
                onClick={() => setExplosionProgress(0)}
                style={{
                  minHeight: '44px',
                  background: 'none',
                  border: '1px solid var(--line-dark)',
                  color: 'var(--c-stone)',
                  padding: '0.4rem 0.75rem',
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.62rem',
                  cursor: 'pointer',
                }}
              >
                ASSEMBLED
              </button>
              <input
                id="explosion-regulator"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={explosionProgress}
                onChange={(e) => setExplosionProgress(parseFloat(e.target.value))}
                aria-label="Adjust 3D watch exploded view separation"
                style={{
                  flex: 1,
                  minHeight: '44px',
                  accentColor: 'var(--c-gold)',
                  cursor: 'pointer',
                }}
              />
              <button
                type="button"
                onClick={() => setExplosionProgress(1)}
                style={{
                  minHeight: '44px',
                  background: 'none',
                  border: '1px solid var(--c-gold)',
                  color: 'var(--c-gold)',
                  padding: '0.4rem 0.75rem',
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.62rem',
                  cursor: 'pointer',
                }}
              >
                EXPLODED
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mech-header-left, .mech-header-right {
            grid-column: 1 / -1 !important;
          }
          .mechanics-full-stage {
            height: 620px !important;
          }
          .mechanics-editorial-overlay {
            max-width: 280px !important;
          }
        }
        @media (max-width: 768px) {
          .blueprint-callout-plaque,
          .desktop-leader-svg {
            display: none !important;
          }
          .mobile-blueprint-marker {
            display: inline-flex !important;
          }
          .mobile-spec-sheet {
            display: block !important;
          }
          .mechanics-full-stage {
            height: 680px !important;
          }
          .mechanics-editorial-overlay {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            max-width: none !important;
            padding: 0.75rem 1rem 0.6rem !important;
            border-bottom: 1px solid var(--line-dark);
            background: rgba(17, 17, 15, 0.92);
          }
          .mechanics-editorial-overlay h3 {
            font-size: 1.5rem !important;
            margin-bottom: 0.2rem !important;
          }
          .mechanics-editorial-overlay h3 br {
            display: none;
          }
          .mechanics-editorial-overlay h3 span::before {
            content: ' ';
          }
          .mechanics-editorial-overlay p {
            font-size: 0.72rem !important;
            line-height: 1.35 !important;
            max-width: none !important;
          }
          .mechanics-regulator-bar {
            padding: 0.65rem 0.95rem !important;
            gap: 0.45rem !important;
          }
        }
      `}</style>
    </section>
  );
};
