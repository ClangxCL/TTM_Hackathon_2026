import React, { useState } from 'react';
import { SyntheticCase, Vitals } from '../../types/patient';
import { RedFlagAssessment, RedFlagAlert } from '../../services/redFlagService';
import {
  AlertTriangle,
  Siren,
  X,
  Printer,
  Copy,
  CheckCircle2,
  Building2,
  Stethoscope,
  ShieldAlert,
  ArrowRight,
  FileText,
  Heart,
  Clock,
  User,
} from 'lucide-react';

interface EmergencyReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientCase: SyntheticCase;
  assessment: RedFlagAssessment;
}

export const EmergencyReferralModal: React.FC<EmergencyReferralModalProps> = ({
  isOpen,
  onClose,
  patientCase,
  assessment,
}) => {
  if (!isOpen) return null;

  const [urgency, setUrgency] = useState<'EMERGENCY' | 'URGENT' | 'ROUTINE'>('EMERGENCY');
  const [targetDept, setTargetDept] = useState(
    assessment.alerts[0]?.suggestedDepartment || 'ห้องฉุกเฉิน (ER)'
  );
  const [customNotes, setCustomNotes] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const vitals = patientCase.current_encounter.vitals;
  const patient = patientCase.patient_info;

  const handleCopySbar = () => {
    const sbarText = `[ใบส่งต่อผู้ป่วยฉุกเฉิน / เร่งด่วน แผนกการแพทย์แผนไทย]
ผู้ป่วย: ${patient.name} (HN: ${patient.hn}, อายุ: ${patient.age} ปี, เพศ: ${patient.gender})
ความเร่งด่วน: ${urgency === 'EMERGENCY' ? '🚨 ฉุกเฉินทันที (Emergency)' : '⚠️ เร่งด่วน (Urgent)'}
ส่งต่อไปยัง: ${targetDept}

1. S (Situation - สถานการณ์):
${assessment.sbarSummary.situation}

2. B (Background - ประวัติและสัญญาณชีพ):
${assessment.sbarSummary.background}

3. A (Assessment - ผลการประเมินข้อห้าม/สัญญาณอันตราย):
${assessment.sbarSummary.assessment}
${customNotes ? `\nหมายเหตุเพิ่มเติมโดยแพทย์แผนไทย: ${customNotes}` : ''}

4. R (Recommendation - ข้อเสนอแนะการดูแลรักษา):
${assessment.sbarSummary.recommendation}

ลงชื่อ พท.ป. ผู้ตรวจรักษา
วันที่: ${new Date().toLocaleDateString('th-TH')} เวลา: ${new Date().toLocaleTimeString('th-TH')}
สถานพยาบาล: งานการแพทย์แผนไทยและการแพทย์ผสมผสาน`;

    navigator.clipboard.writeText(sbarText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitReferral = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-rose-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Alert Strip */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Siren className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white text-rose-800 px-2.5 py-0.5 rounded-full">
                  SAFETY INTERVENTION
                </span>
                <span className="text-xs text-rose-100">ระบบคัดกรองความปลอดภัยทางการแพทย์</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                ใบส่งต่อแพทย์แผนปัจจุบันเร่งด่วน (Emergency / Red Flag Referral)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Patient Header Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-sm">{patient.name}</span>
                <div className="text-slate-500 flex items-center gap-2 font-mono">
                  <span>HN: {patient.hn}</span>
                  <span>•</span>
                  <span>อายุ: {patient.age} ปี ({patient.gender})</span>
                </div>
              </div>
            </div>

            {/* Vitals Snapshot */}
            <div className="flex items-center gap-2 font-mono text-[11px] bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-sans">สัญญาณชีพ:</span>
              <span className={`font-bold ${vitals.btemp >= 38.5 ? 'text-rose-600' : 'text-slate-800'}`}>
                BT {vitals.btemp}°C
              </span>
              <span>•</span>
              <span className={`font-bold ${vitals.sbp >= 160 ? 'text-rose-600' : 'text-slate-800'}`}>
                BP {vitals.sbp}/{vitals.dbp} mmHg
              </span>
              <span>•</span>
              <span className="font-bold text-slate-800">PR {vitals.pr} bpm</span>
            </div>
          </div>

          {/* Procedure Contraindication Banner */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-rose-950 block text-sm">
                ข้อห้ามการนวดไทยและหัตถการทางการแพทย์แผนไทย:
              </span>
              <p className="text-rose-900 leading-relaxed font-semibold">
                {assessment.procedureStatus.massageRestrictionMessage}
              </p>
              <p className="text-rose-700 text-[11px]">
                ตามมาตรฐานวิชาชีพการแพทย์แผนไทยและแนวทางกรมการแพทย์แผนไทยและการแพทย์ทางเลือก กระทรวงสาธารณสุข
              </p>
            </div>
          </div>

          {/* Detected Red Flags & Emergency Alerts */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              รายการสัญญาณอันตราย/ข้อห้ามที่ตรวจพบ ({assessment.alerts.length} ข้อ):
            </label>
            <div className="space-y-2">
              {assessment.alerts.map((alert: RedFlagAlert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                      : 'bg-amber-50/70 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-500'}`} />
                      {alert.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}>
                      {alert.severity === 'CRITICAL' ? '🚨 วิกฤต / ห้ามทำหัตถการ' : '⚠️ ควรเฝ้าระวัง'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed pl-3.5">
                    {alert.description}
                  </p>
                  <div className="text-[10px] font-semibold text-rose-800 pl-3.5 pt-0.5">
                    <b>แนวทางปฏิบัติ:</b> {alert.actionRequired}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency & Target Department Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                ระดับความเร่งด่วนในการส่งต่อ (Triage Urgency):
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setUrgency('EMERGENCY')}
                  className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    urgency === 'EMERGENCY'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div className="text-sm">🚨 ฉุกเฉิน</div>
                  <span className="text-[10px] opacity-80 block">ส่ง ER ทันที</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('URGENT')}
                  className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    urgency === 'URGENT'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-sm">⚠️ เร่งด่วน</div>
                  <span className="text-[10px] opacity-80 block">ภายใน 24 ชม.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('ROUTINE')}
                  className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    urgency === 'ROUTINE'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-sm">ℹ️ ปรึกษา</div>
                  <span className="text-[10px] opacity-80 block">ส่งตรวจ OPD</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                แผนกปลายทางที่ส่งต่อ (Target Department):
              </label>
              <select
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              >
                <option value="ห้องฉุกเฉิน (ER)">ห้องฉุกเฉิน (Emergency Room - ER)</option>
                <option value="อายุรกรรม (OPD)">อายุรกรรมทั่วไป (Internal Medicine OPD)</option>
                <option value="ศัลยกรรมกระดูกและข้อ (Ortho)">ศัลยกรรมกระดูกและข้อ (Orthopedics)</option>
                <option value="ศูนย์โรคหัวใจและหลอดเลือด">ศูนย์โรคหัวใจและหลอดเลือด (Cardiology)</option>
                <option value="ศูนย์โรคหลอดเลือดสมอง (Stroke Unit)">ศูนย์โรคหลอดเลือดสมอง (Stroke Unit)</option>
              </select>
            </div>
          </div>

          {/* SBAR Standard Referral Summary */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-700" />
                <span>ข้อความสรุปอาการส่งต่อมาตรฐาน SBAR (Communication Sheet):</span>
              </span>
              <button
                type="button"
                onClick={handleCopySbar}
                className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer font-semibold"
              >
                {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'คัดลอกแล้ว!' : 'คัดลอก SBAR'}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-900">S (Situation): </span>
                <span className="text-slate-700">{assessment.sbarSummary.situation}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">B (Background): </span>
                <span className="text-slate-700">{assessment.sbarSummary.background}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">A (Assessment): </span>
                <span className="text-slate-700">{assessment.sbarSummary.assessment}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900">R (Recommendation): </span>
                <span className="text-slate-700">{assessment.sbarSummary.recommendation}</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                บันทึกความเห็นเพิ่มเติมของแพทย์แผนไทย (Optional):
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="ระบุข้อตรวจพบเพิ่มเติม เช่น ตำแหน่งบวมแดงร้อน, ระดับความเจ็บปวด VAS, การให้การปฐมพยาบาลเบื้องต้น..."
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>ระบบบันทึกเวลาส่งต่อลงเวชระเบียนอิเล็กทรอนิกส์ (HIS/EHR) อัตโนมัติ</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบส่งต่อ</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitReferral}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>บันทึกการส่งต่อสำเร็จ!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>ยืนยันส่งต่อผู้ป่วยทันที</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
