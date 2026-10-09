import { describe, it, expect } from 'vitest';
import { computeAnalytics, checkDataQuality } from '../services/analyticsEngine';
import syntheticCasesData from '../../data/synthetic/cases.json';
import { SyntheticCase, HistoricalEpisode } from '../types/patient';

describe('AnalyticsEngine Service Tests', () => {
  const cases: SyntheticCase[] = syntheticCasesData as unknown as SyntheticCase[];

  it('should compute aggregated health economics and visit counts from synthetic cases', () => {
    expect(cases.length).toBeGreaterThanOrEqual(10);

    const summary = computeAnalytics(cases);

    expect(summary.total_patients).toBe(cases.length);
    expect(summary.total_visits).toBeGreaterThan(40);
    expect(summary.total_expenditure_thb).toBeGreaterThan(0);
    expect(summary.average_cost_per_episode_thb).toBeGreaterThan(0);
    expect(summary.ttm_drug_cost_thb).toBeGreaterThan(0);
    expect(summary.procedure_cost_thb).toBeGreaterThan(0);
    expect(summary.utilization_by_code.length).toBeGreaterThan(0);
    expect(summary.monthly_trends.length).toBeGreaterThan(0);
  });

  it('should rank ICD-10-TM utilization by case count descending', () => {
    const summary = computeAnalytics(cases);
    const util = summary.utilization_by_code;

    expect(util.length).toBeGreaterThan(0);
    for (let i = 0; i < util.length - 1; i++) {
      expect(util[i].case_count).toBeGreaterThanOrEqual(util[i + 1].case_count);
    }

    // Verify key U-codes exist (e.g. U55.22, U54.1, U60.1)
    const codes = util.map((u) => u.u_code);
    expect(codes.some((c) => c.startsWith('U'))).toBe(true);
  });

  it('should incorporate newly recorded visits into the economic summary', () => {
    const initialSummary = computeAnalytics(cases);

    const additionalVisit: HistoricalEpisode = {
      vn: 'VN-999999',
      date: '2026-10-09',
      icd10tm_code: 'U55.22',
      icd10tm_name: 'โรคลมจับโปงแห้งเข่า',
      icd10_conventional: 'M17.9',
      procedure: { code: '9007710', name: 'การนวดไทยเพื่อการบำบัด', fee_thb: 250 },
      drug: { code_24: '410000000122019150011402', name: 'ขมิ้นชัน', quantity: 1, cost_thb: 100 },
      total_cost_thb: 400,
    };

    const updatedSummary = computeAnalytics(cases, {
      [cases[0].case_id]: [additionalVisit],
    });

    expect(updatedSummary.total_visits).toBe(initialSummary.total_visits + 1);
    expect(updatedSummary.total_expenditure_thb).toBe(initialSummary.total_expenditure_thb + 400);
    expect(updatedSummary.ttm_drug_cost_thb).toBe(initialSummary.ttm_drug_cost_thb + 100);
    expect(updatedSummary.procedure_cost_thb).toBe(initialSummary.procedure_cost_thb + 250);
  });

  it('should evaluate data quality and completeness across all synthetic cases', () => {
    const quality = checkDataQuality(cases);

    expect(quality).toBeDefined();
    expect(quality.valid_codes_count).toBeGreaterThan(0);
    expect(quality.missing_vitals_count).toBe(0); // All 10 synthetic encounters have vitals
  });
});
