import React, { useState } from 'react';
import { SavedCity, WeatherSettings, CityLocation } from '../types/weather';
import {
  formatTemp,
  getWeatherCondition,
  searchCities,
} from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';
import {
  Bookmark,
  Plus,
  Trash2,
  MapPin,
  Search,
  Loader2,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SavedCitiesScreenProps {
  savedCities: SavedCity[];
  currentLocation: CityLocation;
  settings: WeatherSettings;
  onSelectCity: (city: CityLocation) => void;
  onRemoveCity: (cityId: string) => void;
  onAddCity: (city: CityLocation) => void;
}

export const SavedCitiesScreen: React.FC<SavedCitiesScreenProps> = ({
  savedCities,
  currentLocation,
  settings,
  onSelectCity,
  onRemoveCity,
  onAddCity,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await searchCities(val);
      setSearchResults(res);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = (city: CityLocation) => {
    onAddCity(city);
    setShowAddModal(false);
    setSearchQuery('');
    setSearchResults([]);
    setToastMessage(`Added ${city.name} to favourites`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 text-white">
      {/* Screen Title & Add Button */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bookmark size={20} className="text-sky-400" />
            Saved Favourite Cities
          </h2>
          <p className="text-xs text-white/70">
            {savedCities.length} locations tracked · Tap to view full forecast
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
        >
          <Plus size={16} />
          Add City
        </button>
      </div>

      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200 flex items-center gap-2">
          <Check size={14} className="text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* KHIT Campus Highlight Notice */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
        <Sparkles size={18} className="text-amber-400 shrink-0" />
        <div className="text-xs text-white/80">
          <span className="font-bold text-amber-300">KHIT Guntur Campus: </span>
          Preloaded as the primary demonstration location for your Flutter group project submission.
        </div>
      </div>

      {/* Saved Cities List */}
      {savedCities.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/10">
          <MapPin size={40} className="mx-auto text-slate-500 mb-2" />
          <h3 className="text-base font-bold text-white">No Saved Cities</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Search and add favourite cities worldwide to track quick conditions and switch between locations seamlessly.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold"
          >
            Add Your First City
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedCities.map((city) => {
            const isCurrent =
              currentLocation.name.toLowerCase() === city.name.toLowerCase() ||
              (Math.abs(currentLocation.latitude - city.latitude) < 0.1 &&
                Math.abs(currentLocation.longitude - city.longitude) < 0.1);

            const cached = city.cachedWeather;
            const condition = cached
              ? getWeatherCondition(cached.weatherCode, true)
              : null;

            return (
              <div
                key={city.id}
                onClick={() => {
                  onSelectCity({
                    id: city.id,
                    name: city.name,
                    country: city.country,
                    admin1: city.admin1,
                    latitude: city.latitude,
                    longitude: city.longitude,
                  });
                }}
                className={`relative group rounded-2xl p-4 transition-all cursor-pointer border select-none overflow-hidden ${
                  isCurrent
                    ? 'bg-sky-500/20 border-sky-400/50 shadow-xl shadow-sky-500/10'
                    : 'bg-slate-900/50 hover:bg-slate-900/80 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                        {city.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500 text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {condition && cached && (
                    <div className="flex items-center gap-2">
                      <WeatherIcon name={condition.iconName} size={30} animate={false} />
                      <span className="text-2xl font-bold text-white">
                        {formatTemp(cached.temp, settings.tempUnit)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sub info & Actions */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <div className="flex items-center gap-3">
                    {cached ? (
                      <>
                        <span className="text-sky-200">{condition?.label}</span>
                        <span>·</span>
                        <span>
                          H: {formatTemp(cached.tempMax, settings.tempUnit)} L:{' '}
                          {formatTemp(cached.tempMin, settings.tempUnit)}
                        </span>
                      </>
                    ) : (
                      <span className="text-white/50 text-[11px]">Tap to inspect live forecast</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCity(city.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/15 transition-colors"
                      title="Remove saved city"
                      aria-label={`Remove ${city.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Sheet for Adding City */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-sky-400" />
                Add Favourite City
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-sky-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search city name (e.g. Guntur, Paris, Sydney)..."
                className="w-full bg-slate-800 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Results */}
            <div className="max-h-60 overflow-y-auto divide-y divide-white/10">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-sky-400" />
                  Searching global database...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleAdd(city)}
                    className="w-full text-left p-3 hover:bg-sky-500/15 flex items-center justify-between group transition-colors rounded-lg"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-sky-300">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                    <span className="text-xs text-sky-400 font-semibold flex items-center gap-1 group-hover:underline">
                      <Plus size={14} /> Add
                    </span>
                  </button>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No cities found. Try another search query.
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  Type at least 2 characters to search cities worldwide.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
