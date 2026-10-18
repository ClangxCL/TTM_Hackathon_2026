import React, { useState, useMemo } from 'react';
import { ConventionalDrugItem } from '../../types/drug';
import { CurrentMedication } from '../../types/patient';
import { MockDataService } from '../../services/mockDataService';
import { getAllInteractionsDatabase } from '../../services/interactionMatcher';
import { HerbDrugInteraction } from '../../types/hdi';
import {
  Pill,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldAlert,
  Info,
  ChevronRight,
  BookOpen,
  X,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Heart,
  Stethoscope,
} from 'lucide-react';

interface NlemFormularyCatalogProps {
  activeMeds: CurrentMedication[];
  onAddMedication: (drug: ConventionalDrugItem) => void;
  onRemoveMedication?: (drugId: string) => void;
  onSelectHerbPrescribeTab?: () => void;
}

const NLEM_CLINICAL_GROUPS = [
  { id: 'ALL', nameTh: 'ทุกกลุ่มระบบโรค (All)', count: 1080 },
  { id: '1. Gastro-intestinal system', nameTh: '1. ทางเดินอาหาร (GI)', icon: '🍽️' },
  { id: '2. Cardiovascular system', nameTh: '2. หัวใจและหลอดเลือด (CVS)', icon: '❤️' },
  { id: '3. Respiratory system', nameTh: '3. ทางเดินหายใจ (Respiratory)', icon: '🫁' },
  { id: '4. Central nervous system', nameTh: '4. ประสาทส่วนกลาง (CNS)', icon: '🧠' },
  { id: '5. Infections', nameTh: '5. โรคติดเชื้อ (Infections)', icon: '🦠' },
  { id: '6. Endocrine system', nameTh: '6. ต่อมไร้ท่อและเบาหวาน (Endocrine)', icon: '🩸' },
  { id: '7. Obstetrics, gynaecology and urinary-tract disorders', nameTh: '7. สูติ-นรีเวช & ทางเดินปัสสาวะ', icon: '🩺' },
  { id: '8. Malignant disease and immunosuppression', nameTh: '8. มะเร็ง & ยากดภูมิคุ้มกัน', icon: '🎗️' },
  { id: '9. Nutrition and blood', nameTh: '9. โภชนาการและโลหิตวิทยา', icon: '🍎' },
  { id: '10. Musculoskeletal and joint diseases', nameTh: '10. กล้ามเนื้อ กระดูก และข้อ', icon: '🦴' },
  { id: '11. Eye', nameTh: '11. ยาดวงตา (Ophthalmology)', icon: '👁️' },
  { id: '12. Ear, nose, oropharynx and oral cavity', nameTh: '12. หู คอ จมูก และช่องปาก (ENT)', icon: '👂' },
  { id: '13. Skin', nameTh: '13. ยาผิวหนัง (Dermatology)', icon: '🧴' },
  { id: '14. Immunological products and vaccines', nameTh: '14. วัคซีนและภูมิคุ้มกัน', icon: '💉' },
  { id: '15. Anaesthesia', nameTh: '15. ยาระงับความรู้สึก', icon: '💤' },
  { id: '16. Drugs used in poisoning and toxicology', nameTh: '16. ยาแก้พิษและสารพิษ', icon: '🧪' },
  { id: '17. Contrast media and Radiopharmaceuticals', nameTh: '17. สารทึบรังสีและเภสัชรังสี', icon: '☢️' },
];

export const NlemFormularyCatalog: React.FC<NlemFormularyCatalogProps> = ({
  activeMeds,
  onAddMedication,
  onRemoveMedication,
  onSelectHerbPrescribeTab,
}) => {
  const allDrugs: ConventionalDrugItem[] = useMemo(() => {
    return MockDataService.getConventionalDrugs();
  }, []);

  const allInteractions: HerbDrugInteraction[] = useMemo(() => {
    return getAllInteractionsDatabase();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyHdiRisks, setOnlyHdiRisks] = useState(false);
  const [expandedDrugId, setExpandedDrugId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(30);

  // Helper to test if a drug has known HDI interactions in database
  const getDrugInteractions = (drug: ConventionalDrugItem): HerbDrugInteraction[] => {
    const drugName = drug.generic_name.toLowerCase();
    const drugId = drug.drug_id?.toLowerCase() || '';

    return allInteractions.filter((rule) => {
      const ruleDrug = rule.drug_generic_name.toLowerCase();
      const ruleId = rule.drug_id?.toLowerCase() || '';
      return drugName.includes(ruleDrug) || ruleDrug.includes(drugName) || drugId === ruleId;
    });
  };

  // Filter drugs based on search query, group, category, and HDI filter
  const filteredDrugs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allDrugs.filter((drug) => {
      // 1. Group filter
      if (selectedGroup !== 'ALL') {
        const drugGroup = drug.group_name || drug.therapeutic_class || '';
        if (!drugGroup.toLowerCase().includes(selectedGroup.toLowerCase())) {
          return false;
        }
      }

      // 2. NLEM category filter
      if (selectedCategory !== 'ALL') {
        const cat = (drug.nlem_category || '').toUpperCase();
        if (selectedCategory === 'ก' && !cat.includes('ก')) return false;
        if (selectedCategory === 'ข' && !cat.includes('ข') && cat !== 'B') return false;
        if (selectedCategory === 'ค' && !cat.includes('ค')) return false;
        if (selectedCategory === 'ง' && !cat.includes('ง')) return false;
      }

      // 3. Known HDI risk filter
      if (onlyHdiRisks) {
        const interactions = getDrugInteractions(drug);
        if (interactions.length === 0) return false;
      }

      // 4. Text search
      if (!q) return true;

      const genericMatch = drug.generic_name.toLowerCase().includes(q);
      const thaiMatch = drug.thai_name && drug.thai_name.toLowerCase().includes(q);
      const atcMatch = drug.atc_code && drug.atc_code.toLowerCase().includes(q);
      const groupMatch = drug.group_name && drug.group_name.toLowerCase().includes(q);
      const subgroupMatch = drug.subgroup_name && drug.subgroup_name.toLowerCase().includes(q);
      const brandMatch = Array.isArray(drug.brand_names) && drug.brand_names.some((b) => b.toLowerCase().includes(q));
      const indicationMatch =
        (typeof drug.indications === 'string' && drug.indications.toLowerCase().includes(q)) ||
        (Array.isArray(drug.target_indications) && drug.target_indications.some((t) => t.toLowerCase().includes(q)));
      const conditionsMatch = drug.conditions && drug.conditions.toLowerCase().includes(q);

      return (
        genericMatch ||
        thaiMatch ||
        atcMatch ||
        groupMatch ||
        subgroupMatch ||
        brandMatch ||
        indicationMatch ||
        conditionsMatch
      );
    });
  }, [allDrugs, searchQuery, selectedGroup, selectedCategory, onlyHdiRisks, allInteractions]);

  const visibleDrugs = filteredDrugs.slice(0, displayLimit);

  // Check if a drug is already active in patient medication list
  const isDrugActive = (drug: ConventionalDrugItem) => {
    return activeMeds.some(
      (m) =>
        m.generic_name.toLowerCase() === drug.generic_name.toLowerCase() ||
        (drug.drug_id && m.drug_id.toLowerCase() === drug.drug_id.toLowerCase())
    );
  };

  const getActiveMedId = (drug: ConventionalDrugItem) => {
    const found = activeMeds.find(
      (m) =>
        m.generic_name.toLowerCase() === drug.generic_name.toLowerCase() ||
        (drug.drug_id && m.drug_id.toLowerCase() === drug.drug_id.toLowerCase())
    );
    return found ? found.drug_id : null;
  };

  // Helper for NLEM badge style
  const getNlemBadgeColor = (cat?: string) => {
    const c = (cat || '').toUpperCase();
    if (c.includes('ก')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (c.includes('ข') || c === 'B') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (c.includes('ค')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (c.includes('ง')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  return (
    <div className="space-y-4">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 border border-blue-500/30 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0">
              <Pill className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  บัญชียาหลักแห่งชาติ แผนปัจจุบัน (NLEM Formulary)
                </h3>
                <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  1,080 รายการ
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                อ้างอิงประกาศกระทรวงสาธารณสุข & กรมการแพทย์ (17 กลุ่มระบบโรคสากล) พร้อมระบบตรวจอันตรกิริยา HDI กับยาสมุนไพร
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onSelectHerbPrescribeTab && (
              <button
                type="button"
                onClick={onSelectHerbPrescribeTab}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>🌿 กลับสู่สั่งยาแผนไทย</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[10px] text-blue-300 block">จำนวนยาทั้งหมด</span>
            <span className="text-sm font-extrabold text-white">1,080 รายการ</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[10px] text-emerald-300 block">กลุ่มโรคสากล</span>
            <span className="text-sm font-extrabold text-white">17 กลุ่มคลินิก</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[10px] text-amber-300 block">หมวดหมู่ NLEM</span>
            <span className="text-sm font-extrabold text-white">บัญชี ก, ข, ค, ง</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
            <span className="text-[10px] text-rose-300 block">ยาในประวัติผู้ป่วยขณะนี้</span>
            <span className="text-sm font-extrabold text-emerald-400">
              {activeMeds.length} รายการ (HIS Sync)
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อยา (Generic name), ชื่อภาษาไทย, ชื่อการค้า, กลุ่มโรค, ข้อบ่งใช้ หรือรหัส ATC..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayLimit(30);
            }}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-inner font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1">
          {/* NLEM Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              หมวดยา:
            </span>
            {[
              { id: 'ALL', label: 'ทั้งหมด (All)' },
              { id: 'ก', label: 'บัญชี ก (พื้นฐาน)' },
              { id: 'ข', label: 'บัญชี ข (มีเงื่อนไข)' },
              { id: 'ค', label: 'บัญชี ค (เฉพาะทาง)' },
              { id: 'ง', label: 'บัญชี ง (พิเศษ)' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setDisplayLimit(30);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* HDI Risk Toggle */}
          <button
            type="button"
            onClick={() => {
              setOnlyHdiRisks(!onlyHdiRisks);
              setDisplayLimit(30);
            }}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              onlyHdiRisks
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>⚠️ กรองเฉพาะยาที่มีอันตรกิริยา HDI</span>
          </button>
        </div>

        {/* 17 Clinical Group Selector Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              17 กลุ่มระบบโรค (Clinical Systems):
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              พบ {filteredDrugs.length} รายการ
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {NLEM_CLINICAL_GROUPS.map((grp) => {
              const isSelected = selectedGroup === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(grp.id);
                    setDisplayLimit(30);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition shrink-0 flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-800 text-white font-bold shadow-xs'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {grp.icon && <span>{grp.icon}</span>}
                  <span>{grp.nameTh}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drug Results List */}
      <div className="space-y-3">
        {visibleDrugs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
            <Pill className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">ไม่พบรายการยาที่ตรงกับเงื่อนไขค้นหา</h4>
            <p className="text-xs text-slate-400">
              ลองค้นหาด้วยคำอื่น เช่น Generic name หรือเปลี่ยนกลุ่มระบบโรค
            </p>
          </div>
        ) : (
          visibleDrugs.map((drug) => {
            const isActive = isDrugActive(drug);
            const activeId = getActiveMedId(drug);
            const interactions = getDrugInteractions(drug);
            const isExpanded = expandedDrugId === drug.drug_id;

            return (
              <div
                key={drug.drug_id}
                className={`bg-white rounded-2xl p-4 border transition shadow-soft space-y-3 ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-300'
                    : 'border-slate-200/80 hover:border-blue-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{drug.generic_name}</span>
                      </h4>

                      {/* Thai Name */}
                      {drug.thai_name && (
                        <span className="text-xs text-slate-600 font-medium">
                          ({drug.thai_name})
                        </span>
                      )}

                      {/* NLEM Category badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getNlemBadgeColor(
                          drug.nlem_category
                        )}`}
                      >
                        บัญชี {drug.nlem_category?.toUpperCase() || 'ก'}
                      </span>

                      {/* ATC Code */}
                      {drug.atc_code && (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          ATC: {drug.atc_code}
                        </span>
                      )}

                      {/* Active in patient badge */}
                      {isActive && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>อยู่ในประวัติยาผู้ป่วย</span>
                        </span>
                      )}

                      {/* HDI Warning tag */}
                      {interactions.length > 0 && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>พบอันตรกิริยา HDI ({interactions.length} ตำรับ)</span>
                        </span>
                      )}
                    </div>

                    {/* Group & Subgroup */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-blue-900">
                        {drug.group_name || drug.therapeutic_class}
                      </span>
                      {drug.subgroup_name && (
                        <>
                          <span>›</span>
                          <span className="text-slate-600">{drug.subgroup_name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    {isActive ? (
                      onRemoveMedication && activeId && (
                        <button
                          type="button"
                          onClick={() => onRemoveMedication(activeId)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold transition cursor-pointer"
                        >
                          ลบออกจากประวัติยา
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddMedication(drug)}
                        className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ นำเข้าประวัติยาผู้ป่วย</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandedDrugId(isExpanded ? null : drug.drug_id)}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                      title={isExpanded ? 'ย่อรายละเอียด' : 'ดูรายละเอียดทางคลินิก'}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">รูปแบบยา & ขนาดยา:</span>
                    <span className="font-semibold text-slate-800">
                      {drug.dosage_form || 'Tablet'}{' '}
                      {drug.strength_description || `${drug.strength_mg || 5} mg`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">ทางบริหารยา (Route):</span>
                    <span className="font-semibold text-slate-800">
                      {drug.route || 'Oral'} ({drug.standard_regimen?.timing || 'ตามแพทย์สั่ง'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">ข้อบ่งใช้หลัก (Indication):</span>
                    <span className="font-medium text-slate-700 truncate block">
                      {typeof drug.indications === 'string'
                        ? drug.indications
                        : drug.target_indications?.join(', ') || '-'}
                    </span>
                  </div>
                </div>

                {/* Expanded Clinical Details */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs">
                    {/* Brand names */}
                    {Array.isArray(drug.brand_names) && drug.brand_names.length > 0 && (
                      <div>
                        <span className="font-bold text-[10px] text-slate-500 uppercase block">
                          ชื่อการค้า (Brand Names):
                        </span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {drug.brand_names.map((b) => (
                            <span
                              key={b}
                              className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 text-[11px]"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Conditions and safety notes */}
                    {(drug.conditions || drug.critical_safety_notes || drug.notes) && (
                      <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 text-amber-950 space-y-1">
                        <span className="font-bold text-[10px] text-amber-800 uppercase block flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>เงื่อนไขและข้อควรระวังพิเศษ (Safety Precautions):</span>
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          {drug.conditions !== '-' && drug.conditions ? drug.conditions : ''}{' '}
                          {drug.critical_safety_notes !== '-' && drug.critical_safety_notes
                            ? drug.critical_safety_notes
                            : ''}{' '}
                          {drug.notes && drug.notes !== '-' ? `(หมายเหตุ: ${drug.notes})` : ''}
                        </p>
                      </div>
                    )}

                    {/* Matched Herb Interactions Details */}
                    {interactions.length > 0 && (
                      <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 space-y-2">
                        <div className="font-bold text-rose-900 text-[11px] flex items-center gap-1">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>
                            ข้อมูลอันตรกิริยาระหว่าง {drug.generic_name} กับยาสมุนไพรในระบบ TTM:
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {interactions.map((rule) => (
                            <div
                              key={rule.interaction_id}
                              className="bg-white p-2 rounded-lg border border-rose-200/80 text-[11px] space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">
                                  🌿 {rule.herb_thai_name} ({rule.herb_generic_name})
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                    rule.severity_code === 'HIGH'
                                      ? 'bg-rose-600 text-white'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  ระดับความรุนแรง: {rule.severity}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                <b>ผลทางคลินิก:</b> {rule.clinical_effects}
                              </p>
                              <p className="text-emerald-800 font-medium">
                                <b>คำแนะนำ:</b> {rule.recommendation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reference */}
                    {drug.source_reference && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        แหล่งอ้างอิง: {drug.source_reference}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Load More Button */}
        {filteredDrugs.length > visibleDrugs.length && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setDisplayLimit((prev) => prev + 30)}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300 shadow-2xs cursor-pointer"
            >
              แสดงรายการยาเพิ่มเติม (+30) จากทั้งหมด {filteredDrugs.length} รายการ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
