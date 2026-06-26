import { Router } from "express";
import { VictimRegistration } from "../models/VictimRegistration.js";
import { Alert } from "../models/Alert.js";
import { MapResource } from "../models/MapResource.js";
import { Notification } from "../models/Notification.js";

function formatDayLabel(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ensureAdmin(req, res) {
  if (String(req.user.role || "").toLowerCase() !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
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

  function extractRegionFromAlert(alert) {
    if (typeof alert.payload?.subtitle === "string") {
      const parts = alert.payload.subtitle.split("·");
      if (parts.length > 0) return parts[0].trim();
    }
    if (alert.regionKey) return alert.regionKey;
    return "Unknown Region";
  }

  function buildReportFromAlert(alert) {
    const date = alert._id?.getTimestamp
      ? alert._id.getTimestamp()
      : new Date();
    const status = ["automated", "seed"].includes(alert.source)
      ? "sent"
      : "generated";
    const priorityValue =
      typeof alert.priority === "number" ? alert.priority : 100;
    const summary =
      alert.payload?.subtitle ||
      alert.payload?.title ||
      "AI-generated flood intelligence.";
    const detail =
      alert.payload?.summary ||
      alert.payload?.body ||
      "Automated alert details are not available.";

    return {
      id: alert._id.toString(),
      date: date.toISOString().slice(0, 10),
      region: extractRegionFromAlert(alert),
      title: alert.payload?.title || "Automated Flood Intelligence Update",
      status,
      confidence: priorityValue <= 50 ? 96 : priorityValue <= 90 ? 88 : 76,
      summary,
      detail,
      evacPriority:
        priorityValue <= 50
          ? "URGENT"
          : priorityValue <= 100
            ? "HIGH"
            : "MODERATE",
      impactRadius:
        priorityValue <= 50
          ? "14.2 km"
          : priorityValue <= 100
            ? "9.8 km"
            : "6.3 km",
    };
  }

  function buildReportFromVictim(victim) {
    const date = victim.created_at ? new Date(victim.created_at) : new Date();
    const location = victim.incident_location || "Unknown Location";
    const title = `${victim.loss_type || "Damage"} assessment: ${location}`;
    const summary = `${victim.victim_name || "A victim"} reported ${victim.loss_type || "an incident"} in ${location}.`;
    const detail =
      victim.description || `Victim contact: ${victim.phone_number || "N/A"}.`;

    return {
      id: victim._id.toString(),
      date: date.toISOString().slice(0, 10),
      region: location,
      title,
      status: "generated",
      confidence: 82,
      summary,
      detail,
      evacPriority: "PENDING",
      impactRadius: "N/A",
    };
  }

  async function loadAdminReports() {
    const [alerts, victims] = await Promise.all([
      Alert.find().sort({ _id: -1 }).limit(6).lean(),
      VictimRegistration.find().sort({ created_at: -1 }).limit(4).lean(),
    ]);

    const reports = [
      ...alerts.map(buildReportFromAlert),
      ...victims.map(buildReportFromVictim),
    ];

    return reports.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  router.get("/reports", requireAuth, async (req, res, next) => {
    try {
      if (!ensureAdmin(req, res)) return;
      const reports = await loadAdminReports();

      const todayKey = new Date().toISOString().slice(0, 10);
      const reportsToday = reports.filter(
        (report) => report.date === todayKey,
      ).length;
      const successRate = reports.length
        ? Math.round(
            (reports.filter((report) => report.status !== "FAILED").length /
              reports.length) *
              1000,
          ) / 10
        : 100;

      const latestReport = reports[0] || null;
      const aiSummary = latestReport
        ? {
            title: latestReport.title,
            summary: latestReport.summary,
            confidence: latestReport.confidence,
            evacPriority: latestReport.evacPriority,
            impactRadius: latestReport.impactRadius,
            region: latestReport.region,
            generatedAt: latestReport.date,
          }
        : {
            title: "No AI reports available",
            summary:
              "The AI system is preparing the first intelligence summaries.",
            confidence: 0,
            evacPriority: "N/A",
            impactRadius: "N/A",
            region: "N/A",
            generatedAt: null,
          };

      res.json({
        reports,
        stats: {
          reportsToday,
          successRate,
          totalReports: reports.length,
        },
        aiSummary,
      });
    } catch (e) {
      next(e);
    }
  });

  router.post(
    "/reports/:reportId/resend",
    requireAuth,
    async (req, res, next) => {
      try {
        if (!ensureAdmin(req, res)) return;
        const reports = await loadAdminReports();
        const report = reports.find((item) => item.id === req.params.reportId);
        if (!report) {
          return res.status(404).json({ error: "Report not found" });
        }

        const notification = await Notification.create({
          type: "system",
          title: `AI Report resent: ${report.title}`,
          body: `The AI summary for ${report.region} has been resent to admins.`,
          actionText: "View AI Reports",
          accentColor: "blue",
          route: "/admin-aireport",
          priority: 90,
        });

        res.json({
          ok: true,
          notification: notification.toJSON
            ? notification.toJSON()
            : notification,
        });
      } catch (e) {
        next(e);
      }
    },
  );

  return router;
}
