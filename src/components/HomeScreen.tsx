import React from 'react';
import {
  WeatherData,
  WeatherSettings,
  WeatherConditionInfo,
} from '../types/weather';
import {
  formatTemp,
  formatWind,
  formatPressure,
  getUVInfo,
} from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';
import {
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  Sun,
  Eye,
  CloudRain,
  Compass,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface HomeScreenProps {
  weather: WeatherData;
  settings: WeatherSettings;
  condition: WeatherConditionInfo;
  onRefresh: () => void;
  isRefreshing: boolean;
  onSelectDayForecast: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  weather,
  settings,
  condition,
  onRefresh,
  isRefreshing,
  onSelectDayForecast,
}) => {
  const current = weather.current;
  const todayDaily = weather.daily[0];

  // Format current date e.g. "Thursday, 5 November"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const uvInfo = getUVInfo(current.uvIndex);

  // Calculate sun position percentage (0 to 100) based on sunrise/sunset
  const sunPositionPercent = React.useMemo(() => {
    if (!todayDaily) return 50;
    try {
      const now = new Date();
      const [srH, srM] = todayDaily.sunrise.split(':').map(Number);
      const [ssH, ssM] = todayDaily.sunset.split(':').map(Number);
      const riseMin = srH * 60 + srM;
      const setMin = ssH * 60 + ssM;
      const currentMin = now.getHours() * 60 + now.getMinutes();

      if (currentMin <= riseMin) return 0;
      if (currentMin >= setMin) return 100;
      return Math.round(((currentMin - riseMin) / (setMin - riseMin)) * 100);
    } catch {
      return 50;
    }
  }, [todayDaily]);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 text-white">
      {/* Hero Current Weather Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl transition-all">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        {/* Top Location & Refresh */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                {weather.location.name}
              </h1>
              {weather.location.country && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                  {weather.location.countryCode || weather.location.country}
                </span>
              )}
            </div>
            <p className="text-xs text-white/75 mt-0.5">
              {formattedDate} {weather.location.admin1 ? `· ${weather.location.admin1}` : ''}
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white/90"
            title="Refresh live weather"
            aria-label="Refresh weather data"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Temperature & Icon Hero */}
        <div className="my-6 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white drop-shadow-md">
                {formatTemp(current.temp, settings.tempUnit)}
              </span>
            </div>
            <p className="text-sm font-medium text-sky-200 mt-1 flex items-center gap-1.5">
              <span>{condition.label}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80">
                Feels like {formatTemp(current.feelsLike, settings.tempUnit)}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center">
            <WeatherIcon name={condition.iconName} size={68} className="drop-shadow-lg" />
            <span className="text-[11px] text-white/75 mt-1 capitalize text-center max-w-[100px]">
              {condition.description}
            </span>
          </div>
        </div>

        {/* Min / Max & Rain probability pill */}
        <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-300">
              <ArrowDown size={14} />
              {todayDaily ? formatTemp(todayDaily.tempMin, settings.tempUnit) : '--'}
            </span>
            <span className="inline-flex items-center gap-1 text-rose-300">
              <ArrowUp size={14} />
              {todayDaily ? formatTemp(todayDaily.tempMax, settings.tempUnit) : '--'}
            </span>
          </div>

          {todayDaily && (
            <div className="flex items-center gap-1.5 text-sky-200">
              <CloudRain size={14} />
              <span>{todayDaily.precipitationProbability}% precip</span>
            </div>
          )}
        </div>
      </div>

      {/* 24-Hour Hourly Forecast Ribbon */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-white/70">
            24-Hour Hourly Forecast
          </span>
          <button
            onClick={onSelectDayForecast}
            className="text-xs text-sky-300 hover:text-sky-200 transition-colors font-medium"
          >
            7-Day details →
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {weather.hourly.slice(0, 24).map((hour, idx) => {
            const timeDate = new Date(hour.time);
            const timeLabel =
              idx === 0
                ? 'Now'
                : timeDate.toLocaleTimeString([], { hour: 'numeric', hour12: true });

            return (
              <div
                key={hour.time}
                className={`flex flex-col items-center justify-between min-w-[70px] py-3 px-2 rounded-2xl transition-all border shrink-0 ${
                  idx === 0
                    ? 'bg-sky-500/25 border-sky-400/50 shadow-md shadow-sky-500/20'
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-[11px] font-medium text-white/80">{timeLabel}</span>
                <div className="my-2">
                  <WeatherIcon
                    name={hour.isDay ? 'Sun' : 'Moon'}
                    size={22}
                    animate={false}
                  />
                </div>
                <span className="text-sm font-bold text-white">
                  {formatTemp(hour.temp, settings.tempUnit)}
                </span>
                <span className="text-[10px] text-sky-300 mt-1 flex items-center gap-0.5">
                  <Droplets size={10} />
                  {hour.pop}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Atmospheric Metrics Grid (2 columns) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span className="font-semibold uppercase tracking-wider">Humidity</span>
            <Droplets size={16} className="text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {current.humidity}%
          </div>
          <p className="mt-1 text-[11px] text-white/60">
            {current.humidity > 65
              ? 'High humidity, feels warm'
              : current.humidity < 35
              ? 'Dry air conditions'
              : 'Comfortable dew point'}
          </p>
        </div>

        {/* Wind Speed */}
        <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span className="font-semibold uppercase tracking-wider">Wind Speed</span>
            <Wind size={16} className="text-teal-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {formatWind(current.windSpeed, settings.windUnit)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-white/60">
            <Compass size={12} className="text-teal-300" />
            <span>Angle {current.windDirection}°</span>
          </div>
        </div>

        {/* Pressure */}
        <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span className="font-semibold uppercase tracking-wider">Pressure</span>
            <Gauge size={16} className="text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {formatPressure(current.pressure, settings.pressureUnit)}
          </div>
          <p className="mt-1 text-[11px] text-white/60">
            {current.pressure > 1015
              ? 'High pressure · Fair weather'
              : current.pressure < 1005
              ? 'Low pressure · Rain chance'
              : 'Standard atmospheric'}
          </p>
        </div>

        {/* UV Index */}
        <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-white/70 text-xs">
            <span className="font-semibold uppercase tracking-wider">UV Index</span>
            <Sun size={16} className="text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white flex items-center gap-2">
            <span>{current.uvIndex}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 ${uvInfo.color}`}>
              {uvInfo.label}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-white/60">
            {current.uvIndex >= 6 ? 'Sun protection advised' : 'Low risk of sun harm'}
          </p>
        </div>
      </div>

      {/* Sunrise & Sunset Arc Graphic */}
      {todayDaily && (
        <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs text-white/70 mb-3">
            <span className="font-semibold uppercase tracking-wider">Daylight & Sun Position</span>
            <span className="text-[11px] text-sky-300 font-medium">{sunPositionPercent}% day passed</span>
          </div>

          {/* Visual Arc Track */}
          <div className="relative w-full h-14 flex items-center justify-center">
            {/* SVG Arc */}
            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
              <path
                d="M 15 50 Q 100 -5 185 50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
              <path
                d="M 15 50 Q 100 -5 185 50"
                fill="none"
                stroke="url(#sunGradient)"
                strokeWidth="3"
                strokeDasharray="200"
                strokeDashoffset={200 - (sunPositionPercent / 100) * 200}
              />
              <defs>
                <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing Sun Position Indicator */}
            <div
              className="absolute w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-lg shadow-amber-400/80 transition-all duration-700 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${Math.min(95, Math.max(5, sunPositionPercent))}%`,
                top: `${Math.max(10, 50 - Math.sin((sunPositionPercent / 100) * Math.PI) * 40)}px`,
              }}
            />
          </div>

          {/* Sunrise and Sunset times */}
          <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/80">
              <Sunrise size={16} className="text-amber-400" />
              <div>
                <span className="block text-[10px] text-white/50">Sunrise</span>
                <span className="font-bold">{todayDaily.sunrise}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-white/80">
              <div className="text-right">
                <span className="block text-[10px] text-white/50">Sunset</span>
                <span className="font-bold">{todayDaily.sunset}</span>
              </div>
              <Sunset size={16} className="text-rose-400" />
            </div>
          </div>
        </div>
      )}

      {/* Smart Weather Tip */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 border border-sky-400/30 flex items-center gap-3">
        <Sparkles size={20} className="text-sky-300 shrink-0" />
        <div className="text-xs text-white/90">
          <span className="font-bold text-sky-200">SkyCast Smart Insight: </span>
          {current.weatherCode >= 61 && current.weatherCode <= 65
            ? 'Active rainfall predicted. Carry a compact umbrella and exercise driving caution.'
            : current.temp > 32
            ? 'Warm conditions today. Ensure hydration and avoid prolonged direct sun exposure.'
            : current.temp < 10
            ? 'Chilly temperatures expected. Dress in layered outerwear.'
            : 'Excellent atmospheric conditions for outdoor activities and travel!'}
        </div>
      </div>
    </div>
  );
};
