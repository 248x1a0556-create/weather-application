import React from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';

interface PhoneFrameProps {
  isPhoneView: boolean;
  onToggleView: () => void;
  children: React.ReactNode;
  activeScreenTitle?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  isPhoneView,
  children,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isPhoneView) {
    return (
      <div className="w-full max-w-5xl mx-auto min-h-screen flex flex-col transition-all duration-300">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-4 px-2 sm:py-8 sm:px-4">
      {/* Phone Chassis */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-700/60 shadow-sky-950/40 flex flex-col overflow-hidden border-4 border-slate-800">
        
        {/* Hardware Buttons simulation (decorative) */}
        <div className="absolute -left-[6px] top-28 w-[3px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[6px] top-44 w-[3px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[6px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-md" />

        {/* Screen Bezel Inner */}
        <div className="relative w-full h-full bg-slate-950 rounded-[34px] overflow-hidden flex flex-col">
          
          {/* Android Status Bar */}
          <div className="w-full h-9 px-6 flex items-center justify-between text-xs text-white/90 font-medium z-30 select-none bg-black/20 backdrop-blur-xs">
            <span className="tracking-tight font-mono text-[11px]">{currentTime}</span>

            {/* Front Camera Punch-hole */}
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-white/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[10px] font-bold text-sky-400">5G</span>
              <Signal size={12} className="text-white/80" />
              <Wifi size={12} className="text-white/80" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">92%</span>
                <BatteryCharging size={13} className="text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Body */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="w-full h-4 bg-transparent flex items-center justify-center z-30 pointer-events-none pb-1">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
