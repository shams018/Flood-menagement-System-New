import { Router } from "express";
import { VictimRegistration } from "../models/VictimRegistration.js";
import { Alert } from "../models/Alert.js";
import { MapResource } from "../models/MapResource.js";

function formatDayLabel(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function createAdminRouter({ requireAuth }) {
  const router = Router();

  router.get("/overview", requireAuth, async (req, res, next) => {
    try {
      if (String(req.user.role || "").toLowerCase() !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const now = new Date();
      const todayUtc = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );
      const sevenDaysAgoUtc = new Date(todayUtc);
      sevenDaysAgoUtc.setUTCDate(todayUtc.getUTCDate() - 6);

      const activeAlertFilter = {
        $or: [
          { source: { $nin: ["automated"] } },
          { source: { $exists: false } },
          {
            $and: [{ source: "automated" }, { expiresAt: { $gt: new Date() } }],
          },
        ],
      };

      const [
        totalVictims,
        activeAlerts,
        sheltersActive,
        medicalFacilities,
        rescueTeams,
        recentVictimRows,
        topRegionRows,
        alertTrendRows,
        resourceGroups,
      ] = await Promise.all([
        VictimRegistration.countDocuments(),
        Alert.countDocuments(activeAlertFilter),
        MapResource.countDocuments({ category: "shelter" }),
        MapResource.countDocuments({ category: "medical" }),
        MapResource.countDocuments({
          $or: [
            { type_label: { $regex: /rescue/i } },
            { category: { $regex: /rescue|team/i } },
          ],
        }),
        VictimRegistration.find().sort({ created_at: -1 }).limit(5).lean(),
        VictimRegistration.aggregate([
          {
            $group: {
              _id: "$incident_location",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 4 },
        ]),
        Alert.aggregate([
          { $match: { created_at: { $gte: sevenDaysAgoUtc } } },
          {
            $project: {
              dateKey: {
                $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
              },
            },
          },
          { $group: { _id: "$dateKey", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ]),
        MapResource.aggregate([
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const alertTrendMap = alertTrendRows.reduce((memo, row) => {
        memo[row._id] = row.count;
        return memo;
      }, {});

      const alertsOverTime = Array.from({ length: 7 }, (_, index) => {
        const day = new Date(sevenDaysAgoUtc);
        day.setUTCDate(sevenDaysAgoUtc.getUTCDate() + index);
        const key = day.toISOString().slice(0, 10);
        return {
          label: formatDayLabel(day),
          count: alertTrendMap[key] || 0,
        };
      });

      const victimsByRegion = topRegionRows.map((region) => ({
        region: region._id || "Unknown",
        count: region.count,
      }));

      const resourceAllocation = [
        {
          label: "Food & Medical",
          val: medicalFacilities,
          color: "bg-blue-400",
        },
        {
          label: "Search & Rescue",
          val: rescueTeams,
          color: "bg-yellow-400",
        },
        {
          label: "Infrastructure",
          val: sheltersActive,
          color: "bg-red-400",
        },
      ];

      const recentVictimReports = recentVictimRows.map((row) => ({
        id: row._id.toString(),
        victim_name: row.victim_name,
        incident_location: row.incident_location,
        loss_type: row.loss_type,
        created_at: row.created_at?.toISOString?.() || null,
      }));

      res.json({
        overview: {
          totalVictims,
          activeAlerts,
          sheltersActive,
          rescueTeams,
          alertsOverTime,
          recentVictimReports,
          victimsByRegion,
          resourceAllocation,
        },
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}
