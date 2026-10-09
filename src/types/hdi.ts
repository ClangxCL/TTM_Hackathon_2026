export type InteractionSeverity = 'สูง' | 'ปานกลาง' | 'ต่ำ' | 'ไม่มีข้อมูล';
export type InteractionSeverityCode = 'HIGH' | 'MODERATE' | 'LOW' | 'UNCLEAR';

export interface HerbDrugInteraction {
  interaction_id: string;
  case_reference?: string;
  herb_code_24: string;
  herb_thai_name: string;
  herb_generic_name: string;
  drug_id: string;
  drug_generic_name: string;
  atc_code: string;
  severity: InteractionSeverity;
  severity_code: InteractionSeverityCode;
  mechanism: string;
  clinical_effects: string;
  recommendation: string;
  evidence_level: 'A' | 'B' | 'C' | 'D';
  sources: string;
  reviewer: string;
  review_date: string;
  version: string;
  data_disclaimer: string;
}

export interface MatchedInteractionResult {
  interaction: HerbDrugInteraction;
  herb_name: string;
  drug_name: string;
  patient_active_dose?: string;
}
