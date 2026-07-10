import mongoose, { Schema, Document, Model } from "mongoose";
import { MonitorProduct } from "../types";

export interface IMonitorDocument extends Omit<MonitorProduct, "id">, Document {}

const MonitorSchema = new Schema<IMonitorDocument>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    size: { type: Number, required: true, min: 0 },
    resolution: { type: String, required: true, trim: true },
    refreshRate: { type: Number, required: true, min: 0 },
    responseTime: { type: Number, required: true, min: 0 },
    panel: {
      type: String,
      enum: ["IPS", "VA", "TN", "OLED", "Mini-LED"],
      required: true,
    },
    hdr: { type: Boolean, default: false },
    hdrLevel: { type: String, default: null },
    brightness: { type: Number, required: true, min: 0 },
    contrast: { type: String, required: true },
    colorGamut: { type: String, required: true },
    gSync: { type: Boolean, default: false },
    freeSync: { type: Boolean, default: false },
    curved: { type: Boolean, default: false },
    ports: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    rating: { type: Number, required: true, min: 0, max: 10 },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, unknown>) => {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

MonitorSchema.index({ name: "text", brand: "text", description: "text" });

export const MonitorModel: Model<IMonitorDocument> =
  mongoose.models.Monitor ??
  mongoose.model<IMonitorDocument>("Monitor", MonitorSchema);
