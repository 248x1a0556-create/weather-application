import React, { useState } from 'react';
import { WeatherData, WeatherSettings, DailyForecast } from '../types/weather';
import {
  formatTemp,
  formatWind,
  formatPrecip,
  getWeatherCondition,
} from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';
import {
  Calendar,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sunset,
  ShieldAlert,
} from 'lucide-react';

interface ForecastScreenProps {
  weather: WeatherData;
  settings: WeatherSettings;
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({ weather, settings }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const selectedDay: DailyForecast = weather.daily[selectedDayIndex] || weather.daily[0];
  const dayCondition = getWeatherCondition(selectedDay.weatherCode, true);

  // Find min and max across all 7 days for relative temperature range bars
  const overallMin = Math.min(...weather.daily.map((d) => d.tempMin));
  const overallMax = Math.max(...weather.daily.map((d) => d.tempMax));
  const tempSpread = Math.max(overallMax - overallMin, 1);

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 text-white">
      {/* Header Banner */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar size={20} className="text-sky-400" />
            7-Day Extended Forecast
          </h2>
          <p className="text-xs text-white/70">
            {weather.location.name}, {weather.location.country}
          </p>
        </div>

        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/10 text-sky-200 border border-white/10">
          Updated live
        </span>
      </div>

      {/* Selected Day Highlight Card */}
      {selectedDay && (
        <div className="rounded-3xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-sky-300">
                {selectedDay.dayName} · {selectedDay.date}
              </span>
              <h3 className="text-2xl font-bold mt-1 text-white">
                {dayCondition.label}
              </h3>
              <p className="text-xs text-white/75 mt-0.5">
                {dayCondition.description}
              </p>
            </div>
            <WeatherIcon name={dayCondition.iconName} size={48} className="drop-shadow-md" />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 pt-4 border-t border-white/15 text-center">
            <div className="p-2 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/60 block">Min / Max</span>
              <span className="text-xs font-bold text-white">
                {formatTemp(selectedDay.tempMin, settings.tempUnit)} / {formatTemp(selectedDay.tempMax, settings.tempUnit)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/60 block">Precipitation</span>
              <span className="text-xs font-bold text-sky-300 flex items-center justify-center gap-0.5">
                <CloudRain size={12} />
                {selectedDay.precipitationProbability}%
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/60 block">Max Wind</span>
              <span className="text-xs font-bold text-teal-300">
                {formatWind(selectedDay.windSpeedMax, settings.windUnit)}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/60 block">UV Index</span>
              <span className="text-xs font-bold text-amber-300">
                {selectedDay.uvIndexMax} Max
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day List View */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-3 shadow-xl space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-white/70 px-2 block mb-1">
          Daily Breakdown
        </span>

        {weather.daily.map((day, idx) => {
          const condition = getWeatherCondition(day.weatherCode, true);
          const isSelected = selectedDayIndex === idx;
          const isExpanded = expandedIndex === idx;

          // Compute left and width for horizontal temp range bar
          const leftPercent = Math.max(0, ((day.tempMin - overallMin) / tempSpread) * 100);
          const rightPercent = Math.min(100, ((day.tempMax - overallMin) / tempSpread) * 100);
          const barWidth = Math.max(8, rightPercent - leftPercent);

          return (
            <div
              key={day.date}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isSelected
                  ? 'bg-sky-500/20 border-sky-400/40 shadow-lg'
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              {/* Row Summary */}
              <div
                onClick={() => {
                  setSelectedDayIndex(idx);
                  setExpandedIndex(isExpanded ? null : idx);
                }}
                className="p-3 flex items-center justify-between cursor-pointer select-none"
              >
                {/* Day Name & Icon */}
                <div className="flex items-center gap-3 w-32 shrink-0">
                  <WeatherIcon name={condition.iconName} size={24} animate={false} />
                  <div>
                    <span className="text-sm font-bold block text-white">
                      {idx === 0 ? 'Today' : day.dayName}
                    </span>
                    <span className="text-[10px] text-white/60">
                      {day.date.slice(5)}
                    </span>
                  </div>
                </div>

                {/* Rain probability */}
                <div className="w-16 flex items-center gap-1 text-xs text-sky-300 shrink-0">
                  {day.precipitationProbability > 15 ? (
                    <>
                      <CloudRain size={13} />
                      <span className="font-semibold">{day.precipitationProbability}%</span>
                    </>
                  ) : (
                    <span className="text-[11px] text-white/40">Dry</span>
                  )}
                </div>

                {/* Min / Max Range Bar */}
                <div className="flex-1 flex items-center gap-2 max-w-[150px] mx-2">
                  <span className="text-xs text-white/60 font-mono w-8 text-right">
                    {formatTemp(day.tempMin, settings.tempUnit)}
                  </span>

                  <div className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-white font-mono w-8">
                    {formatTemp(day.tempMax, settings.tempUnit)}
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <button
                  type="button"
                  className="text-white/60 hover:text-white p-1"
                  aria-label={isExpanded ? 'Collapse forecast day' : 'Expand forecast day'}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded Details Drawer */}
              {isExpanded && (
                <div className="px-4 pb-3 pt-2 border-t border-white/10 bg-black/20 text-xs text-white/80 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Sunrise size={14} className="text-amber-400" />
                      <span>Sunrise: <strong>{day.sunrise}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sunset size={14} className="text-rose-400" />
                      <span>Sunset: <strong>{day.sunset}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind size={14} className="text-teal-400" />
                      <span>Wind Gusts: <strong>{formatWind(day.windSpeedMax, settings.windUnit)}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CloudRain size={14} className="text-sky-400" />
                      <span>Total Precip: <strong>{formatPrecip(day.precipitationSum, settings.precipUnit)}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
