/**
 * [PRO_UI] Section 02: THE COLLECTION
 * Three models:
 * - VÉRON No. 01 — The Classic
 * - VÉRON No. 02 — The Skeleton
 * - VÉRON No. 03 — The Chronograph
 *
 * Rules:
 * - Warm Ivory (#EAE6DD) editorial environment.
 * - Free asymmetric editorial grid, fine hairline dividers, small technical captions.
 * - No rounded e-commerce cards.
 * - Hover triggers subtle angle/perspective transition, delicate scale, and reveal of technical dossier.
 * - Selecting a model updates the global Zustand store and offers direct transition to the Interactive Atelier or opens the full technical sheet.
 */

import React, { useState } from 'react';
import {
  COLLECTION_MODELS,
  type WatchCollectionItem,
  type WatchModelId,
  useWatchStore,
} from '../store/watchStore';
import { ArrowUpRight, Sliders, Check } from 'lucide-react';

interface WatchArchitecturalPlateProps {
  modelId: WatchModelId;
  isHovered: boolean;
}

/**
 * High-precision SVG Horological Technical Plate & Studio Render for each Collection Model.
 * Changes perspective angle and exposes mechanical layer details on hover.
 */
const WatchArchitecturalPlate: React.FC<WatchArchitecturalPlateProps> = ({
  modelId,
  isHovered,
}) => {
  const isClassic = modelId === 'no-01-classic';
  const isSkeleton = modelId === 'no-02-skeleton';
  const isChrono = modelId === 'no-03-chronograph';

  const caseStroke = isClassic
    ? '#C8AE7D'
    : isSkeleton
    ? '#D5B882'
    : '#9C9E9F';
  const dialBg = isClassic
    ? '#161513'
    : isSkeleton
    ? '#0F0F0D'
    : '#142030';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 4.8',
        backgroundColor: '#121210',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(17, 17, 15, 0.14)',
      }}
    >
      {/* Studio Rim Spotlight Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isClassic
            ? 'radial-gradient(circle at 38% 32%, rgba(200, 174, 125, 0.22) 0%, rgba(17, 17, 15, 0.96) 72%)'
            : isSkeleton
            ? 'radial-gradient(circle at 62% 35%, rgba(180, 154, 112, 0.26) 0%, rgba(12, 12, 10, 0.98) 74%)'
            : 'radial-gradient(circle at 45% 30%, rgba(140, 165, 195, 0.20) 0%, rgba(15, 17, 20, 0.97) 72%)',
          transition: 'transform 650ms var(--ease-veron)',
          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />

      {/* Editorial Plate Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: '1.1rem',
          left: '1.25rem',
          right: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.62rem',
          fontFamily: 'var(--f-mono)',
          letterSpacing: '0.16em',
          color: 'rgba(234, 230, 221, 0.48)',
          zIndex: 2,
        }}
      >
        <span>PLATE // {modelId.toUpperCase()}</span>
        <span>{isHovered ? 'ANGLE: CALIBRE OBLIQUE 18°' : 'ANGLE: FRONTAL STUDIO 0°'}</span>
      </div>

      {/* Watch Studio Graphic with Perspective Angle Shift on Hover */}
      <svg
        viewBox="0 0 400 480"
        style={{
          width: '84%',
          height: '84%',
          zIndex: 2,
          transition: 'transform 650ms var(--ease-veron)',
          transform: isHovered
            ? 'scale(1.045) rotate(-3.5deg) translateY(-4px)'
            : 'scale(1) rotate(0deg) translateY(0px)',
          filter: 'drop-shadow(0 26px 40px rgba(0, 0, 0, 0.75))',
        }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`gold-bevel-${modelId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6C8" />
            <stop offset="45%" stopColor={caseStroke} />
            <stop offset="100%" stopColor="#5D4D32" />
          </linearGradient>
          <radialGradient id={`dial-grad-${modelId}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={isChrono ? '#223650' : '#2A2723'} />
            <stop offset="100%" stopColor={dialBg} />
          </radialGradient>
        </defs>

        {/* Top & Bottom Strap / Bracelet Links */}
        <g opacity="0.9">
          <rect
            x="146"
            y="24"
            width="108"
            height="86"
            fill={isChrono ? '#555759' : '#1B1816'}
            stroke={caseStroke}
            strokeWidth="0.7"
          />
          <line x1="146" y1="52" x2="254" y2="52" stroke={caseStroke} strokeOpacity="0.3" />
          <line x1="146" y1="80" x2="254" y2="80" stroke={caseStroke} strokeOpacity="0.3" />

          <rect
            x="146"
            y="370"
            width="108"
            height="86"
            fill={isChrono ? '#555759' : '#1B1816'}
            stroke={caseStroke}
            strokeWidth="0.7"
          />
          <line x1="146" y1="398" x2="254" y2="398" stroke={caseStroke} strokeOpacity="0.3" />
          <line x1="146" y1="426" x2="254" y2="426" stroke={caseStroke} strokeOpacity="0.3" />
        </g>

        {/* Sculpted Lugs */}
        <path
          d="M126 125 L146 92 L156 125 Z M274 125 L254 92 L244 125 Z M126 355 L146 388 L156 355 Z M274 355 L254 388 L244 355 Z"
          fill={`url(#gold-bevel-${modelId})`}
        />

        {/* Winding Crown at 3 o'clock */}
        <rect
          x="334"
          y="224"
          width="16"
          height="32"
          rx="2"
          fill={`url(#gold-bevel-${modelId})`}
        />

        {/* Outer Stepped Case & Concave Bezel */}
        <circle
          cx="200"
          cy="240"
          r="136"
          fill="#181715"
          stroke={`url(#gold-bevel-${modelId})`}
          strokeWidth="8"
        />
        <circle
          cx="200"
          cy="240"
          r="124"
          fill={`url(#dial-grad-${modelId})`}
          stroke={caseStroke}
          strokeWidth="1.5"
        />

        {/* Minute Railway Track */}
        <circle
          cx="200"
          cy="240"
          r="114"
          fill="none"
          stroke={caseStroke}
          strokeOpacity="0.4"
          strokeWidth="0.75"
          strokeDasharray="2 4"
        />

        {/* Model-Specific Dial Architecture */}
        {isClassic && (
          <g>
            {/* Concentric Inner Guilloché Medallion + 6 o'clock Petite Seconde Subdial */}
            <circle
              cx="200"
              cy="240"
              r="82"
              fill="none"
              stroke={caseStroke}
              strokeWidth="1.0"
              strokeOpacity="0.65"
            />
            <circle
              cx="200"
              cy="288"
              r="28"
              fill="#11100E"
              stroke={caseStroke}
              strokeWidth="1.3"
              strokeOpacity="0.9"
            />
            <line
              x1="200"
              y1="288"
              x2="216"
              y2="274"
              stroke={caseStroke}
              strokeWidth="1.2"
            />
          </g>
        )}

        {isSkeleton && (
          <g>
            {/* Openworked Mechanical Bridges, Gold Gear Train & Ruby Bearings */}
            <circle
              cx="200"
              cy="240"
              r="94"
              fill="#0B0B09"
              stroke={caseStroke}
              strokeWidth="1"
              strokeOpacity="0.55"
            />
            {/* Gear Wheels */}
            <circle
              cx="200"
              cy="185"
              r="34"
              fill="none"
              stroke="#C9A86A"
              strokeWidth="3"
              strokeDasharray="5 3"
            />
            <circle
              cx="162"
              cy="248"
              r="26"
              fill="none"
              stroke="#C9A86A"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <circle
              cx="238"
              cy="248"
              r="26"
              fill="none"
              stroke="#C9A86A"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            {/* Tourbillon / Balance Cage at 6 o'clock */}
            <circle
              cx="200"
              cy="296"
              r="28"
              fill="none"
              stroke="#DFC699"
              strokeWidth="1.8"
            />
            <line x1="145" y1="296" x2="255" y2="296" stroke="#C8C6C0" strokeWidth="4" />
            {/* Synthetic Ruby Jewels */}
            <circle cx="200" cy="185" r="5" fill="#B81D43" />
            <circle cx="162" cy="248" r="4.5" fill="#B81D43" />
            <circle cx="238" cy="248" r="4.5" fill="#B81D43" />
            <circle cx="200" cy="296" r="5" fill="#B81D43" />
          </g>
        )}

        {isChrono && (
          <g>
            {/* Twin Chronograph Registers + Tachymeter Scale */}
            <circle
              cx="148"
              cy="240"
              r="34"
              fill="#0E1724"
              stroke={caseStroke}
              strokeWidth="1.3"
            />
            <line x1="148" y1="240" x2="148" y2="214" stroke="#EAE6DD" strokeWidth="1.5" />
            <circle
              cx="252"
              cy="240"
              r="34"
              fill="#0E1724"
              stroke={caseStroke}
              strokeWidth="1.3"
            />
            <line x1="252" y1="240" x2="270" y2="225" stroke="#B49A70" strokeWidth="1.5" />
            <circle
              cx="200"
              cy="296"
              r="22"
              fill="none"
              stroke={caseStroke}
              strokeWidth="0.8"
              strokeOpacity="0.65"
            />
          </g>
        )}

        {/* 12 Applied Hour Indices */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const angle = (idx * 30 * Math.PI) / 180;
          const x1 = 200 + Math.sin(angle) * 98;
          const y1 = 240 - Math.cos(angle) * 98;
          const x2 = 200 + Math.sin(angle) * 110;
          const y2 = 240 - Math.cos(angle) * 110;
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`url(#gold-bevel-${modelId})`}
              strokeWidth={idx === 0 ? '3.5' : '2'}
            />
          );
        })}

        {/* Brand Signature on Dial */}
        <text
          x="200"
          y="162"
          textAnchor="middle"
          fill="#EAE6DD"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="12"
          letterSpacing="4"
        >
          VÉRON
        </text>

        {/* Dauphine Hands (10:10 position, shifts slightly on hover) */}
        <g
          style={{
            transition: 'transform 650ms var(--ease-veron)',
            transformOrigin: '200px 240px',
            transform: isHovered ? 'rotate(6deg)' : 'rotate(0deg)',
          }}
        >
          <polygon
            points="200,252 195,240 150,196 200,235"
            fill={`url(#gold-bevel-${modelId})`}
          />
          <polygon
            points="200,252 204,240 268,184 200,234"
            fill={`url(#gold-bevel-${modelId})`}
          />
          <circle cx="200" cy="240" r="5.5" fill="#DFC699" />
        </g>

        {/* Diagonal Sapphire Anti-Reflective Sheen */}
        <path
          d="M110 155 Q200 190 295 145 L270 325 Q190 280 95 315 Z"
          fill="rgba(255, 255, 255, 0.035)"
        />
      </svg>

      {/* Bottom Hover Overlay Info */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.15rem 1.25rem',
          background:
            'linear-gradient(0deg, rgba(17, 17, 15, 0.95) 0%, rgba(17, 17, 15, 0.65) 70%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
          opacity: isHovered ? 1 : 0.78,
          transition: 'all 350ms var(--ease-veron)',
          zIndex: 3,
        }}
      >
        <span
          className="tech-mono"
          style={{ fontSize: '0.68rem', color: 'var(--c-gold)', letterSpacing: '0.14em' }}
        >
          {isHovered ? 'CLICK TO LOAD IN 3D ATELIER' : 'HOVER TO INSPECT CALIBRE'}
        </span>
        <ArrowUpRight size={15} color="var(--c-gold)" />
      </div>
    </div>
  );
};

export const CollectionSection: React.FC = () => {
  const activeModelId = useWatchStore((s) => s.activeModelId);
  const selectCollectionModel = useWatchStore((s) => s.selectCollectionModel);
  const [hoveredId, setHoveredId] = useState<WatchModelId | null>(null);

  const inspectingModel =
    COLLECTION_MODELS.find((m) => m.id === activeModelId) || COLLECTION_MODELS[0];

  const handleSelectModel = (model: WatchCollectionItem, scrollToAtelier = false) => {
    selectCollectionModel(model.id, true);
    if (scrollToAtelier) {
      const atelierEl = document.getElementById('atelier');
      atelierEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="collection"
      className="env-ivory"
      style={{
        paddingBlock: 'clamp(5.5rem, 10vw, 9.5rem)',
        borderBottom: '1px solid var(--line-light)',
      }}
    >
      <div className="veron-container collection-container">
        {/* Section Editorial Header */}
        <div
          className="editorial-grid"
          style={{
            alignItems: 'end',
            paddingBottom: '3.25rem',
            borderBottom: '1px solid var(--line-light)',
          }}
        >
          <div style={{ gridColumn: '1 / span 7' }} className="col-header-left">
            <p className="tech-label" style={{ color: 'var(--c-graphite)', marginBottom: '0.85rem' }}>
              02 / THE COLLECTION · HOROLOGICAL ARCHIVE
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 'var(--t-h2)',
                color: 'var(--c-obsidian)',
                fontWeight: 300,
              }}
            >
              Three Expressions of{' '}
              <span className="font-display-italic">Mechanical Mastery.</span>
            </h2>
          </div>

          <div
            style={{
              gridColumn: '8 / span 5',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            className="col-header-right"
          >
            <p
              style={{
                fontSize: 'var(--t-body)',
                color: 'var(--c-graphite)',
                lineHeight: 1.65,
              }}
            >
              Produced in strictly numbered annual series. Select any reference below to inspect
              its calibre specifications or configure it directly inside the 3D Watch Atelier.
            </p>
          </div>
        </div>

        {/* Free Editorial Staggered Grid of the 3 Timepieces */}
        <div
          className="collection-editorial-rows"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.75rem)',
            marginTop: '3.5rem',
          }}
        >
          {COLLECTION_MODELS.map((model, index) => {
            const isSelected = activeModelId === model.id;
            const isHovered = hoveredId === model.id;
            // Subtle editorial vertical stagger on desktop
            const topOffset = index === 1 ? '2.5rem' : index === 2 ? '1.15rem' : '0rem';

            return (
              <article
                key={model.id}
                className="collection-column"
                style={{
                  marginTop: topOffset,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.35rem',
                  paddingBottom: '2rem',
                  borderBottom: isSelected
                    ? '2px solid var(--c-obsidian)'
                    : '1px solid var(--line-light)',
                  transition: 'border-color var(--dur-ui) var(--ease-veron)',
                }}
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Top Index & Edition Limit */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.6rem',
                    borderBottom: '1px solid var(--line-light)',
                  }}
                >
                  <span className="tech-mono" style={{ color: 'var(--c-obsidian)', fontWeight: 500 }}>
                    {model.code}
                  </span>
                  <span className="tech-label" style={{ color: 'var(--c-stone)' }}>
                    {model.editionLimit}
                  </span>
                </div>

                {/* Clickable Architectural Visual Plate */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectModel(model, false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectModel(model, false);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  aria-label={`Select ${model.code} — ${model.name}`}
                >
                  <WatchArchitecturalPlate modelId={model.id} isHovered={isHovered} />
                </div>

                {/* Title & Editorial Subtitle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <h3
                      className="font-display"
                      style={{
                        fontSize: 'var(--t-h3)',
                        color: 'var(--c-obsidian)',
                        fontWeight: 400,
                      }}
                    >
                      {model.code} — <span className="font-display-italic">{model.name}</span>
                    </h3>
                  </div>

                  <p
                    className="tech-label"
                    style={{ color: 'var(--c-graphite)', letterSpacing: '0.15em' }}
                  >
                    {model.subtitle} · {model.calibre}
                  </p>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--c-graphite)',
                    lineHeight: 1.62,
                  }}
                >
                  {model.description}
                </p>

                {/* Technical Micro-Table */}
                <dl
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem 1rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--line-light)',
                    fontSize: '0.75rem',
                  }}
                >
                  <div>
                    <dt className="tech-label" style={{ fontSize: '0.6rem' }}>
                      DIMENSIONS
                    </dt>
                    <dd className="tech-mono" style={{ color: 'var(--c-obsidian)' }}>
                      {model.caseDiameter} × {model.thickness}
                    </dd>
                  </div>
                  <div>
                    <dt className="tech-label" style={{ fontSize: '0.6rem' }}>
                      FREQUENCY
                    </dt>
                    <dd className="tech-mono" style={{ color: 'var(--c-obsidian)' }}>
                      {model.frequency}
                    </dd>
                  </div>
                  <div>
                    <dt className="tech-label" style={{ fontSize: '0.6rem' }}>
                      POWER RESERVE
                    </dt>
                    <dd className="tech-mono" style={{ color: 'var(--c-obsidian)' }}>
                      {model.powerReserve}
                    </dd>
                  </div>
                  <div>
                    <dt className="tech-label" style={{ fontSize: '0.6rem' }}>
                      INDICATIVE BASE
                    </dt>
                    <dd className="tech-mono" style={{ color: 'var(--c-obsidian)' }}>
                      CHF {model.basePrice.toLocaleString('en-US')}
                    </dd>
                  </div>
                </dl>

                {/* Actions: Inspect Dossier or Load in 3D Atelier */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectModel(model, false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: isSelected ? 'var(--c-obsidian)' : 'transparent',
                      color: isSelected ? 'var(--c-ivory)' : 'var(--c-obsidian)',
                      border: '1px solid var(--c-obsidian)',
                      padding: '0.6rem 1rem',
                      fontFamily: 'var(--f-ui)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all var(--dur-hover) var(--ease-veron)',
                    }}
                  >
                    {isSelected ? <Check size={13} /> : null}
                    {isSelected ? 'ACTIVE IN 3D VIEWER' : 'SELECT REFERENCE'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectModel(model, true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid var(--c-obsidian)',
                      paddingBottom: '0.25rem',
                      color: 'var(--c-obsidian)',
                      fontFamily: 'var(--f-ui)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    <Sliders size={12} />
                    OPEN IN ATELIER
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Active Reference Expanded Horological Dossier Drawer */}
        <div
          id="collection-dossier"
          style={{
            marginTop: '4.5rem',
            padding: 'clamp(1.75rem, 3.5vw, 3rem)',
            backgroundColor: 'var(--surface-ivory-elevated)',
            border: '1px solid var(--line-light)',
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100%',
          }}
          className="dossier-bar"
        >
          <div style={{ gridColumn: '1 / span 7' }} className="dossier-left">
            <span className="tech-label" style={{ color: 'var(--c-stone)' }}>
              SELECTED CALIBRE SPECIFICATION DOSSIER
            </span>
            <h3
              className="font-display dossier-title"
              style={{
                fontSize: 'clamp(1.65rem, 2.2vw, 2.35rem)',
                color: 'var(--c-obsidian)',
                marginTop: '0.35rem',
                lineHeight: 1.25,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {inspectingModel.code} — {inspectingModel.name} ({inspectingModel.calibre})
            </h3>
            <p
              style={{
                marginTop: '0.75rem',
                color: 'var(--c-graphite)',
                fontSize: '0.95rem',
                maxWidth: '62ch',
                lineHeight: 1.6,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {inspectingModel.editorialNote}
            </p>
          </div>

          <div
            style={{
              gridColumn: '8 / span 5',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              borderLeft: '1px solid var(--line-light)',
              paddingLeft: '2rem',
            }}
            className="dossier-right"
          >
            <div className="dossier-stat-item">
              <span className="tech-label" style={{ fontSize: '0.62rem' }}>
                JEWEL BEARINGS
              </span>
              <p className="tech-mono dossier-stat-val" style={{ color: 'var(--c-obsidian)', fontSize: '1rem' }}>
                {inspectingModel.jewels} Functional Rubies
              </p>
            </div>
            <div className="dossier-stat-item">
              <span className="tech-label" style={{ fontSize: '0.62rem' }}>
                TOTAL COMPONENTS
              </span>
              <p className="tech-mono dossier-stat-val" style={{ color: 'var(--c-obsidian)', fontSize: '1rem' }}>
                {inspectingModel.partsCount} Hand-Finished Parts
              </p>
            </div>
            <div className="dossier-stat-item">
              <span className="tech-label" style={{ fontSize: '0.62rem' }}>
                WATER RESISTANCE
              </span>
              <p className="tech-mono dossier-stat-val" style={{ color: 'var(--c-obsidian)', fontSize: '1rem' }}>
                {inspectingModel.waterResistance}
              </p>
            </div>
            <div className="dossier-stat-item">
              <span className="tech-label" style={{ fontSize: '0.62rem' }}>
                BESPOKE CUSTOMIZATION
              </span>
              <a
                href="#atelier"
                style={{
                  display: 'inline-block',
                  marginTop: '0.2rem',
                  color: 'var(--c-obsidian)',
                  fontFamily: 'var(--f-mono)',
                  fontSize: '0.78rem',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                Configure in 3D →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #collection {
          scroll-margin-top: 88px;
        }
        @media (max-width: 1024px) {
          .col-header-left, .col-header-right {
            grid-column: 1 / -1 !important;
          }
          .collection-editorial-rows {
            grid-template-columns: 1fr !important;
          }
          .collection-column {
            margin-top: 0 !important;
          }
          .dossier-left, .dossier-right {
            grid-column: 1 / -1 !important;
            border-left: none !important;
            padding-left: 0 !important;
          }
        }
        @media (max-width: 768px) {
          #collection {
            padding-top: calc(72px + 24px) !important;
            scroll-margin-top: 88px !important;
          }
          .collection-container {
            padding-left: 16px !important;
            padding-right: 16px !important;
            box-sizing: border-box !important;
          }
          .dossier-bar {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            margin-top: 2.25rem !important;
            padding: 1.35rem 1rem !important;
            gap: 1.25rem !important;
            scroll-margin-top: 88px !important;
          }
          .dossier-title {
            font-size: clamp(1.25rem, 5vw, 1.75rem) !important;
            line-height: 1.25 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          .dossier-stat-val {
            font-size: 1.05rem !important;
          }
        }
        @media (max-width: 480px) {
          .dossier-right {
            grid-template-columns: 1fr !important;
            gap: 0.85rem !important;
          }
          .dossier-stat-val {
            font-size: 1.05rem !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
        }
      `}</style>
    </section>
  );
};
