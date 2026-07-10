import mongoose, { Schema, Model } from "mongoose";
import { Mouse } from "../types";

// ─── Document type ────────────────────────────────────────────────────────────
// We avoid extending Mongoose's Document interface directly because its
// `model()` method conflicts with our `model: string` field.
// The Schema is defined without a generic type parameter to sidestep the
// conflict; `toJSON` virtuals still serialize `_id` → `id` correctly.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IMouseDocument = any;

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const DimensionsSchema = new Schema(
  {
    length:    { type: Number, required: true, min: 0 },
    width:     { type: Number, required: true, min: 0 },
    height:    { type: Number, required: true, min: 0 },
    gripWidth: { type: Number, default: null },
  },
  { _id: false }
);

const SpecificationsSchema = new Schema(
  {
    sensor:       { type: String, default: null, trim: true },
    maxDPI:       { type: Number, default: null, min: 0 },
    pollingRate:  { type: Number, default: null, min: 0 },
    switches:     { type: String, default: null, trim: true },
    encoder:      { type: String, default: null, trim: true },
    batteryLife:  { type: Number, default: null, min: 0 },
    connectivity: { type: [String], default: [] },
  },
  { _id: false }
);

const SvgViewSchema = new Schema(
  {
    // Raw SVG <path d="…"> data in real millimetre coordinates
    path: { type: String, required: true },
    viewBox: {
      width:  { type: Number, required: true },
      height: { type: Number, required: true },
    },
  },
  { _id: false }
);

const ShapeSchema = new Schema(
  {
    top:   { type: SvgViewSchema, required: true },
    side:  { type: SvgViewSchema, required: true },
    front: { type: SvgViewSchema, default: null },
  },
  { _id: false }
);

const PositionsSchema = new Schema(
  {
    sensor: { x: { type: Number }, y: { type: Number } },
    wheel:  { x: { type: Number }, y: { type: Number } },
  },
  { _id: false }
);

const ImagesSchema = new Schema(
  {
    thumbnail: { type: String, default: "" },
    gallery:   { type: [String], default: [] },
  },
  { _id: false }
);

// ─── Root schema ──────────────────────────────────────────────────────────────

const MouseSchema = new Schema(
  {
    brand:          { type: String, required: true, trim: true },
    model:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    dimensions:     { type: DimensionsSchema, required: true },
    weight:         { type: Number, required: true, min: 0 },
    specifications: { type: SpecificationsSchema, default: () => ({}) },
    shape:          { type: ShapeSchema, required: true },
    positions:      { type: PositionsSchema, default: null },
    images:         { type: ImagesSchema, default: () => ({ thumbnail: "", gallery: [] }) },
    price:          { type: Number, default: null, min: 0 },
    handedness:     { type: String, enum: ["right", "left", "ambidextrous", null], default: null },
    gripStyle:      { type: String, enum: ["palm", "claw", "fingertip", null], default: null },
    tags:           { type: [String], default: [] },
    releaseDate:    { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

MouseSchema.index(
  { brand: "text", model: "text", "specifications.sensor": "text", tags: "text" },
  { name: "mouse_text_search" }
);
MouseSchema.index({ slug: 1 }, { unique: true });
MouseSchema.index({ "dimensions.length": 1 });
MouseSchema.index({ "dimensions.width": 1 });
MouseSchema.index({ weight: 1 });
MouseSchema.index({ price: 1 });
MouseSchema.index({ handedness: 1 });
MouseSchema.index({ tags: 1 });

// ─── Export ───────────────────────────────────────────────────────────────────

export const MouseModel: Model<IMouseDocument> =
  mongoose.models.Mouse ?? mongoose.model<IMouseDocument>("Mouse", MouseSchema);

// Re-export the app-level type for convenience
export type { Mouse };
