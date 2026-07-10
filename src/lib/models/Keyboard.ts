import mongoose, { Schema, Document, Model } from "mongoose";
import { KeyboardProduct } from "../types";

export interface IKeyboardDocument extends Omit<KeyboardProduct, "id">, Document {}

const KeyboardSchema = new Schema<IKeyboardDocument>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    size: {
      type: String,
      enum: ["full", "tkl", "75%", "65%", "60%", "40%"],
      required: true,
    },
    switchType: {
      type: String,
      enum: ["mechanical", "optical", "membrane", "analog"],
      required: true,
    },
    switchName: { type: String, required: true, trim: true },
    connectivity: {
      type: String,
      enum: ["wired", "wireless", "both"],
      required: true,
    },
    hotswap: { type: Boolean, default: false },
    rgb: { type: Boolean, default: false },
    knob: { type: Boolean, default: false },
    gasket: { type: Boolean, default: false },
    battery: { type: Number, default: null },
    weight: { type: Number, required: true, min: 0 },
    layout: { type: String, default: "ANSI" },
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

KeyboardSchema.index({ name: "text", brand: "text", description: "text" });

export const KeyboardModel: Model<IKeyboardDocument> =
  mongoose.models.Keyboard ??
  mongoose.model<IKeyboardDocument>("Keyboard", KeyboardSchema);
