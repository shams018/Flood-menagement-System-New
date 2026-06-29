/**
 * Open-Meteo — free tier, no API key (https://open-meteo.com)
 */

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function geocodePlace(name) {
  const q = String(name || "").trim();
  if (!q) {
    const err = new Error("Place name is required");
    err.status = 400;
    throw err;
  }
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = await res.json();
  if (!data.results?.length) {
    const err = new Error(
      `No location found for “${q}”. Try a city or region name.`,
    );
    err.status = 404;
    throw err;
  }
  const r = data.results[0];
  return {
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    country_code: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  };
}

/**
 * @returns {Promise<{ hourly: { time: string[], precipitation: number[] }, daily: { time: string[], precipitation_sum: number[] } }>}
 */
export async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "precipitation,temperature_2m",
    daily: "precipitation_sum,precipitation_probability_max",
    current_weather: "true",
    forecast_days: "7",
    timezone: "auto",
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather forecast failed (${res.status})`);
  const data = await res.json();
  if (
    !data.hourly?.precipitation ||
    !data.daily?.precipitation_sum ||
    !data.hourly?.temperature_2m ||
    !data.current_weather
  ) {
    throw new Error("Incomplete weather response from Open-Meteo");
  }
  return {
    current: {
      temperature: Number(data.current_weather.temperature) || null,
      wind_speed: Number(data.current_weather.windspeed) || null,
      weather_code: Number(data.current_weather.weathercode) || 0,
    },
    hourly: {
      time: data.hourly.time,
      precipitation: data.hourly.precipitation.map((v) => Number(v) || 0),
      temperature_2m: data.hourly.temperature_2m.map((v) => Number(v) || null),
    },
    daily: {
      time: data.daily.time,
      precipitation_sum: data.daily.precipitation_sum.map(
        (v) => Number(v) || 0,
      ),
      precipitation_probability_max: (
        data.daily.precipitation_probability_max || []
      ).map((v) => Number(v) || 0),
    },
  };
}

export function sumPrecipitationHours(precipMm, hours) {
  const n = Math.min(hours, precipMm.length);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += precipMm[i] || 0;
  return sum;
}

export function maxDailySum(dailySums) {
  if (!dailySums.length) return 0;
  return Math.max(...dailySums);
}
