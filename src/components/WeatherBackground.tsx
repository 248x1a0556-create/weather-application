import React, { useMemo } from 'react';
import { WeatherConditionInfo } from '../types/weather';

interface WeatherBackgroundProps {
  condition: WeatherConditionInfo;
  isDay: boolean;
  theme: string;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ condition, isDay, theme }) => {
  // Generate random particles (stars, raindrops, snow) once per condition
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3 + 2) % 98}%`,
      top: `${(i * 7.1) % 95}%`,
      duration: `${1.2 + (i % 5) * 0.4}s`,
      delay: `${(i % 10) * 0.25}s`,
      size: `${1.5 + (i % 3)}px`,
      opacity: 0.2 + (i % 5) * 0.15,
    }));
  }, []);

  const raindrops = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.1) % 100}%`,
      duration: `${0.6 + (i % 4) * 0.2}s`,
      delay: `${(i % 8) * 0.15}s`,
      height: `${14 + (i % 12)}px`,
      opacity: 0.35 + (i % 5) * 0.12,
    }));
  }, []);

  const snowflakes = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.6) % 98}%`,
      duration: `${3.5 + (i % 5) * 0.8}s`,
      delay: `${(i % 7) * 0.4}s`,
      size: `${3 + (i % 4)}px`,
      opacity: 0.4 + (i % 4) * 0.15,
    }));
  }, []);

  if (theme === 'dark') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black transition-colors duration-700" />
    );
  }

  if (theme === 'light') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-50 via-slate-100 to-slate-200 transition-colors duration-700" />
    );
  }

  // Dynamic Weather Theme
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none transition-colors duration-1000">
      {/* Base gradient based on weather and day/night */}
      <div
        className={`absolute inset-0 bg-gradient-to-b transition-all duration-1000 ${
          isDay ? condition.bgGradientDay : condition.bgGradientNight
        }`}
      />

      {/* Atmospheric Overlays */}
      {/* Sun glow for day clear */}
      {isDay && condition.category === 'clear' && (
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-400/25 blur-3xl animate-pulse" />
      )}

      {/* Moon glow for night clear */}
      {!isDay && condition.category === 'clear' && (
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-sky-300/15 blur-2xl" />
      )}

      {/* Twinkling Stars for clear night */}
      {!isDay && (condition.category === 'clear' || condition.category === 'partly-cloudy') && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute bg-white rounded-full animate-ping"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Rain animation for rain and thunderstorm */}
      {(condition.category === 'rain' || condition.category === 'thunderstorm') && (
        <div className="absolute inset-0 overflow-hidden">
          {raindrops.map((r) => (
            <div
              key={r.id}
              className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-sky-300 to-white/70 animate-rainfall"
              style={{
                left: r.left,
                top: '-20px',
                height: r.height,
                opacity: r.opacity,
                animationDuration: r.duration,
                animationDelay: r.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow animation for snow category */}
      {condition.category === 'snow' && (
        <div className="absolute inset-0 overflow-hidden">
          {snowflakes.map((s) => (
            <div
              key={s.id}
              className="absolute bg-white/80 rounded-full blur-[0.5px] animate-snowfall"
              style={{
                left: s.left,
                top: '-10px',
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                animationDuration: s.duration,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Thunder flash */}
      {condition.category === 'thunderstorm' && (
        <div className="absolute inset-0 bg-white/20 opacity-0 animate-lightning pointer-events-none" />
      )}

      {/* Soft Cloud Shapes for overcast & clouds */}
      {(condition.category === 'cloudy' || condition.category === 'partly-cloudy') && (
        <>
          <div className="absolute top-12 -left-20 w-96 h-40 bg-white/10 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute top-36 -right-20 w-80 h-36 bg-white/10 rounded-full blur-2xl animate-float-delayed" />
        </>
      )}

      {/* Vignette bottom gradient for content readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
    </div>
  );
};
