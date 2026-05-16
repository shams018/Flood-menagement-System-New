import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["emergency", "system", "social"],
      default: "system",
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    actionText: { type: String, default: "View Alert" },
    accentColor: {
      type: String,
      enum: ["red", "blue", "yellow", "gray"],
      default: "gray",
    },
    route: { type: String, default: "/alerts" },
    read: { type: Boolean, default: false },
    priority: { type: Number, default: 100 },
    alertRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alert",
      default: null,
    },
    time: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

notificationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
