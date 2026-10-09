import { TtmIntegrationAdapter } from './adapterInterface';
import { PatientInfo, Vitals, CurrentMedication, ChronicDisease, HistoricalEpisode } from '../types/patient';
import { ThaiHerbFormularyItem, PrescribedItem } from '../types/drug';
import { SmutthanAnalysisResult } from '../types/smutthan';
import { MockDataService } from '../services/mockDataService';

export class MockAdapter implements TtmIntegrationAdapter {
  public name = 'Mock Data Adapter (Standalone / GitHub Pages)';

  public isAvailable(): boolean {
    return true;
  }

  public async getPatient(caseId: string): Promise<PatientInfo | null> {
    const c = MockDataService.getCaseById(caseId);
    return c ? c.patient_info : null;
  }

  public async getVitals(caseId: string): Promise<Vitals | null> {
    const c = MockDataService.getCaseById(caseId);
    return c ? c.current_encounter.vitals : null;
  }

  public async getMedications(caseId: string): Promise<CurrentMedication[]> {
    const c = MockDataService.getCaseById(caseId);
    return c ? c.current_medications : [];
  }

  public async getDiagnoses(caseId: string): Promise<ChronicDisease[]> {
    const c = MockDataService.getCaseById(caseId);
    return c ? c.chronic_diseases : [];
  }

  public async getHistoricalEpisodes(caseId: string): Promise<HistoricalEpisode[]> {
    const c = MockDataService.getCaseById(caseId);
    return c ? c.history_episodes : [];
  }

  public async getFormulary(): Promise<ThaiHerbFormularyItem[]> {
    return MockDataService.getFormulary();
  }

  public async savePrescription(caseId: string, items: PrescribedItem[]): Promise<{ success: boolean; transaction_id: string }> {
    MockDataService.savePrescription(caseId, items);
    return {
      success: true,
      transaction_id: `TXN-LOCAL-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  public async saveAssessment(caseId: string, _result: SmutthanAnalysisResult): Promise<{ success: boolean; record_id: string }> {
    return {
      success: true,
      record_id: `ASSESS-${caseId}-${Date.now().toString(36).toUpperCase()}`,
    };
  }
}
