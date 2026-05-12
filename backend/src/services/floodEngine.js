/**
 * Rule-based flood *risk* from forecast precipitation (not a substitute for official warnings).
 * Jobs: if rainfall / accumulation crosses thresholds → risk tier + factors for alerts.
 */

export const RULES = {
  /** mm liquid water — next 24h summed hourly forecast */
  rain24Critical: 75,
  rain24High: 45,
  rain24Moderate: 25,
  rain24Elevated: 12,
  /** any single day in 7d forecast with this much rain → bump risk one tier */
  dailyBurstMm: 100,
  /** 48h cumulative — secondary stress */
  rain48HighStress: 120,
};

const ORDER = ["LOW", "ELEVATED", "MODERATE", "HIGH", "CRITICAL"];

function bumpTier(level) {
  const i = ORDER.indexOf(level);
  if (i < 0 || i >= ORDER.length - 1) return level;
  return ORDER[i + 1];
}

function tierFromRain24(rain24hMm) {
  if (rain24hMm >= RULES.rain24Critical) return "CRITICAL";
  if (rain24hMm >= RULES.rain24High) return "HIGH";
  if (rain24hMm >= RULES.rain24Moderate) return "MODERATE";
  if (rain24hMm >= RULES.rain24Elevated) return "ELEVATED";
  return "LOW";
}

function priorityForRisk(riskLevel) {
  const map = { CRITICAL: 10, HIGH: 20, MODERATE: 30, ELEVATED: 40, LOW: 50 };
  return map[riskLevel] ?? 50;
}

function recommendation(riskLevel) {
  switch (riskLevel) {
    case "CRITICAL":
      return "Sustained heavy rain is forecast. Avoid flood-prone areas; follow local emergency guidance and prepare to move to higher ground.";
    case "HIGH":
      return "Elevated flash-flood risk. Monitor official alerts; clear drains where safe; avoid walking or driving through water.";
    case "MODERATE":
      return "Localized flooding is possible. Stay aware of low-lying roads and streams; check regional weather services.";
    case "ELEVATED":
      return "Minor water accumulation may occur. Typical urban drainage should cope; remain alert during peak rainfall.";
    default:
      return "No significant precipitation-driven flood signal in the current 7-day forecast for this location.";
  }
}

/**
 * @param {{ rain24hMm: number, rain48hMm: number, maxDaily7Mm: number }} metrics
 */
export function evaluateFloodRisk(metrics) {
  const factors = [];
  let level = tierFromRain24(metrics.rain24hMm);

  factors.push(
    `Forecast rain (next ~24h): ${metrics.rain24hMm.toFixed(1)} mm (Open-Meteo hourly sum)`,
  );
  factors.push(`Next ~48h cumulative: ${metrics.rain48hMm.toFixed(1)} mm`);

  if (metrics.maxDaily7Mm >= RULES.dailyBurstMm) {
    level = bumpTier(level);
    factors.push(
      `Peak single-day rain in window: ${metrics.maxDaily7Mm.toFixed(1)} mm (≥ ${RULES.dailyBurstMm} mm daily-burst rule → raised tier)`,
    );
  } else {
    factors.push(
      `Peak single-day rain (7d): ${metrics.maxDaily7Mm.toFixed(1)} mm`,
    );
  }

  if (metrics.rain48hMm >= RULES.rain48HighStress && level !== "CRITICAL") {
    const before = level;
    level = bumpTier(level);
    if (level !== before) {
      factors.push(
        `48h cumulative ≥ ${RULES.rain48HighStress} mm → additional stress bump`,
      );
    }
  }

  return {
    riskLevel: level,
    factors,
    recommendation: recommendation(level),
    priority: priorityForRisk(level),
    rulesVersion: "precip-v1",
  };
}
