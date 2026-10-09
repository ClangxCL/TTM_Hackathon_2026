import React, { useState } from 'react';
import { ThaiHerbFormularyItem } from '../../types/drug';
import { Search, Filter, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';

interface FormularySearchProps {
  formulary: ThaiHerbFormularyItem[];
  selectedHerb: ThaiHerbFormularyItem | null;
  onSelectHerb: (herb: ThaiHerbFormularyItem) => void;
}

export const FormularySearch: React.FC<FormularySearchProps> = ({
  formulary,
  selectedHerb,
  onSelectHerb,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filtered = formulary.filter((herb) => {
    const matchTerm =
      herb.thai_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herb.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herb.drug_code_24.includes(searchTerm) ||
      herb.indications.some((ind) => ind.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchType =
      selectedType === 'ALL' ||
      (selectedType === 'SINGLE' && herb.herb_type === 'ยาเดี่ยว') ||
      (selectedType === 'FORMULA' && herb.herb_type === 'ยาตำรับ') ||
      (selectedType === 'EXTRACT' && herb.herb_type === 'ยาสมุนไพรสกัด');

    return matchTerm && matchType;
  });

  return (
    <div className="space-y-3">
      {/* Search & Filters Header */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสมุนไพร, ตำรับยา, สรรพคุณ หรือรหัสยา 24 หลัก..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
              selectedType === 'ALL'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ทั้งหมด ({formulary.length})
          </button>
          <button
            onClick={() => setSelectedType('SINGLE')}
            className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
              selectedType === 'SINGLE'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ยาเดี่ยว
          </button>
          <button
            onClick={() => setSelectedType('FORMULA')}
            className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
              selectedType === 'FORMULA'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ยาตำรับ
          </button>
          <button
            onClick={() => setSelectedType('EXTRACT')}
            className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
              selectedType === 'EXTRACT'
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            สารสกัด
          </button>
        </div>
      </div>

      {/* Herb List Grid */}
      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            ไม่พบรายการยาที่ตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          filtered.map((herb) => {
            const isSelected = selectedHerb?.drug_code_24 === herb.drug_code_24;
            return (
              <div
                key={herb.drug_code_24}
                onClick={() => onSelectHerb(herb)}
                className={`p-3 rounded-xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-brand-50/60 border-brand-500 ring-1 ring-brand-500'
                    : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{herb.thai_name}</span>
                      <span className="text-[10px] text-slate-500">({herb.herb_type})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                      {herb.scientific_name}
                    </div>
                  </div>

                  {/* NLEM Badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      herb.nlem_status === 'ใช่'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {herb.nlem_status === 'ใช่' ? (
                      <>
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-600" /> ในบัญชียาหลัก
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-2.5 h-2.5 text-slate-400" /> ยังไม่ตรวจสอบ
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="truncate max-w-[260px] text-slate-500">
                    สรรพคุณ: {herb.indications[0]}
                  </span>
                  <span className="font-mono font-medium text-slate-700 shrink-0">
                    ฿{herb.unit_price_thb.toFixed(2)}/{herb.unit}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
