/**
 * [ARGON_CORE] + [PRO_UI] Section 05: INTERACTIVE WATCH ATELIER
 * Full 3D Horological Configurator + Order Dossier & WhatsApp Integration.
 *
 * Customization Parameters (All synchronized with Single Source of Truth Zustand store):
 * - CASE: Polished Steel | Yellow Gold | Titanium
 * - DIAL: Obsidian Black | Warm Ivory | Deep Midnight Blue
 * - STRAP: Black Leather | Brown Leather | Steel Bracelet
 * - HANDS: Classic | Skeleton
 * - ENGRAVING: Custom inscription input with character limit (24 chars) & live 3D Caseback visualization
 *
 * Viewport Controls:
 * - Orbit Rotation, Zoom In/Out, Reset Button, Camera Angle Presets, Studio Lighting Switcher
 *
 * Pricing & CTA:
 * - Indicative demonstration price recalculated live
 * - CTA: REQUEST YOUR CREATION -> Opens structured Bespoke Commission Dossier Modal with WhatsApp transmission
 */

import React, { useState } from 'react';
import { WatchViewport3D } from '../scene/WatchViewport3D';
import {
  COLLECTION_MODELS,
  CASE_OPTIONS,
  DIAL_OPTIONS,
  STRAP_OPTIONS,
  HANDS_OPTIONS,
  type CameraAngle,
  type StudioLighting,
  WHATSAPP_CONFIG,
  useWatchStore,
} from '../store/watchStore';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sun,
  Camera,
  Check,
  Copy,
  MessageSquare,
  X,
  RefreshCw,
} from 'lucide-react';

const CAMERA_ANGLE_LABELS: { id: CameraAngle; label: string }[] = [
  { id: 'three-quarter', label: '3/4 Studio' },
  { id: 'dial-front', label: 'Dial Front' },
  { id: 'movement-macro', label: 'Calibre' },
  { id: 'caseback', label: 'Caseback Engraving' },
  { id: 'profile', label: 'Crown Profile' },
];

const LIGHTING_LABELS: { id: StudioLighting; label: string }[] = [
  { id: 'boutique-warm', label: 'Boutique Warm' },
  { id: 'obsidian-dramatic', label: 'Obsidian Rim' },
  { id: 'daylight-atelier', label: 'Daylight Atelier' },
];

export const AtelierConfigurator: React.FC = () => {
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
  const isOrderModalOpen = useWatchStore((s) => s.isOrderModalOpen);

  const selectCollectionModel = useWatchStore((s) => s.selectCollectionModel);
  const setCaseMaterial = useWatchStore((s) => s.setCaseMaterial);
  const setDialColor = useWatchStore((s) => s.setDialColor);
  const setStrapType = useWatchStore((s) => s.setStrapType);
  const setHandsStyle = useWatchStore((s) => s.setHandsStyle);
  const setEngravingText = useWatchStore((s) => s.setEngravingText);
  const setCameraAngle = useWatchStore((s) => s.setCameraAngle);
  const setStudioLighting = useWatchStore((s) => s.setStudioLighting);
  const setZoomLevel = useWatchStore((s) => s.setZoomLevel);
  const toggleAutoRotate = useWatchStore((s) => s.toggleAutoRotate);
  const resetConfiguration = useWatchStore((s) => s.resetConfiguration);
  const setOrderModalOpen = useWatchStore((s) => s.setOrderModalOpen);
  const getFormattedOrderSummary = useWatchStore((s) => s.getFormattedOrderSummary);

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [customPhoneInput, setCustomPhoneInput] = useState(WHATSAPP_CONFIG.phoneNumber);
  const [mobileDrawerTab, setMobileDrawerTab] = useState<'case' | 'dial' | 'strap' | 'calibre' | 'engraving'>('case');
  const [drawerTouchStartX, setDrawerTouchStartX] = useState<number | null>(null);

  const MOBILE_TABS: { id: 'case' | 'dial' | 'strap' | 'calibre' | 'engraving'; label: string }[] = [
    { id: 'case', label: 'CASE' },
    { id: 'dial', label: 'DIAL' },
    { id: 'strap', label: 'STRAP' },
    { id: 'calibre', label: 'CALIBRE & HANDS' },
    { id: 'engraving', label: 'ENGRAVING' },
  ];

  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    setDrawerTouchStartX(e.touches[0].clientX);
  };

  const handleDrawerTouchEnd = (e: React.TouchEvent) => {
    if (drawerTouchStartX === null) return;
    const dx = e.changedTouches[0].clientX - drawerTouchStartX;
    setDrawerTouchStartX(null);
    if (Math.abs(dx) < 42) return;
    const currentIdx = MOBILE_TABS.findIndex((t) => t.id === mobileDrawerTab);
    if (dx < 0 && currentIdx < MOBILE_TABS.length - 1) {
      setMobileDrawerTab(MOBILE_TABS[currentIdx + 1].id);
    } else if (dx > 0 && currentIdx > 0) {
      setMobileDrawerTab(MOBILE_TABS[currentIdx - 1].id);
    }
  };

  const summary = getFormattedOrderSummary();

  const handleCopyDossier = () => {
    navigator.clipboard?.writeText(summary.messageText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2600);
  };

  // Dynamic WhatsApp URL if user enters a recipient phone number in the configuration modal or if pre-configured
  const cleanRecipientPhone = customPhoneInput.replace(/[^\d]/g, '');
  const dynamicWhatsappUrl =
    cleanRecipientPhone.length >= 7
      ? `https://wa.me/${cleanRecipientPhone}?text=${encodeURIComponent(summary.messageText)}`
      : summary.whatsappUrl;

  return (
    <section
      id="atelier"
      className="env-obsidian"
      style={{
        paddingBlock: 'clamp(5rem, 9vw, 8.5rem)',
        borderBottom: '1px solid var(--line-dark)',
      }}
    >
      <div className="veron-container">
        {/* Section Header */}
        <div
          className="editorial-grid"
          style={{
            paddingBottom: '2.75rem',
            borderBottom: '1px solid var(--line-dark)',
            alignItems: 'end',
          }}
        >
          <div style={{ gridColumn: '1 / span 7' }} className="atelier-header-left">
            <p className="tech-label" style={{ color: 'var(--c-gold)', marginBottom: '0.75rem' }}>
              05 / INTERACTIVE WATCH ATELIER · BESPOKE COMMISSION
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 'var(--t-h2)',
                color: 'var(--c-white)',
                fontWeight: 300,
              }}
            >
              Personalize Your <span className="font-display-italic">VÉRON Timepiece.</span>
            </h2>
          </div>

          <div
            style={{
              gridColumn: '8 / span 5',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '1rem',
            }}
            className="atelier-header-right"
          >
            <button
              type="button"
              onClick={resetConfiguration}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'transparent',
                border: '1px solid var(--line-dark)',
                color: 'var(--c-stone)',
                padding: '0.65rem 1.15rem',
                fontFamily: 'var(--f-ui)',
                fontSize: '0.68rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all var(--dur-hover) var(--ease-veron)',
              }}
            >
              <RotateCcw size={13} />
              RESET CONFIGURATION
            </button>
          </div>
        </div>

        {/* 3-Column Atelier Workspace: Left Controls (3 Cols) | Center 3D Stage (6 Cols) | Right Summary & Pricing (3 Cols) */}
        <div
          className="atelier-workspace-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: '1.75rem',
            marginTop: '2.75rem',
            alignItems: 'start',
          }}
        >
          {/* ================================================================= */}
          {/* LEFT PANEL: HOROLOGICAL CUSTOMIZATION PARAMETERS (3 Columns)      */}
          {/* ================================================================= */}
          <div
            className="atelier-controls-panel"
            style={{
              gridColumn: '1 / span 3',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.65rem',
              padding: '1.5rem',
              backgroundColor: 'var(--surface-dark)',
              border: '1px solid var(--line-dark)',
            }}
          >
            {/* 0. Base Reference Model Switcher */}
            <div>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.65rem' }}>
                00 / CALIBRE REFERENCE
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {COLLECTION_MODELS.map((m) => {
                  const active = m.id === activeModelId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => selectCollectionModel(m.id, false)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.65rem 0.85rem',
                        background: active ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                        border: active
                          ? '1px solid var(--c-gold)'
                          : '1px solid var(--line-dark)',
                        color: active ? 'var(--c-white)' : 'var(--c-stone)',
                        fontFamily: 'var(--f-ui)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span>
                        {m.code} — {m.name}
                      </span>
                      <span className="tech-mono" style={{ fontSize: '0.65rem', color: 'var(--c-gold)' }}>
                        CHF {(m.basePrice / 1000).toFixed(1)}k
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="hairline-dark" />

            {/* 1. CASE MATERIAL */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span className="tech-label" style={{ whiteSpace: 'nowrap' }}>01 / CASE MATERIAL</span>
                <span className="tech-mono" style={{ fontSize: '0.66rem', color: 'var(--c-gold)', whiteSpace: 'nowrap' }}>
                  {summary.caseMeta.label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {CASE_OPTIONS.map((opt) => {
                  const active = caseMaterial === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCaseMaterial(opt.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.65rem 0.4rem',
                        background: active ? 'rgba(180, 154, 112, 0.12)' : 'transparent',
                        border: active
                          ? '1px solid var(--c-gold)'
                          : '1px solid var(--line-dark)',
                        color: active ? 'var(--c-white)' : 'var(--c-stone)',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${opt.swatchHex} 0%, ${
                            opt.secondaryHex || opt.swatchHex
                          } 100%)`,
                          border: '1px solid rgba(255,255,255,0.25)',
                        }}
                      />
                      <span style={{ fontSize: '0.66rem', textAlign: 'center', lineHeight: 1.2 }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DIAL COLOR */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span className="tech-label" style={{ whiteSpace: 'nowrap' }}>02 / DIAL FINISH</span>
                <span className="tech-mono" style={{ fontSize: '0.66rem', color: 'var(--c-gold)', whiteSpace: 'nowrap' }}>
                  {summary.dialMeta.label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {DIAL_OPTIONS.map((opt) => {
                  const active = dialColor === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDialColor(opt.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.65rem 0.4rem',
                        background: active ? 'rgba(180, 154, 112, 0.12)' : 'transparent',
                        border: active
                          ? '1px solid var(--c-gold)'
                          : '1px solid var(--line-dark)',
                        color: active ? 'var(--c-white)' : 'var(--c-stone)',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: opt.swatchHex,
                          border: '1px solid rgba(255,255,255,0.28)',
                        }}
                      />
                      <span style={{ fontSize: '0.66rem', textAlign: 'center', lineHeight: 1.2 }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. STRAP / BRACELET */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <span className="tech-label" style={{ whiteSpace: 'nowrap' }}>03 / STRAP</span>
                <span className="tech-mono" style={{ fontSize: '0.66rem', color: 'var(--c-gold)', whiteSpace: 'nowrap' }}>
                  {summary.strapMeta.label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {STRAP_OPTIONS.map((opt) => {
                  const active = strapType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setStrapType(opt.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.65rem 0.4rem',
                        background: active ? 'rgba(180, 154, 112, 0.12)' : 'transparent',
                        border: active
                          ? '1px solid var(--c-gold)'
                          : '1px solid var(--line-dark)',
                        color: active ? 'var(--c-white)' : 'var(--c-stone)',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: opt.swatchHex,
                          border: '1px solid rgba(255,255,255,0.28)',
                        }}
                      />
                      <span style={{ fontSize: '0.66rem', textAlign: 'center', lineHeight: 1.2 }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. HANDS ARCHITECTURE */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span className="tech-label">04 / HANDS STYLE</span>
                <span className="tech-mono" style={{ fontSize: '0.68rem', color: 'var(--c-gold)' }}>
                  {summary.handsMeta.label}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {HANDS_OPTIONS.map((opt) => {
                  const active = handsStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHandsStyle(opt.id)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        background: active ? 'rgba(180, 154, 112, 0.12)' : 'transparent',
                        border: active
                          ? '1px solid var(--c-gold)'
                          : '1px solid var(--line-dark)',
                        color: active ? 'var(--c-white)' : 'var(--c-stone)',
                        fontFamily: 'var(--f-ui)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                    >
                      {opt.label} Hands
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. CASEBACK BESPOKE ENGRAVING */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label htmlFor="caseback-engraving-input" className="tech-label">
                  05 / CASEBACK ENGRAVING
                </label>
                <span className="tech-mono" style={{ fontSize: '0.64rem', color: 'var(--c-stone)' }}>
                  {engravingText.length}/24 CHARS
                </span>
              </div>
              <input
                id="caseback-engraving-input"
                type="text"
                maxLength={24}
                value={engravingText}
                placeholder="ENTER INSCRIPTION (E.G. INITIALS)"
                onChange={(e) => {
                  setEngravingText(e.target.value);
                }}
                onFocus={() => setCameraAngle('caseback')}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.85rem',
                  backgroundColor: 'var(--c-obsidian)',
                  border: '1px solid var(--c-gold-subtle)',
                  color: 'var(--c-white)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.76rem',
                  letterSpacing: '0.12em',
                }}
              />
              <span
                style={{
                  display: 'block',
                  marginTop: '0.4rem',
                  fontSize: '0.65rem',
                  color: 'var(--c-stone)',
                }}
              >
                Focusing automatically rotates the 3D timepiece to inspect the engraved sapphire caseback.
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* CENTER PANEL: LARGE INTERACTIVE 3D WATCH STAGE (6 Columns)        */}
          {/* ================================================================= */}
          <div
            className="atelier-center-stage"
            style={{
              gridColumn: '4 / span 6',
              backgroundColor: 'var(--surface-dark)',
              border: '1px solid var(--line-dark)',
              display: 'flex',
              flexDirection: 'column',
              height: 'clamp(520px, 76vh, 740px)',
              position: 'relative',
            }}
          >
            {/* Top Viewport Toolbar: Studio Lighting & Auto-Rotate */}
            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid var(--line-dark)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                zIndex: 3,
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                <Sun size={13} color="var(--c-gold)" />
                <span className="tech-label" style={{ fontSize: '0.6rem' }}>
                  STUDIO LIGHTING:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {LIGHTING_LABELS.map((l) => {
                    const active = studioLighting === l.id;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setStudioLighting(l.id)}
                        style={{
                          padding: '0.28rem 0.55rem',
                          background: active ? 'var(--c-gold)' : 'transparent',
                          color: active ? 'var(--c-obsidian)' : 'var(--c-stone)',
                          border: '1px solid var(--line-dark)',
                          fontFamily: 'var(--f-ui)',
                          fontSize: '0.62rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                      >
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zoom & Turntable Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setZoomLevel(zoomLevel - 0.12)}
                  aria-label="Zoom Out"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--line-dark)',
                    color: 'var(--c-ivory)',
                    padding: '0.35rem 0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <ZoomOut size={13} />
                </button>
                <span className="tech-mono" style={{ fontSize: '0.66rem', minWidth: '42px', textAlign: 'center' }}>
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(zoomLevel + 0.12)}
                  aria-label="Zoom In"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--line-dark)',
                    color: 'var(--c-ivory)',
                    padding: '0.35rem 0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  type="button"
                  onClick={toggleAutoRotate}
                  aria-pressed={autoRotate}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: autoRotate ? 'rgba(180,154,112,0.16)' : 'transparent',
                    border: autoRotate ? '1px solid var(--c-gold)' : '1px solid var(--line-dark)',
                    color: autoRotate ? 'var(--c-gold)' : 'var(--c-stone)',
                    padding: '0.35rem 0.65rem',
                    fontFamily: 'var(--f-mono)',
                    fontSize: '0.62rem',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={11} />
                  {autoRotate ? 'MOTION ON' : 'STATIC'}
                </button>
              </div>
            </div>

            {/* 3D Canvas Stage */}
            <div style={{ flex: 1, position: 'relative' }}>
              <WatchViewport3D mode="atelier" interactiveOrbit={true} />
            </div>

            {/* Bottom Camera Angle Bar */}
            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--line-dark)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                zIndex: 3,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Camera size={13} color="var(--c-gold)" />
                <span className="tech-label" style={{ fontSize: '0.6rem' }}>
                  CAMERA ANGLE:
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {CAMERA_ANGLE_LABELS.map((cam) => {
                  const active = cameraAngle === cam.id;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setCameraAngle(cam.id)}
                      style={{
                        padding: '0.35rem 0.68rem',
                        background: active ? 'var(--c-gold)' : 'transparent',
                        color: active ? 'var(--c-obsidian)' : 'var(--c-ivory)',
                        border: active
                          ? '1px solid var(--c-gold)'
                          : '1px solid var(--line-dark)',
                        fontFamily: 'var(--f-ui)',
                        fontSize: '0.64rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {cam.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT PANEL: LIVE CONFIGURATION DOSSIER & VALUATION (3 Columns)   */}
          {/* ================================================================= */}
          <div
            className="atelier-summary-panel"
            style={{
              gridColumn: '10 / span 3',
              padding: '1.65rem 1.5rem',
              backgroundColor: 'var(--surface-dark)',
              border: '1px solid var(--line-dark)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.35rem',
            }}
          >
            <div>
              <span className="tech-label" style={{ color: 'var(--c-gold)' }}>
                BESPOKE SPECIFICATION
              </span>
              <h3
                className="font-display"
                style={{
                  fontSize: '1.75rem',
                  color: 'var(--c-white)',
                  fontWeight: 400,
                  marginTop: '0.25rem',
                }}
              >
                {summary.model.code}
                <br />
                <span className="font-display-italic" style={{ color: 'var(--c-ivory)' }}>
                  {summary.model.name}
                </span>
              </h3>
            </div>

            <hr className="hairline-dark" />

            {/* Live Selected Options Breakdown */}
            <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <dt className="tech-label">CALIBRE BASE</dt>
                <dd className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
                  CHF {summary.model.basePrice.toLocaleString('en-US')}
                </dd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <dt className="tech-label">CASE ({summary.caseMeta.label.toUpperCase()})</dt>
                <dd className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
                  {summary.caseMeta.priceDelta > 0
                    ? `+ CHF ${summary.caseMeta.priceDelta.toLocaleString('en-US')}`
                    : 'INCLUDED'}
                </dd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <dt className="tech-label">DIAL ({summary.dialMeta.label.toUpperCase()})</dt>
                <dd className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
                  {summary.dialMeta.priceDelta > 0
                    ? `+ CHF ${summary.dialMeta.priceDelta.toLocaleString('en-US')}`
                    : 'INCLUDED'}
                </dd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <dt className="tech-label">STRAP ({summary.strapMeta.label.toUpperCase()})</dt>
                <dd className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
                  {summary.strapMeta.priceDelta > 0
                    ? `+ CHF ${summary.strapMeta.priceDelta.toLocaleString('en-US')}`
                    : 'INCLUDED'}
                </dd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <dt className="tech-label">HANDS ({summary.handsMeta.label.toUpperCase()})</dt>
                <dd className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
                  {summary.handsMeta.priceDelta > 0
                    ? `+ CHF ${summary.handsMeta.priceDelta.toLocaleString('en-US')}`
                    : 'INCLUDED'}
                </dd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <dt className="tech-label">ENGRAVING</dt>
                <dd className="tech-mono" style={{ color: 'var(--c-gold)' }}>
                  {engravingText.trim() ? `"${engravingText.trim()}" (+350)` : 'NONE'}
                </dd>
              </div>
            </dl>

            <hr className="hairline-gold" />

            {/* Total Demonstration Valuation */}
            <div>
              <span className="tech-label" style={{ display: 'block', marginBottom: '0.3rem' }}>
                INDICATIVE DEMONSTRATION VALUATION
              </span>
              <div
                className="tech-mono"
                style={{
                  fontSize: '1.65rem',
                  color: 'var(--c-white)',
                  letterSpacing: '0.04em',
                }}
              >
                CHF {summary.totalPrice.toLocaleString('en-US')}
              </div>
              <p
                style={{
                  fontSize: '0.66rem',
                  color: 'var(--c-stone)',
                  marginTop: '0.35rem',
                  lineHeight: 1.45,
                }}
              >
                *Approximate demonstration figures for concept evaluation only. Not a commercial offer.
              </p>
            </div>

            {/* Primary CTA: REQUEST YOUR CREATION */}
            <button
              type="button"
              onClick={() => setOrderModalOpen(true)}
              className="btn-primary btn-primary--solid"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              REQUEST YOUR CREATION
            </button>
          </div>

          {/* ================================================================= */}
          {/* MOBILE / TABLET (< 900px) BOTTOM DRAWER WITH HORIZONTAL SWIPE TABS */}
          {/* ================================================================= */}
          <div
            className="atelier-mobile-bottom-drawer"
            onTouchStart={handleDrawerTouchStart}
            onTouchEnd={handleDrawerTouchEnd}
            style={{
              display: 'none',
              gridColumn: '1 / -1',
              backgroundColor: 'var(--surface-dark)',
              border: '1px solid var(--c-gold-subtle)',
              boxShadow: '0 -12px 32px rgba(0, 0, 0, 0.65)',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Drawer Pull Handle & Active Reference Valuation Header */}
            <div
              style={{
                padding: '0.65rem 1rem 0.55rem',
                borderBottom: '1px solid var(--line-dark)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                backgroundColor: 'rgba(17, 17, 15, 0.96)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '36px',
                  height: '3px',
                  backgroundColor: 'rgba(180, 154, 112, 0.45)',
                  margin: '0 auto',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <span
                    className="tech-label"
                    style={{ color: 'var(--c-gold)', fontSize: '0.56rem', display: 'block' }}
                  >
                    {summary.model.code} · {summary.caseMeta.label.toUpperCase()}
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: '1.15rem', color: 'var(--c-white)' }}
                  >
                    {summary.model.name}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    className="tech-label"
                    style={{ fontSize: '0.54rem', display: 'block' }}
                  >
                    INDICATIVE VALUATION
                  </span>
                  <span
                    className="tech-mono"
                    style={{ fontSize: '0.98rem', color: 'var(--c-gold)', fontWeight: 600 }}
                  >
                    CHF {summary.totalPrice.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>

            {/* Horizontal Swipe Tabs: CASE | DIAL | STRAP | CALIBRE & HANDS | ENGRAVING */}
            <div
              role="tablist"
              aria-label="Atelier Customization Categories"
              className="atelier-drawer-tabs"
              style={{
                display: 'flex',
                overflowX: 'auto',
                touchAction: 'pan-x',
                borderBottom: '1px solid var(--line-dark)',
                backgroundColor: 'var(--c-obsidian)',
              }}
            >
              {MOBILE_TABS.map((tab) => {
                const isActive = mobileDrawerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setMobileDrawerTab(tab.id)}
                    style={{
                      flex: '1 0 auto',
                      minHeight: '44px',
                      padding: '0.65rem 1rem',
                      background: isActive ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                      border: 'none',
                      borderBottom: isActive
                        ? '2px solid var(--c-gold)'
                        : '2px solid transparent',
                      color: isActive ? 'var(--c-gold)' : 'var(--c-stone)',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Active Tab Panel Content */}
            <div style={{ padding: '1rem' }}>
              {mobileDrawerTab === 'case' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <span className="tech-label">SELECT CASE ALLOY</span>
                    <span className="tech-mono" style={{ fontSize: '0.68rem', color: 'var(--c-gold)' }}>
                      {summary.caseMeta.label}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                    {CASE_OPTIONS.map((opt) => {
                      const active = caseMaterial === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCaseMaterial(opt.id)}
                          style={{
                            minHeight: '64px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 0.35rem',
                            background: active ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                            border: active
                              ? '1px solid var(--c-gold)'
                              : '1px solid var(--line-dark)',
                            color: active ? 'var(--c-white)' : 'var(--c-stone)',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${opt.swatchHex} 0%, ${
                                opt.secondaryHex || opt.swatchHex
                              } 100%)`,
                              border: '1px solid rgba(255,255,255,0.28)',
                            }}
                          />
                          <span style={{ fontSize: '0.68rem', textAlign: 'center' }}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileDrawerTab === 'dial' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <span className="tech-label">SELECT GUILLOCHÉ DIAL</span>
                    <span className="tech-mono" style={{ fontSize: '0.68rem', color: 'var(--c-gold)' }}>
                      {summary.dialMeta.label}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                    {DIAL_OPTIONS.map((opt) => {
                      const active = dialColor === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDialColor(opt.id)}
                          style={{
                            minHeight: '64px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 0.35rem',
                            background: active ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                            border: active
                              ? '1px solid var(--c-gold)'
                              : '1px solid var(--line-dark)',
                            color: active ? 'var(--c-white)' : 'var(--c-stone)',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: opt.swatchHex,
                              border: '1px solid rgba(255,255,255,0.28)',
                            }}
                          />
                          <span style={{ fontSize: '0.68rem', textAlign: 'center' }}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileDrawerTab === 'strap' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.65rem',
                    }}
                  >
                    <span className="tech-label">SELECT STRAP / BRACELET</span>
                    <span className="tech-mono" style={{ fontSize: '0.68rem', color: 'var(--c-gold)' }}>
                      {summary.strapMeta.label}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem' }}>
                    {STRAP_OPTIONS.map((opt) => {
                      const active = strapType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setStrapType(opt.id)}
                          style={{
                            minHeight: '64px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            padding: '0.6rem 0.35rem',
                            background: active ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                            border: active
                              ? '1px solid var(--c-gold)'
                              : '1px solid var(--line-dark)',
                            color: active ? 'var(--c-white)' : 'var(--c-stone)',
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: opt.swatchHex,
                              border: '1px solid rgba(255,255,255,0.28)',
                            }}
                          />
                          <span style={{ fontSize: '0.68rem', textAlign: 'center' }}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileDrawerTab === 'calibre' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
                    {COLLECTION_MODELS.map((m) => {
                      const active = m.id === activeModelId;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => selectCollectionModel(m.id, false)}
                          style={{
                            minHeight: '48px',
                            padding: '0.45rem 0.5rem',
                            background: active ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                            border: active
                              ? '1px solid var(--c-gold)'
                              : '1px solid var(--line-dark)',
                            color: active ? 'var(--c-white)' : 'var(--c-stone)',
                            fontFamily: 'var(--f-mono)',
                            fontSize: '0.64rem',
                            cursor: 'pointer',
                          }}
                        >
                          {m.code}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
                    {HANDS_OPTIONS.map((opt) => {
                      const active = handsStyle === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setHandsStyle(opt.id)}
                          style={{
                            minHeight: '44px',
                            padding: '0.45rem',
                            background: active ? 'rgba(180, 154, 112, 0.14)' : 'transparent',
                            border: active
                              ? '1px solid var(--c-gold)'
                              : '1px solid var(--line-dark)',
                            color: active ? 'var(--c-white)' : 'var(--c-stone)',
                            fontFamily: 'var(--f-ui)',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label} Hands
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileDrawerTab === 'engraving' && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <span className="tech-label">CASEBACK INSCRIPTION</span>
                    <span className="tech-mono" style={{ fontSize: '0.64rem', color: 'var(--c-gold)' }}>
                      {engravingText.length}/24 CHARS
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={24}
                    value={engravingText}
                    placeholder="ENTER INSCRIPTION (E.G. INITIALS)"
                    onChange={(e) => setEngravingText(e.target.value)}
                    onFocus={() => setCameraAngle('caseback')}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--c-obsidian)',
                      border: '1px solid var(--c-gold-subtle)',
                      color: 'var(--c-white)',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                    }}
                  />
                </div>
              )}

              {/* Persistent Bottom Drawer Action CTA */}
              <button
                type="button"
                onClick={() => setOrderModalOpen(true)}
                className="btn-primary btn-primary--solid"
                style={{ width: '100%', marginTop: '0.85rem', minHeight: '48px', padding: '0.8rem 1.25rem' }}
              >
                REQUEST YOUR CREATION
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BESPOKE COMMISSION DOSSIER & WHATSAPP INTEGRATION MODAL               */}
      {/* ===================================================================== */}
      {isOrderModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="commission-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            backgroundColor: 'rgba(11, 11, 9, 0.86)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              backgroundColor: 'var(--surface-dark)',
              border: '1px solid var(--c-gold)',
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.35rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <span className="tech-label" style={{ color: 'var(--c-gold)' }}>
                  MAISON VÉRON · BESPOKE DOSSIER
                </span>
                <h3
                  id="commission-modal-title"
                  className="font-display"
                  style={{ fontSize: '2rem', color: 'var(--c-white)', fontWeight: 400 }}
                >
                  Your Configured Creation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                aria-label="Close Commission Modal"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line-dark)',
                  color: 'var(--c-ivory)',
                  padding: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Formatted Specification Pre-View */}
            <pre
              className="tech-mono"
              style={{
                backgroundColor: 'var(--c-obsidian)',
                border: '1px solid var(--line-dark)',
                padding: '1.15rem',
                fontSize: '0.73rem',
                color: 'var(--c-ivory)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.65,
              }}
            >
              {summary.messageText}
            </pre>

            {/* WhatsApp Concierge Endpoint Configuration Notice (Per Strict Prompt Rule) */}
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(180, 154, 112, 0.08)',
                border: '1px solid var(--c-gold-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <label
                htmlFor="whatsapp-endpoint-input"
                className="tech-label"
                style={{ color: 'var(--c-gold)', fontSize: '0.64rem' }}
              >
                WHATSAPP CONCIERGE NUMBER (CONFIGURATION):
              </label>
              <input
                id="whatsapp-endpoint-input"
                type="tel"
                value={customPhoneInput}
                onChange={(e) => setCustomPhoneInput(e.target.value)}
                placeholder="Enter destination WhatsApp number (e.g. +41790000000)"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: 'var(--c-obsidian)',
                  border: '1px solid var(--line-dark)',
                  color: 'var(--c-white)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.75rem',
                }}
              />
              {!dynamicWhatsappUrl && (
                <p style={{ fontSize: '0.74rem', color: 'var(--c-stone)', lineHeight: 1.45 }}>
                  Контактный номер WhatsApp ещё не настроен в <code className="tech-mono">WHATSAPP_CONFIG.phoneNumber</code>. Укажите номер выше для генерации прямой ссылки <code className="tech-mono">https://wa.me/</code> с <code className="tech-mono">encodeURIComponent()</code> или скопируйте готовое досье заказа.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={handleCopyDossier}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
                {copiedSummary ? 'DOSSIER COPIED' : 'COPY SPECIFICATION'}
              </button>

              {dynamicWhatsappUrl ? (
                <a
                  href={dynamicWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-primary--solid"
                  style={{ flex: 1 }}
                >
                  <MessageSquare size={14} />
                  SEND VIA WHATSAPP
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--line-dark)',
                    color: 'var(--c-stone)',
                    fontFamily: 'var(--f-ui)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'not-allowed',
                  }}
                >
                  CONFIGURE NUMBER TO ENABLE WA.ME
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1120px) {
          .atelier-header-left, .atelier-header-right {
            grid-column: 1 / -1 !important;
            justify-content: flex-start !important;
          }
          .atelier-controls-panel {
            grid-column: 1 / span 6 !important;
            order: 2;
          }
          .atelier-center-stage {
            grid-column: 1 / -1 !important;
            height: 480px !important;
            order: 1;
          }
          .atelier-summary-panel {
            grid-column: 7 / span 6 !important;
            order: 3;
          }
        }
        @media (max-width: 900px) {
          .atelier-workspace-grid {
            gap: 0 !important;
            margin-top: 1.5rem !important;
          }
          .atelier-controls-panel,
          .atelier-summary-panel {
            display: none !important;
          }
          .atelier-center-stage {
            grid-column: 1 / -1 !important;
            height: clamp(340px, 44svh, 400px) !important;
            order: 1 !important;
            border-bottom: none !important;
          }
          .atelier-center-stage > div:first-child,
          .atelier-center-stage > div:last-child {
            padding: 0.5rem 0.75rem !important;
          }
          .atelier-mobile-bottom-drawer {
            display: flex !important;
            order: 2 !important;
          }
          .atelier-drawer-tabs::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};
