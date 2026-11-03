/**
 * [PRO_UI] Section 06: FINAL BRAND STATEMENT & MINIMALIST FOOTER
 *
 * Section 06 Exact Content:
 * - Visual: Expressive watch model on dark obsidian background
 * - Heading: TIME IS PERSONAL.
 * - Subtitle: A creation that reflects the individual behind it.
 * - Button: CREATE YOUR VÉRON
 *
 * Footer Exact Content:
 * - VÉRON
 * - INDEPENDENT WATCHMAKING
 * - COLLECTION | CRAFTSMANSHIP | ATELIER
 * - CONTACT | INSTAGRAM
 * - © VÉRON 2026
 */

import React, { useState } from 'react';
import { WatchViewport3D } from '../scene/WatchViewport3D';
import { useWatchStore } from '../store/watchStore';

export const FinalBrandStatement: React.FC = () => {
  const setOrderModalOpen = useWatchStore((s) => s.setOrderModalOpen);

  const handleCreateClick = () => {
    const atelierEl = document.getElementById('atelier');
    if (atelierEl) {
      atelierEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="statement"
      className="env-obsidian"
      style={{
        position: 'relative',
        paddingBlock: 'clamp(5.5rem, 10vw, 9.5rem)',
        borderBottom: '1px solid var(--line-dark)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle golden horizon glow behind finale timepiece */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '54vw',
          height: '54vw',
          maxWidth: '640px',
          maxHeight: '640px',
          background:
            'radial-gradient(circle, rgba(180, 154, 112, 0.11) 0%, rgba(17, 17, 15, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="veron-container"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.75rem',
        }}
      >
        <span className="tech-label" style={{ color: 'var(--c-gold)' }}>
          06 / THE FINAL STATEMENT
        </span>

        {/* Expressive 3D Timepiece Showcase */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            height: '360px',
            position: 'relative',
          }}
        >
          <WatchViewport3D mode="finale" interactiveOrbit={true} />
        </div>

        <h2
          className="font-display"
          style={{
            fontSize: 'var(--t-hero)',
            color: 'var(--c-white)',
            fontWeight: 300,
            letterSpacing: '-0.015em',
            lineHeight: 1.0,
          }}
        >
          TIME IS PERSONAL.
        </h2>

        <p
          style={{
            fontSize: 'var(--t-lead)',
            color: 'var(--c-stone)',
            maxWidth: '42ch',
            fontWeight: 300,
          }}
        >
          A creation that reflects the individual behind it.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '0.75rem',
          }}
        >
          <button
            type="button"
            onClick={handleCreateClick}
            className="btn-primary btn-primary--solid"
          >
            CREATE YOUR VÉRON
          </button>
          <button
            type="button"
            onClick={() => setOrderModalOpen(true)}
            className="btn-primary"
          >
            VIEW CURRENT DOSSIER
          </button>
        </div>
      </div>
    </section>
  );
};

export const Footer: React.FC = () => {
  const [contactNoteVisible, setContactNoteVisible] = useState(false);

  return (
    <footer
      className="env-obsidian"
      style={{
        paddingBlock: '4.5rem 3.5rem',
      }}
    >
      <div className="veron-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid var(--line-dark)',
            alignItems: 'start',
          }}
          className="footer-grid"
        >
          {/* Brand Identity Column */}
          <div style={{ gridColumn: '1 / span 5' }} className="footer-col-brand">
            <div
              style={{
                fontFamily: 'var(--f-display)',
                fontSize: '2.1rem',
                color: 'var(--c-white)',
                letterSpacing: '0.24em',
                lineHeight: 1,
                marginBottom: '0.6rem',
              }}
            >
              VÉRON
            </div>
            <p className="tech-label" style={{ color: 'var(--c-gold)' }}>
              INDEPENDENT WATCHMAKING
            </p>
            <p
              style={{
                marginTop: '1rem',
                fontSize: '0.82rem',
                color: 'var(--c-stone)',
                maxWidth: '38ch',
                lineHeight: 1.6,
              }}
            >
              Some things are not made to follow time. They are made to define it.
            </p>
          </div>

          {/* Navigation Column */}
          <div
            style={{
              gridColumn: '7 / span 3',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            className="footer-col-nav"
          >
            <a href="#collection" className="nav-link" style={{ width: 'fit-content' }}>
              COLLECTION
            </a>
            <a href="#craftsmanship" className="nav-link" style={{ width: 'fit-content' }}>
              CRAFTSMANSHIP
            </a>
            <a href="#atelier" className="nav-link" style={{ width: 'fit-content' }}>
              ATELIER
            </a>
          </div>

          {/* Contact & Social Column */}
          <div
            style={{
              gridColumn: '10 / span 3',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
            className="footer-col-contact"
          >
            <button
              type="button"
              onClick={() => setContactNoteVisible((v) => !v)}
              className="nav-link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: 'fit-content',
              }}
            >
              CONTACT
            </button>
            <a
              href="#atelier"
              onClick={(e) => {
                e.preventDefault();
                setContactNoteVisible(true);
              }}
              className="nav-link"
              style={{ width: 'fit-content' }}
            >
              INSTAGRAM
            </a>

            {contactNoteVisible && (
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--c-gold)',
                  lineHeight: 1.5,
                  marginTop: '0.35rem',
                }}
              >
                Concept Portfolio Showcase — Use the Interactive Watch Atelier above to generate a bespoke commission dossier.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span className="tech-mono" style={{ color: 'var(--c-stone)', fontSize: '0.72rem' }}>
            © VÉRON 2026
          </span>
          <span className="tech-label" style={{ fontSize: '0.62rem', color: 'var(--c-stone)' }}>
            CONCEPTUAL HAUTE HORLOGERIE DIGITAL EXPERIENCE
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-col-brand, .footer-col-nav, .footer-col-contact {
            grid-column: 1 / -1 !important;
          }
        }
      `}</style>
    </footer>
  );
};
