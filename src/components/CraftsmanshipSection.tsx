/**
 * [PRO_UI] Section 04: CRAFTSMANSHIP
 * Editorial spread inspired by high-end European watchmaking journals (Ref 2 & Ref 3).
 * Exact Text:
 * - Heading: MADE BY HAND. DEFINED BY PRECISION.
 * - Copy:
 *   Each detail is considered.
 *   Each component is crafted with intention.
 *   Nothing exists without a reason.
 *
 * Features asymmetric editorial macro studies of:
 * 1. Hand-Anglage & Mirror-Polished Case Chamfers
 * 2. Mechanical Gear Train & Ruby Pivot Bearings
 * 3. Multi-Tiered Grand Feu Enamel Dial & Diamond-Cut Hands
 * 4. Fluted Winding Crown & Hand-Stitched Alligator Strap
 */

import React from 'react';

interface MacroStudyItem {
  code: string;
  title: string;
  subtitle: string;
  hoursRequired: string;
  tolerance: string;
  description: string;
  spanCols: string;
  aspect: string;
  renderMacroSvg: () => React.ReactNode;
}

const MACRO_STUDIES: MacroStudyItem[] = [
  {
    code: 'PLATE I // ANGLAGE & CARRURE',
    title: 'Mirror-Polished Case & Hand-Beveled Bridges',
    subtitle: 'Polissage Noir & Côtes de Genève',
    hoursRequired: '18 Hours per Case',
    tolerance: '± 0.002 mm',
    description:
      'Every inward and outward angle on the German silver bridges is beveled by hand using boxwood sticks and diamond paste until it achieves a distortion-free black polish.',
    spanCols: '1 / span 7',
    aspect: '16 / 10',
    renderMacroSvg: () => (
      <svg viewBox="0 0 700 440" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <defs>
          <linearGradient id="macro-case-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B1A17" />
            <stop offset="40%" stopColor="#433929" />
            <stop offset="52%" stopColor="#E6D0A3" />
            <stop offset="65%" stopColor="#8A7248" />
            <stop offset="100%" stopColor="#11110F" />
          </linearGradient>
        </defs>
        <rect width="700" height="440" fill="#121210" />
        {/* Macro Curved Case Flank & Lug Chamfer */}
        <path
          d="M -40 380 Q 240 120 740 80 L 740 460 L -40 460 Z"
          fill="url(#macro-case-1)"
        />
        <path
          d="M -40 380 Q 240 120 740 80"
          fill="none"
          stroke="#FFF4DC"
          strokeWidth="2.5"
          opacity="0.85"
        />
        <path
          d="M -20 415 Q 260 155 740 115"
          fill="none"
          stroke="#B49A70"
          strokeWidth="1.2"
          opacity="0.65"
        />
        {/* Technical Loupe Reticle */}
        <circle
          cx="380"
          cy="215"
          r="92"
          fill="none"
          stroke="rgba(234,230,221,0.28)"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        />
        <line
          x1="380"
          y1="105"
          x2="380"
          y2="325"
          stroke="rgba(180,154,112,0.35)"
          strokeWidth="0.75"
        />
        <line
          x1="270"
          y1="215"
          x2="490"
          y2="215"
          stroke="rgba(180,154,112,0.35)"
          strokeWidth="0.75"
        />
        <text
          x="485"
          y="198"
          fill="#EAE6DD"
          fontFamily="JetBrains Mono, monospace"
          fontSize="10"
          letterSpacing="2"
        >
          45° CHAMFER BEVEL
        </text>
      </svg>
    ),
  },
  {
    code: 'PLATE II // ROUAGE & ÉCHAPPEMENT',
    title: 'Epicyclic Gear Train & Ruby Chatons',
    subtitle: 'In-House Calibre Architecture',
    hoursRequired: '42 Hours Assembly',
    tolerance: '21,600 vph',
    description:
      'Circular-grained brass wheels mesh with mirror-polished steel pinions, pivoted inside gold-mounted synthetic corundum rubies to minimize friction over decades.',
    spanCols: '8 / span 5',
    aspect: '4 / 4.6',
    renderMacroSvg: () => (
      <svg viewBox="0 0 500 560" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <rect width="500" height="560" fill="#141311" />
        {/* Interlocking Macro Horological Gears (Inspired by Reference 3) */}
        <g transform="translate(250, 280)">
          <circle
            r="165"
            fill="none"
            stroke="#B49A70"
            strokeWidth="12"
            strokeDasharray="8 6"
            opacity="0.75"
          />
          <circle r="142" fill="none" stroke="#C8AE7D" strokeWidth="2" />
          <circle
            r="95"
            fill="none"
            stroke="#9E9B93"
            strokeWidth="18"
            strokeDasharray="42 18"
          />
          {/* Secondary Meshed Wheel */}
          <g transform="translate(-95, -105)">
            <circle
              r="78"
              fill="none"
              stroke="#DFC699"
              strokeWidth="8"
              strokeDasharray="6 4"
            />
            <circle r="18" fill="#A81339" stroke="#DFC699" strokeWidth="4" />
          </g>
          {/* Central Ruby Jewel & Gold Chaton */}
          <circle r="34" fill="#292824" stroke="#DFC699" strokeWidth="3" />
          <circle r="19" fill="#B8163E" />
          <circle cx="-6" cy="-6" r="5" fill="rgba(255,255,255,0.65)" />
        </g>
      </svg>
    ),
  },
  {
    code: 'PLATE III // CADRAN & AIGUILLES',
    title: 'Multi-Tiered Dial & Diamond-Cut Hands',
    subtitle: 'Grand Feu Enamel & Lancette Facets',
    hoursRequired: '14 Kiln Firings',
    tolerance: '0.08 mm Tip',
    description:
      'Fired at 820°C before being lapped flat with pumice stone, our dials provide an abyssal backdrop for razor-sharp Dauphine hands balanced to a tenth of a milligram.',
    spanCols: '1 / span 5',
    aspect: '4 / 4.3',
    renderMacroSvg: () => (
      <svg viewBox="0 0 500 520" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <rect width="500" height="520" fill="#10100E" />
        {/* Macro Subdial Chapter Track & Faceted Hand Intersection */}
        <circle
          cx="360"
          cy="360"
          r="280"
          fill="none"
          stroke="#B49A70"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <circle
          cx="360"
          cy="360"
          r="245"
          fill="none"
          stroke="#B49A70"
          strokeWidth="14"
          strokeDasharray="2 8"
          opacity="0.45"
        />
        {/* Macro Dauphine Hand Facet */}
        <polygon points="360,360 85,120 135,95" fill="#F2DEC0" />
        <polygon points="360,360 85,120 65,165" fill="#8C734B" />
        <circle cx="360" cy="360" r="18" fill="#DFC699" stroke="#11110F" strokeWidth="3" />
      </svg>
    ),
  },
  {
    code: 'PLATE IV // COURONNE & BRACELET',
    title: 'Fluted Winding Crown & Saddle-Stitched Leather',
    subtitle: 'Tactile Ergonomics',
    hoursRequired: '9 Hours Hand-Stitching',
    tolerance: '10-Tooth Pinion',
    description:
      'The dynamometric winding crown provides a crisp, unmistakable mechanical resistance on the fingertips, paired with hand-burnished alligator or 5-link integrated steel.',
    spanCols: '6 / span 7',
    aspect: '16 / 10',
    renderMacroSvg: () => (
      <svg viewBox="0 0 700 440" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <rect width="700" height="440" fill="#151412" />
        {/* Macro Fluted Crown Profile & Leather Grain */}
        <g transform="translate(350, 220)">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x="-160"
              y={-125 + i * 18}
              width="120"
              height="10"
              rx="3"
              fill={i % 2 === 0 ? '#D8BF92' : '#7A643F'}
            />
          ))}
          <rect
            x="-40"
            y="-145"
            width="230"
            height="290"
            fill="#241B16"
            stroke="#B49A70"
            strokeWidth="1.2"
          />
          {/* Saddle Stitch Marks */}
          {Array.from({ length: 8 }).map((_, s) => (
            <line
              key={s}
              x1="-15"
              y1={-115 + s * 32}
              x2="-8"
              y2={-98 + s * 32}
              stroke="#EAE6DD"
              strokeWidth="2.2"
               opacity="0.75"
            />
          ))}
        </g>
      </svg>
    ),
  },
];

export const CraftsmanshipSection: React.FC = () => {
  return (
    <section
      id="craftsmanship"
      className="env-ivory"
      style={{
        paddingBlock: 'clamp(5.5rem, 10vw, 9.5rem)',
        borderBottom: '1px solid var(--line-light)',
      }}
    >
      <div className="veron-container">
        {/* Editorial Spread Header */}
        <div
          className="editorial-grid"
          style={{
            paddingBottom: '3.5rem',
            borderBottom: '1px solid var(--line-light)',
            alignItems: 'end',
          }}
        >
          <div style={{ gridColumn: '1 / span 7' }} className="craft-header-left">
            <p className="tech-label" style={{ color: 'var(--c-graphite)', marginBottom: '0.85rem' }}>
              04 / HAUTE HORLOGERIE · SAVOIR-FAIRE
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 'var(--t-h2)',
                color: 'var(--c-obsidian)',
                fontWeight: 300,
                lineHeight: 1.02,
              }}
            >
              MADE BY HAND.
              <br />
              <span className="font-display-italic">DEFINED BY PRECISION.</span>
            </h2>
          </div>

          <div style={{ gridColumn: '8 / span 5' }} className="craft-header-right">
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(1.25rem, 1.6vw, 1.55rem)',
                color: 'var(--c-obsidian)',
                lineHeight: 1.45,
                fontWeight: 400,
              }}
            >
              Each detail is considered.
              <br />
              Each component is crafted with intention.
              <br />
              Nothing exists without a reason.
            </p>
          </div>
        </div>

        {/* Asymmetric Magazine-Style Macro Grid */}
        <div
          className="editorial-grid craft-macro-grid"
          style={{
            rowGap: '3.75rem',
            marginTop: '3.75rem',
            alignItems: 'start',
          }}
        >
          {MACRO_STUDIES.map((study) => (
            <article
              key={study.code}
              className="craft-macro-item"
              style={{
                gridColumn: study.spanCols,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
              }}
            >
              {/* Top Plate Meta */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--line-light)',
                  paddingBottom: '0.5rem',
                }}
              >
                <span className="tech-mono" style={{ color: 'var(--c-obsidian)', fontSize: '0.7rem' }}>
                  {study.code}
                </span>
                <span className="tech-mono" style={{ color: 'var(--c-stone)', fontSize: '0.7rem' }}>
                  {study.hoursRequired} · {study.tolerance}
                </span>
              </div>

              {/* Macro Visual Frame */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: study.aspect,
                  overflow: 'hidden',
                  border: '1px solid rgba(17, 17, 15, 0.15)',
                  backgroundColor: 'var(--c-obsidian)',
                }}
              >
                {study.renderMacroSvg()}
              </div>

              {/* Editorial Caption Block */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.35fr',
                  gap: '1.25rem',
                  paddingTop: '0.35rem',
                }}
                className="craft-caption-cols"
              >
                <div>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: '1.45rem',
                      color: 'var(--c-obsidian)',
                      fontWeight: 400,
                      lineHeight: 1.15,
                    }}
                  >
                    {study.title}
                  </h3>
                  <span
                    className="tech-label"
                    style={{
                      display: 'block',
                      marginTop: '0.35rem',
                      color: 'var(--c-stone)',
                      fontSize: '0.62rem',
                    }}
                  >
                    {study.subtitle}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--c-graphite)',
                    lineHeight: 1.62,
                  }}
                >
                  {study.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .craft-header-left, .craft-header-right, .craft-macro-item {
            grid-column: 1 / -1 !important;
          }
          .craft-caption-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
