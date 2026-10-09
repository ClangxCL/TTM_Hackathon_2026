export interface ElementScores {
  earth: number; // ปถวี
  water: number; // อาโป
  wind: number;  // วาโย
  fire: number;  // เตโช
}

export interface RuleImpact {
  category: 'อุตุสมุฏฐาน (อากาศ)' | 'กาลสมุฏฐาน (เวลา)' | 'อายุสมุฏฐาน (วัย)' | 'สัญญาณชีพ' | 'อาการสำคัญ' | 'ธาตุกำเนิด';
  rule_title: string;
  condition_matched: string;
  delta: Partial<ElementScores>;
  reason_th: string;
}

export interface SmutthanAnalysisResult {
  scores: ElementScores;
  dominant_element: 'earth' | 'water' | 'wind' | 'fire';
  dominant_element_th: string;
  status: 'กำเริบ (Aggravated)' | 'หย่อน (Deficient)' | 'สมดุล (Normal)' | 'พิการ (Vitiated)';
  clinical_summary: string;
  reasons_list: RuleImpact[];
  recommended_taste: string[];
  lifestyle_advice: string[];
  disclaimer: string;
  ai_explanation?: string;
  is_ai_generated?: boolean;
}

export interface ClinicianOverride {
  clinician_id: string;
  clinician_name: string;
  original_dominant: string;
  overridden_dominant: string;
  agreed: boolean;
  notes: string;
  timestamp: string;
}
