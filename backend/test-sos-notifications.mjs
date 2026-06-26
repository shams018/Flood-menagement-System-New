#!/usr/bin/env node

/**
 * SOS Admin Notification Verification Script
 * 
 * Usage:
 *   node backend/test-sos-notifications.mjs
 * 
 * Requirements:
 *   - MongoDB running
 *   - Backend server running
 *   - Admin user exists in database
 *   - Regular user exists in database
 */

import mongoose from "mongoose";
import { Notification } from "./src/models/Notification.js";
import { Admin } from "./src/models/Admin.js";
import { User } from "./src/models/User.js";
import { Alert } from "./src/models/Alert.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/flood_management";

async function testNotificationSystem() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if admins exist
    console.log("📋 Checking admin accounts...");
    const admins = await Admin.find({});
    console.log(`✅ Found ${admins.length} admin(s)\n`);

    if (admins.length === 0) {
      console.log("❌ ERROR: No admins found in database");
      console.log("   Please create an admin account first\n");
      process.exit(1);
    }

    // Check if users exist
    console.log("📋 Checking user accounts...");
    const users = await User.find({});
    console.log(`✅ Found ${users.length} user(s)\n`);

    if (users.length === 0) {
      console.log("❌ ERROR: No users found in database");
      console.log("   Please create a user account first\n");
      process.exit(1);
    }

    // Check recent SOS notifications
    console.log("🔍 Checking SOS notifications...\n");

    const sosNotifications = await Notification.find({ type: "emergency" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "email role")
      .lean();

    if (sosNotifications.length === 0) {
      console.log("⚠️  No emergency notifications found\n");
      console.log(
        "   This is expected if no SOS has been triggered yet.\n"
      );
    } else {
      console.log(`✅ Found ${sosNotifications.length} emergency notification(s):\n`);
      sosNotifications.forEach((notif, index) => {
        console.log(`${index + 1}. ${notif.title}`);
        console.log(`   Body: ${notif.body}`);
        if (notif.location) {
          console.log(
            `   Location: ${notif.location.latitude}, ${notif.location.longitude}`
          );
        }
        if (notif.sosData) {
          console.log(`   Type: ${notif.sosData.emergencyType}`);
          console.log(`   User: ${notif.sosData.userName}`);
        }
        console.log(
          `   Time: ${new Date(notif.createdAt).toLocaleString()}\n`
        );
      });
    }

    // Check SOS alerts
    console.log("🚨 Checking SOS alerts...\n");
    const sosAlerts = await Alert.find({ kind: "emergency_sos" })
      .sort({ created_at: -1 })
      .limit(10)
      .lean();

    if (sosAlerts.length === 0) {
      console.log("⚠️  No SOS alerts found\n");
    } else {
      console.log(`✅ Found ${sosAlerts.length} SOS alert(s):\n`);
      sosAlerts.forEach((alert, index) => {
        console.log(`${index + 1}. ${alert.payload?.title}`);
        console.log(`   Location: ${alert.payload?.placeLabel}`);
        console.log(
          `   Time: ${new Date(alert.created_at).toLocaleString()}\n`
        );
      });
    }

    // Count notifications by admin
    console.log("👥 Notifications per admin:\n");
    const adminCounts = await Notification.aggregate([
      { $match: { type: "emergency" } },
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    if (adminCounts.length === 0) {
      console.log("   No notifications assigned to admins yet\n");
    } else {
      for (const adminCount of adminCounts) {
        const admin = await Admin.findById(adminCount._id);
        console.log(`   ${admin?.email || "Unknown"}: ${adminCount.count} notification(s)`);
      }
      console.log();
    }

    console.log("✅ Verification complete!\n");
    console.log("📝 Next steps:");
    console.log("   1. Go to the SOS page and trigger an emergency");
    console.log("   2. Request assistance (medical/police/fire/rescue)");
    console.log("   3. Login as admin and check notifications");
    console.log("   4. Rerun this script to see updated notifications\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testNotificationSystem();
