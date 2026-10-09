import { describe, it, expect } from 'vitest';
import { CarePlanService } from '../services/carePlanService';
import { MockDataService } from '../services/mockDataService';

describe('CarePlanService', () => {
  const cases = MockDataService.getCases();

  it('should generate a comprehensive care plan for high risk case (C02: Warfarin + Curcuma)', () => {
    const c02 = cases.find((c) => c.case_id === 'C02')!;
    expect(c02).toBeDefined();

    const plan = CarePlanService.generateCarePlan(c02);
    expect(plan.case_id).toBe('C02');
    expect(plan.risk_level).toBe('HIGH');
    expect(plan.therapeutic_goals.short_term_weeks_1_2.length).toBeGreaterThan(0);
    expect(plan.therapeutic_goals.medium_term_months_1_3.length).toBeGreaterThan(0);
    expect(plan.therapeutic_goals.long_term_months_3_6.length).toBeGreaterThan(0);

    // Monitoring Domains
    expect(plan.monitoring_domains.length).toBeGreaterThanOrEqual(4);
    const bleedingDomain = plan.monitoring_domains.find((d) => d.id === 'dom-hdi-bleeding');
    expect(bleedingDomain).toBeDefined();
    expect(bleedingDomain?.category).toBe('HDI_SAFETY');
    expect(bleedingDomain?.what_to_monitor).toContain('INR');

    // Monthly Cadence for High Risk
    expect(plan.monthly_cadence.length).toBeGreaterThanOrEqual(4);
    const month1 = plan.monthly_cadence.find((m) => m.month_number === 1);
    expect(month1?.recommended_visits_per_month).toBe(4); // Weekly visits in month 1 for high risk

    // Follow-up Schedule Milestones
    expect(plan.follow_up_schedule.length).toBe(6);
    expect(plan.follow_up_schedule[0].timing_label).toContain('Day 7');

    // Longitudinal Trajectory Points
    expect(plan.prognosis.trajectory_points.length).toBeGreaterThan(3);
    const baseline = plan.prognosis.trajectory_points.find((p) => p.visit_label.includes('ปัจจุบัน'));
    expect(baseline).toBeDefined();
    expect(baseline?.pain_score).toBeGreaterThan(0);

    // Holistic Care
    expect(plan.holistic_care.diet_recommendations.length).toBeGreaterThan(0);
    expect(plan.holistic_care.emergency_red_flags.length).toBeGreaterThan(0);
  });

  it('should generate moderate risk care plan with 2 visits in month 1 (C03: Amlodipine + Licorice)', () => {
    const c03 = cases.find((c) => c.case_id === 'C03')!;
    expect(c03).toBeDefined();

    const plan = CarePlanService.generateCarePlan(c03);
    expect(plan.risk_level).toBe('MODERATE');

    const month1 = plan.monthly_cadence.find((m) => m.month_number === 1);
    expect(month1?.recommended_visits_per_month).toBe(2); // Bi-weekly in month 1 for moderate risk
  });

  it('should generate low risk care plan with acute resolution focus (C01: Ginger)', () => {
    const c01 = cases.find((c) => c.case_id === 'C01')!;
    expect(c01).toBeDefined();

    const plan = CarePlanService.generateCarePlan(c01);
    expect(plan.risk_level).toBe('LOW');

    const month1 = plan.monthly_cadence.find((m) => m.month_number === 1);
    expect(month1?.recommended_visits_per_month).toBe(1);
  });

  it('should correctly tailor diet and ruesi dat ton to patient birth element', () => {
    const fireCase = cases.find((c) => c.patient_info.birth_element.includes('ไฟ')) || cases[0];
    const planFire = CarePlanService.generateCarePlan(fireCase);
    expect(planFire.holistic_care.diet_recommendations.length).toBeGreaterThan(0);
    expect(planFire.holistic_care.exercise_ruesi_dutton.length).toBeGreaterThan(0);
  });
});
