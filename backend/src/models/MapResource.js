import mongoose from "mongoose";

const mapResourceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type_label: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, required: true },
  status_color_class: { type: String, required: true },
  distance_label: { type: String, required: true },
  capacity_text: { type: String, default: "" },
  is_critical: { type: Boolean, default: false },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null },
});

mapResourceSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const MapResource = mongoose.model("MapResource", mapResourceSchema);
