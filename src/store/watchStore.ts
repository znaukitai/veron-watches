/**
 * [SHARED_CONTRACTS] & [ARGON_CORE]
 * Single Source of Truth for VÉRON Horological Experience.
 * Synchronizes 3D Scene, Collection Selection, Exploded Mechanics, Interactive Atelier, and Order Formatting.
 */

import { create } from 'zustand';

export type WatchModelId = 'no-01-classic' | 'no-02-skeleton' | 'no-03-chronograph';

export type CaseOption = 'steel' | 'gold' | 'titanium';
export type DialOption = 'obsidian' | 'ivory' | 'midnight';
export type StrapOption = 'black-leather' | 'brown-leather' | 'steel-bracelet';
export type HandsOption = 'classic' | 'skeleton';
export type CameraAngle = 'three-quarter' | 'dial-front' | 'movement-macro' | 'caseback' | 'profile';
export type StudioLighting = 'boutique-warm' | 'obsidian-dramatic' | 'daylight-atelier';

export interface WatchCollectionItem {
  id: WatchModelId;
  code: string;
  name: string;
  subtitle: string;
  calibre: string;
  frequency: string;
  powerReserve: string;
  caseDiameter: string;
  thickness: string;
  waterResistance: string;
  jewels: number;
  partsCount: number;
  editionLimit: string;
  description: string;
  editorialNote: string;
  basePrice: number;
  defaultConfig: {
    caseMaterial: CaseOption;
    dialColor: DialOption;
    strapType: StrapOption;
    handsStyle: HandsOption;
  };
}

export interface OptionMeta<T extends string> {
  id: T;
  label: string;
  technicalSpec: string;
  priceDelta: number;
  swatchHex: string;
  secondaryHex?: string;
}

export const WHATSAPP_CONFIG = {
  // Explicitly marked unconfigured by default per strict requirements:
  // If empty, the UI shows a transparent configuration modal + direct copy/preview rather than a fake phone link.
  phoneNumber: '',
  conciergeEmail: 'atelier@veron-horlogerie.concept',
  isDemoMode: true,
};

export const COLLECTION_MODELS: WatchCollectionItem[] = [
  {
    id: 'no-01-classic',
    code: 'VÉRON No. 01',
    name: 'The Classic',
    subtitle: 'Automatic Dress Chronometer',
    calibre: 'Calibre VR-01 In-House Manual',
    frequency: '21,600 vph (3 Hz)',
    powerReserve: '72 Hours',
    caseDiameter: '39.0 mm',
    thickness: '8.4 mm',
    waterResistance: '5 ATM / 50m',
    jewels: 29,
    partsCount: 186,
    editionLimit: '25 Pieces Annually',
    description:
      'Architectural restraint distilled to its purest horological form. Hand-finished bevels frame a multi-tiered lacquer dial with heat-Tempered lancette hands.',
    editorialNote:
      'Designed for the collector who values silence over spectacle. The 8.4mm profile slips effortlessly beneath a tailored cuff.',
    basePrice: 28500,
    defaultConfig: {
      caseMaterial: 'steel',
      dialColor: 'obsidian',
      strapType: 'black-leather',
      handsStyle: 'classic',
    },
  },
  {
    id: 'no-02-skeleton',
    code: 'VÉRON No. 02',
    name: 'The Skeleton',
    subtitle: 'Openworked Tourbillon Architecture',
    calibre: 'Calibre VR-02 Openworked',
    frequency: '18,000 vph (2.5 Hz)',
    powerReserve: '80 Hours',
    caseDiameter: '40.0 mm',
    thickness: '9.1 mm',
    waterResistance: '3 ATM / 30m',
    jewels: 35,
    partsCount: 242,
    editionLimit: '12 Pieces Annually',
    description:
      'Every non-essential gram of German silver is carved away by hand, exposing the suspended gear train, twin mainspring barrels, and beating balance wheel.',
    editorialNote:
      'Light passes directly through the movement bridges, turning Negative Space into a structural mechanical element.',
    basePrice: 44000,
    defaultConfig: {
      caseMaterial: 'gold',
      dialColor: 'obsidian',
      strapType: 'brown-leather',
      handsStyle: 'skeleton',
    },
  },
  {
    id: 'no-03-chronograph',
    code: 'VÉRON No. 03',
    name: 'The Chronograph',
    subtitle: 'Column-Wheel Monopusher Split',
    calibre: 'Calibre VR-03 Column-Wheel',
    frequency: '28,800 vph (4 Hz)',
    powerReserve: '64 Hours',
    caseDiameter: '40.5 mm',
    thickness: '10.6 mm',
    waterResistance: '5 ATM / 50m',
    jewels: 38,
    partsCount: 314,
    editionLimit: '18 Pieces Annually',
    description:
      'Twin recessed registers inspired by mid-century observatory instruments, driven by a vertical clutch and a hand-polished 8-pillar column wheel.',
    editorialNote:
      'Coaxial monopusher integrated into the crown delivers tactile mechanical crispness with zero lateral dial clutter.',
    basePrice: 36800,
    defaultConfig: {
      caseMaterial: 'titanium',
      dialColor: 'midnight',
      strapType: 'steel-bracelet',
      handsStyle: 'classic',
    },
  },
];

export const CASE_OPTIONS: OptionMeta<CaseOption>[] = [
  {
    id: 'steel',
    label: 'Polished Steel',
    technicalSpec: '904L Mirror & Satin Hand-Finished Alloy',
    priceDelta: 0,
    swatchHex: '#D8D8D6',
    secondaryHex: '#8E8E8C',
  },
  {
    id: 'gold',
    label: 'Yellow Gold',
    technicalSpec: '18K 3N Champagne Gold (750/1000)',
    priceDelta: 6500,
    swatchHex: '#C8AE7D',
    secondaryHex: '#9A7E4E',
  },
  {
    id: 'titanium',
    label: 'Titanium',
    technicalSpec: 'Grade 5 Micro-Blasted & Chamfered Titanium',
    priceDelta: 2400,
    swatchHex: '#8B8D8F',
    secondaryHex: '#595B5D',
  },
];

export const DIAL_OPTIONS: OptionMeta<DialOption>[] = [
  {
    id: 'obsidian',
    label: 'Obsidian Black',
    technicalSpec: 'Grand Feu Enamel & Circular Satiné Subdials',
    priceDelta: 0,
    swatchHex: '#151513',
  },
  {
    id: 'ivory',
    label: 'Warm Ivory',
    technicalSpec: 'Grained Silveré Opalescent Warm Lacquer',
    priceDelta: 800,
    swatchHex: '#EAE6DD',
  },
  {
    id: 'midnight',
    label: 'Deep Midnight Blue',
    technicalSpec: 'PVD Sunray Côtes de Genève Abyssal Blue',
    priceDelta: 1200,
    swatchHex: '#162234',
  },
];

export const STRAP_OPTIONS: OptionMeta<StrapOption>[] = [
  {
    id: 'black-leather',
    label: 'Black Leather',
    technicalSpec: 'Hand-Stitched Matte Obsidian Alligator Calfskin',
    priceDelta: 0,
    swatchHex: '#181816',
  },
  {
    id: 'brown-leather',
    label: 'Brown Leather',
    technicalSpec: 'Warm Cognac Barénia Patina Saddle Leather',
    priceDelta: 450,
    swatchHex: '#4E3224',
  },
  {
    id: 'steel-bracelet',
    label: 'Steel Bracelet',
    technicalSpec: 'Integrated 5-Link Articulated Brushed Metal',
    priceDelta: 1900,
    swatchHex: '#B6B6B2',
  },
];

export const HANDS_OPTIONS: OptionMeta<HandsOption>[] = [
  {
    id: 'classic',
    label: 'Classic',
    technicalSpec: 'Diamond-Cut Dauphine with Faceted Center Ridge',
    priceDelta: 0,
    swatchHex: '#B49A70',
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    technicalSpec: 'Openworked Architectural Lancette',
    priceDelta: 950,
    swatchHex: '#E0DCD0',
  },
];

export interface ExplodedComponentInfo {
  id: string;
  index: string;
  name: string;
  frenchTerm: string;
  material: string;
  description: string;
  offsetY: number;
}

export const EXPLODED_COMPONENTS: ExplodedComponentInfo[] = [
  {
    id: 'sapphire-crystal',
    index: '01',
    name: 'Sapphire Crystal',
    frenchTerm: 'Glace Saphir Bombée',
    material: 'Corundum Al₂O₃ (9 Mohs)',
    description: 'Box-domed crystal machined from a single boules block with 7-layer internal anti-reflective treatment.',
    offsetY: 2.35,
  },
  {
    id: 'hands',
    index: '02',
    name: 'Hands',
    frenchTerm: 'Aiguilles Dauphine Squelette',
    material: '18K Gold / Blued Steel',
    description: 'Hand-diamond-polished facets engineered to catch ambient light at the slightest wrist inclination.',
    offsetY: 1.45,
  },
  {
    id: 'dial',
    index: '03',
    name: 'Dial',
    frenchTerm: 'Cadran Multi-Niveaux',
    material: 'Solid Brass & Grand Feu Lacquer',
    description: 'Three-piece construction featuring engine-turned chapter rings and diamond-beveled indices.',
    offsetY: 0.65,
  },
  {
    id: 'movement',
    index: '04',
    name: 'Movement',
    frenchTerm: 'Calibre Manufacture VR',
    material: 'German Silver (Maillechort) & Brass',
    description: 'Free-sprung balance wheel, Côtes de Genève bridges, 29 ruby jewels, and hand-anglage chamfers.',
    offsetY: -0.25,
  },
  {
    id: 'case',
    index: '05',
    name: 'Case',
    frenchTerm: 'Boîtier Carrure',
    material: '904L Steel / 18K Gold / Grade 5 Ti',
    description: 'Ergonomic 39mm middle case combining satin-brushed flanks with mirror-polished concave bezel.',
    offsetY: -1.15,
  },
  {
    id: 'case-back',
    index: '06',
    name: 'Case Back',
    frenchTerm: 'Fond Saphir Gravé',
    material: 'Exhibition Sapphire & Engraved Ring',
    description: 'Secured by 6 titanium torx screws with bespoke hand-engraved perimeter inscription.',
    offsetY: -2.15,
  },
];

interface WatchStoreState {
  // Active Collection Model
  activeModelId: WatchModelId;

  // Interactive Atelier Configuration
  caseMaterial: CaseOption;
  dialColor: DialOption;
  strapType: StrapOption;
  handsStyle: HandsOption;
  engravingText: string;

  // 3D Viewport & Camera States
  cameraAngle: CameraAngle;
  studioLighting: StudioLighting;
  zoomLevel: number;
  autoRotate: boolean;
  hoveredPart: string | null;

  // Exploded View State (0 = assembled, 1 = fully exploded)
  explosionProgress: number;
  activeExplodedPart: string | null;

  // Order Modal State
  isOrderModalOpen: boolean;

  // Actions
  selectCollectionModel: (modelId: WatchModelId, applyDefaults?: boolean) => void;
  setCaseMaterial: (val: CaseOption) => void;
  setDialColor: (val: DialOption) => void;
  setStrapType: (val: StrapOption) => void;
  setHandsStyle: (val: HandsOption) => void;
  setEngravingText: (val: string) => void;
  setCameraAngle: (angle: CameraAngle) => void;
  setStudioLighting: (lighting: StudioLighting) => void;
  setZoomLevel: (zoom: number) => void;
  toggleAutoRotate: () => void;
  setHoveredPart: (part: string | null) => void;
  setExplosionProgress: (progress: number) => void;
  setActiveExplodedPart: (partId: string | null) => void;
  resetConfiguration: () => void;
  setOrderModalOpen: (open: boolean) => void;

  // Derived Selectors / Helpers
  getTotalPrice: () => number;
  getFormattedOrderSummary: () => {
    model: WatchCollectionItem;
    caseMeta: OptionMeta<CaseOption>;
    dialMeta: OptionMeta<DialOption>;
    strapMeta: OptionMeta<StrapOption>;
    handsMeta: OptionMeta<HandsOption>;
    engraving: string;
    totalPrice: number;
    messageText: string;
    whatsappUrl: string | null;
  };
}

export const useWatchStore = create<WatchStoreState>((set, get) => ({
  activeModelId: 'no-01-classic',
  caseMaterial: 'gold',
  dialColor: 'obsidian',
  strapType: 'black-leather',
  handsStyle: 'classic',
  engravingText: 'EST. MMXXVI',

  cameraAngle: 'three-quarter',
  studioLighting: 'boutique-warm',
  zoomLevel: 1.0,
  autoRotate: true,
  hoveredPart: null,

  explosionProgress: 0,
  activeExplodedPart: 'movement',

  isOrderModalOpen: false,

  selectCollectionModel: (modelId, applyDefaults = true) => {
    const found = COLLECTION_MODELS.find((m) => m.id === modelId);
    if (!found) return;
    if (applyDefaults) {
      set({
        activeModelId: modelId,
        caseMaterial: found.defaultConfig.caseMaterial,
        dialColor: found.defaultConfig.dialColor,
        strapType: found.defaultConfig.strapType,
        handsStyle: found.defaultConfig.handsStyle,
      });
    } else {
      set({ activeModelId: modelId });
    }
  },

  setCaseMaterial: (caseMaterial) => set({ caseMaterial }),
  setDialColor: (dialColor) => set({ dialColor }),
  setStrapType: (strapType) => set({ strapType }),
  setHandsStyle: (handsStyle) => set({ handsStyle }),
  setEngravingText: (raw) => {
    const sanitized = raw.slice(0, 24).toUpperCase();
    set({ engravingText: sanitized });
  },
  setCameraAngle: (cameraAngle) => set({ cameraAngle }),
  setStudioLighting: (studioLighting) => set({ studioLighting }),
  setZoomLevel: (zoom) => set({ zoomLevel: Math.min(1.4, Math.max(0.75, zoom)) }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setHoveredPart: (hoveredPart) => set({ hoveredPart }),
  setExplosionProgress: (explosionProgress) =>
    set({ explosionProgress: Math.min(1, Math.max(0, explosionProgress)) }),
  setActiveExplodedPart: (activeExplodedPart) => set({ activeExplodedPart }),

  resetConfiguration: () => {
    const currentModel =
      COLLECTION_MODELS.find((m) => m.id === get().activeModelId) || COLLECTION_MODELS[0];
    set({
      caseMaterial: currentModel.defaultConfig.caseMaterial,
      dialColor: currentModel.defaultConfig.dialColor,
      strapType: currentModel.defaultConfig.strapType,
      handsStyle: currentModel.defaultConfig.handsStyle,
      engravingText: 'EST. MMXXVI',
      cameraAngle: 'three-quarter',
      studioLighting: 'boutique-warm',
      zoomLevel: 1.0,
      autoRotate: true,
    });
  },

  setOrderModalOpen: (isOrderModalOpen) => set({ isOrderModalOpen }),

  getTotalPrice: () => {
    const state = get();
    const model =
      COLLECTION_MODELS.find((m) => m.id === state.activeModelId) || COLLECTION_MODELS[0];
    const caseMeta = CASE_OPTIONS.find((c) => c.id === state.caseMaterial) || CASE_OPTIONS[0];
    const dialMeta = DIAL_OPTIONS.find((d) => d.id === state.dialColor) || DIAL_OPTIONS[0];
    const strapMeta = STRAP_OPTIONS.find((s) => s.id === state.strapType) || STRAP_OPTIONS[0];
    const handsMeta = HANDS_OPTIONS.find((h) => h.id === state.handsStyle) || HANDS_OPTIONS[0];
    const engravingFee = state.engravingText.trim().length > 0 ? 350 : 0;

    return (
      model.basePrice +
      caseMeta.priceDelta +
      dialMeta.priceDelta +
      strapMeta.priceDelta +
      handsMeta.priceDelta +
      engravingFee
    );
  },

  getFormattedOrderSummary: () => {
    const state = get();
    const model =
      COLLECTION_MODELS.find((m) => m.id === state.activeModelId) || COLLECTION_MODELS[0];
    const caseMeta = CASE_OPTIONS.find((c) => c.id === state.caseMaterial) || CASE_OPTIONS[0];
    const dialMeta = DIAL_OPTIONS.find((d) => d.id === state.dialColor) || DIAL_OPTIONS[0];
    const strapMeta = STRAP_OPTIONS.find((s) => s.id === state.strapType) || STRAP_OPTIONS[0];
    const handsMeta = HANDS_OPTIONS.find((h) => h.id === state.handsStyle) || HANDS_OPTIONS[0];
    const totalPrice = state.getTotalPrice();
    const engraving = state.engravingText.trim() || 'NONE';

    const lines = [
      'VÉRON — INDEPENDENT WATCHMAKING',
      'BESPOKE ATELIER COMMISSION DOSSIER',
      '────────────────────────────────────',
      `Model: ${model.code} — ${model.name} (${model.calibre})`,
      `Case: ${caseMeta.label} (${caseMeta.technicalSpec})`,
      `Dial: ${dialMeta.label} (${dialMeta.technicalSpec})`,
      `Strap: ${strapMeta.label} (${strapMeta.technicalSpec})`,
      `Hands: ${handsMeta.label} (${handsMeta.technicalSpec})`,
      `Caseback Engraving: "${engraving}"`,
      '────────────────────────────────────',
      `Indicative Demonstration Estimate: CHF ${totalPrice.toLocaleString('en-US')}`,
      '(Concept Demonstration Valuation — Non-commercial)',
    ];

    const messageText = lines.join('\n');
    const cleanPhone = WHATSAPP_CONFIG.phoneNumber.replace(/[^\d]/g, '');
    const whatsappUrl =
      cleanPhone.length >= 7
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
        : null;

    return {
      model,
      caseMeta,
      dialMeta,
      strapMeta,
      handsMeta,
      engraving,
      totalPrice,
      messageText,
      whatsappUrl,
    };
  },
}));
