import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyntheticCase } from '../types/patient';
import { ThaiHerbFormularyItem, PrescribedItem, DrugWarning } from '../types/drug';
import { MatchedInteractionResult } from '../types/hdi';
import { MockDataService } from '../services/mockDataService';
import { checkHerbDrugInteractions } from '../services/interactionMatcher';
import { validateDosageAndSafety } from '../services/dosageValidator';
import { PatientActiveMeds } from '../components/prescribing/PatientActiveMeds';
import { FormularySearch } from '../components/prescribing/FormularySearch';
import { PrescriptionForm } from '../components/prescribing/PrescriptionForm';
import { InteractionAlerts } from '../components/prescribing/InteractionAlerts';
import { PrescriptionCart } from '../components/prescribing/PrescriptionCart';
import { ArrowLeft, ArrowRight, Pill, ShieldAlert, Sparkles } from 'lucide-react';

interface PrescribePageProps {
  currentCase: SyntheticCase;
}

export const PrescribePage: React.FC<PrescribePageProps> = ({ currentCase }) => {
  const navigate = useNavigate();
  const formulary = MockDataService.getFormulary();

  // Find initial herb from intended case prescription
  const defaultHerb =
    formulary.find((h: ThaiHerbFormularyItem) => h.drug_code_24 === currentCase.intended_ttm_prescription.drug_code_24) ||
    formulary[0];

  const [selectedHerb, setSelectedHerb] = useState<ThaiHerbFormularyItem>(defaultHerb);
  const [cartItems, setCartItems] = useState<PrescribedItem[]>(() => {
    return MockDataService.getPrescriptions(currentCase.case_id);
  });

  // Calculate live matched interactions for the currently selected herb or cart items
  const activeMeds = currentCase.current_medications;

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
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition"
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
            className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-4 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
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
            medications={currentCase.current_medications}
            chronicDiseases={currentCase.chronic_diseases}
          />
        </div>

        {/* Column 2 (Middle 5 cols): Formulary Catalog & Prescribing Form */}
        <div className="lg:col-span-5 space-y-4">
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
