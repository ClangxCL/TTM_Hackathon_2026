import React, { useState } from 'react';
import { CurrentMedication, ChronicDisease, PatientInfo } from '../../types/patient';
import { MockDataService } from '../../services/mockDataService';
import { Pill, AlertOctagon, Heart, ShieldAlert, Plus, Search, Trash2, CheckCircle2, X } from 'lucide-react';

interface PatientActiveMedsProps {
  patient: PatientInfo;
  medications: CurrentMedication[];
  chronicDiseases: ChronicDisease[];
  onUpdateMedications?: (meds: CurrentMedication[]) => void;
  onOpenFullNlemCatalog?: () => void;
}

const COMMON_NLEM_DRUGS = [
  { generic: 'Warfarin sodium', brand: 'Orfarin 3mg', strength: 3.0, form: 'Tablet', timing: 'ก่อนนอน' },
  { generic: 'Aspirin', brand: 'Aspent-M 81mg', strength: 81.0, form: 'Tablet', timing: 'หลังอาหารเช้า' },
  { generic: 'Amlodipine besilate', brand: 'Norvasc 5mg', strength: 5.0, form: 'Tablet', timing: 'ตอนเช้า' },
  { generic: 'Metformin hydrochloride', brand: 'Glucophage 500mg', strength: 500.0, form: 'Tablet', timing: 'พร้อมอาหาร เช้า-เย็น' },
  { generic: 'Simvastatin', brand: 'Zocor 20mg', strength: 20.0, form: 'Tablet', timing: 'ก่อนนอน' },
  { generic: 'Omeprazole', brand: 'Miracid 20mg', strength: 20.0, form: 'Capsule', timing: 'ก่อนอาหารเช้า 30 นาที' },
  { generic: 'Digoxin', brand: 'Lanoxin 0.25mg', strength: 0.25, form: 'Tablet', timing: 'ตอนเช้า' },
  { generic: 'Ibuprofen', brand: 'Brufen 400mg', strength: 400.0, form: 'Tablet', timing: 'หลังอาหารทันที' },
];

export const PatientActiveMeds: React.FC<PatientActiveMedsProps> = ({
  patient,
  medications,
  chronicDiseases,
  onUpdateMedications,
  onOpenFullNlemCatalog,
}) => {
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const conventionalDrugs = MockDataService.getConventionalDrugs();

  const filteredDrugs = conventionalDrugs.filter((d: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return false;
    return (
      d.generic_name.toLowerCase().includes(q) ||
      (d.thai_name && d.thai_name.toLowerCase().includes(q)) ||
      (d.group_name && d.group_name.toLowerCase().includes(q)) ||
      (d.subgroup_name && d.subgroup_name.toLowerCase().includes(q)) ||
      (Array.isArray(d.brand_names) && d.brand_names.some((b: string) => b.toLowerCase().includes(q))) ||
      (Array.isArray(d.target_indications) && d.target_indications.some((ind: string) => ind.toLowerCase().includes(q))) ||
      (typeof d.indications === 'string' && d.indications.toLowerCase().includes(q))
    );
  }).slice(0, 30);

  const handleAddDrug = (drug: any) => {
    if (!onUpdateMedications) return;
    if (medications.some((m) => m.generic_name.toLowerCase() === drug.generic_name.toLowerCase())) return;

    const brand = Array.isArray(drug.brand_names) && drug.brand_names.length > 0
      ? drug.brand_names[0]
      : drug.brand_name || drug.generic_name;
    const form = drug.dosage_forms?.[0]?.form || drug.dosage_form || 'Tablet';
    const dose = drug.standard_regimen?.dose_mg || drug.standard_regimen?.dose_per_admin_mg || drug.strength_mg || 5.0;
    const freq = drug.standard_regimen?.frequency_per_day || 1;
    const timing = drug.standard_regimen?.timing || 'วันละ 1 ครั้ง หลังอาหาร';

    const newMed: CurrentMedication = {
      drug_id: drug.drug_id || `MED-CONV-${Date.now().toString().slice(-4)}`,
      generic_name: drug.generic_name,
      brand_name: brand,
      dosage_form: form,
      strength_mg: dose,
      dose_per_admin_mg: dose,
      frequency_per_day: freq,
      timing: timing,
      days: 30,
      calculated_daily_dose_mg: dose * freq,
      route: drug.route || 'Oral',
    };

    onUpdateMedications([...medications, newMed]);
    setSearchQuery('');
    setIsAddingOpen(false);
  };

  const handleRemoveDrug = (drugId: string) => {
    if (!onUpdateMedications) return;
    onUpdateMedications(medications.filter((m) => m.drug_id !== drugId));
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Pill className="w-4 h-4 text-brand-700" />
          <span>ยาแผนปัจจุบันที่ใช้อยู่ (HIS Active Meds)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
            {medications.length} รายการ
          </span>
          {onUpdateMedications && (
            <button
              type="button"
              onClick={() => setIsAddingOpen(!isAddingOpen)}
              className="text-[10px] bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold transition cursor-pointer"
              title="พิมพ์ค้นหาเพิ่มยาแผนปัจจุบันจากบัญชียาหลัก NLEM"
            >
              <Plus className="w-3 h-3" />
              <span>{isAddingOpen ? 'ปิด' : 'เพิ่มยา NLEM'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Add Drug from NLEM (If open) */}
      {isAddingOpen && (
        <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
              <Search className="w-3 h-3 text-purple-700" />
              <span>พิมพ์ค้นหายาแผนปัจจุบัน (บัญชียาหลักแห่งชาติ):</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddingOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="พิมพ์ชื่อยา เช่น warfarin, amlodipine, metformin, aspirin..."
              className="w-full bg-white border border-purple-300 rounded-lg pl-3 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
              autoFocus
            />
          </div>

          {/* Autocomplete Search Results */}
          {searchQuery && (
            <div className="max-h-40 overflow-y-auto space-y-1 bg-white rounded-lg border border-purple-200 p-1.5">
              {filteredDrugs.length === 0 ? (
                <div className="text-[11px] text-slate-400 p-2 text-center">
                  ไม่พบรายการยาที่ตรงกับ "{searchQuery}"
                </div>
              ) : (
                filteredDrugs.map((d: any) => (
                  <div
                    key={d.drug_id}
                    onClick={() => handleAddDrug(d)}
                    className="p-1.5 hover:bg-purple-50 rounded-md cursor-pointer flex items-center justify-between text-xs transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{d.generic_name}</span>
                      <span className="text-[10px] text-slate-500 ml-1">({d.thai_name || d.brand_name})</span>
                      <span className="text-[9px] text-purple-700 block">{d.strength_mg} mg • บัญชี {d.nlem_category}</span>
                    </div>
                    <button
                      type="button"
                      className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-semibold shrink-0"
                    >
                      + เพิ่ม
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Quick Preset Buttons for Common History Regimens */}
          <div className="space-y-1 pt-1 border-t border-purple-200/60">
            <span className="text-[10px] text-purple-900 font-semibold block">
              หรือเลือกยาในประวัติที่พบบ่อย (1-Click History):
            </span>
            <div className="flex flex-wrap gap-1">
              {COMMON_NLEM_DRUGS.map((item) => (
                <button
                  key={item.generic}
                  type="button"
                  onClick={() => handleAddDrug({
                    drug_id: `MED-${item.generic.slice(0, 4).toUpperCase()}`,
                    generic_name: item.generic,
                    brand_name: item.brand,
                    dosage_form: item.form,
                    strength_mg: item.strength,
                    standard_regimen: { dose_per_admin_mg: item.strength, frequency_per_day: 1, timing: item.timing },
                  })}
                  className="text-[10px] bg-white border border-purple-200 hover:border-purple-400 text-purple-900 px-2 py-0.5 rounded-md transition shadow-2xs font-medium cursor-pointer"
                >
                  + {item.generic}
                </button>
              ))}
            </div>
          </div>

          {onOpenFullNlemCatalog && (
            <button
              type="button"
              onClick={onOpenFullNlemCatalog}
              className="w-full text-center py-1.5 text-[11px] text-blue-700 hover:text-blue-900 font-bold bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>เปิดฐานข้อมูลบัญชียาหลัก 1,080 รายการฉบับเต็ม →</span>
            </button>
          )}
        </div>
      )}

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
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>รายการยาและขนาดที่รับประทานจริง</span>
          <span className="text-[10px] text-slate-400 font-normal">ประวัติจาก HIS / NLEM</span>
        </div>

        {medications.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-400 space-y-1">
            <p>ไม่มีประวัติการใช้ยาแผนปัจจุบันในระบบ</p>
            {onUpdateMedications && (
              <button
                type="button"
                onClick={() => setIsAddingOpen(true)}
                className="text-xs text-purple-700 font-semibold hover:underline"
              >
                + คลิกเพื่อค้นหาเพิ่มยาแผนปัจจุบัน
              </button>
            )}
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
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                      {m.strength_mg} mg
                    </span>
                    {onUpdateMedications && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDrug(m.drug_id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="ลบยานี้ออกจากประวัติ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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
        <span>ข้อมูลเชื่อมต่อ HIS Adapter</span>
        <span className="font-mono">มาตรฐาน HL7 / FHIR</span>
      </div>
    </div>
  );
};
