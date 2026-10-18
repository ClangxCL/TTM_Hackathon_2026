import React, { useState, useEffect } from 'react';
import { Vitals } from '../../types/patient';
import { Activity, Plus, X, SlidersHorizontal, RotateCcw, Thermometer, Heart, Wind, Gauge } from 'lucide-react';
import { VoiceSymptomRecorder } from '../common/VoiceSymptomRecorder';

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

  // Controlled string states so user can freely clear and type numbers without snapping back
  const [rawBtemp, setRawBtemp] = useState<string>(String(initialVitals.btemp ?? 36.5));
  const [rawSbp, setRawSbp] = useState<string>(String(initialVitals.sbp ?? 120));
  const [rawDbp, setRawDbp] = useState<string>(String(initialVitals.dbp ?? 80));
  const [rawPr, setRawPr] = useState<string>(String(initialVitals.pr ?? 75));
  const [rawRr, setRawRr] = useState<string>(String(initialVitals.rr ?? 18));

  // Sync when initialVitals change (e.g. Reset or Switch Patient)
  useEffect(() => {
    setVitals({ ...initialVitals });
    setRawBtemp(String(initialVitals.btemp ?? 36.5));
    setRawSbp(String(initialVitals.sbp ?? 120));
    setRawDbp(String(initialVitals.dbp ?? 80));
    setRawPr(String(initialVitals.pr ?? 75));
    setRawRr(String(initialVitals.rr ?? 18));
  }, [initialVitals]);

  useEffect(() => {
    setSymptoms([...initialSymptoms]);
  }, [initialSymptoms]);

  const handleFieldChange = (field: keyof Vitals, rawVal: string, parseFn: (s: string) => number, defaultFallback: number) => {
    if (field === 'btemp') setRawBtemp(rawVal);
    else if (field === 'sbp') setRawSbp(rawVal);
    else if (field === 'dbp') setRawDbp(rawVal);
    else if (field === 'pr') setRawPr(rawVal);
    else if (field === 'rr') setRawRr(rawVal);

    const parsed = parseFn(rawVal);
    if (!isNaN(parsed) && parsed > 0) {
      const updated = { ...vitals, [field]: parsed };
      setVitals(updated);
      onUpdate(updated, symptoms);
    }
  };

  const handleFieldBlur = (field: keyof Vitals, rawVal: string, parseFn: (s: string) => number, defaultFallback: number) => {
    const parsed = parseFn(rawVal);
    const finalVal = !isNaN(parsed) && parsed > 0 ? parsed : defaultFallback;
    const updated = { ...vitals, [field]: finalVal };
    setVitals(updated);
    if (field === 'btemp') setRawBtemp(String(finalVal));
    else if (field === 'sbp') setRawSbp(String(finalVal));
    else if (field === 'dbp') setRawDbp(String(finalVal));
    else if (field === 'pr') setRawPr(String(finalVal));
    else if (field === 'rr') setRawRr(String(finalVal));
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

  const handleVoiceSymptoms = (extracted: string[]) => {
    if (extracted.length === 0) return;
    const combined = Array.from(new Set([...symptoms, ...extracted]));
    setSymptoms(combined);
    onUpdate(vitals, combined);
  };

  const isFever = vitals.btemp >= 37.5;
  const isHighBp = vitals.sbp >= 140 || vitals.dbp >= 90;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-700" />
            <span>สัญญาณชีพและอาการตรวจพบ (Clinical Vitals & Findings)</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            ปรับเปลี่ยนค่าสัญญาณชีพหรือเพิ่มอาการ เพื่อทดสอบการประเมินสมุฏฐานธาตุแบบ Real-time
          </p>
        </div>
        <button
          onClick={onReset}
          title="คืนค่าสัญญาณชีพเริ่มต้น"
          className="text-xs text-slate-500 hover:text-brand-700 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>รีเซ็ตค่า</span>
        </button>
      </div>

      {/* Chief Complaint Display */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs flex items-start gap-2">
        <span className="font-bold text-slate-700 shrink-0">อาการสำคัญ (CC):</span>
        <span className="text-slate-900 font-medium">{chiefComplaint}</span>
      </div>

      {/* Spacious, Easy-to-Read Vitals Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Body Temperature (BTEMP) */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isFever
              ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
              : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Thermometer className={`w-4 h-4 ${isFever ? 'text-rose-600' : 'text-amber-600'}`} />
              <span>อุณหภูมิกาย (BTEMP)</span>
            </label>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                isFever ? 'bg-rose-100 text-rose-800' : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              {isFever ? 'มีไข้ (เตโชกำเริบ)' : 'ปกติ'}
            </span>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="decimal"
              value={rawBtemp}
              onChange={(e) => handleFieldChange('btemp', e.target.value, parseFloat, 36.5)}
              onBlur={(e) => handleFieldBlur('btemp', e.target.value, parseFloat, 36.5)}
              placeholder="36.5"
              className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-10 py-2 text-base font-extrabold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 shadow-2xs"
            />
            <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
              °C
            </span>
          </div>
        </div>

        {/* 2. Blood Pressure (BP: SBP / DBP) */}
        <div
          className={`p-3 rounded-xl border transition-all ${
            isHighBp
              ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
              : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Gauge className={`w-4 h-4 ${isHighBp ? 'text-amber-600' : 'text-teal-600'}`} />
              <span>ความดันโลหิต (SBP / DBP)</span>
            </label>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                isHighBp ? 'bg-amber-100 text-amber-900' : 'bg-slate-200/70 text-slate-600'
              }`}
            >
              {isHighBp ? 'ความดันสูง' : 'ปกติ'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={rawSbp}
                onChange={(e) => handleFieldChange('sbp', e.target.value, parseInt, 120)}
                onBlur={(e) => handleFieldBlur('sbp', e.target.value, parseInt, 120)}
                placeholder="120"
                className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-2 py-2 text-base font-extrabold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 shadow-2xs"
                title="ความดันตัวบน (Systolic BP)"
              />
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                value={rawDbp}
                onChange={(e) => handleFieldChange('dbp', e.target.value, parseInt, 80)}
                onBlur={(e) => handleFieldBlur('dbp', e.target.value, parseInt, 80)}
                placeholder="80"
                className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-14 py-2 text-base font-extrabold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 shadow-2xs"
                title="ความดันตัวล่าง (Diastolic BP)"
              />
              <span className="absolute right-2 text-[11px] font-bold text-slate-500 pointer-events-none">
                mmHg
              </span>
            </div>
          </div>
        </div>

        {/* 3. Heart Rate (PR / ชีพจร) */}
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>อัตราชีพจร (Pulse Rate - PR)</span>
            </label>
            <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ปกติ 60-100</span>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={rawPr}
              onChange={(e) => handleFieldChange('pr', e.target.value, parseInt, 75)}
              onBlur={(e) => handleFieldBlur('pr', e.target.value, parseInt, 75)}
              placeholder="75"
              className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-12 py-2 text-base font-extrabold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 shadow-2xs"
            />
            <span className="absolute right-3 text-xs font-bold text-slate-500 pointer-events-none">
              bpm
            </span>
          </div>
        </div>

        {/* 4. Respiration Rate (RR / อัตราการหายใจ) */}
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-600" />
              <span>อัตราการหายใจ (Respiration - RR)</span>
            </label>
            <span className="text-[10px] text-slate-500 font-medium">เกณฑ์ปกติ 12-20</span>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={rawRr}
              onChange={(e) => handleFieldChange('rr', e.target.value, parseInt, 18)}
              onBlur={(e) => handleFieldBlur('rr', e.target.value, parseInt, 18)}
              placeholder="18"
              className="w-full bg-white border border-slate-300 rounded-xl pl-3 pr-16 py-2 text-base font-extrabold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 shadow-2xs"
            />
            <span className="absolute right-3 text-[11px] font-bold text-slate-500 pointer-events-none">
              ครั้ง/นาที
            </span>
          </div>
        </div>
      </div>

      {/* Voice Speech-to-Text Symptom Intake Helper */}
      <div className="pt-1">
        <VoiceSymptomRecorder
          buttonLabel="🎙️ พูดบอกอาการเพิ่มด้วยเสียง (Speech-to-Text)"
          onSymptomsExtracted={handleVoiceSymptoms}
        />
      </div>

      {/* Symptoms Tags */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700">
            อาการตรวจพบในครั้งนี้ ({symptoms.length} รายการ):
          </label>
          <span className="text-[10px] text-slate-400">คลิกที่กากบาทเพื่อลบ หรือพิมพ์เพิ่มด้านล่าง</span>
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {symptoms.map((s, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-brand-50 text-brand-900 border border-brand-200 text-xs px-2.5 py-1 rounded-lg font-medium shadow-2xs"
            >
              <span>{s}</span>
              <button
                type="button"
                onClick={() => handleRemoveSymptom(idx)}
                className="hover:text-rose-600 transition cursor-pointer p-0.5"
                title={`ลบอาการ ${s}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Add Symptom inline form */}
          <form onSubmit={handleAddSymptom} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="+ พิมพ์อาการเพิ่ม (เช่น ไข้, ลมตี)..."
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600 w-48 shadow-2xs text-slate-900"
            />
            <button
              type="submit"
              className="bg-brand-700 hover:bg-brand-800 text-white p-1.5 rounded-lg text-xs transition cursor-pointer shadow-xs"
              title="เพิ่มอาการ"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
