import React from 'react';
import { CurrentMedication, ChronicDisease, PatientInfo } from '../../types/patient';
import { Pill, AlertOctagon, Heart, ShieldAlert } from 'lucide-react';

interface PatientActiveMedsProps {
  patient: PatientInfo;
  medications: CurrentMedication[];
  chronicDiseases: ChronicDisease[];
}

export const PatientActiveMeds: React.FC<PatientActiveMedsProps> = ({
  patient,
  medications,
  chronicDiseases,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Pill className="w-4 h-4 text-brand-700" />
          <span>ยาแผนปัจจุบันที่ใช้อยู่ (HIS Active Meds)</span>
        </div>
        <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
          {medications.length} รายการ
        </span>
      </div>

      {/* High-Risk Clinical Flags */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          ปัจจัยเสี่ยงทางคลินิก (Risk Profile)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {patient.age >= 65 && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
              <ShieldAlert className="w-3 h-3 text-amber-600" /> ผู้สูงอายุ ({patient.age} ปี)
            </span>
          )}
          {patient.age <= 12 && (
            <span className="inline-flex items-center gap-1 text-[11px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-medium">
              <ShieldAlert className="w-3 h-3 text-sky-600" /> ผู้ป่วยเด็ก ({patient.age} ปี)
            </span>
          )}
          {chronicDiseases.map((cd, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium"
              title={cd.name}
            >
              <Heart className="w-3 h-3 text-rose-500" /> {cd.icd10}: {cd.name.split(',')[0]}
            </span>
          ))}
          {chronicDiseases.length === 0 && patient.age > 12 && patient.age < 65 && (
            <span className="text-xs text-slate-400 italic">ไม่มีโรคเรื้อรังที่บันทึก</span>
          )}
        </div>
      </div>

      {/* Medication Cards List */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          รายการยาและขนาดที่รับประทานจริง
        </div>

        {medications.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400">
            ไม่มีประวัติการใช้ยาแผนปัจจุบันในระบบ HIS
          </div>
        ) : (
          medications.map((m) => {
            const isNarrow = m.generic_name.toLowerCase().includes('warfarin') || m.generic_name.toLowerCase().includes('digoxin');
            return (
              <div
                key={m.drug_id}
                className={`p-3 rounded-xl border transition ${
                  isNarrow
                    ? 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{m.generic_name}</span>
                      {isNarrow && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                          <AlertOctagon className="w-2.5 h-2.5" /> ช่วงบำบัดแคบ
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {m.brand_name} • {m.dosage_form}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono shrink-0">
                    {m.strength_mg} mg
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <span>
                    วิธีใช้: <b>{m.dose_per_admin_mg} mg</b> ({m.timing})
                  </span>
                  <span className="font-mono text-slate-500">
                    รวม: {m.calculated_daily_dose_mg} mg/วัน
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex items-center justify-between">
        <span>ข้อมูลดึงจาก HIS Adapter</span>
        <span className="font-mono">มาตรฐาน HL7 / FHIR</span>
      </div>
    </div>
  );
};
