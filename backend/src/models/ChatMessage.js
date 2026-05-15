import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    channel: { type: String, default: "general" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    author_label: { type: String, required: true },
    body: { type: String, required: true },
    is_own_highlight: { type: Boolean, default: false },
    is_ai_message: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

chatMessageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.user;
    if (ret.created_at) ret.created_at = ret.created_at.toISOString();
    return ret;
  },
});

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
