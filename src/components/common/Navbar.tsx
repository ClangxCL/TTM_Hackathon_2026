import React from 'react';
import { User, Activity, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { SyntheticCase } from '../../types/patient';
import { WeatherWidget } from './WeatherWidget';

interface NavbarProps {
  currentCase: SyntheticCase;
  onSelectCaseClick: () => void;
  onWeatherUpdate?: (weather: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCase,
  onSelectCaseClick,
  onWeatherUpdate,
}) => {
  const p = currentCase.patient_info;
  const v = currentCase.current_encounter.vitals;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Patient Ribbon */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectCaseClick}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-xl px-3 py-1.5 transition text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentCase.case_id}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                <span className="text-[11px] text-slate-500">
                  ({p.gender}, {p.age} ปี)
                </span>
                <span className="text-[10px] bg-slate-200/70 text-slate-700 font-mono px-1 rounded">
                  {p.hn}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>ภูมิลำเนา: {p.province}</span>
                <span>•</span>
                <span className="text-brand-800 font-medium">ธาตุกำเนิด: {p.birth_element}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 group-hover:translate-x-0.5 transition" />
          </button>

          {/* Vitals Summary Pill */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              <span>BT: <b className="text-slate-900">{v.btemp}°C</b></span>
            </span>
            <span className="text-slate-300">|</span>
            <span>BP: <b className="text-slate-900">{v.sbp}/{v.dbp}</b></span>
            <span className="text-slate-300">|</span>
            <span>PR: <b className="text-slate-900">{v.pr}</b> bpm</span>
            <span className="text-slate-300">|</span>
            <span>RR: <b className="text-slate-900">{v.rr}</b>/min</span>
          </div>
        </div>

        {/* Right: Weather & Current Encounter Context */}
        <div className="flex items-center gap-2">
          <WeatherWidget
            latitude={currentCase.current_encounter.ambient_context.latitude}
            longitude={currentCase.current_encounter.ambient_context.longitude}
            locationName={currentCase.current_encounter.ambient_context.location}
            onWeatherLoaded={onWeatherUpdate}
          />
        </div>
      </div>
    </header>
  );
};
