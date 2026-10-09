import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyntheticCase, Vitals } from '../types/patient';
import { calculateSmutthan } from '../services/smutthanEngine';
import { generateClinicalExplanation } from '../services/aiExplainerService';
import { ElementRadarChart } from '../components/smutthan/ElementRadarChart';
import { ExplainableFactors } from '../components/smutthan/ExplainableFactors';
import { VitalsInputForm } from '../components/smutthan/VitalsInputForm';
import { MockDataService } from '../services/mockDataService';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface SmutthanPageProps {
  currentCase: SyntheticCase;
  onUpdateCaseVitals: (vitals: Vitals, symptoms: string[]) => void;
}

export const SmutthanPage: React.FC<SmutthanPageProps> = ({
  currentCase,
  onUpdateCaseVitals,
}) => {
  const navigate = useNavigate();

  // Local state for live recalculation
  const [vitals, setVitals] = useState<Vitals>({ ...currentCase.current_encounter.vitals });
  const [symptoms, setSymptoms] = useState<string[]>([...currentCase.current_encounter.symptoms]);

  // Override modal state
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideElement, setOverrideElement] = useState<'earth' | 'water' | 'wind' | 'fire'>('wind');
  const [overrideNote, setOverrideNote] = useState('');
  const [hasOverridden, setHasOverridden] = useState(false);

  // AI synthesized clinical note
  const [aiNote, setAiNote] = useState<string>('');

  // Calculate Smutthan live
  const analysis = calculateSmutthan(
    currentCase.patient_info,
    vitals,
    symptoms,
    currentCase.current_encounter.ambient_context
  );

  useEffect(() => {
    generateClinicalExplanation(
      analysis,
      currentCase.current_encounter.ambient_context,
      currentCase.patient_info.age
    ).then((res: { text: string; source: 'genai' | 'template' }) => {
      setAiNote(res.text);
    });
  }, [vitals, symptoms, currentCase]);

  const handleVitalsUpdate = (newVitals: Vitals, newSymptoms: string[]) => {
    setVitals(newVitals);
    setSymptoms(newSymptoms);
    onUpdateCaseVitals(newVitals, newSymptoms);
  };

  const handleResetVitals = () => {
    const originalVitals = currentCase.current_encounter.vitals;
    const originalSymptoms = currentCase.current_encounter.symptoms;
    setVitals(originalVitals);
    setSymptoms(originalSymptoms);
    onUpdateCaseVitals(originalVitals, originalSymptoms);
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    MockDataService.saveOverride({
      clinician_id: 'TTM-DOC-001',
      clinician_name: 'พท.ป. ผู้ตรวจรักษา',
      original_dominant: analysis.dominant_element_th,
      overridden_dominant: overrideElement,
      agreed: false,
      notes: overrideNote || 'แพทย์มีความเห็นต่างจากผลการประเมินอัตโนมัติเนื่องจากอาการเฉพาะที่',
      timestamp: new Date().toISOString(),
    });
    setHasOverridden(true);
    setIsOverrideModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 px-4 sm:px-6">
      {/* Stepper Navigation */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-soft flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-brand-800 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
            <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>ประเมินสมุฏฐานวินิจฉัย (Smutthan Engine)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">→</span>
          <span className="text-slate-400 hidden sm:inline">2. สั่งยาแผนไทย & ตรวจ HDI</span>
          <span className="text-slate-300 hidden sm:inline">→</span>
          <span className="text-slate-400 hidden sm:inline">3. ยืนยันใบสั่งยา & ฉลากยา</span>
        </div>

        <button
          onClick={() => navigate('/prescribe')}
          className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <span>ไปขั้นตอนสั่งยา</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Radar Chart & Explainability */}
        <div className="lg:col-span-7 space-y-4">
          {/* Radar Chart */}
          <ElementRadarChart
            scores={analysis.scores}
            dominantElement={analysis.dominant_element}
            status={analysis.status}
          />

          {/* Clinical Dominant Result & Recommendation Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  ผลการวิเคราะห์สมุฏฐานโดยสรุป
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  ธาตุที่มีแนวโน้มแปรปรวนสูงสุด: <span className="text-brand-800">{analysis.dominant_element_th}</span>
                </h3>
              </div>

              {/* Clinician Override Trigger */}
              <button
                onClick={() => setIsOverrideModalOpen(true)}
                className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1 transition ${
                  hasOverridden
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>{hasOverridden ? 'แพทย์ Override แล้ว' : 'ปรับเปลี่ยนผล (Override)'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              {analysis.clinical_summary}
            </p>

            {/* Recommendations: Taste and Lifestyle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl">
                <span className="font-bold text-amber-900 block mb-1">
                  รสยาที่แนะนำเพื่อปรับสมดุล (9 Tastes):
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.recommended_taste.map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-white/80 text-amber-800 border border-amber-300/80 px-2 py-0.5 rounded text-[11px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-teal-50/60 border border-teal-200/70 rounded-xl">
                <span className="font-bold text-teal-900 block mb-1">
                  คำแนะนำการปฏิบัติตัว (Lifestyle Advice):
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  {analysis.lifestyle_advice.slice(0, 2).map((adv: string, idx: number) => (
                    <li key={idx} className="truncate">
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Explainable AI Rules Breakdown */}
          <ExplainableFactors
            reasons={analysis.reasons_list}
            aiExplanation={aiNote}
            isAiGenerated={false}
          />
        </div>

        {/* Right Column (5 cols): Vitals & Patient Context */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Editable Vitals & Symptoms Form */}
          <VitalsInputForm
            initialVitals={vitals}
            initialSymptoms={symptoms}
            chiefComplaint={currentCase.current_encounter.chief_complaint}
            onUpdate={handleVitalsUpdate}
            onReset={handleResetVitals}
          />

          {/* Patient 5 Smutthan Factors Profile */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft space-y-3">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-700" />
              <span>องค์ประกอบสมุฏฐานทั้ง 5 ประการของผู้ป่วย</span>
            </h4>

            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pt-1 flex items-center justify-between">
                <span className="text-slate-500">1. ธาตุสมุฏฐาน (กำเนิด):</span>
                <span className="font-semibold text-slate-900">{currentCase.patient_info.birth_element}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">2. ฤตุสมุฏฐาน (ฤดูกาล):</span>
                <span className="font-semibold text-brand-800">{currentCase.current_encounter.season}</span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">3. กาลสมุฏฐาน (เวลา):</span>
                <span className="font-semibold text-slate-900">
                  {currentCase.current_encounter.ambient_context.kala_period}
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">4. อายุสมุฏฐาน (ช่วงวัย):</span>
                <span className="font-semibold text-slate-900">
                  {currentCase.patient_info.age <= 16
                    ? 'ปฐมวัย (อาโปธาตุ)'
                    : currentCase.patient_info.age <= 32
                    ? 'มัชฌิมวัย (เตโชธาตุ)'
                    : 'ปัจฉิมวัย (วาโยธาตุ)'}
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">5. ประเทศสมุฏฐาน (ถิ่นที่อยู่):</span>
                <span className="font-semibold text-slate-900">{currentCase.patient_info.region}</span>
              </div>
            </div>
          </div>

          {/* Forward Action Card */}
          <div className="bg-gradient-to-br from-brand-700 to-teal-800 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="font-bold text-sm">พร้อมเข้าสู่ขั้นตอนการสั่งยาสมุนไพร</div>
            <p className="text-xs text-brand-100 leading-relaxed">
              ผลการประเมินสมุฏฐานจะถูกส่งต่อเข้าสู่โมดูลสั่งยา เพื่อช่วยเลือกยาสมุนไพรและตรวจสอบอันตรกิริยากับยาแผนปัจจุบันโดยอัตโนมัติ
            </p>
            <button
              onClick={() => navigate('/prescribe')}
              className="w-full bg-white text-brand-900 hover:bg-brand-50 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>ดำเนินการสั่งยาแผนไทย (Prescribe Module)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clinician Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-modal">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Edit3 className="w-5 h-5 text-brand-700" />
              <span>ปรับเปลี่ยนผลการวินิจฉัยธาตุประธาน (Clinician Override)</span>
            </div>
            <p className="text-xs text-slate-500">
              บันทึกการตัดสินใจของผู้ประกอบวิชาชีพ เพื่อความโปร่งใสและศึกษาความสอดคล้องระหว่างแพทย์กับระบบ AI (Human-in-the-loop)
            </p>

            <form onSubmit={handleSaveOverride} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  เลือกธาตุประธานที่แพทย์ประเมิน:
                </label>
                <select
                  value={overrideElement}
                  onChange={(e) => setOverrideElement(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="wind">วาโยธาตุ (ธาตุลม) - ลมกำเริบ</option>
                  <option value="fire">เตโชธาตุ (ธาตุไฟ) - ไฟกำเริบ</option>
                  <option value="water">อาโปธาตุ (ธาตุน้ำ) - น้ำกำเริบ</option>
                  <option value="earth">ปถวีธาตุ (ธาตุดิน) - ดินกำเริบ/หย่อน</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ระบุเหตุผลทางคลินิกของการปรับเปลี่ยน:
                </label>
                <textarea
                  rows={3}
                  value={overrideNote}
                  onChange={(e) => setOverrideNote(e.target.value)}
                  placeholder="เช่น ผู้ป่วยมีอาการปวดกล้ามเนื้อเฉพาะที่เด่นชัดกว่าสัญญาณชีพ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOverrideModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl font-semibold bg-brand-700 hover:bg-brand-800 text-white shadow-sm"
                >
                  บันทึกการ Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
