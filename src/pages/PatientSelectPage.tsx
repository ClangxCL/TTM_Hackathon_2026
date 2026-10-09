import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SyntheticCase } from '../types/patient';
import { User, AlertOctagon, AlertTriangle, Info, CheckCircle2, ChevronRight, Pill, Activity } from 'lucide-react';

interface PatientSelectPageProps {
  cases: SyntheticCase[];
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
}

export const PatientSelectPage: React.FC<PatientSelectPageProps> = ({
  cases,
  selectedCaseId,
  onSelectCase,
}) => {
  const navigate = useNavigate();

  const handleChoose = (caseId: string) => {
    onSelectCase(caseId);
    navigate('/smutthan');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            เลือกเคสผู้ป่วยจำลอง (10 Synthetic Demonstration Cases)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ชุดข้อมูลสังเคราะห์ 10 เคส ออกแบบครอบคลุมระดับความเสี่ยงทางคลินิก (สูง/ปานกลาง/ต่ำ/ไม่พบปฏิกิริยา) และช่วงวัยตามเกณฑ์แข่งขัน
          </p>
        </div>
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-medium shrink-0">
          ข้อมูลสังเคราะห์เพื่อการสาธิต (Zero PII)
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((c) => {
          const isSelected = c.case_id === selectedCaseId;
          const p = c.patient_info;
          const enc = c.current_encounter;
          const outcome = c.expected_demo_outcome;

          let severityBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          let SevIcon = CheckCircle2;

          if (outcome.interaction_level.includes('สูง')) {
            severityBadge = 'bg-rose-50 text-rose-800 border-rose-200';
            SevIcon = AlertOctagon;
          } else if (outcome.interaction_level.includes('ปานกลาง')) {
            severityBadge = 'bg-orange-50 text-orange-800 border-orange-200';
            SevIcon = AlertTriangle;
          } else if (outcome.interaction_level.includes('ต่ำ')) {
            severityBadge = 'bg-amber-50 text-amber-800 border-amber-200';
            SevIcon = Info;
          } else if (outcome.interaction_level.includes('ไม่มีข้อมูล')) {
            severityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
            SevIcon = Info;
          }

          return (
            <div
              key={c.case_id}
              onClick={() => handleChoose(c.case_id)}
              className={`p-4 rounded-2xl border cursor-pointer transition shadow-soft flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-brand-50/70 border-brand-500 ring-2 ring-brand-500/30'
                  : 'bg-white border-slate-200/80 hover:border-brand-300 hover:shadow-card'
              }`}
            >
              <div>
                {/* Top Row: Case ID, Demographics, Severity Tag */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {c.case_id}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-xs font-normal text-slate-500">
                          ({p.gender}, {p.age} ปี)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>{enc.ambient_context.location}</span>
                        <span>•</span>
                        <span className="text-brand-800 font-medium">{enc.season}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${severityBadge}`}
                  >
                    <SevIcon className="w-3 h-3" />
                    <span>{outcome.interaction_level}</span>
                  </span>
                </div>

                {/* Chief Complaint */}
                <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-slate-700">
                  <span className="font-semibold text-slate-900">อาการสำคัญ: </span>
                  <span>{enc.chief_complaint}</span>
                </div>

                {/* Clinical Meds & Herb Comparison */}
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-100/70 border border-slate-200/60">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                      <Pill className="w-3 h-3 text-slate-500" /> ยาแผนปัจจุบัน (HIS)
                    </div>
                    <div className="font-medium text-slate-800 truncate mt-0.5">
                      {c.current_medications.length > 0
                        ? c.current_medications.map((m) => m.generic_name).join(', ')
                        : 'ไม่มีการใช้ยา'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-teal-50/70 border border-teal-200/60">
                    <div className="text-[10px] font-semibold text-teal-700 uppercase flex items-center gap-1">
                      <Activity className="w-3 h-3 text-teal-600" /> ยาแผนไทยที่จะสั่ง
                    </div>
                    <div className="font-medium text-teal-900 truncate mt-0.5">
                      {c.intended_ttm_prescription.herb_name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  ประวัติย้อนหลัง: <b>{c.history_episodes.length} ครั้ง</b>
                </span>
                <span className="text-brand-700 font-semibold flex items-center gap-1">
                  <span>เลือกเคสและเข้าห้องตรวจ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
