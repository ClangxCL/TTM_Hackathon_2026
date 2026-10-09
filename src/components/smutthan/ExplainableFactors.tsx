import React, { useState } from 'react';
import { RuleImpact } from '../../types/smutthan';
import { Info, ChevronDown, ChevronUp, Zap, HelpCircle } from 'lucide-react';

interface ExplainableFactorsProps {
  reasons: RuleImpact[];
  aiExplanation?: string;
  isAiGenerated?: boolean;
}

export const ExplainableFactors: React.FC<ExplainableFactorsProps> = ({
  reasons,
  aiExplanation,
  isAiGenerated,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-700" />
            <span>ความโปร่งใสของตรรกะการคำนวณ (Explainable AI Rules)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            แจกแจงที่มาของคะแนนและน้ำหนักของแต่ละปัจจัยสมุฏฐานอย่างโปร่งใส ตรวจสอบได้
          </p>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-mono">
          {reasons.length} กฎที่ตรงเงื่อนไข
        </span>
      </div>

      {/* Optional AI / Synthesized Clinical Note */}
      {aiExplanation && (
        <div className="bg-gradient-to-r from-teal-50/70 to-emerald-50/70 border border-teal-200/80 rounded-xl p-3.5 text-xs text-teal-950">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-teal-900">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-700" />
              สรุปทางคลินิก (Clinician Explanatory Synthesis)
            </span>
            <span className="text-[10px] bg-teal-200/60 px-2 py-0.5 rounded text-teal-800">
              {isAiGenerated ? 'GenAI Integration' : 'Rule-Template Engine (Offline Safe)'}
            </span>
          </div>
          <p className="leading-relaxed whitespace-pre-line text-slate-700">{aiExplanation}</p>
        </div>
      )}

      {/* Rules Breakdown List */}
      <div className="space-y-2">
        {reasons.map((rule, idx) => {
          const isExpanded = expandedIndex === idx;
          const deltaStr = Object.entries(rule.delta)
            .map(([k, v]) => {
              const nameMap: { [k: string]: string } = {
                earth: 'ดิน',
                water: 'น้ำ',
                wind: 'ลม',
                fire: 'ไฟ',
              };
              const sign = v && v > 0 ? `+${v}` : `${v}`;
              return `${nameMap[k] || k} ${sign}`;
            })
            .join(', ');

          return (
            <div
              key={idx}
              className={`border rounded-xl transition overflow-hidden ${
                isExpanded ? 'border-brand-300 bg-brand-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="px-2 py-0.5 rounded-md font-medium text-[10px] bg-slate-100 text-slate-700 shrink-0">
                    {rule.category}
                  </span>
                  <span className="font-semibold text-slate-800 truncate">{rule.rule_title}</span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline truncate">
                    ({rule.condition_matched})
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="font-mono font-medium text-brand-800 bg-brand-100/70 px-2 py-0.5 rounded text-[11px]">
                    {deltaStr}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3.5 pb-3 pt-1 border-t border-brand-100/60 text-xs text-slate-600 bg-white/70">
                  <p className="leading-relaxed">{rule.reason_th}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
