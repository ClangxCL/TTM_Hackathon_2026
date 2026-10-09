import React from 'react';
import { AnalyticsSummary } from '../../types/analytics';
import { Coins, Activity, TrendingUp, DollarSign, PieChart, Users } from 'lucide-react';

interface CostPerCaseCardProps {
  summary: AnalyticsSummary;
}

export const CostPerCaseCard: React.FC<CostPerCaseCardProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Total Visits */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">จำนวนครั้งรับบริการ</span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono">
          {summary.total_visits}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{summary.total_patients} ผู้ป่วยในกลุ่มตัวอย่าง</span>
        </div>
      </div>

      {/* 2. Total Expenditure */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">ค่าใช้จ่ายรวมทั้งระบบ</span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono">
          ฿{summary.total_expenditure_thb.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          ค่ายา + ค่าหัตถการ + ค่าบริการ OPD
        </div>
      </div>

      {/* 3. Average Cost Per Episode */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">ต้นทุนเฉลี่ยต่อ Episode</span>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono">
          ฿{summary.average_cost_per_episode_thb.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          ต้นทุนการรักษาเฉลี่ยต่อครั้ง
        </div>
      </div>

      {/* 4. TTM to Conventional Ratio */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold">สัดส่วนยาไทย / แผนปัจจุบัน</span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 font-mono">
          {summary.ttm_to_conventional_ratio}x
        </div>
        <div className="text-[11px] text-slate-500 mt-1">
          ค่ายาสมุนไพร ฿{summary.ttm_drug_cost_thb.toLocaleString()}
        </div>
      </div>
    </div>
  );
};
