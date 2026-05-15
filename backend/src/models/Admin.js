import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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
    role: { type: String, default: "Admin" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

adminSchema.set("toJSON", {
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

export const Admin = mongoose.model("Admin", adminSchema);
