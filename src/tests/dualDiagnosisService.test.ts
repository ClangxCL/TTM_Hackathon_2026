import { describe, it, expect } from 'vitest';
import { DualDiagnosisService } from '../services/dualDiagnosisService';

describe('DualDiagnosisService Tests', () => {
  it('should recommend ICD-10 J00 and ICD-10-TM U56.19 for cold and respiratory symptoms', () => {
    const res = DualDiagnosisService.recommendDualDiagnosis(
      ['ไอ', 'จาม', 'เจ็บคอ', 'มีน้ำมูก'],
      'มีไข้ ไอ เจ็บคอ น้ำมูกไหล 3 วัน'
    );

    expect(res.primary.item.icd10_conventional_code).toBe('J00');
    expect(res.primary.item.icd10tm_code).toBe('U56.19');
    expect(res.primary.matchScore).toBeGreaterThanOrEqual(70);
    expect(res.primary.confidenceLevel).toBe('HIGH');
    expect(res.primary.matchedKeywords).toContain('ไอ');
    expect(res.primary.clinicalRationale.conventional).toContain('J00');
    expect(res.primary.clinicalRationale.traditional).toContain('U56.19');
  });

  it('should recommend ICD-10 K30 and ICD-10-TM U60.10 for dyspepsia symptoms', () => {
    const res = DualDiagnosisService.recommendDualDiagnosis(
      ['แน่นท้อง', 'จุกเสียด', 'เรอบ่อย'],
      'ท้องอืด ท้องเฟ้อ แน่นท้องหลังอาหาร 2 วัน'
    );

    expect(res.primary.item.icd10_conventional_code).toBe('K30');
    expect(res.primary.item.icd10tm_code).toBe('U60.10');
    expect(res.primary.matchScore).toBeGreaterThanOrEqual(70);
  });

  it('should recommend ICD-10 M54.5 and ICD-10-TM U55.20 for back pain symptoms', () => {
    const res = DualDiagnosisService.recommendDualDiagnosis(
      ['ปวดหลัง', 'เอวยอก', 'กษัยเส้น'],
      'ปวดหลังส่วนล่าง ก้มยกของแล้วยอก'
    );

    expect(res.primary.item.icd10_conventional_code).toBe('M54.5');
    expect(res.primary.item.icd10tm_code).toBe('U55.20');
  });

  it('should recommend ICD-10 G43.9 and ICD-10-TM U61.2 for migraine symptoms', () => {
    const res = DualDiagnosisService.recommendDualDiagnosis(
      ['ปวดหัวข้างเดียว', 'ตาพร่า', 'คลื่นไส้'],
      'ปวดศีรษะตุบๆ ข้างขวา ไมเกรนกำเริบ'
    );

    expect(res.primary.item.icd10_conventional_code).toBe('G43.9');
    expect(res.primary.item.icd10tm_code).toBe('U61.2');
  });

  it('should provide alternative differential diagnoses with scores', () => {
    const res = DualDiagnosisService.recommendDualDiagnosis(
      ['แน่นอก', 'จุกเสียด', 'แสบร้อนกลางอก'],
      'แสบร้อนยอดอก มีลมตีขึ้น เรอเปรี้ยว'
    );

    expect(res.alternatives.length).toBeGreaterThan(0);
    expect(res.allCandidates.length).toBeGreaterThanOrEqual(8);
  });
});
