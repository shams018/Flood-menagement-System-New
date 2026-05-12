import { runFloodAssessment } from "../services/floodAssessment.js";

/**
 * Periodically re-evaluate flood risk for configured cities (creates/updates Alert docs).
 * Set MONITORED_LOCATIONS=City1,City2 in .env
 */
export async function syncMonitoredLocations() {
  const raw =
    process.env.MONITORED_LOCATIONS ||
    "Karachi,London,New York,Mumbai,Sydney";
  const places = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const p of places) {
    try {
      await runFloodAssessment(p, { persist: true });
      console.log(`[flood-sync] OK: ${p}`);
    } catch (e) {
      console.warn(`[flood-sync] ${p}: ${e.message}`);
    }
  }
}
