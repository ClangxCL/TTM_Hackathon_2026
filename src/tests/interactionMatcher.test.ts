import { describe, it, expect } from 'vitest';
import { checkHerbDrugInteractions, getAllInteractionsDatabase } from '../services/interactionMatcher';
import { CurrentMedication } from '../types/patient';

describe('InteractionMatcher Service Tests', () => {
  it('should return all loaded interactions from the database', () => {
    const all = getAllInteractionsDatabase();
    expect(all).toBeDefined();
    expect(all.length).toBeGreaterThanOrEqual(14);
    expect(all[0]).toHaveProperty('interaction_id');
    expect(all[0]).toHaveProperty('severity_code');
    expect(all[0]).toHaveProperty('clinical_effects');
    expect(all[0]).toHaveProperty('mechanism');
    expect(all[0]).toHaveProperty('recommendation');
  });

  it('should detect Warfarin + ขมิ้นชัน interaction as HIGH severity with bleeding risk (Case C02)', () => {
    const activeMeds: CurrentMedication[] = [
      {
        drug_id: 'MED-CONV-001',
        generic_name: 'Warfarin',
        brand_name: 'Coumadin',
        dosage_form: 'เม็ด',
        strength_mg: 3,
        dose_per_admin_mg: 3,
        frequency_per_day: 1,
        timing: 'ก่อนนอน',
        days: 30,
        calculated_daily_dose_mg: 3,
        route: 'รับประทาน',
      },
    ];

    const matches = checkHerbDrugInteractions(activeMeds, '410000000122019150011402', 'ขมิ้นชัน');

    expect(matches.length).toBeGreaterThan(0);
    const match = matches[0];
    expect(match.interaction.drug_generic_name).toContain('Warfarin');
    expect(match.interaction.herb_thai_name).toBe('ขมิ้นชัน');
    expect(match.interaction.severity_code).toBe('HIGH');
    expect(match.interaction.mechanism).toContain('เกล็ดเลือด');
    expect(match.interaction.recommendation).toContain('หลีกเลี่ยงการใช้ร่วมกัน');
    expect(match.patient_active_dose).toContain('3 mg');
  });

  it('should detect Amlodipine + ชะเอมเทศ interaction causing pseudoaldosteronism & BP elevation (Case C03)', () => {
    const activeMeds: CurrentMedication[] = [
      {
        drug_id: 'MED-CONV-002',
        generic_name: 'Amlodipine',
        brand_name: 'Norvasc',
        dosage_form: 'เม็ด',
        strength_mg: 5,
        dose_per_admin_mg: 5,
        frequency_per_day: 1,
        timing: 'เช้า',
        days: 30,
        calculated_daily_dose_mg: 5,
        route: 'รับประทาน',
      },
    ];

    const matches = checkHerbDrugInteractions(activeMeds, '410000000154019125011403', 'ชะเอมเทศ');

    expect(matches.length).toBeGreaterThan(0);
    const match = matches[0];
    expect(match.interaction.severity_code).toBe('MODERATE');
    expect(match.interaction.clinical_effects).toContain('ความดันโลหิตสูงขึ้น');
  });

  it('should detect Clopidogrel + ขิง interaction causing antiplatelet synergy (Case C08)', () => {
    const activeMeds: CurrentMedication[] = [
      {
        drug_id: 'MED-CONV-009',
        generic_name: 'Clopidogrel',
        brand_name: 'Plavix',
        dosage_form: 'เม็ด',
        strength_mg: 75,
        dose_per_admin_mg: 75,
        frequency_per_day: 1,
        timing: 'เช้า',
        days: 30,
        calculated_daily_dose_mg: 75,
        route: 'รับประทาน',
      },
    ];

    const matches = checkHerbDrugInteractions(activeMeds, '410000000102019150011401', 'ขิง');

    expect(matches.length).toBeGreaterThan(0);
    const match = matches[0];
    expect(match.interaction.severity_code).toBe('HIGH');
    expect(match.interaction.clinical_effects).toContain('เลือดออก');
  });

  it('should detect Digoxin + ชะเอมเทศ interaction as HIGH severity with Level A evidence (Case C10)', () => {
    const activeMeds: CurrentMedication[] = [
      {
        drug_id: 'MED-CONV-012',
        generic_name: 'Digoxin',
        brand_name: 'Lanoxin',
        dosage_form: 'เม็ด',
        strength_mg: 0.25,
        dose_per_admin_mg: 0.25,
        frequency_per_day: 1,
        timing: 'เช้า',
        days: 30,
        calculated_daily_dose_mg: 0.25,
        route: 'รับประทาน',
      },
    ];

    const matches = checkHerbDrugInteractions(activeMeds, '410000000154019125011403', 'ชะเอมเทศ');

    expect(matches.length).toBeGreaterThan(0);
    const match = matches[0];
    expect(match.interaction.severity_code).toBe('HIGH');
    expect(match.interaction.evidence_level).toBe('A');
    expect(match.interaction.recommendation).toContain('ห้ามใช้ร่วมกัน');
  });

  it('should return empty array if patient has no active medications', () => {
    const matches = checkHerbDrugInteractions([], '410000000122019150011402', 'ขมิ้นชัน');
    expect(matches).toEqual([]);
  });

  it('should return empty array if herb has no documented interaction with the active drugs', () => {
    const activeMeds: CurrentMedication[] = [
      {
        drug_id: 'MED-CONV-006',
        generic_name: 'Cetirizine',
        brand_name: 'Zyrtec',
        dosage_form: 'เม็ด',
        strength_mg: 10,
        dose_per_admin_mg: 10,
        frequency_per_day: 1,
        timing: 'ก่อนนอน',
        days: 7,
        calculated_daily_dose_mg: 10,
        route: 'รับประทาน',
      },
    ];

    // ขมิ้นชัน has no documented interaction with Cetirizine in our database
    const matches = checkHerbDrugInteractions(activeMeds, '410000000122019150011402', 'ขมิ้นชัน');
    expect(matches).toEqual([]);
  });
});
