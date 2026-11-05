import {
  CityLocation,
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  SavedCity,
  WeatherConditionInfo,
  WeatherData,
  WeatherSettings,
} from '../types/weather';

export const DEFAULT_SETTINGS: WeatherSettings = {
  tempUnit: 'celsius',
  windUnit: 'kmh',
  pressureUnit: 'hPa',
  precipUnit: 'mm',
  theme: 'weather',
  apiProvider: 'open-meteo',
  openWeatherMapKey: '',
};

export const INITIAL_SAVED_CITIES: SavedCity[] = [
  {
    id: 'guntur-in',
    name: 'Guntur',
    country: 'India',
    admin1: 'Andhra Pradesh',
    latitude: 16.3067,
    longitude: 80.4365,
    isFavorite: true,
  },
  {
    id: 'hyderabad-in',
    name: 'Hyderabad',
    country: 'India',
    admin1: 'Telangana',
    latitude: 17.385,
    longitude: 78.4867,
    isFavorite: true,
  },
  {
    id: 'london-gb',
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    isFavorite: true,
  },
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    country: 'Japan',
    admin1: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    isFavorite: true,
  },
  {
    id: 'new-york-us',
    name: 'New York',
    country: 'United States',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    isFavorite: true,
  },
];

export function getWeatherCondition(code: number, isDay = true): WeatherConditionInfo {
  // WMO Code interpretation
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Sunny' : 'Clear Night',
        description: 'Clear sky without cloud obstructions',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        bgGradientDay: 'from-sky-500 via-sky-600 to-indigo-800',
        bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-950',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mostly Sunny' : 'Mostly Clear',
        description: 'Mainly clear with sparse high clouds',
        iconName: isDay ? 'SunDim' : 'MoonStar',
        category: 'clear',
        bgGradientDay: 'from-blue-500 via-sky-600 to-indigo-800',
        bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-950',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of sunshine',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'partly-cloudy',
        bgGradientDay: 'from-blue-600 via-cyan-700 to-slate-800',
        bgGradientNight: 'from-slate-900 via-slate-800 to-slate-950',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense cloud cover blocking the sun',
        iconName: 'Cloud',
        category: 'cloudy',
        bgGradientDay: 'from-slate-600 via-slate-700 to-slate-900',
        bgGradientNight: 'from-slate-900 via-zinc-900 to-slate-950',
      };
    case 45:
    case 48:
      return {
        code,
        label: 'Foggy Mist',
        description: 'Reduced horizontal visibility with dense fog',
        iconName: 'CloudFog',
        category: 'fog',
        bgGradientDay: 'from-zinc-500 via-slate-600 to-slate-800',
        bgGradientNight: 'from-zinc-900 via-slate-900 to-black',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: 'Light Drizzle',
        description: 'Fine mist and intermittent gentle drizzle',
        iconName: 'CloudDrizzle',
        category: 'rain',
        bgGradientDay: 'from-slate-600 via-blue-800 to-slate-900',
        bgGradientNight: 'from-slate-950 via-blue-950 to-slate-950',
      };
    case 61:
    case 63:
      return {
        code,
        label: 'Rain Showers',
        description: 'Steady rainfall with wet road conditions',
        iconName: 'CloudRain',
        category: 'rain',
        bgGradientDay: 'from-blue-700 via-slate-800 to-indigo-950',
        bgGradientNight: 'from-slate-950 via-slate-900 to-black',
      };
    case 65:
    case 82:
      return {
        code,
        label: 'Heavy Rainstorm',
        description: 'Torrential downpour and rapid precipitation',
        iconName: 'CloudRainWind',
        category: 'rain',
        bgGradientDay: 'from-slate-800 via-blue-950 to-slate-950',
        bgGradientNight: 'from-black via-slate-950 to-zinc-950',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Freezing droplets with icy surfaces risk',
        iconName: 'CloudHail',
        category: 'rain',
        bgGradientDay: 'from-slate-700 via-cyan-900 to-slate-950',
        bgGradientNight: 'from-slate-950 via-cyan-950 to-black',
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Fall',
        description: 'Accumulating cold snowflakes and flurries',
        iconName: 'CloudSnow',
        category: 'snow',
        bgGradientDay: 'from-slate-500 via-blue-700 to-slate-900',
        bgGradientNight: 'from-slate-900 via-blue-950 to-slate-950',
      };
    case 80:
    case 81:
      return {
        code,
        label: 'Passing Showers',
        description: 'Periodic rain bursts with breaks in between',
        iconName: 'CloudRain',
        category: 'rain',
        bgGradientDay: 'from-blue-600 via-slate-700 to-slate-900',
        bgGradientNight: 'from-slate-900 via-blue-950 to-slate-950',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Electrical storm with lightning and heavy rain',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
        bgGradientDay: 'from-indigo-900 via-purple-950 to-slate-950',
        bgGradientNight: 'from-zinc-950 via-purple-950 to-black',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm',
        description: 'Intense thunderstorm with hail hazard',
        iconName: 'CloudLightning',
        category: 'thunderstorm',
        bgGradientDay: 'from-violet-950 via-indigo-950 to-slate-950',
        bgGradientNight: 'from-black via-purple-950 to-slate-950',
      };
    default:
      return {
        code,
        label: isDay ? 'Sunny Intervals' : 'Fair Sky',
        description: 'Moderate conditions with variable cloudiness',
        iconName: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        bgGradientDay: 'from-sky-600 via-blue-700 to-indigo-900',
        bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-950',
      };
  }
}

// Convert temperature
export function formatTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

// Convert wind speed
export function formatWind(kmh: number, unit: 'kmh' | 'mph' | 'ms'): string {
  if (unit === 'mph') {
    return `${(kmh * 0.621371).toFixed(1)} mph`;
  }
  if (unit === 'ms') {
    return `${(kmh / 3.6).toFixed(1)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

// Convert pressure
export function formatPressure(hPa: number, unit: 'hPa' | 'inHg'): string {
  if (unit === 'inHg') {
    return `${(hPa * 0.02953).toFixed(2)} inHg`;
  }
  return `${Math.round(hPa)} hPa`;
}

// Convert precipitation
export function formatPrecip(mm: number, unit: 'mm' | 'inch'): string {
  if (unit === 'inch') {
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

// Get UV index category description
export function getUVInfo(uvIndex: number): { label: string; color: string } {
  if (uvIndex <= 2) return { label: 'Low', color: 'text-emerald-400' };
  if (uvIndex <= 5) return { label: 'Moderate', color: 'text-amber-400' };
  if (uvIndex <= 7) return { label: 'High', color: 'text-orange-400' };
  if (uvIndex <= 10) return { label: 'Very High', color: 'text-red-400' };
  return { label: 'Extreme', color: 'text-purple-400' };
}

// Open-Meteo Weather Fetching (High Accuracy, No API Key Required)
export async function fetchWeatherFromOpenMeteo(
  latitude: number,
  longitude: number,
  location: CityLocation
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const data = await response.json();

  const current: CurrentWeather = {
    temp: data.current.temperature_2m ?? 24,
    feelsLike: data.current.apparent_temperature ?? data.current.temperature_2m ?? 24,
    humidity: data.current.relative_humidity_2m ?? 60,
    windSpeed: data.current.wind_speed_10m ?? 10,
    windDirection: data.current.wind_direction_10m ?? 180,
    pressure: data.current.surface_pressure ?? 1013,
    weatherCode: data.current.weather_code ?? 0,
    uvIndex: data.daily?.uv_index_max?.[0] ?? 4,
    visibility: 10,
    cloudCover: data.current.cloud_cover ?? 10,
    isDay: Boolean(data.current.is_day ?? 1),
    time: data.current.time ?? new Date().toISOString(),
  };

  // Hourly parsing (next 24 hours starting from current hour)
  const hourlyTimes: string[] = data.hourly?.time || [];
  const currentIsoHour = (data.current?.time || new Date().toISOString()).slice(0, 13);
  let startIndex = hourlyTimes.findIndex((t) => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;

  const next24 = hourlyTimes.slice(startIndex, startIndex + 24);
  const hourly: HourlyForecast[] = next24.map((time, idx) => {
    const i = startIndex + idx;
    return {
      time,
      temp: data.hourly?.temperature_2m?.[i] ?? current.temp,
      feelsLike: data.hourly?.apparent_temperature?.[i] ?? current.temp,
      humidity: data.hourly?.relative_humidity_2m?.[i] ?? current.humidity,
      pop: data.hourly?.precipitation_probability?.[i] ?? 0,
      weatherCode: data.hourly?.weather_code?.[i] ?? 0,
      windSpeed: data.hourly?.wind_speed_10m?.[i] ?? current.windSpeed,
      isDay: Boolean(data.hourly?.is_day?.[i] ?? true),
    };
  });

  // Daily parsing (7 days)
  const days: string[] = data.daily?.time || [];
  const daily: DailyForecast[] = days.map((dateStr, idx) => {
    const dateObj = new Date(dateStr);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const isToday = idx === 0;
    const dayName = isToday ? 'Today' : dayNames[dateObj.getDay()];

    return {
      date: dateStr,
      dayName,
      tempMax: data.daily?.temperature_2m_max?.[idx] ?? current.temp + 4,
      tempMin: data.daily?.temperature_2m_min?.[idx] ?? current.temp - 4,
      weatherCode: data.daily?.weather_code?.[idx] ?? current.weatherCode,
      precipitationProbability: data.daily?.precipitation_probability_max?.[idx] ?? 10,
      precipitationSum: data.daily?.precipitation_sum?.[idx] ?? 0,
      windSpeedMax: data.daily?.wind_speed_10m_max?.[idx] ?? current.windSpeed,
      sunrise: data.daily?.sunrise?.[idx] || '06:00',
      sunset: data.daily?.sunset?.[idx] || '18:30',
      uvIndexMax: data.daily?.uv_index_max?.[idx] ?? 5,
    };
  });

  return {
    location,
    current,
    hourly,
    daily,
    lastUpdated: new Date().toISOString(),
  };
}

// Geocoding Search via Open-Meteo Global Geocoding API
export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      id: `${item.id || item.name}-${item.latitude.toFixed(2)}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

// Reverse Geocoding from GPS coords
export async function reverseGeocode(latitude: number, longitude: number): Promise<CityLocation> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
      { headers: { 'User-Agent': 'SkyCastWeatherApp/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const name =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        data.address?.county ||
        'Current Location';
      const country = data.address?.country || '';
      const admin1 = data.address?.state || '';

      return {
        id: `gps-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
        name,
        country,
        admin1,
        latitude,
        longitude,
      };
    }
  } catch (e) {
    console.warn('Reverse geocode failed, using coordinates', e);
  }

  return {
    id: `gps-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
    name: 'Current Location',
    country: '',
    latitude,
    longitude,
  };
}

// Fetch preview weather for saved cities cards
export async function fetchSavedCityPreview(city: SavedCity): Promise<{
  temp: number;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  time: string;
} | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    return {
      temp: data.current?.temperature_2m ?? 24,
      weatherCode: data.current?.weather_code ?? 0,
      tempMax: data.daily?.temperature_2m_max?.[0] ?? 28,
      tempMin: data.daily?.temperature_2m_min?.[0] ?? 20,
      humidity: data.current?.relative_humidity_2m ?? 50,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch {
    return null;
  }
}
