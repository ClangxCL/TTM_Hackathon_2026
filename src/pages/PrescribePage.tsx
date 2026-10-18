import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyntheticCase, CurrentMedication } from '../types/patient';
import { ThaiHerbFormularyItem, PrescribedItem, DrugWarning } from '../types/drug';
import { MatchedInteractionResult } from '../types/hdi';
import { MockDataService } from '../services/mockDataService';
import { checkHerbDrugInteractions } from '../services/interactionMatcher';
import { validateDosageAndSafety } from '../services/dosageValidator';
import { calculateSmutthan } from '../services/smutthanEngine';
import { HerbRecommendationService, HerbRecommendationResult } from '../services/herbRecommendationService';
import { PatientActiveMeds } from '../components/prescribing/PatientActiveMeds';
import { FormularySearch } from '../components/prescribing/FormularySearch';
import { PrescriptionForm } from '../components/prescribing/PrescriptionForm';
import { InteractionAlerts } from '../components/prescribing/InteractionAlerts';
import { PrescriptionCart } from '../components/prescribing/PrescriptionCart';
import {
  ArrowLeft,
  ArrowRight,
  Pill,
  ShieldAlert,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface PrescribePageProps {
  currentCase: SyntheticCase;
}

export const PrescribePage: React.FC<PrescribePageProps> = ({ currentCase }) => {
  const navigate = useNavigate();
  const formulary = MockDataService.getFormulary();

  // 1. Calculate Smutthan live to get dominant element & recommended tastes
  const smutthan = calculateSmutthan(
    currentCase.patient_info,
    currentCase.current_encounter.vitals,
    currentCase.current_encounter.symptoms,
    currentCase.current_encounter.ambient_context
  );

  // 2. Active medications state (synced with case, allows editing/adding on Prescribe page)
  const [activeMeds, setActiveMeds] = useState<CurrentMedication[]>([...currentCase.current_medications]);

  useEffect(() => {
    setActiveMeds([...currentCase.current_medications]);
  }, [currentCase.case_id]);

  const handleUpdateActiveMeds = (newMeds: CurrentMedication[]) => {
    setActiveMeds(newMeds);
    MockDataService.updateCaseMedications(currentCase.case_id, newMeds);
  };

  // 3. AI Herb Recommendations tailored to symptoms & element balance with live HDI
  const recommendations: HerbRecommendationResult[] = HerbRecommendationService.recommendHerbs(
    formulary,
    currentCase.current_encounter.symptoms,
    currentCase.current_encounter.chief_complaint,
    smutthan.dominant_element,
    smutthan.recommended_taste,
    activeMeds
  );

  // Find initial herb (prefer top AI recommendation, fallback to intended prescription)
  const defaultHerb =
    recommendations[0]?.herb ||
    formulary.find((h: ThaiHerbFormularyItem) => h.drug_code_24 === currentCase.intended_ttm_prescription.drug_code_24) ||
    formulary[0];

  const [selectedHerb, setSelectedHerb] = useState<ThaiHerbFormularyItem>(defaultHerb);
  const [cartItems, setCartItems] = useState<PrescribedItem[]>(() => {
    return MockDataService.getPrescriptions(currentCase.case_id);
  });

  // Real-time matched interactions for the currently focused herb
  const liveInteractions: MatchedInteractionResult[] = checkHerbDrugInteractions(
    activeMeds,
    selectedHerb.drug_code_24,
    selectedHerb.thai_name
  );

  const handleAddToCart = (newItem: Omit<PrescribedItem, 'id' | 'warnings' | 'acknowledged'>) => {
    // 1. Calculate dosage warnings
    const warnings: DrugWarning[] = validateDosageAndSafety({
      herb: newItem.herb,
      dose_per_admin: newItem.dose_per_admin,
      frequency_per_day: newItem.frequency_per_day,
      days: newItem.days,
      patient: currentCase.patient_info,
    });

    // 2. Calculate HDI warnings
    const matchedHdi = checkHerbDrugInteractions(
      activeMeds,
      newItem.herb.drug_code_24,
      newItem.herb.thai_name
    );

    matchedHdi.forEach((m: MatchedInteractionResult) => {
      warnings.push({
        type: 'INTERACTION',
        severity: m.interaction.severity_code,
        title: `อันตรกิริยากับ ${m.drug_name}`,
        message: m.interaction.clinical_effects,
        recommendation: m.interaction.recommendation,
      });
    });

    const itemWithId: PrescribedItem = {
      ...newItem,
      id: `RX-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      warnings,
      acknowledged: warnings.every((w) => w.severity !== 'HIGH'), // Auto acknowledge if not HIGH
    };

    const updatedCart = [...cartItems, itemWithId];
    setCartItems(updatedCart);
    MockDataService.savePrescription(currentCase.case_id, updatedCart);
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter((i) => i.id !== id);
    setCartItems(updatedCart);
    MockDataService.savePrescription(currentCase.case_id, updatedCart);
  };

  const handleAcknowledgeItem = (id: string, reason: string) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          acknowledged: true,
          acknowledgement_reason: reason,
        };
      }
      return item;
    });
    setCartItems(updatedCart);
    MockDataService.savePrescription(currentCase.case_id, updatedCart);
  };

  const handleConfirmPrescription = () => {
    MockDataService.savePrescription(currentCase.case_id, cartItems);
    navigate('/prescription-print');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4 px-4 sm:px-6">
      {/* Stepper Navigation */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-soft flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/smutthan')}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>1. ประเมินสมุฏฐาน</span>
          </button>
          <span className="text-slate-300">→</span>
          <div className="flex items-center gap-2 font-bold text-brand-800 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200">
            <span className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>สั่งยาแผนไทย & ตรวจอันตรกิริยา (Prescribing & HDI Check)</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">→</span>
          <span className="text-slate-400 hidden sm:inline">3. ยืนยันใบสั่งยา & ฉลากยา</span>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={handleConfirmPrescription}
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>พิมพ์ใบสั่งยา ({cartItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3-Column Clinical Prescribing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Column 1 (Left 3 cols): Active Medications & Chronic Diseases */}
        <div className="lg:col-span-3 space-y-4">
          <PatientActiveMeds
            patient={currentCase.patient_info}
            medications={activeMeds}
            chronicDiseases={currentCase.chronic_diseases}
            onUpdateMedications={handleUpdateActiveMeds}
          />
        </div>

        {/* Column 2 (Middle 5 cols): Formulary Catalog & Prescribing Form */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Recommended Herbs for Element Balance & Symptoms */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white rounded-2xl p-4 border border-teal-500/40 shadow-soft space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-teal-500/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <span>ยาแผนไทยแนะนำตามอาการและสมดุลธาตุ (AI Prescribe Guide)</span>
                  </h4>
                  <p className="text-[10px] text-teal-200/80">
                    ธาตุที่มีแนวโน้มแปรปรวน: <b className="text-white">{smutthan.dominant_element_th}</b> • รสยาปรับสมดุล:{' '}
                    <b className="text-amber-300">{smutthan.recommended_taste.join(', ')}</b>
                  </p>
                </div>
              </div>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                AI MATCHED
              </span>
            </div>

            {/* Top 2 Recommended Herb Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recommendations.slice(0, 2).map((rec) => {
                const isFocused = selectedHerb.drug_code_24 === rec.herb.drug_code_24;
                return (
                  <div
                    key={rec.herb.drug_code_24}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isFocused
                        ? 'bg-teal-500/20 border-teal-400 ring-1 ring-teal-400'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-teal-400/50'
                    }`}
                    onClick={() => setSelectedHerb(rec.herb)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">{rec.herb.thai_name}</span>
                        <span className="text-[10px] bg-teal-400/20 text-teal-200 border border-teal-400/40 px-1.5 py-0.2 rounded font-mono font-bold">
                          {rec.matchScore}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 line-clamp-2">
                        {rec.elementRationale}
                      </p>
                    </div>

                    <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
                      {rec.hdiRisk === 'HIGH' ? (
                        <span className="text-rose-300 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" /> เสี่ยง HDI สูง
                        </span>
                      ) : rec.hdiRisk === 'MODERATE' ? (
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-400" /> เฝ้าระวัง HDI
                        </span>
                      ) : (
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> ปลอดภัย ไม่พบ HDI
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHerb(rec.herb);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                          isFocused
                            ? 'bg-teal-400 text-slate-950 font-bold'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isFocused ? '✓ เลือกอยู่' : 'เลือกยานี้'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Pill className="w-4 h-4 text-brand-700" />
                <span>บัญชียาสมุนไพรและยาแผนไทย (Formulary)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                มาตรฐาน พ.ศ. 2568
              </span>
            </div>
            <FormularySearch
              formulary={formulary}
              selectedHerb={selectedHerb}
              onSelectHerb={setSelectedHerb}
              recommendations={recommendations}
            />
          </div>

          {/* Selected Herb Prescribing Form */}
          <PrescriptionForm
            herb={selectedHerb}
            patient={currentCase.patient_info}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Column 3 (Right 4 cols): Real-Time HDI Alerts & Prescription Cart */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Alerts for Currently Selected Herb */}
          <InteractionAlerts interactions={liveInteractions} />

          {/* Prescription Cart Basket */}
          <PrescriptionCart
            items={cartItems}
            onRemoveItem={handleRemoveItem}
            onAcknowledgeItem={handleAcknowledgeItem}
            onConfirmPrescription={handleConfirmPrescription}
          />
        </div>
      </div>
    </div>
  );
};
