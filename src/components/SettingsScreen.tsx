import React, { useState } from 'react';
import { WeatherSettings, TemperatureUnit, WindSpeedUnit, PressureUnit, AppTheme } from '../types/weather';
import {
  Settings,
  Thermometer,
  Wind,
  Gauge,
  Moon,
  Sun,
  Palette,
  CloudLightning,
  Key,
  GraduationCap,
  Code,
  FileDown,
  RotateCcw,
  Check,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: WeatherSettings;
  onUpdateSettings: (newSettings: Partial<WeatherSettings>) => void;
  onResetCities: () => void;
  onOpenFlutterModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetCities,
  onOpenFlutterModal,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(settings.openWeatherMapKey);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveApiKey = () => {
    onUpdateSettings({ openWeatherMapKey: apiKeyInput.trim() });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5 text-white">
      {/* Title */}
      <div className="pt-2">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings size={20} className="text-sky-400" />
          Settings & Preferences
        </h2>
        <p className="text-xs text-white/70">
          Configure units, appearance, APIs, and KHIT project exports
        </p>
      </div>

      {/* Temperature Units */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
          <Thermometer size={16} />
          Temperature Unit
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings({ tempUnit: 'celsius' })}
            className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
              settings.tempUnit === 'celsius'
                ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span>Celsius (°C)</span>
            {settings.tempUnit === 'celsius' && <Check size={16} className="text-sky-400" />}
          </button>

          <button
            onClick={() => onUpdateSettings({ tempUnit: 'fahrenheit' })}
            className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
              settings.tempUnit === 'fahrenheit'
                ? 'bg-sky-500/25 border-sky-400 text-white shadow-md'
                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span>Fahrenheit (°F)</span>
            {settings.tempUnit === 'fahrenheit' && <Check size={16} className="text-sky-400" />}
          </button>
        </div>
      </div>

      {/* Wind Speed Units */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
          <Wind size={16} />
          Wind Speed Unit
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'kmh' as WindSpeedUnit, label: 'km/h' },
            { id: 'mph' as WindSpeedUnit, label: 'mph' },
            { id: 'ms' as WindSpeedUnit, label: 'm/s' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onUpdateSettings({ windUnit: item.id })}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                settings.windUnit === item.id
                  ? 'bg-teal-500/25 border-teal-400 text-white shadow-md'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Atmospheric Pressure Unit */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
          <Gauge size={16} />
          Atmospheric Pressure Unit
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'hPa' as PressureUnit, label: 'Hectopascal (hPa / mbar)' },
            { id: 'inHg' as PressureUnit, label: 'Inches of Mercury (inHg)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onUpdateSettings({ pressureUnit: item.id })}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                settings.pressureUnit === item.id
                  ? 'bg-amber-500/25 border-amber-400 text-white shadow-md'
                  : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
          <Palette size={16} />
          Theme & Visual Appearance
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'weather' as AppTheme, label: 'Adaptive Weather', icon: CloudLightning },
            { id: 'dark' as AppTheme, label: 'Dark Mode', icon: Moon },
            { id: 'light' as AppTheme, label: 'Light Mode', icon: Sun },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = settings.theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onUpdateSettings({ theme: item.id })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-indigo-500/25 border-indigo-400 text-white shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon size={18} className={isSelected ? 'text-indigo-300' : 'text-slate-400'} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Public Weather API Integration Option */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
            <Key size={16} />
            Weather API Integration
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            Live Global API
          </span>
        </div>

        <p className="text-xs text-white/70">
          Currently using high-precision <strong>Open-Meteo Public API</strong> (no API key required, 100% global coverage, free for educational use).
        </p>

        <div className="pt-2 border-t border-white/10 space-y-2">
          <label className="text-[11px] text-white/60 block">
            Optional: OpenWeatherMap API Key
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste OpenWeatherMap key (optional)..."
              className="flex-1 bg-slate-800/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shrink-0"
            >
              Save Key
            </button>
          </div>
          {isSavedNotice && (
            <p className="text-[11px] text-emerald-300 flex items-center gap-1">
              <Check size={12} /> API configuration saved
            </p>
          )}
        </div>
      </div>

      {/* Flutter Source Code & Project Downloader Trigger */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-purple-600/30 border border-sky-400/40 p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code size={20} className="text-sky-300" />
            <h3 className="text-base font-bold text-white">
              KHIT Flutter Project Bundle
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-400 text-slate-950">
            Ready to Run
          </span>
        </div>

        <p className="text-xs text-white/80">
          Inspect full Flutter & Dart source files (models, services, providers, screens, widgets, tests, README) and download the ready-to-run <strong>skycast.zip</strong> project for Android Studio.
        </p>

        <button
          onClick={onOpenFlutterModal}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-98 transition-all text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25"
        >
          <FileDown size={16} />
          Open Flutter Source Code & Project Downloader
        </button>
      </div>

      {/* Reset & Clear Cache */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">Reset Default Cities</span>
          <span className="text-[11px] text-white/60">Restore Guntur, Hyderabad, London, Tokyo, NY</span>
        </div>
        <button
          onClick={onResetCities}
          className="px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs text-white flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* About Application & KHIT Group Project */}
      <div className="rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 p-4 shadow-xl space-y-3 text-xs text-white/80">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <GraduationCap size={18} className="text-sky-400" />
          About SkyCast · KHIT Project
        </div>

        <div className="space-y-1.5 text-[11px] text-white/70">
          <div className="flex justify-between">
            <span>Project Name:</span>
            <span className="font-semibold text-white">SkyCast – Smart Weather App</span>
          </div>
          <div className="flex justify-between">
            <span>Institution:</span>
            <span className="font-semibold text-white">KHIT Guntur (AP, India)</span>
          </div>
          <div className="flex justify-between">
            <span>Technology Stack:</span>
            <span className="font-semibold text-white">Flutter, Dart, Provider, REST APIs</span>
          </div>
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="font-mono text-sky-300">1.0.0+1 (Release APK Ready)</span>
          </div>
          <div className="flex justify-between">
            <span>Specification Status:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck size={12} /> 100% Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
