import {
  geocodePlace,
  fetchForecast,
  sumPrecipitationHours,
  maxDailySum,
} from "./openMeteo.js";
import { evaluateFloodRisk } from "./floodEngine.js";
import { Alert } from "../models/Alert.js";

function regionKey(lat, lon) {
  return `${Number(lat).toFixed(3)}_${Number(lon).toFixed(3)}`;
}

function getWeatherDescription(code) {
  // WMO Weather interpretation codes
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown conditions";
}

function badgeForRisk(risk) {
  if (risk === "CRITICAL")
    return { bg: "bg-red-600", label: "WEATHER — CRITICAL RISK" };
  if (risk === "HIGH")
    return { bg: "bg-orange-600", label: "WEATHER — HIGH RISK" };
  if (risk === "MODERATE")
    return { bg: "bg-yellow-600", label: "WEATHER — MODERATE RISK" };
  if (risk === "ELEVATED")
    return { bg: "bg-amber-600", label: "WEATHER — ELEVATED" };
  return { bg: "bg-green-600", label: "WEATHER — LOW RISK" };
}

/**
 * Full pipeline: geocode → forecast → rules → optional DB upsert
 */
export async function runFloodAssessment(placeQuery, { persist = true } = {}) {
  const geo = await geocodePlace(placeQuery || "London");
  const forecast = await fetchForecast(geo.latitude, geo.longitude);

  const rain24hMm = sumPrecipitationHours(forecast.hourly.precipitation, 24);
  const rain48hMm = sumPrecipitationHours(forecast.hourly.precipitation, 48);
  const maxDaily7Mm = maxDailySum(forecast.daily.precipitation_sum);

  const evaluation = evaluateFloodRisk({
    rain24hMm,
    rain48hMm,
    maxDaily7Mm,
  });

  const rk = regionKey(geo.latitude, geo.longitude);
  const placeLabel = [geo.name, geo.admin1, geo.country]
    .filter(Boolean)
    .join(", ");
  const badge = badgeForRisk(evaluation.riskLevel);

  // Extract weather data from forecast
  const currentTemp =
    forecast.current?.temperature || forecast.hourly?.temperature_2m?.[0] || 24;
  const currentWeatherCode = forecast.current?.weather_code || 0;
  const weatherDescription = getWeatherDescription(currentWeatherCode);

  const assessment = {
    placeName: geo.name,
    placeLabel,
    country: geo.country,
    latitude: geo.latitude,
    longitude: geo.longitude,
    regionKey: rk,
    riskLevel: evaluation.riskLevel,
    factors: evaluation.factors,
    recommendation: evaluation.recommendation,
    weather: {
      temp: Math.round(currentTemp * 10) / 10,
      description: weatherDescription,
      code: currentWeatherCode,
    },
    metrics: {
      rain24hMm: Math.round(rain24hMm * 10) / 10,
      rain48hMm: Math.round(rain48hMm * 10) / 10,
      maxDaily7Mm: Math.round(maxDaily7Mm * 10) / 10,
    },
    dataSource: "Open-Meteo (forecast)",
    rulesVersion: evaluation.rulesVersion,
    assessedAt: new Date().toISOString(),
    hasFloodConcern: evaluation.riskLevel !== "LOW",
  };

  if (persist) {
    const hoursValid =
      evaluation.riskLevel === "CRITICAL" || evaluation.riskLevel === "HIGH"
        ? 4
        : 6;
    const expiresAt = new Date(Date.now() + hoursValid * 60 * 60 * 1000);

    const payload = {
      badgePrimary: badge.label,
      badgeSecondary: placeLabel,
      title: `Flood risk assessment: ${geo.name}`,
      subtitle: `Forecast precipitation · ${assessment.dataSource}`,
      summary: evaluation.recommendation,
      riskLevel: evaluation.riskLevel,
      factors: evaluation.factors,
      metrics: assessment.metrics,
      placeName: geo.name,
      placeLabel,
      latitude: geo.latitude,
      longitude: geo.longitude,
      assessedAt: assessment.assessedAt,
      dataSource: assessment.dataSource,
    };

    await Alert.findOneAndUpdate(
      { source: "automated", regionKey: rk },
      {
        kind: "automated_flood",
        source: "automated",
        regionKey: rk,
        sort_order: 0,
        priority: evaluation.priority,
        expiresAt,
        payload,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  return assessment;
}
