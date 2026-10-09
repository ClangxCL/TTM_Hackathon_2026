import { SyntheticCase, HistoricalEpisode } from '../types/patient';
import { AnalyticsSummary, Icd10tmUtilization } from '../types/analytics';
import icd10tmData from '../../data/master/icd10tm-master.json';

export function computeAnalytics(
  cases: SyntheticCase[],
  additionalVisits: { [caseId: string]: HistoricalEpisode[] } = {}
): AnalyticsSummary {
  let totalVisits = 0;
  let totalExpenditure = 0;
  let ttmDrugCost = 0;
  let conventionalDrugCost = 0;
  let procedureFee = 0;

  const codeMap: { [code: string]: {
    count: number;
    name: string;
    conventional: string;
    procCost: number;
    drugCost: number;
    totalCost: number;
  }} = {};

  const monthlyBuckets: { [month: string]: { visits: number; ttmCost: number; convCost: number } } = {};

  // Process all historical episodes
  for (const c of cases) {
    const episodes = [...c.history_episodes, ...(additionalVisits[c.case_id] || [])];
    
    // Add conventional drug costs from current meds profile
    for (const med of c.current_medications) {
      const convCost = med.days * 5.0; // standard estimate 5 THB/pill
      conventionalDrugCost += convCost;
      totalExpenditure += convCost;
    }

    for (const ep of episodes) {
      totalVisits += 1;
      const drugCost = ep.drug?.cost_thb || 0;
      const procCost = ep.procedure?.fee_thb || 0;
      const visitTotal = ep.total_cost_thb || (drugCost + procCost + 50);

      ttmDrugCost += drugCost;
      procedureFee += procCost;
      totalExpenditure += visitTotal;

      // Group by ICD-10-TM
      const uCode = ep.icd10tm_code || 'U-UNSPECIFIED';
      if (!codeMap[uCode]) {
        codeMap[uCode] = {
          count: 0,
          name: ep.icd10tm_name || 'ไม่ระบุชื่อโรค',
          conventional: ep.icd10_conventional || 'R69',
          procCost: 0,
          drugCost: 0,
          totalCost: 0,
        };
      }
      codeMap[uCode].count += 1;
      codeMap[uCode].procCost += procCost;
      codeMap[uCode].drugCost += drugCost;
      codeMap[uCode].totalCost += visitTotal;

      // Group by Month
      const monthKey = ep.date ? ep.date.substring(0, 7) : '2026-01';
      if (!monthlyBuckets[monthKey]) {
        monthlyBuckets[monthKey] = { visits: 0, ttmCost: 0, convCost: 0 };
      }
      monthlyBuckets[monthKey].visits += 1;
      monthlyBuckets[monthKey].ttmCost += (drugCost + procCost);
      monthlyBuckets[monthKey].convCost += 150; // average monthly conventional Rx
    }
  }

  // Format code utilization table
  const utilization_by_code: Icd10tmUtilization[] = Object.keys(codeMap).map((code) => {
    const item = codeMap[code];
    return {
      u_code: code,
      thai_name: item.name,
      conventional_code: item.conventional,
      case_count: item.count,
      total_procedure_fee: item.procCost,
      total_drug_cost: item.drugCost,
      total_cost: item.totalCost,
      average_cost_per_case: Math.round(item.totalCost / item.count),
    };
  }).sort((a, b) => b.case_count - a.case_count);

  // Format monthly trends
  const monthly_trends = Object.keys(monthlyBuckets)
    .sort()
    .map((month) => ({
      month,
      visit_count: monthlyBuckets[month].visits,
      ttm_cost: Math.round(monthlyBuckets[month].ttmCost),
      conventional_cost: Math.round(monthlyBuckets[month].convCost),
    }));

  const avgCostPerEpisode = totalVisits > 0 ? Math.round(totalExpenditure / totalVisits) : 0;
  const ratio = conventionalDrugCost > 0 ? Math.round((ttmDrugCost / conventionalDrugCost) * 100) / 100 : 0;

  return {
    total_patients: cases.length,
    total_visits: totalVisits,
    total_expenditure_thb: Math.round(totalExpenditure),
    average_cost_per_episode_thb: avgCostPerEpisode,
    ttm_drug_cost_thb: Math.round(ttmDrugCost),
    conventional_drug_cost_thb: Math.round(conventionalDrugCost),
    procedure_cost_thb: Math.round(procedureFee),
    ttm_to_conventional_ratio: ratio,
    utilization_by_code,
    monthly_trends,
  };
}

export function checkDataQuality(cases: SyntheticCase[]): {
  valid_codes_count: number;
  invalid_codes_count: number;
  missing_vitals_count: number;
  unmapped_diagnoses: string[];
} {
  const masterCodes = new Set((icd10tmData as any[]).map((d) => d.icd10tm_code));
  let validCount = 0;
  let invalidCount = 0;
  let missingVitals = 0;
  const unmapped: string[] = [];

  for (const c of cases) {
    if (!c.current_encounter.vitals.btemp || !c.current_encounter.vitals.sbp) {
      missingVitals++;
    }
    for (const ep of c.history_episodes) {
      if (masterCodes.has(ep.icd10tm_code)) {
        validCount++;
      } else {
        invalidCount++;
        unmapped.push(`${ep.vn}: ${ep.icd10tm_code}`);
      }
    }
  }

  return {
    valid_codes_count: validCount,
    invalid_codes_count: invalidCount,
    missing_vitals_count: missingVitals,
    unmapped_diagnoses: unmapped,
  };
}
