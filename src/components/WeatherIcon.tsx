import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudHail,
  Wind,
  Sparkles,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
  animate?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  className = '',
  size = 28,
  animate = true,
}) => {
  switch (name) {
    case 'Sun':
      return (
        <Sun
          size={size}
          className={`text-amber-400 fill-amber-400/20 ${animate ? 'hover:rotate-45 transition-transform duration-500' : ''} ${className}`}
        />
      );
    case 'SunDim':
      return (
        <Sun
          size={size}
          className={`text-amber-300 fill-amber-300/10 ${className}`}
        />
      );
    case 'Moon':
      return (
        <Moon
          size={size}
          className={`text-indigo-200 fill-indigo-200/20 ${className}`}
        />
      );
    case 'MoonStar':
      return (
        <div className="relative inline-flex items-center justify-center">
          <Moon size={size} className={`text-indigo-200 fill-indigo-200/20 ${className}`} />
          <Sparkles size={size * 0.4} className="absolute -top-1 -right-1 text-amber-300 animate-pulse" />
        </div>
      );
    case 'CloudSun':
      return (
        <CloudSun
          size={size}
          className={`text-sky-300 fill-sky-200/20 ${className}`}
        />
      );
    case 'CloudMoon':
      return (
        <CloudMoon
          size={size}
          className={`text-indigo-300 fill-indigo-300/20 ${className}`}
        />
      );
    case 'Cloud':
      return (
        <Cloud
          size={size}
          className={`text-slate-300 fill-slate-300/20 ${className}`}
        />
      );
    case 'CloudDrizzle':
      return (
        <CloudDrizzle
          size={size}
          className={`text-sky-300 fill-sky-300/20 ${className}`}
        />
      );
    case 'CloudRain':
    case 'CloudRainWind':
      return (
        <CloudRain
          size={size}
          className={`text-blue-400 fill-blue-400/20 ${className}`}
        />
      );
    case 'CloudLightning':
      return (
        <CloudLightning
          size={size}
          className={`text-amber-300 fill-amber-300/20 ${className}`}
        />
      );
    case 'CloudSnow':
      return (
        <CloudSnow
          size={size}
          className={`text-blue-200 fill-blue-100/20 ${className}`}
        />
      );
    case 'CloudFog':
      return (
        <CloudFog
          size={size}
          className={`text-slate-400 fill-slate-400/20 ${className}`}
        />
      );
    case 'CloudHail':
      return (
        <CloudHail
          size={size}
          className={`text-cyan-300 fill-cyan-300/20 ${className}`}
        />
      );
    default:
      return <Wind size={size} className={`text-sky-300 ${className}`} />;
  }
};
