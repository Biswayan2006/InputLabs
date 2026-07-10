import { Mouse } from "../types";

/**
 * Seed data for gaming mice.
 *
 * SVG coordinate system rules:
 *
 * top view  (shape.top):
 *   viewBox = "0 0 {width_mm} {length_mm}"
 *   X = 0  → left side of mouse
 *   X = W  → right side
 *   Y = 0  → front (buttons end)
 *   Y = L  → rear (cable / back of mouse)
 *
 * side view (shape.side):
 *   viewBox = "0 0 {length_mm} {height_mm}"
 *   X = 0  → front
 *   X = L  → rear
 *   Y = 0  → bottom (desk surface)
 *   Y = H  → peak of hump (NOTE: peak is at Y=H, front/rear are lower)
 *   The path should start at bottom-left, trace up and over the hump, back down.
 *
 * All coordinates are in real millimetres. The renderer multiplies by a single
 * global PX_PER_MM scale so all overlaid mice stay true-to-life size.
 */

// Seed mice don't have MongoDB _id yet — id/createdAt/updatedAt are filled by DB.
// We use a cast so TypeScript is satisfied while seeding strips these fields.
type SeedMouse = Omit<Mouse, "id" | "createdAt" | "updatedAt">;

export const mice: SeedMouse[] = [
  // ─── Logitech G Pro X Superlight 2 ─────────────────────────────────────────
  // 125 × 63.5 × 40 mm | 60 g | right-handed symmetrical
  {
    brand: "Logitech",
    model: "G Pro X Superlight 2",
    slug: "logitech-g-pro-x-superlight-2",
    dimensions: { length: 125, width: 63.5, height: 40 },
    weight: 60,
    specifications: {
      sensor: "HERO 2",
      maxDPI: 32000,
      pollingRate: 2000,
      batteryLife: 95,
      connectivity: ["wireless"],
    },
    shape: {
      top: {
        // Slightly right-biased symmetrical shape, gentle waist pinch
        viewBox: { width: 63.5, height: 125 },
        path: `
          M 8.9 1.3
          C 8.9 1.3 12.7 0 31.75 0
          C 50.8 0 54.6 1.3 54.6 1.3
          C 59.7 3.2 62.2 7.6 62.2 13.9
          C 62.2 25.4 61.0 36.8 59.7 43.1
          C 57.8 50.8 54.6 57.1 50.2 60.3
          C 44.5 63.5 19.1 63.5 13.3 60.3
          C 8.9 57.1 5.7 50.8 3.8 43.1
          C 2.5 36.8 1.3 25.4 1.3 13.9
          C 1.3 7.6 3.8 3.2 8.9 1.3 Z
        `,
      },
      side: {
        // Low, competitive profile — hump peaks around 40% from front
        viewBox: { width: 125, height: 40 },
        path: `
          M 0 0
          L 0 6.4
          C 2.5 17.6 8.9 30.0 16.3 36.0
          C 23.8 40.0 35.0 40.0 42.5 40.0
          C 77.5 40.0 100.0 32.0 112.5 22.4
          C 121.3 15.2 125.0 8.0 125.0 4.8
          L 125.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 31.75, y: 35.0 },
      sensor: { x: 31.75, y: 82.5 },
    },
    images: { thumbnail: "/images/mice/gpx2.png", gallery: [] },
    price: 159,
    handedness: "right",
    gripStyle: "palm",
    tags: ["competitive", "lightweight", "wireless", "esports"],
    releaseDate: "2023-02-01",
  },

  // ─── Razer DeathAdder V3 ────────────────────────────────────────────────────
  // 128 × 68 × 44 mm | 59 g | right-handed ergo
  {
    brand: "Razer",
    model: "DeathAdder V3",
    slug: "razer-deathadder-v3",
    dimensions: { length: 128, width: 68, height: 44 },
    weight: 59,
    specifications: {
      sensor: "Focus Pro 30K",
      maxDPI: 30000,
      pollingRate: 8000,
      connectivity: ["wired"],
    },
    shape: {
      top: {
        // Ergo: right side bulges prominently around 55% from front
        viewBox: { width: 68, height: 128 },
        path: `
          M 12.2 1.4
          C 12.2 1.4 19.0 0 34.0 0
          C 46.2 0 53.1 0.7 57.1 2.0
          C 63.2 4.8 67.3 10.2 67.9 17.7
          C 68.7 27.3 68.0 39.4 66.7 47.6
          C 64.8 56.5 60.9 63.4 54.5 66.2
          C 47.0 68.7 21.8 68.7 13.6 66.2
          C 7.5 63.4 3.4 56.5 2.0 47.6
          C 0.7 38.7 0.0 26.6 0.7 17.1
          C 1.4 9.5 5.4 3.4 12.2 1.4 Z
        `,
      },
      side: {
        // Taller ergo hump, peaks at ~40% from front
        viewBox: { width: 128, height: 44 },
        path: `
          M 0 0
          L 0 7.0
          C 4.5 20.5 12.8 35.2 22.4 40.8
          C 30.7 44.0 43.5 44.0 51.2 44.0
          C 89.6 44.0 108.8 34.1 121.6 23.0
          C 128.0 16.6 128.0 8.3 128.0 5.1
          L 128.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 34.0, y: 38.0 },
      sensor: { x: 34.0, y: 83.2 },
    },
    images: { thumbnail: "/images/mice/dav3.png", gallery: [] },
    price: 99,
    handedness: "right",
    gripStyle: "palm",
    tags: ["ergo", "wired", "8000hz", "competitive"],
    releaseDate: "2022-11-01",
  },

  // ─── Zowie EC2-C ────────────────────────────────────────────────────────────
  // 122 × 64 × 42 mm | 73 g | right-handed ergo
  {
    brand: "Zowie",
    model: "EC2-C",
    slug: "zowie-ec2-c",
    dimensions: { length: 122, width: 64, height: 42 },
    weight: 73,
    specifications: {
      sensor: "3360",
      maxDPI: 3200,
      pollingRate: 1000,
      connectivity: ["wired"],
    },
    shape: {
      top: {
        // Classic EC ergo — medium right bulge, narrower front
        viewBox: { width: 64, height: 122 },
        path: `
          M 12.8 1.3
          C 12.8 1.3 19.2 0 32.0 0
          C 43.5 0 49.9 0.6 53.8 2.6
          C 58.2 5.1 62.2 10.2 62.8 16.6
          C 63.5 25.6 63.0 37.0 61.4 45.1
          C 59.5 53.8 55.5 60.8 49.0 63.4
          C 41.6 66.0 22.4 66.0 14.7 63.4
          C 8.3 60.8 4.5 53.8 2.6 45.1
          C 1.3 36.2 0.6 24.3 1.3 16.0
          C 1.9 9.0 6.4 3.2 12.8 1.3 Z
        `,
      },
      side: {
        viewBox: { width: 122, height: 42 },
        path: `
          M 0 0
          L 0 6.7
          C 4.3 19.6 12.2 33.6 21.4 38.9
          C 29.3 42.0 41.5 42.0 48.8 42.0
          C 85.4 42.0 103.7 32.4 115.9 21.9
          C 122.0 15.8 122.0 7.9 122.0 4.8
          L 122.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 32.0, y: 36.6 },
      sensor: { x: 32.0, y: 79.3 },
    },
    images: { thumbnail: "/images/mice/ec2c.png", gallery: [] },
    price: 69,
    handedness: "right",
    gripStyle: "palm",
    tags: ["plug-n-play", "no-software", "ergo", "wired"],
    releaseDate: "2022-06-01",
  },

  // ─── Pulsar Xlite V3 ────────────────────────────────────────────────────────
  // 120 × 62 × 38 mm | 55 g | ambidextrous
  {
    brand: "Pulsar",
    model: "Xlite V3",
    slug: "pulsar-xlite-v3",
    dimensions: { length: 120, width: 62, height: 38 },
    weight: 55,
    specifications: {
      sensor: "PAW3395",
      maxDPI: 26000,
      pollingRate: 1000,
      batteryLife: 70,
      connectivity: ["wireless"],
    },
    shape: {
      top: {
        // Ambidextrous: symmetrical, pinched waist
        viewBox: { width: 62, height: 120 },
        path: `
          M 9.3 1.2
          C 9.3 1.2 13.6 0 31.0 0
          C 48.4 0 52.7 1.2 52.7 1.2
          C 57.7 3.1 60.8 8.1 60.8 14.3
          C 60.8 24.8 58.9 38.8 55.9 49.2
          C 53.0 58.7 48.4 66.8 43.1 69.0
          C 37.2 72.0 24.8 72.0 18.9 69.0
          C 13.6 66.8 9.0 58.7 6.2 49.2
          C 3.1 38.8 1.2 24.8 1.2 14.3
          C 1.2 8.1 4.3 3.1 9.3 1.2 Z
        `,
      },
      side: {
        // Low flat profile
        viewBox: { width: 120, height: 38 },
        path: `
          M 0 0
          L 0 6.1
          C 3.6 17.1 9.6 28.8 16.8 34.0
          C 24.0 38.0 36.0 38.0 42.0 38.0
          C 78.0 38.0 99.6 30.4 111.6 21.3
          C 118.8 15.2 120.0 7.6 120.0 4.6
          L 120.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 31.0, y: 34.0 },
      sensor: { x: 31.0, y: 78.0 },
    },
    images: { thumbnail: "/images/mice/xlitev3.png", gallery: [] },
    price: 59,
    handedness: "ambidextrous",
    gripStyle: "claw",
    tags: ["budget", "lightweight", "wireless", "ambidextrous"],
    releaseDate: "2023-04-01",
  },

  // ─── Finalmouse Starlight-12 Small ──────────────────────────────────────────
  // 116 × 57 × 36 mm | 42 g | ambidextrous
  {
    brand: "Finalmouse",
    model: "Starlight-12 Small",
    slug: "finalmouse-starlight-12-small",
    dimensions: { length: 116, width: 57, height: 36 },
    weight: 42,
    specifications: {
      sensor: "FinSensor",
      maxDPI: 800,
      pollingRate: 1000,
      batteryLife: 160,
      connectivity: ["wireless"],
    },
    shape: {
      top: {
        // Very narrow ambi, pronounced pinched waist
        viewBox: { width: 57, height: 116 },
        path: `
          M 9.1 1.1
          C 9.1 1.1 12.5 0 28.5 0
          C 44.5 0 47.9 1.1 47.9 1.1
          C 52.7 3.1 55.9 7.8 55.9 13.9
          C 55.9 24.4 53.5 37.2 50.2 46.4
          C 47.1 55.0 42.3 63.3 36.9 65.5
          C 31.8 68.0 25.2 68.0 20.1 65.5
          C 14.7 63.3 9.9 55.0 6.8 46.4
          C 3.5 37.2 1.1 24.4 1.1 13.9
          C 1.1 7.8 4.3 3.1 9.1 1.1 Z
        `,
      },
      side: {
        // Very flat and low for its length
        viewBox: { width: 116, height: 36 },
        path: `
          M 0 0
          L 0 5.8
          C 3.5 16.2 9.3 27.4 16.2 32.0
          C 23.2 36.0 34.8 36.0 40.6 36.0
          C 75.4 36.0 97.0 28.8 108.5 20.2
          C 115.4 14.4 116.0 7.2 116.0 4.3
          L 116.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 28.5, y: 32.5 },
      sensor: { x: 28.5, y: 75.4 },
    },
    images: { thumbnail: "/images/mice/starlight12.png", gallery: [] },
    price: 189,
    handedness: "ambidextrous",
    gripStyle: "fingertip",
    tags: ["ultralight", "wireless", "premium", "ambidextrous"],
    releaseDate: "2022-03-01",
  },

  // ─── SteelSeries Prime Wireless ─────────────────────────────────────────────
  // 130 × 65 × 42 mm | 80 g | right-handed ergo
  {
    brand: "SteelSeries",
    model: "Prime Wireless",
    slug: "steelseries-prime-wireless",
    dimensions: { length: 130, width: 65, height: 42 },
    weight: 80,
    specifications: {
      sensor: "True Move Air",
      maxDPI: 18000,
      pollingRate: 1000,
      batteryLife: 100,
      connectivity: ["wireless"],
    },
    shape: {
      top: {
        // Ergo with longer rear body
        viewBox: { width: 65, height: 130 },
        path: `
          M 11.1 1.3
          C 11.1 1.3 17.6 0 32.5 0
          C 45.5 0 52.0 0.7 56.0 2.6
          C 62.1 5.9 65.0 11.8 65.0 18.2
          C 65.0 28.6 63.7 41.6 61.8 50.7
          C 59.2 60.5 54.6 67.9 47.5 71.5
          C 39.8 74.1 25.2 74.1 17.5 71.5
          C 10.5 67.9 5.9 60.5 3.3 50.7
          C 1.3 41.6 0.0 28.6 0.0 18.2
          C 0.0 11.1 3.3 4.6 11.1 1.3 Z
        `,
      },
      side: {
        viewBox: { width: 130, height: 42 },
        path: `
          M 0 0
          L 0 6.7
          C 5.2 20.2 13.0 34.4 22.8 39.5
          C 31.2 42.0 43.9 42.0 52.0 42.0
          C 91.0 42.0 110.5 32.7 123.5 21.8
          C 130.0 15.6 130.0 7.8 130.0 4.7
          L 130.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 32.5, y: 39.0 },
      sensor: { x: 32.5, y: 84.5 },
    },
    images: { thumbnail: "/images/mice/primewl.png", gallery: [] },
    price: 129,
    handedness: "right",
    gripStyle: "palm",
    tags: ["wireless", "ergo", "rgb", "magnetic switches"],
    releaseDate: "2021-09-01",
  },

  // ─── Endgame Gear XM2w ──────────────────────────────────────────────────────
  // 122 × 64 × 40 mm | 63 g | ambidextrous
  {
    brand: "Endgame Gear",
    model: "XM2w",
    slug: "endgame-gear-xm2w",
    dimensions: { length: 122, width: 64, height: 40 },
    weight: 63,
    specifications: {
      sensor: "PAW3370",
      maxDPI: 19000,
      pollingRate: 1000,
      batteryLife: 80,
      connectivity: ["wireless"],
    },
    shape: {
      top: {
        // Ambi with a pronounced front taper
        viewBox: { width: 64, height: 122 },
        path: `
          M 9.0 1.9
          C 9.0 1.9 14.1 0 32.0 0
          C 49.9 0 55.0 1.9 55.0 1.9
          C 59.7 3.8 62.7 9.6 62.7 16.0
          C 62.7 26.9 60.8 40.8 57.7 50.7
          C 54.7 59.6 49.9 67.4 43.5 70.3
          C 37.1 73.0 26.9 73.0 20.5 70.3
          C 14.1 67.4 9.3 59.6 6.3 50.7
          C 3.2 40.8 1.3 26.9 1.3 16.0
          C 1.3 9.6 4.3 3.8 9.0 1.9 Z
        `,
      },
      side: {
        viewBox: { width: 122, height: 40 },
        path: `
          M 0 0
          L 0 6.4
          C 4.9 18.4 11.6 31.2 19.5 36.0
          C 27.3 40.0 39.0 40.0 46.4 40.0
          C 82.9 40.0 103.7 30.8 115.9 20.8
          C 122.0 14.8 122.0 7.2 122.0 4.4
          L 122.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 32.0, y: 36.6 },
      sensor: { x: 32.0, y: 79.3 },
    },
    images: { thumbnail: "/images/mice/xm2w.png", gallery: [] },
    price: 79,
    handedness: "ambidextrous",
    gripStyle: "claw",
    tags: ["wireless", "ambidextrous", "value", "competitive"],
    releaseDate: "2022-08-01",
  },

  // ─── Razer Viper V3 Pro ─────────────────────────────────────────────────────
  // 131 × 68 × 38 mm | 74 g | ambidextrous
  {
    brand: "Razer",
    model: "Viper V3 Pro",
    slug: "razer-viper-v3-pro",
    dimensions: { length: 131, width: 68, height: 38 },
    weight: 74,
    specifications: {
      sensor: "Focus Pro 35K",
      maxDPI: 35000,
      pollingRate: 8000,
      batteryLife: 95,
      connectivity: ["wireless"],
    },
    shape: {
      top: {
        // Ambi, longer body, distinctive flat top profile
        viewBox: { width: 68, height: 131 },
        path: `
          M 8.8 2.0
          C 8.8 2.0 14.3 0 34.0 0
          C 53.7 0 59.2 2.0 59.2 2.0
          C 64.6 4.8 67.3 10.9 67.3 18.4
          C 67.3 29.9 65.3 44.5 62.6 54.9
          C 59.2 65.4 53.7 73.6 46.9 76.9
          C 39.4 79.7 28.6 79.7 21.1 76.9
          C 14.3 73.6 8.8 65.4 5.4 54.9
          C 2.7 44.5 0.7 29.9 0.7 18.4
          C 0.7 10.9 3.4 4.8 8.8 2.0 Z
        `,
      },
      side: {
        // Notably flat and low for its size
        viewBox: { width: 131, height: 38 },
        path: `
          M 0 0
          L 0 6.1
          C 4.6 17.8 10.5 29.8 17.7 34.0
          C 25.5 38.0 38.2 38.0 45.9 38.0
          C 85.2 38.0 108.1 29.0 121.8 19.2
          C 131.0 13.0 131.0 6.1 131.0 3.8
          L 131.0 0 Z
        `,
      },
    },
    positions: {
      wheel:  { x: 34.0, y: 39.3 },
      sensor: { x: 34.0, y: 85.2 },
    },
    images: { thumbnail: "/images/mice/viperv3pro.png", gallery: [] },
    price: 159,
    handedness: "ambidextrous",
    gripStyle: "palm",
    tags: ["wireless", "8000hz", "ambidextrous", "esports"],
    releaseDate: "2023-04-01",
  },
];
