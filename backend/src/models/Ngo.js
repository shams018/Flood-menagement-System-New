import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  status_color_class: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  is_active: { type: Boolean, default: true },
});

ngoSchema.index(
  {
    name: "text",
    type: "text",
    location: "text",
  },
  { default_language: "english", name: "NgoTextIndex" },
);

ngoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Ngo = mongoose.model("Ngo", ngoSchema);
