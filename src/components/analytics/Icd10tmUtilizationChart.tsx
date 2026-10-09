import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Icd10tmUtilization } from '../../types/analytics';

interface Icd10tmUtilizationChartProps {
  utilization: Icd10tmUtilization[];
  monthlyTrends: { month: string; visit_count: number; ttm_cost: number; conventional_cost: number }[];
}

export const Icd10tmUtilizationChart: React.FC<Icd10tmUtilizationChartProps> = ({
  utilization,
  monthlyTrends,
}) => {
  const chartData = utilization.slice(0, 6).map((item) => ({
    name: item.u_code,
    label: item.thai_name.split(' ')[0],
    cases: item.case_count,
    procCost: item.total_procedure_fee,
    drugCost: item.total_drug_cost,
    avgCost: item.average_cost_per_case,
  }));

  return (
    <div className="space-y-4">
      {/* 1. Bar Chart: Expenditure Breakdown by ICD-10-TM */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-xs text-slate-900">
              ค่าบริการและค่ายาสมุนไพรแยกตามกลุ่มโรค ICD-10-TM (บาท)
            </h4>
            <p className="text-[11px] text-slate-500">
              เปรียบเทียบสัดส่วนค่าทำหัตถการ (Procedure) กับค่ายาสมุนไพร (Drug)
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            Top {chartData.length} Diagnoses
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar name="ค่าหัตถการ (บาท)" dataKey="procCost" fill="#0F766E" radius={[4, 4, 0, 0]} />
              <Bar name="ค่ายาสมุนไพร (บาท)" dataKey="drugCost" fill="#CA8A04" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Monthly Trend Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-bold text-xs text-slate-900">
              แนวโน้มค่าใช้จ่ายและจำนวนครั้งรับบริการรายเดือน (Monthly Trend)
            </h4>
            <p className="text-[11px] text-slate-500">
              ประมวลผลประวัติย้อนหลัง 6 - 12 เดือน จากข้อมูล 43 แฟ้มสังเคราะห์
            </p>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
            Real-time Aggregation
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                name="ค่าบริการแผนไทยรวม (บาท)"
                dataKey="ttm_cost"
                stroke="#0F766E"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                name="จำนวน Visit (ครั้ง)"
                dataKey="visit_count"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Detailed Table Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-900">
            ตารางสถิติรายรหัสโรค ICD-10-TM และต้นทุนเฉลี่ยต่อเคส (Cost per Episode)
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            {utilization.length} รหัสวินิจฉัย
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">รหัส ICD-10-TM</th>
                <th className="py-2.5 px-4 font-semibold">ชื่อโรคแผนไทย</th>
                <th className="py-2.5 px-4 font-semibold">เทียบเคียง ICD-10</th>
                <th className="py-2.5 px-4 font-semibold text-center">จำนวนเคส</th>
                <th className="py-2.5 px-4 font-semibold text-right">ค่าหัตถการ (บาท)</th>
                <th className="py-2.5 px-4 font-semibold text-right">ค่ายาไทย (บาท)</th>
                <th className="py-2.5 px-4 font-semibold text-right">ต้นทุนเฉลี่ย/เคส</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {utilization.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-2.5 px-4 font-mono font-bold text-brand-800">
                    {item.u_code}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900">{item.thai_name}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-500">{item.conventional_code}</td>
                  <td className="py-2.5 px-4 text-center font-bold">{item.case_count}</td>
                  <td className="py-2.5 px-4 text-right">฿{item.total_procedure_fee.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right">฿{item.total_drug_cost.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                    ฿{item.average_cost_per_case.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
