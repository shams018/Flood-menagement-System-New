import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  kind: { type: String, required: true },
  sort_order: { type: Number, default: 0 },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  source: {
    type: String,
    enum: ["seed", "automated"],
    default: "seed",
  },
  regionKey: { type: String, default: null },
  expiresAt: { type: Date, default: null },
  /** Lower = more urgent (automated flood risks use 10–50; seeds use ~100+) */
  priority: { type: Number, default: 100 },
});

alertSchema.index(
  { regionKey: 1 },
  { unique: true, partialFilterExpression: { source: "automated" } },
);

alertSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Alert = mongoose.model("Alert", alertSchema);
