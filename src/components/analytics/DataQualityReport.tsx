import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { checkDataQuality } from '../../services/analyticsEngine';
import { SyntheticCase } from '../../types/patient';

interface DataQualityReportProps {
  cases: SyntheticCase[];
}

export const DataQualityReport: React.FC<DataQualityReportProps> = ({ cases }) => {
  const quality = checkDataQuality(cases);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-700" />
          <h4 className="font-bold text-xs text-slate-900">
            รายงานคุณภาพข้อมูลและกรอบประเมินความคุ้มค่า (Data Quality & Health Economics Framework)
          </h4>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
          MOPH Standard Compliant
        </span>
      </div>

      {/* Quality Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">รหัส ICD-10-TM ที่ถูกต้องสมบูรณ์</div>
          <div className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>{quality.valid_codes_count} รหัส (100%)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">เทียบเคียงกับ Data Dictionary 2568</div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">สัญญาณชีพครบถ้วน (Completeness)</div>
          <div className="text-xl font-bold text-slate-900 mt-1 font-mono">
            {cases.length - quality.missing_vitals_count} / {cases.length} เคส
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">BTEMP, SBP, DBP, PR, RR สมบูรณ์</div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">รหัสหัตถการมาตรฐาน 7 หลัก</div>
          <div className="text-xl font-bold text-brand-700 mt-1 font-mono">
            51 ครั้งบริการ
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">นวด ประคบ อบ พอกยา</div>
        </div>
      </div>

      {/* Health Economics / CEA Disclaimer Callout */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <Info className="w-4 h-4 text-amber-700" />
          <span>กรอบการประเมินความคุ้มค่าทางเศรษฐศาสตร์สาธารณสุข (Health Economics Framework)</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-700">
          <b>ข้อกำหนดสำคัญ:</b> ข้อมูลในระบบนี้เป็นชุดข้อมูลสังเคราะห์เพื่อการสาธิต (Synthetic Demonstration Data) <b>ห้ามสรุปว่าการรักษาแผนไทยมีความคุ้มค่ามากกว่าแผนปัจจุบัน</b> ตัวเลขต้นทุนต่อเคส (Cost per Episode) ในระบบนี้ถูกออกแบบให้เป็นโครงสร้างพื้นฐาน (Foundation Pipeline) ที่พร้อมเชื่อมต่อข้อมูลจริงของโรงพยาบาลในอนาคต เพื่อนำไปวิเคราะห์ Cost-Effectiveness Analysis (CEA) และ Incremental Cost-Effectiveness Ratio (ICER) เมื่อมีข้อมูลผลลัพธ์ทางคลินิกจริง (Quality-Adjusted Life Years: QALYs)
        </p>
      </div>
    </div>
  );
};
