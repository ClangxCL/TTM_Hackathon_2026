export interface PatientInfo {
  hn: string;
  name: string;
  gender: string;
  sex_code: string; // '1' | '2'
  age: number;
  birth_date: string;
  province: string;
  province_code: string;
  region: string;
  occupation: string;
  birth_element: string;
}

export interface AmbientContext {
  location: string;
  latitude: number;
  longitude: number;
  temperature_c: number;
  relative_humidity: number;
  weather_condition: string;
  kala_period: string;
}

export interface Vitals {
  btemp: number;
  sbp: number;
  dbp: number;
  pr: number;
  rr: number;
  weight_kg: number;
  height_cm: number;
  bmi: number;
}

export interface ChronicDisease {
  icd10: string;
  name: string;
  diag_date: string;
}

export interface CurrentMedication {
  drug_id: string;
  generic_name: string;
  brand_name: string;
  dosage_form: string;
  strength_mg: number;
  dose_per_admin_mg: number;
  frequency_per_day: number;
  timing: string;
  days: number;
  calculated_daily_dose_mg: number;
  route: string;
}

export interface PlannedProcedure {
  code: string;
  name: string;
  fee: number;
}

export interface HistoricalEpisode {
  vn: string;
  date: string;
  icd10tm_code: string;
  icd10tm_name: string;
  icd10_conventional: string;
  procedure: {
    code: string;
    name: string;
    fee_thb: number;
  };
  drug: {
    code_24: string;
    name: string;
    quantity: number;
    cost_thb: number;
  };
  total_cost_thb: number;
}

export interface SyntheticCase {
  case_id: string; // 'C01' ... 'C10'
  patient_info: PatientInfo;
  current_encounter: {
    vn: string;
    date: string;
    time: string;
    season: string;
    ambient_context: AmbientContext;
    chief_complaint: string;
    vitals: Vitals;
    symptoms: string[];
  };
  chronic_diseases: ChronicDisease[];
  current_medications: CurrentMedication[];
  intended_ttm_prescription: {
    drug_code_24: string;
    herb_name: string;
    dose_per_admin: number;
    unit: string;
    frequency_per_day: number;
    timing: string;
    days: number;
    total_dispensed: number;
    calculated_daily_dose_units: number;
    calculated_daily_dose_mg: number;
    instruction: string;
    is_overdose_demo: boolean;
  };
  planned_procedure: PlannedProcedure;
  expected_demo_outcome: {
    interaction_level: string;
    interaction_count: number;
    target_pair?: string;
    dosage_warning?: string;
    smutthan_dominant: string;
  };
  history_episodes: HistoricalEpisode[];
}
