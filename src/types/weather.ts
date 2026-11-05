export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';
export type PressureUnit = 'hPa' | 'inHg';
export type PrecipitationUnit = 'mm' | 'inch';
export type AppTheme = 'weather' | 'dark' | 'light' | 'midnight';

export interface WeatherSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  pressureUnit: PressureUnit;
  precipUnit: PrecipitationUnit;
  theme: AppTheme;
  apiProvider: 'open-meteo' | 'openweathermap';
  openWeatherMapKey: string;
}

export interface CityLocation {
  id: number | string;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface HourlyForecast {
  time: string; // ISO string
  temp: number; // in Celsius
  feelsLike: number;
  humidity: number;
  pop: number; // probability of precipitation 0-100%
  weatherCode: number;
  windSpeed: number; // in km/h
  isDay: boolean;
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitationSum: number; // mm
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number; // km/h
  windDirection: number;
  pressure: number; // hPa
  weatherCode: number;
  uvIndex: number;
  visibility: number; // km
  cloudCover: number; // %
  isDay: boolean;
  time: string;
  dewPoint?: number;
}

export interface WeatherData {
  location: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastUpdated: string;
}

export interface SavedCity {
  id: string;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  isFavorite?: boolean;
  cachedWeather?: {
    temp: number;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    humidity: number;
    time: string;
  };
}

export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  category: 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
  bgGradientDay: string;
  bgGradientNight: string;
}
