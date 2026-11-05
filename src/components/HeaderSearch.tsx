import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Bookmark, Check } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { searchCities } from '../services/weatherService';

interface HeaderSearchProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onUseGeolocation: () => void;
  isLocating: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  currentCity,
  onSelectCity,
  onUseGeolocation,
  isLocating,
  isFavorite,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchCities(query.trim());
        setResults(data);
        setIsOpen(true);
      } catch (e) {
        console.error('Search failed', e);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-40 px-4 pt-3 pb-2" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {/* Search Input Box */}
        <div className="relative flex-1 flex items-center bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/15 px-3 py-2 text-sm text-white shadow-lg transition-all focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20">
          <Search size={18} className="text-sky-400 shrink-0 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={`Search city (e.g. ${currentCity.name}, Tokyo)...`}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            aria-label="Search city weather"
          />

          {isLoading ? (
            <Loader2 size={16} className="text-sky-400 animate-spin shrink-0 ml-1" />
          ) : query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="text-slate-400 hover:text-white shrink-0 p-0.5 rounded-full"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        {/* GPS Locate Me button */}
        <button
          onClick={onUseGeolocation}
          disabled={isLocating}
          title="Use current GPS location"
          className="p-2.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/15 text-slate-200 hover:text-sky-300 hover:border-sky-400/50 transition-colors shadow-lg active:scale-95 disabled:opacity-50 shrink-0"
          aria-label="Get current location weather"
        >
          {isLocating ? (
            <Loader2 size={18} className="text-sky-400 animate-spin" />
          ) : (
            <MapPin size={18} className="text-sky-400" />
          )}
        </button>

        {/* Favorite Bookmark button */}
        <button
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from saved cities' : 'Save to favourites'}
          className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all shadow-lg active:scale-95 shrink-0 ${
            isFavorite
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-400 hover:bg-amber-500/30'
              : 'bg-slate-900/60 border-white/15 text-slate-300 hover:text-amber-300 hover:border-amber-400/30'
          }`}
          aria-label="Toggle favourite city"
        >
          <Bookmark size={18} className={isFavorite ? 'fill-amber-400 text-amber-400' : ''} />
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-4 right-4 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
          {isLoading && results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin text-sky-400" />
              Searching locations...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-white/5 py-1">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-sky-500/15 flex items-center justify-between group transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white group-hover:text-sky-300">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {[item.admin1, item.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 group-hover:text-sky-400">
                    {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching cities found for &quot;{query}&quot;. Check spelling or try a major nearby hub.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
