import React, { useState, useEffect, useCallback } from 'react';
import {
  WeatherData,
  WeatherSettings,
  CityLocation,
  SavedCity,
} from './types/weather';
import {
  DEFAULT_SETTINGS,
  INITIAL_SAVED_CITIES,
  fetchWeatherFromOpenMeteo,
  getWeatherCondition,
  reverseGeocode,
  fetchSavedCityPreview,
} from './services/weatherService';
import { WeatherBackground } from './components/WeatherBackground';
import { PhoneFrame } from './components/PhoneFrame';
import { BottomNavBar, ScreenTab } from './components/BottomNavBar';
import { HeaderSearch } from './components/HeaderSearch';
import { HomeScreen } from './components/HomeScreen';
import { ForecastScreen } from './components/ForecastScreen';
import { SavedCitiesScreen } from './components/SavedCitiesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { FlutterProjectModal } from './components/FlutterProjectModal';
import {
  Smartphone,
  Monitor,
  Code,
  Download,
  CloudSun,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEYS = {
  SETTINGS: 'skycast_settings_v1',
  SAVED_CITIES: 'skycast_saved_cities_v1',
  LAST_LOCATION: 'skycast_last_location_v1',
  PHONE_VIEW: 'skycast_phone_view_v1',
};

// Default KHIT Campus location: Guntur, Andhra Pradesh, India
const DEFAULT_LOCATION: CityLocation = {
  id: 'guntur-khit',
  name: 'Guntur',
  country: 'India',
  admin1: 'Andhra Pradesh',
  latitude: 16.3067,
  longitude: 80.4365,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [isPhoneView, setIsPhoneView] = useState<boolean>(true);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Saved Cities
  const [savedCities, setSavedCities] = useState<SavedCity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_CITIES);
      return saved ? JSON.parse(saved) : INITIAL_SAVED_CITIES;
    } catch {
      return INITIAL_SAVED_CITIES;
    }
  });

  // Current Location
  const [currentLocation, setCurrentLocation] = useState<CityLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  // Weather data
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<WeatherSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save settings', e);
      }
      return updated;
    });
  };

  // Save saved cities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_CITIES, JSON.stringify(savedCities));
    } catch (e) {
      console.error('Failed to save saved cities', e);
    }
  }, [savedCities]);

  // Load weather for location
  const loadWeatherData = useCallback(
    async (location: CityLocation, showLoader = true) => {
      if (showLoader) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage(null);

      try {
        const data = await fetchWeatherFromOpenMeteo(
          location.latitude,
          location.longitude,
          location
        );
        setWeather(data);
        setCurrentLocation(location);
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(location));
        } catch {
          // ignore
        }
      } catch (err: any) {
        console.error('Weather load error:', err);
        setErrorMessage(
          err?.message || 'Could not connect to weather service. Please check your network and retry.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, []);

  // Update preview weather for saved cities in background
  useEffect(() => {
    let isCancelled = false;
    async function updatePreviews() {
      const updated = await Promise.all(
        savedCities.map(async (city) => {
          if (city.cachedWeather && Date.now() - new Date(city.cachedWeather.time).getTime() < 300000) {
            return city;
          }
          const preview = await fetchSavedCityPreview(city);
          if (preview) {
            return { ...city, cachedWeather: preview };
          }
          return city;
        })
      );
      if (!isCancelled) {
        setSavedCities(updated);
      }
    }

    if (savedCities.length > 0) {
      updatePreviews();
    }

    return () => {
      isCancelled = true;
    };
  }, [savedCities.length]);

  // Check if current location is favorite
  const isCurrentFavorite = savedCities.some(
    (c) =>
      c.name.toLowerCase() === currentLocation.name.toLowerCase() ||
      (Math.abs(c.latitude - currentLocation.latitude) < 0.1 &&
        Math.abs(c.longitude - currentLocation.longitude) < 0.1)
  );

  const toggleFavorite = () => {
    if (isCurrentFavorite) {
      setSavedCities((prev) =>
        prev.filter((c) => c.name.toLowerCase() !== currentLocation.name.toLowerCase())
      );
    } else {
      const newSaved: SavedCity = {
        id: `${currentLocation.name.toLowerCase()}-${Date.now()}`,
        name: currentLocation.name,
        country: currentLocation.country,
        admin1: currentLocation.admin1,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        isFavorite: true,
        cachedWeather: weather
          ? {
              temp: weather.current.temp,
              weatherCode: weather.current.weatherCode,
              tempMax: weather.daily[0]?.tempMax ?? weather.current.temp + 4,
              tempMin: weather.daily[0]?.tempMin ?? weather.current.temp - 4,
              humidity: weather.current.humidity,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : undefined,
      };
      setSavedCities((prev) => [newSaved, ...prev]);
    }
  };

  const handleSelectCity = (city: CityLocation) => {
    loadWeatherData(city);
    setActiveTab('home');
  };

  const handleRemoveSavedCity = (cityId: string) => {
    setSavedCities((prev) => prev.filter((c) => c.id !== cityId));
  };

  const handleAddSavedCity = (city: CityLocation) => {
    if (!savedCities.some((c) => c.name.toLowerCase() === city.name.toLowerCase())) {
      const newCity: SavedCity = {
        id: `${city.name.toLowerCase()}-${Date.now()}`,
        name: city.name,
        country: city.country,
        admin1: city.admin1,
        latitude: city.latitude,
        longitude: city.longitude,
        isFavorite: true,
      };
      setSavedCities((prev) => [newCity, ...prev]);
    }
  };

  const handleResetCities = () => {
    setSavedCities(INITIAL_SAVED_CITIES);
  };

  // Device Geolocation GPS handler
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocode(latitude, longitude);
          loadWeatherData(loc);
        } catch {
          loadWeatherData({
            id: `gps-${latitude.toFixed(2)}-${longitude.toFixed(2)}`,
            name: 'Current Location',
            country: '',
            latitude,
            longitude,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        alert('Could not retrieve current location. Please verify location permissions.');
      },
      { timeout: 8000 }
    );
  };

  // Current weather condition calculation
  const condition = weather
    ? getWeatherCondition(weather.current.weatherCode, weather.current.isDay)
    : getWeatherCondition(0, true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* Top Application Bar with Controls & Project Downloader */}
      <header className="relative z-30 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
              <CloudSun size={19} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                SkyCast
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-sky-500/20 text-sky-400 border border-sky-400/30">
                  KHIT
                </span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-slate-400">
            <span>Group Project</span>
            <span>·</span>
            <span>Guntur Campus</span>
          </div>
        </div>

        {/* View Mode Toggle & Flutter Code Downloader Button */}
        <div className="flex items-center gap-2">
          {/* Frame View Toggle */}
          <button
            onClick={() => setIsPhoneView(!isPhoneView)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold border border-white/10 transition-colors shadow-sm"
            title="Toggle between Android phone frame and wide desktop view"
          >
            {isPhoneView ? (
              <>
                <Monitor size={14} className="text-sky-400" />
                <span className="hidden sm:inline">Expanded View</span>
              </>
            ) : (
              <>
                <Smartphone size={14} className="text-sky-400" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>

          {/* Flutter Code Explorer & Zip Button */}
          <button
            onClick={() => setIsFlutterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 active:scale-95 transition-all"
          >
            <Code size={14} />
            <span>Flutter Code (.zip)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start relative">
        <PhoneFrame isPhoneView={isPhoneView} onToggleView={() => setIsPhoneView(!isPhoneView)}>
          {/* Weather Animated Ambient Background */}
          <WeatherBackground
            condition={condition}
            isDay={weather ? weather.current.isDay : true}
            theme={settings.theme}
          />

          {/* Search Header Bar */}
          <HeaderSearch
            currentCity={currentLocation}
            onSelectCity={handleSelectCity}
            onUseGeolocation={handleUseGeolocation}
            isLocating={isLocating}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={toggleFavorite}
          />

          {/* Screen Content State */}
          <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-sky-400/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full border-4 border-t-sky-400 border-r-transparent border-b-sky-400 border-l-transparent animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Connecting to Meteorological Satellites...
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fetching high-precision data for {currentLocation.name}
                  </p>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <AlertCircle size={44} className="text-rose-400" />
                <h3 className="text-base font-bold text-white">Weather Data Unavailable</h3>
                <p className="text-xs text-slate-400 max-w-xs">{errorMessage}</p>
                <button
                  onClick={() => loadWeatherData(currentLocation)}
                  className="mt-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <RefreshCw size={14} />
                  Retry Connection
                </button>
              </div>
            ) : weather ? (
              <>
                {/* Screen 1: Home / Today */}
                {activeTab === 'home' && (
                  <HomeScreen
                    weather={weather}
                    settings={settings}
                    condition={condition}
                    onRefresh={() => loadWeatherData(currentLocation, false)}
                    isRefreshing={isRefreshing}
                    onSelectDayForecast={() => setActiveTab('forecast')}
                  />
                )}

                {/* Screen 2: Forecast / Details */}
                {activeTab === 'forecast' && (
                  <ForecastScreen
                    weather={weather}
                    settings={settings}
                  />
                )}

                {/* Screen 3: Saved Cities */}
                {activeTab === 'saved' && (
                  <SavedCitiesScreen
                    savedCities={savedCities}
                    currentLocation={currentLocation}
                    settings={settings}
                    onSelectCity={handleSelectCity}
                    onRemoveCity={handleRemoveSavedCity}
                    onAddCity={handleAddSavedCity}
                  />
                )}

                {/* Screen 4: Settings */}
                {activeTab === 'settings' && (
                  <SettingsScreen
                    settings={settings}
                    onUpdateSettings={updateSettings}
                    onResetCities={handleResetCities}
                    onOpenFlutterModal={() => setIsFlutterModalOpen(true)}
                  />
                )}
              </>
            ) : null}
          </div>

          {/* Bottom Material 3 Navigation Bar */}
          <BottomNavBar
            currentTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            savedCount={savedCities.length}
          />
        </PhoneFrame>
      </main>

      {/* Flutter Source Code & Project Downloader Modal */}
      <FlutterProjectModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
      />
    </div>
  );
}
