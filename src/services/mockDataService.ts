import { SyntheticCase, PatientInfo } from '../types/patient';
import { ThaiHerbFormularyItem, PrescribedItem } from '../types/drug';
import { HerbDrugInteraction } from '../types/hdi';
import { FeedbackRecord } from '../types/analytics';
import { ClinicianOverride } from '../types/smutthan';

import rawCases from '../../data/synthetic/cases.json';
import rawFormulary from '../../data/formulary/thai-formulary.json';
import rawInteractions from '../../data/hdi/herb-drug-interactions.json';
import rawIcd10tm from '../../data/master/icd10tm-master.json';

const STORAGE_KEY_CASES = 'ttm_synthetic_cases_v1';
const STORAGE_KEY_PRESCRIPTIONS = 'ttm_prescriptions_v1';
const STORAGE_KEY_FEEDBACKS = 'ttm_feedbacks_v1';
const STORAGE_KEY_OVERRIDES = 'ttm_overrides_v1';

export class MockDataService {
  private static cases: SyntheticCase[] = [];
  private static formulary: ThaiHerbFormularyItem[] = [];
  private static interactions: HerbDrugInteraction[] = [];

  private static isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public static initialize(): void {
    // 1. Load cases from localStorage or fallback to bundled JSON
    if (this.isStorageAvailable()) {
      const storedCases = localStorage.getItem(STORAGE_KEY_CASES);
      if (storedCases) {
        try {
          const parsed = JSON.parse(storedCases);
          if (Array.isArray(parsed) && parsed.length >= (rawCases as any[]).length) {
            this.cases = parsed;
          } else {
            // Keep custom added cases and ensure all bundled 30 cases are present
            const customOnly = Array.isArray(parsed)
              ? parsed.filter((c: any) => c.case_id.startsWith('CUSTOM') || !c.case_id.match(/^C(?:0[1-9]|[12][0-9]|30)$/))
              : [];
            this.cases = [...customOnly, ...(rawCases as SyntheticCase[])];
            this.saveCases();
          }
        } catch {
          this.cases = rawCases as SyntheticCase[];
        }
      } else {
        this.cases = rawCases as SyntheticCase[];
        this.saveCases();
      }
    } else {
      this.cases = rawCases as SyntheticCase[];
    }

    this.formulary = rawFormulary as ThaiHerbFormularyItem[];
    this.interactions = rawInteractions as HerbDrugInteraction[];
  }

  public static getCases(): SyntheticCase[] {
    if (this.cases.length === 0) this.initialize();
    return this.cases;
  }

  public static getCaseById(caseId: string): SyntheticCase | undefined {
    return this.getCases().find((c) => c.case_id.toLowerCase() === caseId.toLowerCase());
  }

  public static addCustomCase(newCase: SyntheticCase): void {
    if (this.cases.length === 0) this.initialize();
    this.cases = [newCase, ...this.cases];
    this.saveCases();
  }

  public static deleteCase(caseId: string): void {
    if (this.cases.length === 0) this.initialize();
    this.cases = this.cases.filter((c) => c.case_id !== caseId);
    this.saveCases();
  }

  public static calculateBirthElement(month: number): { element: string; desc: string } {
    if ([4, 5, 6].includes(month)) {
      return { element: 'เตโชธาตุ (ธาตุไฟ)', desc: 'เดือน 5, 6, 7 (เมษายน - มิถุนายน)' };
    } else if ([7, 8, 9].includes(month)) {
      return { element: 'วาโยธาตุ (ธาตุลม)', desc: 'เดือน 8, 9, 10 (กรกฎาคม - กันยายน)' };
    } else if ([10, 11, 12].includes(month)) {
      return { element: 'อาโปธาตุ (ธาตุน้ำ)', desc: 'เดือน 11, 12, 1 (ตุลาคม - ธันวาคม)' };
    } else {
      return { element: 'ปถวีธาตุ (ธาตุดิน)', desc: 'เดือน 2, 3, 4 (มกราคม - มีนาคม)' };
    }
  }

  public static updateCaseVitalsAndSymptoms(
    caseId: string,
    vitals: SyntheticCase['current_encounter']['vitals'],
    symptoms: string[]
  ): void {
    const c = this.getCaseById(caseId);
    if (c) {
      c.current_encounter.vitals = vitals;
      c.current_encounter.symptoms = symptoms;
      this.saveCases();
    }
  }

  public static getFormulary(): ThaiHerbFormularyItem[] {
    if (this.formulary.length === 0) this.initialize();
    return this.formulary;
  }

  public static getInteractions(): HerbDrugInteraction[] {
    if (this.interactions.length === 0) this.initialize();
    return this.interactions;
  }

  public static getIcd10tmMaster() {
    return rawIcd10tm;
  }

  public static getDiagnosisCrosswalk(codeOrQuery?: string) {
    if (!codeOrQuery) return rawIcd10tm[0];
    const match = rawIcd10tm.find(
      (item) =>
        item.icd10tm_code.toLowerCase() === codeOrQuery.toLowerCase() ||
        codeOrQuery.toLowerCase().includes(item.icd10tm_code.toLowerCase()) ||
        item.thai_diagnosis_name.includes(codeOrQuery)
    );
    return match || rawIcd10tm[0];
  }

  // Prescriptions Persistence
  public static savePrescription(caseId: string, items: PrescribedItem[]): void {
    if (!this.isStorageAvailable()) return;
    const existingStr = localStorage.getItem(STORAGE_KEY_PRESCRIPTIONS);
    const existing: { [caseId: string]: PrescribedItem[] } = existingStr ? JSON.parse(existingStr) : {};
    existing[caseId] = items;
    localStorage.setItem(STORAGE_KEY_PRESCRIPTIONS, JSON.stringify(existing));
  }

  public static getPrescriptions(caseId: string): PrescribedItem[] {
    if (!this.isStorageAvailable()) return [];
    const existingStr = localStorage.getItem(STORAGE_KEY_PRESCRIPTIONS);
    if (!existingStr) return [];
    const existing = JSON.parse(existingStr);
    return existing[caseId] || [];
  }

  // Clinician Overrides Persistence
  public static saveOverride(record: ClinicianOverride): void {
    if (!this.isStorageAvailable()) return;
    const list = this.getOverrides();
    list.push(record);
    localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(list));
  }

  public static getOverrides(): ClinicianOverride[] {
    if (!this.isStorageAvailable()) return [];
    const stored = localStorage.getItem(STORAGE_KEY_OVERRIDES);
    return stored ? JSON.parse(stored) : [];
  }

  // Feedbacks Persistence
  public static saveFeedback(feedback: FeedbackRecord): void {
    if (!this.isStorageAvailable()) return;
    const list = this.getFeedbacks();
    list.push(feedback);
    localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(list));
  }

  public static getFeedbacks(): FeedbackRecord[] {
    if (!this.isStorageAvailable()) return [];
    const stored = localStorage.getItem(STORAGE_KEY_FEEDBACKS);
    return stored ? JSON.parse(stored) : [];
  }

  public static resetToFactoryDefaults(): void {
    if (this.isStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEY_CASES);
      localStorage.removeItem(STORAGE_KEY_PRESCRIPTIONS);
      localStorage.removeItem(STORAGE_KEY_FEEDBACKS);
      localStorage.removeItem(STORAGE_KEY_OVERRIDES);
    }
    this.cases = rawCases as SyntheticCase[];
    this.saveCases();
  }

  private static saveCases(): void {
    if (this.isStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(this.cases));
    }
  }
}
