/**
 * [MERGE_INSTRUCTIONS] Root Application Integration
 * Connects [PRO_UI] Editorial Sections with [ARGON_CORE] 3D Horological Viewports
 * and Single Source of Truth Zustand Store.
 */

import { Navbar, HeroSection } from './components/HeroSection';
import { CollectionSection } from './components/CollectionSection';
import { MechanicsSection } from './components/MechanicsSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { AtelierConfigurator } from './components/AtelierConfigurator';
import { FinalBrandStatement, Footer } from './components/FinalBrandStatement';

export function App() {
  return (
    <div className="veron-app-root">
      <Navbar />
      <main id="main-content">
        {/* SECTION 01 — HERO / THE FIRST IMPRESSION (Deep Obsidian) */}
        <HeroSection />

        {/* SECTION 02 — THE COLLECTION (Warm Ivory Editorial) */}
        <CollectionSection />

        {/* SECTION 03 — THE ART OF MECHANICS (Deep Obsidian 3D Exploded View) */}
        <MechanicsSection />

        {/* SECTION 04 — CRAFTSMANSHIP (Warm Ivory Macro Editorial) */}
        <CraftsmanshipSection />

        {/* SECTION 05 — INTERACTIVE WATCH ATELIER (Deep Obsidian 3D Configurator) */}
        <AtelierConfigurator />

        {/* SECTION 06 — FINAL BRAND STATEMENT (Deep Obsidian Finale) */}
        <FinalBrandStatement />
      </main>
      <Footer />
    </div>
  );
}

export default App;
