import React from 'react';
import { SyntheticCase } from '../types/patient';
import { computeAnalytics } from '../services/analyticsEngine';
import { CostPerCaseCard } from '../components/analytics/CostPerCaseCard';
import { Icd10tmUtilizationChart } from '../components/analytics/Icd10tmUtilizationChart';
import { DataQualityReport } from '../components/analytics/DataQualityReport';
import { BarChart3, Database, RefreshCw, ShieldCheck } from 'lucide-react';

interface AnalyticsPageProps {
  cases: SyntheticCase[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ cases }) => {
  const summary = computeAnalytics(cases);

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                ICD-10-TM Real-time Analytics & Health Economics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ยกระดับการบันทึกรหัสโรค ICD-10-TM เพื่อประมวลผลการจ่ายยาและหัตถการไทยแบบ Real-time ประเมินต้นทุนต่อเคส
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>43 แฟ้มเชื่อมต่ออัตโนมัติ</span>
          </span>
        </div>
      </div>

      {/* Top Economic KPI Cards */}
      <CostPerCaseCard summary={summary} />

      {/* Charts & Table */}
      <Icd10tmUtilizationChart
        utilization={summary.utilization_by_code}
        monthlyTrends={summary.monthly_trends}
      />

      {/* Data Quality & Methodology Framework */}
      <DataQualityReport cases={cases} />
    </div>
  );
};
