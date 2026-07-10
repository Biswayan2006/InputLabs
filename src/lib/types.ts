// ─── Mouse ────────────────────────────────────────────────────────────────────

export interface MouseDimensions {
  length: number;   // mm, front-to-back
  width: number;    // mm, side-to-side
  height: number;   // mm, desk to peak
  gripWidth?: number; // mm, measured at grip
}

export interface MouseSpecifications {
  sensor?: string;
  maxDPI?: number;
  pollingRate?: number;
  switches?: string;
  encoder?: string;
  batteryLife?: number; // hours; omit for wired
  connectivity?: string[]; // e.g. ["wired"], ["wireless", "wired"], ["2.4GHz", "Bluetooth"]
}

/**
 * SVG outline stored as raw path data + the viewBox that matches real mm dimensions.
 *
 * viewBox must always equal the physical dimension it represents, so the renderer
 * can apply one global px-per-mm scale and all overlaid mice stay proportional.
 *
 * top view  → viewBox width  = mouse width  (mm)
 *           → viewBox height = mouse length (mm)
 * side view → viewBox width  = mouse length (mm)
 *           → viewBox height = mouse height (mm)
 */
export interface MouseSvgView {
  /** Raw SVG <path d="…"> data, coordinate system in mm */
  path: string;
  viewBox: {
    width: number;
    height: number;
  };
}

export interface MouseShape {
  top: MouseSvgView;
  side: MouseSvgView;
  front?: MouseSvgView; // optional front-profile
}

/** Pixel positions of notable points inside the top-view SVG (in mm coordinates) */
export interface MousePositions {
  sensor?: { x: number; y: number };
  wheel?: { x: number; y: number };
}

export interface MouseImages {
  thumbnail: string;
  gallery: string[];
}

export interface Mouse {
  id: string;          // MongoDB _id serialized as string
  brand: string;
  model: string;
  slug: string;        // URL-safe: "logitech-g-pro-x-superlight-2"
  dimensions: MouseDimensions;
  weight: number;      // grams
  specifications: MouseSpecifications;
  shape: MouseShape;
  positions?: MousePositions;
  images: MouseImages;
  price?: number;      // USD; optional — some mice are sold out / no fixed price
  handedness?: "right" | "left" | "ambidextrous";
  gripStyle?: "palm" | "claw" | "fingertip";
  tags: string[];
  releaseDate?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────

export type KeyboardSize = "full" | "tkl" | "75%" | "65%" | "60%" | "40%";
export type KeyboardSwitch = "mechanical" | "optical" | "membrane" | "analog";
export type KeyboardConnectivity = "wired" | "wireless" | "both";

export interface KeyboardProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: KeyboardSize;
  switchType: KeyboardSwitch;
  switchName: string;
  connectivity: KeyboardConnectivity;
  hotswap: boolean;
  rgb: boolean;
  knob: boolean;
  gasket: boolean;
  battery?: number;
  weight: number; // grams
  layout: string;
  tags: string[];
  rating: number;
  description: string;
}

// ─── Monitor ──────────────────────────────────────────────────────────────────

export type MonitorPanel = "IPS" | "VA" | "TN" | "OLED" | "Mini-LED";

export interface MonitorProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: number; // inches
  resolution: string;
  refreshRate: number; // Hz
  responseTime: number; // ms
  panel: MonitorPanel;
  hdr: boolean;
  hdrLevel?: string;
  brightness: number; // nits
  contrast: string;
  colorGamut: string;
  gSync: boolean;
  freeSync: boolean;
  curved: boolean;
  ports: string[];
  tags: string[];
  rating: number;
  description: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export type Category = "mice" | "keyboards" | "monitors";

export interface CompareItem {
  id: string;
  category: Category;
}
