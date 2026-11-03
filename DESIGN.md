# VÉRON — DESIGN & ARCHITECTURE SPECIFICATION

## 1. SKILL COORDINATION

1. **`awwwards-3d-pipeline` (Chief Technical Orchestrator):**
   - Defines strict boundaries between `[ARGON_CORE]` (3D engine, Three.js / React Three Fiber, PBR materials, exploded view kinematics, Zustand state management, pricing math, and WhatsApp order formatting) and `[PRO_UI]` (editorial art direction, typography, layout rhythm, micro-interactions, responsive design).
   - Enforces a Single Source of Truth via `watchStore.ts` (`Zustand`), ensuring zero duplicated state between UI controls and 3D scene representation.
   - Manages WebGL resource lifecycle, adaptive pixel ratio (`dpr={[1, 2]}`), lighting environments, and fallback/prototype node structures ready for drop-in `.glb/.gltf` replacement.

2. **`awwwards` (Creative Direction & Visual Quality Bar):**
   - Establishes the **Concept Card**, **Design Tokens**, typographic hierarchy (`Cormorant Garamond` + `Manrope` + `JetBrains Mono`), and 12-column editorial grid.
   - Enforces "Every static frame is a poster" and "Calm, Precise, Intentional" motion choreography (`cubic-bezier(0.16, 1, 0.3, 1)`), with full `prefers-reduced-motion` support and keyboard accessibility.

---

## 2. CONCEPT CARD

```text
Idea:        An independent Geneva-inspired horological maison where mechanical architecture meets quiet editorial luxury.
Metaphor:    The Calibre & The Loupe — switching seamlessly between warm ivory editorial spreads and deep obsidian watchmaker inspection rooms.
Signature:   Scroll-driven horological exploded view (The Art of Mechanics) + real-time 3D Watch Atelier with live calibre ticking and caseback engraving.
Emotion:     Quiet confidence, mechanical precision, museum-grade intimacy.
Motion verb: "Tick & settle" — high-precision exponential deceleration (cubic-bezier(0.16, 1, 0.3, 1)), mimicking a regulated escapement.
Screenshot:  The exploded mechanical calibre suspended in obsidian space with hairline golden callouts and tabular technical indices.
```

---

## 3. VISUAL REFERENCES SYNTHESIS

1. **Ref 1 (Warm Gold & Burgundy Off-Center Dial on Pitch Black):**
   - *Extracted Principle:* Studio rim-lighting that carves metallic bevels out of pure `#11110F` obsidian darkness; subdial ring geometry and warm champagne gold specular highlights.
2. **Ref 2 (Magazine Spread with Hands Framing Watch on Warm Paper):**
   - *Extracted Principle:* Tactile editorial intimacy on `#EAE6DD` Warm Ivory paper; asymmetric column flow with compact, museum-grade technical captions (`DAY-DATE / CALIBRE` style blocks).
3. **Ref 3 (Macro Exposed Mechanical Movement):**
   - *Extracted Principle:* Multi-layered depth of brushed steel bridges, brass gear trains, blued screws, and ruby pivot bearings — informs our 3D procedural movement assembly and Section 04 Craftsmanship macro plates.
4. **Ref 4 (Monochromatic Brushed Steel Watch on Dark Stone Pedestal):**
   - *Extracted Principle:* Architectural restraint, satin vs. mirror-polished chamfers, and quiet authority without superfluous decoration.

---

## 4. DESIGN TOKENS

### Color Palette
- `--c-obsidian`: `#11110F` (Deep Obsidian — Dark cinematic sections)
- `--c-ivory`: `#EAE6DD` (Warm Ivory — Light editorial sections)
- `--c-gold`: `#B49A70` (Champagne Gold — Micro-accents, hairlines, active indicators)
- `--c-stone`: `#8C8981` (Muted Stone — Secondary technical labels & captions)
- `--c-graphite`: `#292824` (Soft Graphite — Dark surfaces, borders, charcoal dials)
- `--c-white`: `#F7F6F2` (Pure White — High-contrast reading & elevated cards)

### Typography
- **Display (`--f-display`):** `'Cormorant Garamond', Georgia, serif` — High-contrast editorial serif, weights 300, 400, 500, italic.
- **UI & Body (`--f-ui`):** `'Manrope', -apple-system, sans-serif` — Clean geometric sans-serif for navigation, specs, and controls.
- **Technical Mono (`--f-mono`):** `'JetBrains Mono', monospace` — Tabular numerals for calibre specs, tolerances, and pricing.

### Motion System
- Primary Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Hover transitions: `280ms`
- UI state transitions: `420ms`
- Section reveals: `750ms`
