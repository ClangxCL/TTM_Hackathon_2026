export type MonitoringRiskLevel = 'HIGH' | 'MODERATE' | 'LOW';

export type MonitoringCategory =
  | 'HDI_SAFETY'
  | 'VITALS_SYMPTOMS'
  | 'ELEMENT_BALANCE'
  | 'ADHERENCE'
  | 'LAB_VALUES';

export type FollowUpModality = 'FACILITY' | 'TELEMED' | 'SELF_LOG' | 'LAB';

export type FollowUpStatus = 'COMPLETED' | 'NEXT_DUE' | 'PLANNED';

export interface MonitoringDomain {
  id: string;
  category: MonitoringCategory;
  title: string;
  description: string;
  what_to_monitor: string;
  how_to_monitor: string;
  modality: FollowUpModality;
  target_indicator: string;
  danger_signs: string;
  frequency_note: string;
}

export interface MonthlyCadence {
  month_number: number;
  month_label: string;
  recommended_visits_per_month: number;
  frequency_rationale: string;
  guideline_reference: string;
  key_milestones: string[];
  check_items: string[];
}

export interface FollowUpMilestone {
  visit_number: number;
  due_date_offset_days: number;
  scheduled_date: string;
  timing_label: string;
  modality: FollowUpModality;
  modality_label: string;
  focus: string;
  status: FollowUpStatus;
  key_actions: string[];
  doctor_notes?: string;
}

export interface TrajectoryDataPoint {
  visit_label: string;
  date: string;
  is_projected: boolean;
  pain_score: number; // 0-10
  symptom_severity: number; // 0-100%
  earth_score: number;
  water_score: number;
  wind_score: number;
  fire_score: number;
  sbp: number;
  dbp: number;
  pr: number;
  adherence_rate: number; // 0-100%
  cost_thb: number;
  cumulative_cost_thb: number;
  clinical_summary: string;
}

export interface PromHealthScore {
  physical_dimension: number; // 0-100
  mental_dimension: number;
  social_dimension: number;
  spiritual_dimension: number;
  overall_score: number;
}

export interface HolisticSelfCarePlan {
  diet_recommendations: string[];
  avoid_foods: string[];
  exercise_ruesi_dutton: string[];
  lifestyle_behaviors: string[];
  emergency_red_flags: string[];
}

export interface PatientCarePlan {
  patient_hn: string;
  patient_name: string;
  case_id: string;
  risk_level: MonitoringRiskLevel;
  risk_label: string;
  guideline_source: string;
  prescribed_herb_name: string;
  western_medications: string[];
  
  // Therapeutic Goals
  therapeutic_goals: {
    short_term_weeks_1_2: string[];
    medium_term_months_1_3: string[];
    long_term_months_3_6: string[];
  };

  // 4 Monitoring Core Domains
  monitoring_domains: MonitoringDomain[];

  // Monthly Academic Cadence (Months 1 to 6)
  monthly_cadence: MonthlyCadence[];

  // 6-Month Actionable Milestones Timeline
  follow_up_schedule: FollowUpMilestone[];

  // Longitudinal Prognosis & Trajectory
  prognosis: {
    response_status: 'EXCELLENT' | 'GOOD' | 'STABLE' | 'NEEDS_MONITORING';
    response_label: string;
    overall_adherence_percent: number;
    prom_score: PromHealthScore;
    cumulative_spend_thb: number;
    trajectory_points: TrajectoryDataPoint[];
  };

  // Holistic Self-Care Prescription
  holistic_care: HolisticSelfCarePlan;
}
