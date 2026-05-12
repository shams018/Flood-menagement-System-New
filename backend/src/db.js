import mongoose from "mongoose";
import { MapResource } from "./models/MapResource.js";
import { Alert } from "./models/Alert.js";
import { Ngo } from "./models/Ngo.js";
import { ChatMessage } from "./models/ChatMessage.js";

export async function connectMongo(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

export async function seedIfEmpty() {
  const count = await MapResource.countDocuments();
  if (count > 0) return;

  await MapResource.insertMany([
    {
      category: "shelter",
      type_label: "Emergency Shelter Alpha",
      name: "Civic Center Plaza",
      status: "85% Capacity",
      status_color_class: "bg-yellow-400",
      distance_label: "0.8 MI",
      capacity_text: "",
      is_critical: false,
      lat: 40.7128,
      lng: -74.006,
    },
    {
      category: "medical",
      type_label: "Medical Center Delta",
      name: "St. Jude Field Hospital",
      status: "Open - Low Traffic",
      status_color_class: "bg-green-500",
      distance_label: "2.4 MI",
      capacity_text: "",
      is_critical: false,
      lat: 40.72,
      lng: -74.01,
    },
    {
      category: "shelter",
      type_label: "Evacuation Hub",
      name: "North Harbor Pier",
      status: "CRITICAL: AT CAPACITY",
      status_color_class: "bg-red-500",
      distance_label: "4.1 MI",
      capacity_text: "",
      is_critical: true,
      lat: 40.73,
      lng: -73.99,
    },
  ]);

  await Alert.insertMany([
    {
      kind: "emergency_hero",
      source: "seed",
      priority: 101,
      sort_order: 1,
      payload: {
        badgePrimary: "EMERGENCY",
        badgeSecondary: "IMPACT IN: 04 MINUTES",
        title: "Sudden Surge: Lower Manhattan Zone 4",
        subtitle: "Lower Manhattan, NY · 12:42 PM EST",
        summary:
          "Rapid water-level rise detected upstream. Models indicate breach risk at seawall nodes LM-12 to LM-15 within the next hour. Evacuation corridors Alpha and Bravo remain open.",
        meta1: "WIND 28 KTS",
        meta2: "RISE +0.4M / 15 MIN",
      },
    },
    {
      kind: "warning_card",
      source: "seed",
      priority: 102,
      sort_order: 2,
      payload: {
        badgePrimary: "WARNING",
        title: "Thames Estuary Watch",
        body:
          "Elevated tidal coupling combined with upstream discharge may exceed advisory thresholds near barrier gates T3-T5.",
        timeLabel: "2 HOURS AGO",
      },
    },
    {
      kind: "watch_card",
      source: "seed",
      priority: 103,
      sort_order: 3,
      payload: {
        badgePrimary: "WATCH",
        title: "Rhine Valley Pre-Alert",
        body:
          "Long-range precipitation models suggest sustained saturation along the middle Rhine basin through Thursday.",
        timeLabel: "10 HOURS AGO",
      },
    },
    {
      kind: "priority_full",
      source: "seed",
      priority: 104,
      sort_order: 4,
      payload: {
        badgePrimary: "HIGH PRIORITY EMERGENCY",
        title: "Coastal Breach: Mumbai North Coastal Sector",
        body:
          "Storm surge modeling shows overlapping king tide and cyclonic fetch. Municipal seawall monitoring stations report structural stress above rated tolerance. Shelter capacity and evacuation routes are being updated in real time.",
      },
    },
  ]);

  await Ngo.insertMany([
    {
      name: "Red Cross International",
      type: "Medical & Relief",
      status: "Active - Deployed",
      status_color_class: "bg-green-500",
      location: "Sector 7G, NYC",
      contact: "+1 (555) 012-3456",
      is_active: true,
    },
    {
      name: "Global Aid Network",
      type: "Logistics & Supply",
      status: "Coordinating",
      status_color_class: "bg-yellow-500",
      location: "Distribution Center A",
      contact: "+1 (555) 098-7654",
      is_active: false,
    },
    {
      name: "Flood Relief Alliance",
      type: "Emergency Response",
      status: "Active - On Site",
      status_color_class: "bg-green-500",
      location: "Lower Manhattan",
      contact: "+1 (555) 045-6789",
      is_active: true,
    },
    {
      name: "Community Support Org",
      type: "Local Coordination",
      status: "Standby",
      status_color_class: "bg-blue-500",
      location: "Brooklyn HQ",
      contact: "+1 (555) 032-1987",
      is_active: false,
    },
  ]);

  await ChatMessage.insertMany([
    {
      channel: "general",
      author_label: "Command",
      body: "All personnel transition to Sector 7. Aerial surveillance confirms rising water levels.",
      is_own_highlight: false,
    },
    {
      channel: "general",
      author_label: "Unit 4",
      body: "Copy that Command. Units positioned at Sector 7 perimeter.",
      is_own_highlight: false,
    },
    {
      channel: "general",
      author_label: "You",
      body: "On-site at Sector 7 Bridge. Visibility is low due to fog.",
      is_own_highlight: true,
    },
  ]);
}
