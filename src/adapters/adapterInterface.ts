import { PatientInfo, Vitals, CurrentMedication, ChronicDisease, HistoricalEpisode } from '../types/patient';
import { ThaiHerbFormularyItem, PrescribedItem } from '../types/drug';
import { SmutthanAnalysisResult } from '../types/smutthan';

export interface TtmIntegrationAdapter {
  name: string;
  isAvailable(): boolean;
  getPatient(id: string): Promise<PatientInfo | null>;
  getVitals(id: string): Promise<Vitals | null>;
  getMedications(id: string): Promise<CurrentMedication[]>;
  getDiagnoses(id: string): Promise<ChronicDisease[]>;
  getHistoricalEpisodes(id: string): Promise<HistoricalEpisode[]>;
  getFormulary(): Promise<ThaiHerbFormularyItem[]>;
  savePrescription(caseId: string, items: PrescribedItem[]): Promise<{ success: boolean; transaction_id: string }>;
  saveAssessment(caseId: string, result: SmutthanAnalysisResult): Promise<{ success: boolean; record_id: string }>;
}
