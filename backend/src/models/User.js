import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: { type: String, required: true, select: false },
    full_name: { type: String, required: true },
    phone: { type: String, default: null },
    role: { type: String, default: "User" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password_hash;
    if (ret.created_at) ret.created_at = ret.created_at.toISOString();
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);
