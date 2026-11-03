/**
 * [PRO_UI] Navigation Bar & Section 01: Hero / The First Impression
 * Exact Brand Content:
 * - Top Nav: VÉRON | COLLECTION | CRAFTSMANSHIP | ATELIER
 * - Heading: TIME, CRAFTED TO PERFECTION.
 * - Description: An expression of precision, patience and the art of mechanical watchmaking.
 * - Primary CTA: EXPLORE THE COLLECTION
 * - Secondary Link: DISCOVER THE ATELIER
 * - Signature Caption: INDEPENDENT WATCHMAKING / EST. MMXXIV
 */

import React, { useEffect, useState } from 'react';
import { WatchViewport3D } from '../scene/WatchViewport3D';
import { useWatchStore, COLLECTION_MODELS } from '../store/watchStore';
import { Compass } from 'lucide-react';

function formatGenevaTime(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Zurich',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }
}

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genevaTime, setGenevaTime] = useState<string>(() => formatGenevaTime());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGenevaTime(formatGenevaTime());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-nav)',
        background:
          'linear-gradient(180deg, rgba(17, 17, 15, 0.92) 0%, rgba(17, 17, 15, 0.65) 75%, rgba(17, 17, 15, 0) 100%)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid rgba(234, 230, 221, 0.07)',
      }}
    >
      <div
        className="veron-container"
        style={{
          height: '84px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Wordmark */}
        <a
          href="#top"
          style={{
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            color: 'var(--c-ivory)',
            gap: '2px',
          }}
          aria-label="VÉRON Home"
        >
          <span
            style={{
              fontFamily: 'var(--f-display)',
              fontSize: '1.65rem',
              fontWeight: 400,
              letterSpacing: '0.26em',
              color: 'var(--c-white)',
              lineHeight: 1,
            }}
          >
            VÉRON
          </span>
          <span
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.28em',
              color: 'var(--c-gold)',
              textTransform: 'uppercase',
            }}
          >
            GENÈVE · CONCEPT
          </span>
        </a>

        {/* Primary Desktop Navigation: VÉRON | COLLECTION | CRAFTSMANSHIP | ATELIER */}
        <nav
          aria-label="Primary Navigation"
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.75rem, 3.5vw, 3.5rem)',
          }}
        >
          <a href="#collection" className="nav-link">
            COLLECTION
          </a>
          <a href="#mechanics" className="nav-link">
            MECHANICS
          </a>
          <a href="#craftsmanship" className="nav-link">
            CRAFTSMANSHIP
          </a>
          <a href="#atelier" className="nav-link">
            ATELIER
          </a>
        </nav>

        {/* Right Boutique Action + Live Geneva Horological Chronometer Widget */}
        <div className="nav-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            className="nav-geneva-clock"
            aria-label="Live Geneva Manufacture Time"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--f-mono)',
              fontSize: '11px',
              color: '#8C8981',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              className="nav-geneva-dot"
              aria-hidden="true"
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#98B475',
                boxShadow: '0 0 6px rgba(180, 154, 112, 0.85)',
                display: 'inline-block',
                flexShrink: 0,
                animation: 'veronPulseDot 2.2s ease-in-out infinite',
              }}
            />
            <span className="nav-geneva-text">GENÈVE · {genevaTime} CET</span>
          </div>

          <a
            href="#atelier"
            className="nav-link nav-cta-btn"
            style={{
              color: 'var(--c-gold)',
              opacity: 1,
              border: '1px solid rgba(180, 154, 112, 0.35)',
              padding: '0.5rem 0.95rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="nav-cta-long">CONFIGURE TIMEPIECE</span>
            <span className="nav-cta-short" style={{ display: 'none' }}>ATELIER</span>
          </a>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--line-dark)',
              color: 'var(--c-ivory)',
              padding: '0.5rem 0.75rem',
              fontFamily: 'var(--f-ui)',
              fontSize: '0.66rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          style={{
            background: 'var(--c-obsidian)',
            borderBottom: '1px solid var(--c-gold-subtle)',
            padding: '2rem var(--gutter)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.35rem',
          }}
        >
          <button
            type="button"
            onClick={() => handleNavClick('collection')}
            className="btn-secondary-link"
          >
            01 / COLLECTION
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('mechanics')}
            className="btn-secondary-link"
          >
            02 / THE ART OF MECHANICS
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('craftsmanship')}
            className="btn-secondary-link"
          >
            03 / CRAFTSMANSHIP
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('atelier')}
            className="btn-secondary-link"
          >
            04 / INTERACTIVE WATCH ATELIER
          </button>
        </div>
      )}

      <style>{`
        @keyframes veronPulseDot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            background-color: #98B475;
          }
          50% {
            opacity: 0.42;
            transform: scale(0.85);
            background-color: #D5BA88;
          }
        }
        @media (max-width: 1120px) {
          .desktop-nav { gap: 1.35rem !important; }
        }
        @media (max-width: 920px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
        @media (max-width: 640px) {
          .nav-geneva-text { display: none !important; }
          .nav-cta-long { display: none !important; }
          .nav-cta-short { display: inline !important; }
          .nav-cta-btn { padding: 0.45rem 0.7rem !important; font-size: 0.66rem !important; }
          .nav-right-actions { gap: 0.65rem !important; }
        }
      `}</style>
    </header>
  );
};

export const HeroSection: React.FC = () => {
  const activeModelId = useWatchStore((s) => s.activeModelId);
  const selectCollectionModel = useWatchStore((s) => s.selectCollectionModel);
  const activeModel =
    COLLECTION_MODELS.find((m) => m.id === activeModelId) || COLLECTION_MODELS[0];

  return (
    <section
      id="top"
      className="env-obsidian"
      style={{
        position: 'relative',
        minHeight: '100svh',
        paddingTop: '96px',
        paddingBottom: '3.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--line-dark)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial studio spotlight behind the 3D watch */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '48%',
          left: '64%',
          transform: 'translate(-50%, -50%)',
          width: '62vw',
          height: '62vw',
          maxWidth: '780px',
          maxHeight: '780px',
          background:
            'radial-gradient(circle, rgba(180, 154, 112, 0.09) 0%, rgba(41, 40, 36, 0.04) 45%, rgba(17, 17, 15, 0) 72%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="veron-container hero-layout"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Left Column: Editorial Typography & CTAs (5 Columns) */}
        <div
          className="hero-copy-col"
          style={{
            gridColumn: '1 / span 5',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            paddingBlock: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '28px',
                height: '1px',
                backgroundColor: 'var(--c-gold)',
              }}
            />
            <p className="tech-label" style={{ color: 'var(--c-gold)' }}>
              INDEPENDENT WATCHMAKING / EST. MMXXIV
            </p>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'var(--t-hero)',
              color: 'var(--c-white)',
              fontWeight: 300,
              letterSpacing: '-0.015em',
              lineHeight: 0.98,
            }}
          >
            TIME,
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>CRAFTED TO</span>
            <br />
            <span className="font-display-italic" style={{ color: 'var(--c-ivory)' }}>
              PERFECTION.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'var(--t-lead)',
              color: 'var(--c-stone)',
              maxWidth: '38ch',
              fontWeight: 300,
              lineHeight: 1.65,
            }}
          >
            An expression of precision, patience and the art of mechanical watchmaking.
          </p>

          {/* Primary & Secondary CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.75rem',
              marginTop: '0.75rem',
            }}
          >
            <a href="#collection" className="btn-primary">
              EXPLORE THE COLLECTION
            </a>
            <a href="#atelier" className="btn-secondary-link">
              DISCOVER THE ATELIER
            </a>
          </div>

          {/* Philosophy Micro-Quote */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--line-dark)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <p
              className="font-display-italic"
              style={{
                fontSize: '1.08rem',
                color: 'var(--c-ivory)',
                opacity: 0.88,
              }}
            >
              “Some things are not made to follow time. They are made to define it.”
            </p>
            <span className="tech-label" style={{ fontSize: '0.62rem' }}>
              MAISON VÉRON · HAUTE HORLOGERIE
            </span>
          </div>
        </div>

        {/* Right / Center Stage: Dominant 3D Flagship Mechanical Watch (7 Columns) */}
        <div
          className="hero-stage-col"
          style={{
            gridColumn: '6 / span 7',
            position: 'relative',
            height: 'clamp(440px, 68vh, 690px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <WatchViewport3D mode="hero" interactiveOrbit={true} />

          {/* Subtle Interactive Viewport HUD in Bottom-Right of Stage */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.5rem',
              left: '0.75rem',
              right: '0.75rem',
              zIndex: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              pointerEvents: 'none',
            }}
          >
            <div
              className="hero-hud-hint"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                color: 'var(--c-stone)',
                fontSize: '0.64rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'rgba(17, 17, 15, 0.72)',
                padding: '0.35rem 0.65rem',
                border: '1px solid rgba(234, 230, 221, 0.06)',
              }}
            >
              <Compass size={13} color="var(--c-gold)" />
              <span className="hero-hud-hint-full">DRAG TO INSPECT 3D CALIBRE · REAL-TIME ESCAPEMENT</span>
              <span className="hero-hud-hint-short" style={{ display: 'none' }}>SWIPE 3D CALIBRE</span>
            </div>

            {/* Quick Calibre Switcher on Hero Stage */}
            <div
              className="ui-interactive"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(17, 17, 15, 0.78)',
                border: '1px solid var(--line-dark)',
                padding: '0.3rem',
              }}
              role="group"
              aria-label="Select flagship model in 3D viewer"
            >
              {COLLECTION_MODELS.map((m, idx) => {
                const isSelected = m.id === activeModelId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectCollectionModel(m.id, true)}
                    style={{
                      background: isSelected ? 'var(--c-gold)' : 'transparent',
                      color: isSelected ? 'var(--c-obsidian)' : 'var(--c-stone)',
                      border: 'none',
                      padding: '0.38rem 0.75rem',
                      fontFamily: 'var(--f-mono)',
                      fontSize: '0.66rem',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      transition: 'all var(--dur-hover) var(--ease-veron)',
                    }}
                  >
                    No. 0{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Specification Bar */}
      <div
        className="veron-container"
        style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--line-dark)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div>
          <span className="tech-label" style={{ display: 'block', marginBottom: '0.2rem' }}>
            DISPLAYED REFERENCE
          </span>
          <span className="tech-mono" style={{ color: 'var(--c-white)' }}>
            {activeModel.code} — {activeModel.name}
          </span>
        </div>
        <div>
          <span className="tech-label" style={{ display: 'block', marginBottom: '0.2rem' }}>
            MOVEMENT ARCHITECTURE
          </span>
          <span className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
            {activeModel.calibre} ({activeModel.partsCount} Components)
          </span>
        </div>
        <div>
          <span className="tech-label" style={{ display: 'block', marginBottom: '0.2rem' }}>
            OSCILLATION & RESERVE
          </span>
          <span className="tech-mono" style={{ color: 'var(--c-ivory)' }}>
            {activeModel.frequency} · {activeModel.powerReserve}
          </span>
        </div>
        <div>
          <span className="tech-label" style={{ display: 'block', marginBottom: '0.2rem' }}>
            ANNUAL PRODUCTION
          </span>
          <span className="tech-mono" style={{ color: 'var(--c-gold)' }}>
            {activeModel.editionLimit}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-copy-col {
            grid-column: 1 / -1 !important;
            order: 2;
          }
          .hero-stage-col {
            grid-column: 1 / -1 !important;
            height: 440px !important;
            order: 1;
          }
        }
        @media (max-width: 768px) {
          #top {
            padding-top: 84px !important;
            padding-bottom: 2.25rem !important;
          }
          .hero-layout {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .hero-stage-col {
            order: 1 !important;
            width: 100% !important;
            height: clamp(350px, 47svh, 420px) !important;
          }
          .hero-copy-col {
            order: 2 !important;
            width: 100% !important;
            padding-block: 0.5rem 1rem !important;
            gap: 1.15rem !important;
          }
        }
        @media (max-width: 640px) {
          .hero-hud-hint-full {
            display: none !important;
          }
          .hero-hud-hint-short {
            display: inline !important;
          }
          #top .veron-container:last-of-type {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
};
