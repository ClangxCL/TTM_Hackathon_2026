import React, { useState } from 'react';
import { Vitals } from '../../types/patient';
import { Activity, Plus, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface VitalsInputFormProps {
  initialVitals: Vitals;
  initialSymptoms: string[];
  chiefComplaint: string;
  onUpdate: (vitals: Vitals, symptoms: string[]) => void;
  onReset: () => void;
}

export const VitalsInputForm: React.FC<VitalsInputFormProps> = ({
  initialVitals,
  initialSymptoms,
  chiefComplaint,
  onUpdate,
  onReset,
}) => {
  const [vitals, setVitals] = useState<Vitals>({ ...initialVitals });
  const [symptoms, setSymptoms] = useState<string[]>([...initialSymptoms]);
  const [newSymptom, setNewSymptom] = useState('');

  const handleChange = (field: keyof Vitals, value: number) => {
    const updated = { ...vitals, [field]: value };
    setVitals(updated);
    onUpdate(updated, symptoms);
  };

  const handleAddSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymptom.trim()) return;
    const updated = [...symptoms, newSymptom.trim()];
    setSymptoms(updated);
    setNewSymptom('');
    onUpdate(vitals, updated);
  };

  const handleRemoveSymptom = (idx: number) => {
    const updated = symptoms.filter((_, i) => i !== idx);
    setSymptoms(updated);
    onUpdate(vitals, updated);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-700" />
            <span>สัญญาณชีพและอาการตรวจพบ (Clinical Vitals & Symptoms)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ปรับเปลี่ยนค่าสัญญาณชีพหรือเพิ่มอาการเพื่อทดสอบการตอบสนองของ Engine แบบ Real-time
          </p>
        </div>
        <button
          onClick={onReset}
          title="คืนค่าสัญญาณชีพเริ่มต้น"
          className="text-xs text-slate-500 hover:text-brand-700 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตค่า</span>
        </button>
      </div>

      {/* Chief Complaint Display */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
        <span className="font-semibold text-slate-700">อาการสำคัญ (Chief Complaint): </span>
        <span className="text-slate-900">{chiefComplaint}</span>
      </div>

      {/* Vitals Numeric Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* BTEMP */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            อุณหภูมิ BTEMP (°C)
          </label>
          <input
            type="number"
            step="0.1"
            value={vitals.btemp}
            onChange={(e) => handleChange('btemp', parseFloat(e.target.value) || 36.5)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* SBP */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            ความดันตัวบน SBP
          </label>
          <input
            type="number"
            value={vitals.sbp}
            onChange={(e) => handleChange('sbp', parseInt(e.target.value, 10) || 120)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* DBP */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            ความดันตัวล่าง DBP
          </label>
          <input
            type="number"
            value={vitals.dbp}
            onChange={(e) => handleChange('dbp', parseInt(e.target.value, 10) || 80)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* PR */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            ชีพจร PR (bpm)
          </label>
          <input
            type="number"
            value={vitals.pr}
            onChange={(e) => handleChange('pr', parseInt(e.target.value, 10) || 75)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* RR */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
          <label className="text-[11px] font-medium text-slate-500 block mb-1">
            หายใจ RR (/min)
          </label>
          <input
            type="number"
            value={vitals.rr}
            onChange={(e) => handleChange('rr', parseInt(e.target.value, 10) || 18)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Symptoms Tags */}
      <div className="space-y-2 pt-1">
        <label className="text-xs font-semibold text-slate-700 block">
          อาการและสัญญาณที่ระบุในการตรวจ:
        </label>
        <div className="flex flex-wrap gap-1.5 items-center">
          {symptoms.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-brand-50 text-brand-900 border border-brand-200 text-xs px-2.5 py-1 rounded-lg font-medium"
            >
              <span>{s}</span>
              <button
                type="button"
                onClick={() => handleRemoveSymptom(idx)}
                className="hover:text-rose-600 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Add Symptom inline form */}
          <form onSubmit={handleAddSymptom} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="+ พิมพ์อาการเพิ่ม (เช่น ไข้, ลมตี)"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 w-44"
            />
            <button
              type="submit"
              className="bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-600 p-1 rounded-lg text-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
