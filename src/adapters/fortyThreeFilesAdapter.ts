import { TtmIntegrationAdapter } from './adapterInterface';
import { PatientInfo, Vitals, CurrentMedication, ChronicDisease, HistoricalEpisode } from '../types/patient';
import { ThaiHerbFormularyItem, PrescribedItem } from '../types/drug';
import { SmutthanAnalysisResult } from '../types/smutthan';
import { MockAdapter } from './mockAdapter';

export class FortyThreeFilesAdapter implements TtmIntegrationAdapter {
  public name = 'MOPH 43-Folders CSV Adapter';
  private fallbackMock = new MockAdapter();
  private csvParsedData: { [table: string]: any[] } = {};

  public isAvailable(): boolean {
    return Object.keys(this.csvParsedData).length > 0;
  }

  public ingestCsvContent(tableName: string, csvText: string): number {
    const lines = csvText.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) return 0;

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
    const rows: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      const obj: any = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] ?? '';
      });
      rows.push(obj);
    }

    this.csvParsedData[tableName.toUpperCase()] = rows;
    return rows.length;
  }

  public async getPatient(id: string): Promise<PatientInfo | null> {
    const personRows = this.csvParsedData['PERSON'];
    if (personRows) {
      const row = personRows.find((r) => r.PID === id);
      if (row) {
        return {
          hn: row.PID,
          name: row.NAME,
          gender: row.SEX === '1' ? 'ชาย' : 'หญิง',
          sex_code: row.SEX,
          age: parseInt(row.AGE_Y, 10) || 45,
          birth_date: row.BIRTH,
          province: row.PROVINCE,
          province_code: row.PROVINCE,
          region: 'เขตบริการสุขภาพ',
          occupation: 'ไม่ระบุ',
          birth_element: 'ไม่ระบุ',
        };
      }
    }
    return this.fallbackMock.getPatient(id);
  }

  public async getVitals(id: string): Promise<Vitals | null> {
    return this.fallbackMock.getVitals(id);
  }

  public async getMedications(id: string): Promise<CurrentMedication[]> {
    return this.fallbackMock.getMedications(id);
  }

  public async getDiagnoses(id: string): Promise<ChronicDisease[]> {
    return this.fallbackMock.getDiagnoses(id);
  }

  public async getHistoricalEpisodes(id: string): Promise<HistoricalEpisode[]> {
    return this.fallbackMock.getHistoricalEpisodes(id);
  }

  public async getFormulary(): Promise<ThaiHerbFormularyItem[]> {
    return this.fallbackMock.getFormulary();
  }

  public async savePrescription(caseId: string, items: PrescribedItem[]): Promise<{ success: boolean; transaction_id: string }> {
    return this.fallbackMock.savePrescription(caseId, items);
  }

  public async saveAssessment(caseId: string, result: SmutthanAnalysisResult): Promise<{ success: boolean; record_id: string }> {
    return this.fallbackMock.saveAssessment(caseId, result);
  }
}
