import React, { useState, useEffect } from 'react';
import { ThaiHerbFormularyItem, PrescribedItem, DrugWarning } from '../../types/drug';
import { PatientInfo } from '../../types/patient';
import { PlusCircle, AlertTriangle, ShieldCheck, Flame, Droplet, Wind, Mountain, Tag } from 'lucide-react';
import { validateDosageAndSafety } from '../../services/dosageValidator';

interface PrescriptionFormProps {
  herb: ThaiHerbFormularyItem;
  patient: PatientInfo;
  onAddToCart: (item: Omit<PrescribedItem, 'id' | 'warnings' | 'acknowledged'>) => void;
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  herb,
  patient,
  onAddToCart,
}) => {
  const isChild = patient.age < 15;
  const standardRule = isChild && herb.standard_dosing.child ? herb.standard_dosing.child : herb.standard_dosing.adult;

  const [dose, setDose] = useState<number>(standardRule.dose_per_admin);
  const [freq, setFreq] = useState<number>(standardRule.frequency_per_day);
  const [timing, setTiming] = useState<string>(standardRule.timing);
  const [days, setDays] = useState<number>(Math.min(standardRule.max_duration_days || 7, 7));
  const [route, setRoute] = useState<string>(herb.dosage_form.includes('ทา') || herb.dosage_form.includes('น้ำมัน') ? 'ใช้ภายนอก' : 'รับประทาน');
  const [instructions, setInstructions] = useState<string>('');
  const [reasonIcd, setReasonIcd] = useState<string>('U60.10 ลมกษัยจุกเสียด');

  // Sync defaults when herb changes
  useEffect(() => {
    setDose(standardRule.dose_per_admin);
    setFreq(standardRule.frequency_per_day);
    setTiming(standardRule.timing);
    setDays(Math.min(standardRule.max_duration_days || 7, 7));
    setRoute(herb.dosage_form.includes('ทา') || herb.dosage_form.includes('น้ำมัน') ? 'ใช้ภายนอก' : 'รับประทาน');
    setInstructions(`รับประทานครั้งละ ${standardRule.dose_per_admin} ${herb.unit} วันละ ${standardRule.frequency_per_day} ครั้ง ${standardRule.timing}`);
  }, [herb]);

  const totalQuantity = dose * freq * days;
  const calculatedDailyMg = dose * freq * herb.unit_amount_mg;
  const calculatedDailyUnits = dose * freq;

  // Real-time dosage validation check for preview
  const liveWarnings = validateDosageAndSafety({
    herb,
    dose_per_admin: dose,
    frequency_per_day: freq,
    days,
    patient,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart({
      herb,
      dose_per_admin: dose,
      frequency_per_day: freq,
      timing,
      days,
      route,
      total_quantity: totalQuantity,
      calculated_daily_dose_mg: calculatedDailyMg,
      calculated_daily_dose_units: calculatedDailyUnits,
      instructions: instructions || `รับประทานครั้งละ ${dose} ${herb.unit} วันละ ${freq} ครั้ง ${timing}`,
      reason_icd10tm: reasonIcd,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-4">
      {/* Selected Herb Summary Header */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-sm">{herb.thai_name}</h4>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              รหัส 24 หลัก: {herb.drug_code_24}
            </span>
          </div>
          <span className="text-xs font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            {herb.dosage_form} ({herb.strength_per_unit})
          </span>
        </div>

        {/* Tastes & Primary Element */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
            รสยา: {herb.taste}
          </span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            คุมธาตุ: {herb.primary_element}
          </span>
        </div>

        {/* Clinical Contraindications & Warnings Pill */}
        {herb.contraindications.length > 0 && (
          <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">ข้อห้ามใช้: </span>
              {herb.contraindications.join('; ')}
            </div>
          </div>
        )}
      </div>

      {/* Prescription Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Dose per admin */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">
              ขนาดต่อครั้ง ({herb.unit})
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={dose}
              onChange={(e) => setDose(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">
              ความถี่ (ครั้ง/วัน)
            </label>
            <select
              value={freq}
              onChange={(e) => setFreq(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="1">วันละ 1 ครั้ง</option>
              <option value="2">วันละ 2 ครั้ง (เช้า-เย็น)</option>
              <option value="3">วันละ 3 ครั้ง (เช้า-กลางวัน-เย็น)</option>
              <option value="4">วันละ 4 ครั้ง (ก่อนนอน)</option>
            </select>
          </div>

          {/* Timing */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">เวลาที่รับประทาน</label>
            <input
              type="text"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Days */}
          <div>
            <label className="font-medium text-slate-700 block mb-1">จำนวนวัน (วัน)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Calculation Summary Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-slate-700">
          <div>
            <span>จำนวนรวมที่จ่าย: </span>
            <b className="text-slate-900 text-sm font-mono">{totalQuantity}</b> {herb.unit}
            <span className="text-slate-400 mx-2">|</span>
            <span>ขนาดรวมต่อวัน: </span>
            <b className="text-slate-900 font-mono">{calculatedDailyUnits}</b> {herb.unit}/วัน
            {herb.unit_amount_mg > 0 && (
              <span className="text-slate-500 ml-1">
                ({calculatedDailyMg.toLocaleString()} มก./วัน)
              </span>
            )}
          </div>
          <div className="font-semibold text-slate-900">
            ฿{(totalQuantity * herb.unit_price_thb).toFixed(2)}
          </div>
        </div>

        {/* Live Overdose or Duration Warnings */}
        {liveWarnings.map((w, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border flex items-start gap-2 ${
              w.severity === 'HIGH'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <div className="font-bold">{w.title}</div>
              <div className="text-[11px] leading-relaxed mt-0.5">{w.message}</div>
              <div className="text-[10px] text-slate-500 italic mt-0.5">
                แนะนำ: {w.recommendation}
              </div>
            </div>
          </div>
        ))}

        {/* Reason linked to ICD-10-TM */}
        <div>
          <label className="font-medium text-slate-700 block mb-1">
            เหตุผลการสั่งจ่าย (เชื่อมกับการวินิจฉัย ICD-10-TM):
          </label>
          <select
            value={reasonIcd}
            onChange={(e) => setReasonIcd(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="U60.10 ลมกษัยจุกเสียด (K30 Functional Dyspepsia)">
              U60.10 ลมกษัยจุกเสียด (K30 Functional Dyspepsia)
            </option>
            <option value="U56.19 ไข้หวัด, ไม่ระบุรายละเอียด (J00 Common Cold)">
              U56.19 ไข้หวัด, ไม่ระบุรายละเอียด (J00 Common Cold)
            </option>
            <option value="U55.20 ลมปลายปัตฆาตสัญญาณ 4, 5 หลัง (M54.5 Low Back Pain)">
              U55.20 ลมปลายปัตฆาตสัญญาณ 4, 5 หลัง (M54.5 Low Back Pain)
            </option>
            <option value="U61.2 ลมปะกัง หรือ ลมตะกัง (G43.9 Migraine)">
              U61.2 ลมปะกัง หรือ ลมตะกัง (G43.9 Migraine)
            </option>
            <option value="U69.00 โรคมธุรส / เบาหวานแบบแพทย์แผนไทย (E11.9 T2DM)">
              U69.00 โรคมธุรส / เบาหวานแบบแพทย์แผนไทย (E11.9 T2DM)
            </option>
          </select>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>เพิ่มรายการลงในใบสั่งยา (Add to Prescription)</span>
        </button>
      </form>
    </div>
  );
};
