export interface Icd10tmUtilization {
  u_code: string;
  thai_name: string;
  conventional_code: string;
  case_count: number;
  total_procedure_fee: number;
  total_drug_cost: number;
  total_cost: number;
  average_cost_per_case: number;
}

export interface AnalyticsSummary {
  total_patients: number;
  total_visits: number;
  total_expenditure_thb: number;
  average_cost_per_episode_thb: number;
  ttm_drug_cost_thb: number;
  conventional_drug_cost_thb: number;
  procedure_cost_thb: number;
  ttm_to_conventional_ratio: number;
  utilization_by_code: Icd10tmUtilization[];
  monthly_trends: {
    month: string;
    visit_count: number;
    ttm_cost: number;
    conventional_cost: number;
  }[];
}

export interface FeedbackRecord {
  id: string;
  timestamp: string;
  case_id: string;
  clinician_name: string;
  usefulness_score: number; // 1 to 5
  warning_accuracy_score: number; // 1 to 5
  ux_score: number; // 1 to 5
  feedback_notes: string;
  overridden: boolean;
  override_details?: string;
}
