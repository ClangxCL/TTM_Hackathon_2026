import { describe, it, expect } from 'vitest';
import { calculateSmutthan } from '../services/smutthanEngine';
import { PatientInfo, Vitals, AmbientContext } from '../types/patient';

describe('SmutthanEngine Service Tests', () => {
  const basePatient: PatientInfo = {
    hn: 'HN-999901',
    name: 'นายทดสอบ สมมุติ',
    gender: 'ชาย',
    sex_code: '1',
    age: 45,
    birth_date: '1981-05-15',
    province: 'พิษณุโลก',
    province_code: '65',
    region: 'ภาคเหนือ',
    occupation: 'พนักงานออฟฟิศ',
    birth_element: 'ธาตุดิน (พฤษภ)',
  };

  const normalVitals: Vitals = {
    btemp: 36.6,
    sbp: 120,
    dbp: 80,
    pr: 74,
    rr: 18,
    weight_kg: 68,
    height_cm: 172,
    bmi: 23.0,
  };

  const neutralAmbient: AmbientContext = {
    location: 'รพ.สต.บางกระทุ่ม จ.พิษณุโลก',
    latitude: 16.58,
    longitude: 100.30,
    temperature_c: 28.0,
    relative_humidity: 60,
    weather_condition: 'เมฆเป็นส่วนมาก',
    kala_period: 'ปิตตะกาล (10:00 - 14:00)',
  };

  it('should calculate baseline scores and default to wind element for adult with age >= 32', () => {
    // 10:00 is pitta kala (fire), age 45 is pacchim-vaya (wind + earth)
    const mockTime = new Date('2026-10-09T11:00:00');
    const result = calculateSmutthan(basePatient, normalVitals, [], neutralAmbient, mockTime);

    expect(result).toBeDefined();
    expect(result.scores.earth).toBeGreaterThan(0);
    expect(result.scores.water).toBeGreaterThan(0);
    expect(result.scores.wind).toBeGreaterThan(0);
    expect(result.scores.fire).toBeGreaterThan(0);
    expect(result.reasons_list.length).toBeGreaterThan(0);
    expect(result.dominant_element_th).toContain('ธาตุ');
    expect(result.disclaimer).toContain('Clinical Decision Support');
  });

  it('should elevate fire score significantly when ambient temperature >= 35°C and high body temp', () => {
    const hotAmbient: AmbientContext = {
      ...neutralAmbient,
      temperature_c: 38.5,
    };
    const febrileVitals: Vitals = {
      ...normalVitals,
      btemp: 38.6,
    };

    const mockTime = new Date('2026-10-09T12:00:00'); // Midday (Pitta kala)
    const result = calculateSmutthan(basePatient, febrileVitals, ['ตัวร้อน', 'กระหายน้ำ'], hotAmbient, mockTime);

    expect(result.dominant_element).toBe('fire');
    expect(result.scores.fire).toBeGreaterThanOrEqual(60);
    expect(result.status).toBe('กำเริบ (Aggravated)');
    expect(result.recommended_taste).toContain('รสขม (ดับพิษร้อน)');
    
    // Verify reason list captures both weather and fever
    const hasHotWeatherReason = result.reasons_list.some(r => r.rule_title.includes('ความร้อนภายนอกระดับสูงจัด'));
    const hasFeverReason = result.reasons_list.some(r => r.rule_title.includes('มีไข้สูงเฉียบพลัน'));
    expect(hasHotWeatherReason).toBe(true);
    expect(hasFeverReason).toBe(true);
  });

  it('should elevate water score during cold/high humidity weather in child (Pathama-vaya)', () => {
    const childPatient: PatientInfo = {
      ...basePatient,
      age: 8,
      birth_element: 'ธาตุน้ำ (กรกฎ)',
    };
    const coldHumidAmbient: AmbientContext = {
      ...neutralAmbient,
      temperature_c: 19.5,
      relative_humidity: 88,
    };
    const mockTime = new Date('2026-10-09T07:30:00'); // Morning (Semha kala)
    const symptoms = ['ไอมีเสมหะขาว', 'น้ำมูกไหล', 'คัดจมูก'];

    const result = calculateSmutthan(childPatient, normalVitals, symptoms, coldHumidAmbient, mockTime);

    expect(result.dominant_element).toBe('water');
    expect(result.scores.water).toBeGreaterThanOrEqual(55);
    expect(result.recommended_taste).toContain('รสเปรี้ยว (กัดเสมหะ)');
    expect(result.lifestyle_advice.some(a => a.includes('เสมหะ'))).toBe(true);
  });

  it('should elevate wind score when symptoms include muscle stiffness, ache, or dizziness', () => {
    const elderPatient: PatientInfo = {
      ...basePatient,
      age: 62,
    };
    const highBpVitals: Vitals = {
      ...normalVitals,
      sbp: 155,
      dbp: 95,
      pr: 88,
    };
    const mockTime = new Date('2026-10-09T15:30:00'); // Afternoon (Vata kala)
    const symptoms = ['ปวดตึงบ่าไหล่ร้าวขึ้นศีรษะ', 'วิงเวียนศีรษะ', 'ชาปลายนิ้วมือ'];

    const result = calculateSmutthan(elderPatient, highBpVitals, symptoms, neutralAmbient, mockTime);

    expect(result.dominant_element).toBe('wind');
    expect(result.scores.wind).toBeGreaterThanOrEqual(60);
    expect(result.status).toBe('กำเริบ (Aggravated)');
    expect(result.recommended_taste).toContain('รสสุขุม');
  });

  it('should clamp scores within 10 to 100 range', () => {
    const extremeVitals: Vitals = {
      ...normalVitals,
      btemp: 41.0,
      sbp: 200,
      dbp: 120,
      pr: 130,
    };
    const extremeHotAmbient: AmbientContext = {
      ...neutralAmbient,
      temperature_c: 45.0,
      relative_humidity: 15,
    };
    const manySymptoms = ['ปวดเมื่อยรุนแรง', 'วิงเวียน', 'ตัวร้อนจัด', 'กระหายน้ำ', 'ท้องอืด'];

    const result = calculateSmutthan(basePatient, extremeVitals, manySymptoms, extremeHotAmbient);

    expect(result.scores.fire).toBeLessThanOrEqual(100);
    expect(result.scores.wind).toBeLessThanOrEqual(100);
    expect(result.scores.water).toBeGreaterThanOrEqual(10);
    expect(result.scores.earth).toBeGreaterThanOrEqual(10);
  });
});
