import mongoose from "mongoose";

const socialPostSchema = new mongoose.Schema(
  {
    source: { type: String, default: "social" },
    user_handle: { type: String, default: null },
    user_label: { type: String, default: null },
    message: { type: String, required: true },
    hashtags: { type: [String], default: [] },
    region: { type: String, default: null },
    urgency: {
      type: String,
      enum: ["info", "attention", "urgent"],
      default: "info",
    },
    verified: { type: Boolean, default: false },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

socialPostSchema.index({ region: 1 });
socialPostSchema.index({ message: "text", user_handle: "text" });

socialPostSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const SocialPost = mongoose.model("SocialPost", socialPostSchema);
