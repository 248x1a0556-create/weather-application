import React from 'react';
import { Sun, CalendarDays, Bookmark, Settings as SettingsIcon } from 'lucide-react';

export type ScreenTab = 'home' | 'forecast' | 'saved' | 'settings';

interface BottomNavBarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  savedCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  savedCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as ScreenTab,
      label: 'Today',
      icon: Sun,
    },
    {
      id: 'forecast' as ScreenTab,
      label: 'Forecast',
      icon: CalendarDays,
    },
    {
      id: 'saved' as ScreenTab,
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'settings' as ScreenTab,
      label: 'Settings',
      icon: SettingsIcon,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="relative z-30 w-full bg-slate-900/90 backdrop-blur-md border-t border-white/10 px-3 py-2 flex items-center justify-around select-none transition-colors"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
              isActive
                ? 'text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator (Material 3 style) */}
            <div
              className={`relative px-4 py-1 rounded-full transition-all duration-300 flex items-center justify-center ${
                isActive ? 'bg-sky-500/20 text-sky-400' : 'bg-transparent text-slate-400 group-hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'scale-110' : ''} />

              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[11px] mt-0.5 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
