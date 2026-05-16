import mongoose from "mongoose";

const victimRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    victim_name: { type: String, required: true },
    father_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    age: { type: Number, required: true, min: 1, max: 120 },
    cnic_number: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Responded"],
      default: "Pending",
    },
    government_id_type: { type: String, default: "CNIC" },
    government_id_number: { type: String, default: null },
    incident_location: { type: String, required: true },
    loss_type: { type: String, required: true },
    description: { type: String, default: null },
    photo_paths: { type: [String], default: [] },
    id_front_path: { type: String, required: true },
    id_back_path: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

victimRegistrationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    ret.user_id = ret.user ? ret.user.toString() : null;
    delete ret.user;
    ret.status = ret.status || "Pending";
    if (ret.created_at) ret.created_at = ret.created_at.toISOString();
    return ret;
  },
});

export const VictimRegistration = mongoose.model(
  "VictimRegistration",
  victimRegistrationSchema,
);
