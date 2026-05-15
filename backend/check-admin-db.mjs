import mongoose from "mongoose";
import { User } from "./src/models/User.js";
import { Admin } from "./src/models/Admin.js";

const uri = process.env.MONGODB_URI
  ? process.env.MONGODB_URI
  : "mongodb://127.0.0.1:27017/sentinel_flood";

try {
  await mongoose.connect(uri);
  const userCount = await User.countDocuments();
  const adminCount = await Admin.countDocuments();
  console.log("users", userCount, "admins", adminCount);
  const adminSample = await Admin.find().limit(5).lean();
  console.log("adminSample", adminSample);
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}
