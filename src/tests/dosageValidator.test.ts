import { describe, it, expect } from 'vitest';
import { validateDosageAndSafety } from '../services/dosageValidator';
import { ThaiHerbFormularyItem } from '../types/drug';
import { PatientInfo } from '../types/patient';

describe('DosageValidator Service Tests', () => {
  const sampleHerb: ThaiHerbFormularyItem = {
    drug_code_24: '410000000102019150011401',
    ttmt_id: 'T11401-100010',
    thai_name: 'ยาแคปซูลขิง',
    common_name: 'Ginger Capsule',
    scientific_name: 'Zingiber officinale Roscoe',
    herb_type: 'ยาเดี่ยว',
    dosage_form: 'แคปซูล',
    strength_per_unit: '500 มก./แคปซูล',
    unit_amount_mg: 500,
    unit: 'แคปซูล',
    unit_price_thb: 2.5,
    taste: 'เผ็ดร้อน',
    primary_element: 'วาโย / เตโช',
    indications: ['บรรเทาอาการท้องอืด ขับลม'],
    contraindications: ['ห้ามใช้ในท่อน้ำดีอุดตัน'],
    precautions: {
      pregnancy_lactation: 'ควรระวังการใช้ในหญิงตั้งครรภ์',
      pediatric: 'เด็กอายุต่ำกว่า 6 ขวบ ควรปรึกษาแพทย์แผนไทย',
      elderly: 'ใช้ได้ตามปกติ แต่ระวังแสบร้อนยอดอก',
      hepatic_renal: 'ระวังในผู้ป่วยไตเสื่อม',
      drug_interactions: 'ระวังการใช้ร่วมกับยาต้านการแข็งตัวของเลือด',
    },
    standard_dosing: {
      adult: {
        dose_per_admin: 1,
        dose_unit: 'แคปซูล (500 มก.)',
        frequency_per_day: 3,
        timing: 'หลังอาหาร เช้า-กลางวัน-เย็น',
        max_daily_dose_units: 4,
        max_daily_dose_mg: 2000,
        max_duration_days: 14,
      },
      child: {
        eligible_age_min: 6,
        dose_per_admin: 1,
        dose_unit: 'แคปซูล (250-500 มก.)',
        frequency_per_day: 2,
        timing: 'หลังอาหาร เช้า-เย็น',
        max_daily_dose_units: 2,
        max_daily_dose_mg: 1000,
        max_duration_days: 7,
      },
    },
    nlem_status: 'ใช่',
    nlem_category: 'ยาสมุนไพรในบัญชียาหลักแห่งชาติ',
    verification_status: 'ตัวอย่าง รอเภสัชกร/แพทย์แผนไทยตรวจสอบ',
    source_reference: 'คู่มือรหัสยาแผนไทย 24 หลัก (2568)',
  };

  const adultPatient: PatientInfo = {
    hn: 'HN-001',
    name: 'นายเอก สมมุติ',
    gender: 'ชาย',
    sex_code: '1',
    age: 40,
    birth_date: '1986-01-01',
    province: 'กรุงเทพมหานคร',
    province_code: '10',
    region: 'ภาคกลาง',
    occupation: 'ค้าขาย',
    birth_element: 'วาโย',
  };

  it('should return no warnings for standard therapeutic dose and duration', () => {
    const warnings = validateDosageAndSafety({
      herb: sampleHerb,
      dose_per_admin: 1,
      frequency_per_day: 3, // 3 units/day <= max 4
      days: 7, // 7 days <= max 14
      patient: adultPatient,
    });

    expect(warnings.length).toBe(0);
  });

  it('should trigger OVERDOSE warning when daily dose exceeds maximum allowed units', () => {
    const warnings = validateDosageAndSafety({
      herb: sampleHerb,
      dose_per_admin: 2,
      frequency_per_day: 3, // 6 units/day > max 4
      days: 7,
      patient: adultPatient,
    });

    expect(warnings.length).toBeGreaterThan(0);
    const overdose = warnings.find((w) => w.type === 'OVERDOSE');
    expect(overdose).toBeDefined();
    expect(overdose?.severity).toBe('HIGH');
    expect(overdose?.message).toContain('เกินขนาดสูงสุดที่แนะนำ');
  });

  it('should trigger DURATION warning when treatment exceeds recommended maximum days', () => {
    const warnings = validateDosageAndSafety({
      herb: sampleHerb,
      dose_per_admin: 1,
      frequency_per_day: 2,
      days: 30, // 30 days > max 14
      patient: adultPatient,
    });

    const durationWarn = warnings.find((w) => w.type === 'DURATION');
    expect(durationWarn).toBeDefined();
    expect(durationWarn?.severity).toBe('MODERATE');
    expect(durationWarn?.message).toContain('เกินระยะเวลาที่แนะนำ');
  });

  it('should trigger age eligibility warning for child younger than eligible_age_min', () => {
    const toddlerPatient: PatientInfo = {
      ...adultPatient,
      age: 4, // < 6
    };

    const warnings = validateDosageAndSafety({
      herb: sampleHerb,
      dose_per_admin: 1,
      frequency_per_day: 1,
      days: 3,
      patient: toddlerPatient,
    });

    const ageWarn = warnings.find((w) => w.title.includes('ข้อจำกัดด้านอายุผู้ป่วย'));
    expect(ageWarn).toBeDefined();
    expect(ageWarn?.severity).toBe('HIGH');
  });

  it('should include elderly precaution warning for patient aged 65 and older', () => {
    const elderlyPatient: PatientInfo = {
      ...adultPatient,
      age: 72,
    };

    const warnings = validateDosageAndSafety({
      herb: sampleHerb,
      dose_per_admin: 1,
      frequency_per_day: 2,
      days: 7,
      patient: elderlyPatient,
    });

    const elderlyWarn = warnings.find((w) => w.title.includes('ผู้สูงอายุ'));
    expect(elderlyWarn).toBeDefined();
    expect(elderlyWarn?.message).toContain(sampleHerb.precautions.elderly);
  });
});
