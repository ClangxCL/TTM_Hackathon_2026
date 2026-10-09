export interface StandardDosingRule {
  eligible_age_min?: number;
  dose_per_admin: number;
  dose_unit: string;
  frequency_per_day: number;
  timing: string;
  max_daily_dose_units: number;
  max_daily_dose_mg: number;
  max_duration_days: number;
}

export interface ThaiHerbFormularyItem {
  drug_code_24: string;
  ttmt_id: string;
  thai_name: string;
  common_name: string;
  scientific_name: string;
  herb_type: 'ยาเดี่ยว' | 'ยาตำรับ' | 'ยาสมุนไพรสกัด';
  dosage_form: string;
  strength_per_unit: string;
  unit_amount_mg: number;
  unit: string;
  unit_price_thb: number;
  taste: string;
  primary_element: string;
  indications: string[];
  contraindications: string[];
  precautions: {
    pregnancy_lactation: string;
    pediatric: string;
    elderly: string;
    hepatic_renal: string;
    drug_interactions: string;
  };
  standard_dosing: {
    adult: StandardDosingRule;
    child?: StandardDosingRule;
  };
  nlem_status: 'ใช่' | 'ไม่ใช่' | 'ยังไม่ตรวจสอบ';
  nlem_category: string;
  verification_status: string;
  source_reference: string;
}

export interface PrescribedItem {
  id: string;
  herb: ThaiHerbFormularyItem;
  dose_per_admin: number;
  frequency_per_day: number;
  timing: string;
  days: number;
  route: string;
  total_quantity: number;
  calculated_daily_dose_mg: number;
  calculated_daily_dose_units: number;
  instructions: string;
  special_notes?: string;
  reason_icd10tm?: string;
  warnings: DrugWarning[];
  acknowledged: boolean;
  acknowledgement_reason?: string;
}

export interface DrugWarning {
  type: 'OVERDOSE' | 'DURATION' | 'CONTRAINDICATION' | 'PRECAUTION' | 'INTERACTION';
  severity: 'HIGH' | 'MODERATE' | 'LOW' | 'UNCLEAR';
  title: string;
  message: string;
  recommendation: string;
}
