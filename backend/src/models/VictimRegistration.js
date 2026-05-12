import mongoose from "mongoose";

const victimRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    incident_location: { type: String, required: true },
    loss_type: { type: String, required: true },
    description: { type: String, default: null },
    photo_paths: { type: [String], default: [] },
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
    if (ret.created_at) ret.created_at = ret.created_at.toISOString();
    return ret;
  },
});

export const VictimRegistration = mongoose.model(
  "VictimRegistration",
  victimRegistrationSchema,
);
