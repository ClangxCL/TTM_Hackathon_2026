import { Vitals } from '../types/patient';
import rawIcd10tm from '../../data/master/icd10tm-master.json';

export interface DiagnosisCrosswalkItem {
  icd10tm_code: string;
  thai_diagnosis_name: string;
  traditional_concept: string;
  icd10_conventional_code: string;
  icd10_conventional_name: string;
  typical_ttm_treatment: string;
  category: string;
  verification_status: string;
  symptoms_keywords?: string[];
  conventional_clinical_clues?: string;
  conventional_treatment?: string;
  smutthan_element_impact?: string;
}

export interface DualDiagnosisSuggestion {
  item: DiagnosisCrosswalkItem;
  matchScore: number; // 0 - 100%
  matchedKeywords: string[];
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  clinicalRationale: {
    conventional: string;
    traditional: string;
  };
}

export interface DualDiagnosisRecommendationResult {
  primary: DualDiagnosisSuggestion;
  alternatives: DualDiagnosisSuggestion[];
  extractedSymptoms: string[];
  allCandidates: DualDiagnosisSuggestion[];
}

export class DualDiagnosisService {
  private static masterData: DiagnosisCrosswalkItem[] = rawIcd10tm as DiagnosisCrosswalkItem[];

  public static getMasterList(): DiagnosisCrosswalkItem[] {
    return this.masterData;
  }

  public static getDiagnosisByCode(codeOrQuery?: string): DiagnosisCrosswalkItem {
    if (!codeOrQuery) return this.masterData[0];
    const clean = codeOrQuery.trim().toLowerCase();
    const found = this.masterData.find(
      (item) =>
        item.icd10tm_code.toLowerCase() === clean ||
        item.icd10_conventional_code.toLowerCase() === clean ||
        clean.includes(item.icd10tm_code.toLowerCase()) ||
        clean.includes(item.icd10_conventional_code.toLowerCase()) ||
        item.thai_diagnosis_name.toLowerCase().includes(clean) ||
        item.icd10_conventional_name.toLowerCase().includes(clean)
    );
    return found || this.masterData[0];
  }

  /**
   * Recommends Conventional ICD-10 and maps side-by-side with ICD-10-TM
   * based on patient symptoms, chief complaint, and vitals.
   */
  public static recommendDualDiagnosis(
    symptoms: string[] = [],
    chiefComplaint: string = '',
    vitals?: Vitals,
    preferredIcdCode?: string
  ): DualDiagnosisRecommendationResult {
    const combinedText = `${chiefComplaint} ${symptoms.join(' ')}`.toLowerCase();

    const evaluated: DualDiagnosisSuggestion[] = this.masterData.map((item) => {
      const keywords = item.symptoms_keywords || [];
      const matchedKeywords: string[] = [];

      keywords.forEach((kw) => {
        const kwLower = kw.toLowerCase();
        if (combinedText.includes(kwLower)) {
          matchedKeywords.push(kw);
        }
      });

      // Calculate score based on match count
      let score = 40; // baseline
      if (matchedKeywords.length > 0) {
        score += Math.min(45, matchedKeywords.length * 15);
      }

      // Check vitals correlation
      if (vitals) {
        if (item.icd10_conventional_code === 'I10' && vitals.sbp >= 140) {
          score += 25;
          matchedKeywords.push(`ความดันสูง (${vitals.sbp}/${vitals.dbp} mmHg)`);
        }
        if (item.icd10_conventional_code === 'J00' && vitals.btemp >= 37.5) {
          score += 20;
          matchedKeywords.push(`มีไข้ (${vitals.btemp} °C)`);
        }
        if (item.icd10_conventional_code === 'M17.9' && vitals.bmi >= 28) {
          score += 10;
          matchedKeywords.push(`ดัชนีมวลกายสูง (BMI ${vitals.bmi})`);
        }
      }

      // If user had a prior code or preferred code that matches
      if (preferredIcdCode) {
        const prefLower = preferredIcdCode.toLowerCase();
        if (
          item.icd10tm_code.toLowerCase() === prefLower ||
          item.icd10_conventional_code.toLowerCase() === prefLower ||
          prefLower.includes(item.icd10tm_code.toLowerCase())
        ) {
          score += 15;
        }
      }

      score = Math.min(98, Math.max(35, Math.round(score)));

      let confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (score >= 75) confidenceLevel = 'HIGH';
      else if (score >= 55) confidenceLevel = 'MEDIUM';

      const conventionalRationale = matchedKeywords.length > 0
        ? `[ICD-10: ${item.icd10_conventional_code}] อาการ ${matchedKeywords.slice(0, 3).join(', ')} สอดคล้องกับพยาธิสภาพ ${item.conventional_clinical_clues || item.icd10_conventional_name}`
        : `[ICD-10: ${item.icd10_conventional_code}] ข้อบ่งชี้ทางคลินิกสอดคล้องกับกลุ่มโรค ${item.icd10_conventional_name}`;

      const traditionalRationale = `[ICD-10-TM: ${item.icd10tm_code}] ตามหลักเวชกรรมไทยจัดอยู่ในกลุ่ม ${item.thai_diagnosis_name} สอดคล้องกับสมุฏฐาน: ${item.smutthan_element_impact || item.traditional_concept}`;

      return {
        item,
        matchScore: score,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        confidenceLevel,
        clinicalRationale: {
          conventional: conventionalRationale,
          traditional: traditionalRationale,
        },
      };
    });

    // Sort descending by matchScore
    evaluated.sort((a, b) => b.matchScore - a.matchScore);

    const primary = evaluated[0];
    const alternatives = evaluated.slice(1, 4);

    return {
      primary,
      alternatives,
      extractedSymptoms: symptoms,
      allCandidates: evaluated,
    };
  }
}
