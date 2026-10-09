import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Pill,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Database,
  Cpu,
  Share2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 sm:px-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-800 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Thai Traditional Medicine Digital Health & AI Hackathon 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          TTM Smutthan Engine Platform
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          แพลตฟอร์มสนับสนุนการตัดสินใจทางคลินิก (CDSS) สำหรับแพทย์แผนไทย เชื่อมโยงข้อมูลสภาพแวดล้อม Real-time ประเมินสมุฏฐานวินิจฉัยอย่างโปร่งใส พร้อมฐานข้อมูลกลางตรวจอันตรกิริยาระหว่างยากับสมุนไพร และวิเคราะห์ความคุ้มค่า ICD-10-TM
        </p>

        {/* Prototype Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Functional Prototype (ระดับ 1.3)
          </span>
          <span className="bg-teal-100 text-teal-900 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-teal-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> MVP-Ready (ระดับ 1.4)
          </span>
          <span className="bg-amber-100 text-amber-900 font-medium px-3 py-1 rounded-full border border-amber-200">
            ข้อมูลสังเคราะห์เพื่อการสาธิต 10 เคส
          </span>
        </div>

        {/* Action CTA */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/patients')}
            className="bg-brand-700 hover:bg-brand-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm group"
          >
            <span>เริ่มสาธิตระบบห้องตรวจ (Launch Demo Flow)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => navigate('/status')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-5 py-3 rounded-2xl transition text-sm"
          >
            ตรวจสอบสถานะความพร้อมระบบ (Status Matrix)
          </button>
        </div>
      </div>

      {/* 3 Core Hackathon Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Pillar 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-700 flex items-center justify-center border border-teal-100 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              1. Smutthan Engine (AI-Assisted)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ดึงข้อมูลสภาพอากาศ อุณหภูมิ ความชื้นสดจาก <b>Open-Meteo API</b> แบบ Real-time ประมวลผลร่วมกับกาลสมุฏฐาน อายุ และสัญญาณชีพ เพื่อคำนวณแนวโน้ม 4 ธาตุ (ปถวี อาโป วาโย เตโช) ผ่าน Rule-based scoring ที่โปร่งใส อธิบายได้ ลดความเหลื่อมล้ำในการวินิจฉัย
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-brand-700 flex items-center gap-1">
            <span>คำนวณสดด้วย Radar Chart & Explainable Rules</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              2. Centralized Herb-Drug Interaction (HDI)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ฐานข้อมูลกลางตรวจสอบอันตรกิริยาคู่ยาระหว่างยาแผนปัจจุบันใน HIS กับยาสมุนไพรไทย แจ้งเตือนความเสี่ยงทันที (สูง/ปานกลาง/ต่ำ) พร้อมกลไกทางเภสัชวิทยา ระดับหลักฐานเชิงประจักษ์ (Level A-D) และระบบตรวจขนาดยาเกินอัตโนมัติ
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-rose-600 flex items-center gap-1">
            <span>เชื่อมต่อ HIS ผ่าน OpenAPI & FHIR Spec</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              3. ICD-10-TM Real-time Analytics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ประมวลผลการลงรหัสโรคแพทย์แผนไทย (ICD-10-TM U-Codes) ควบคู่กับรหัสหัตถการและค่ายาสมุนไพรแบบ Real-time คำนวณต้นทุนต่อเคส (Cost per Episode) เพื่อสร้างกรอบวิเคราะห์ความคุ้มค่าทางเศรษฐศาสตร์สาธารณสุข
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center gap-1">
            <span>โครงสร้างรองรับ CEA / CUA / ICER ในอนาคต</span>
          </div>
        </div>
      </div>

      {/* Clinical Workflow Overview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-700" />
          <span>เส้นทางการใช้งานในห้องตรวจจริง (Clinician-Facing User Journey)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="font-bold text-brand-800 text-sm block mb-1">ขั้นตอนที่ 1</span>
            <div className="font-semibold text-slate-900">เลือกเคสผู้ป่วย</div>
            <p className="text-slate-500 mt-1 text-[11px]">
              จำลองข้อมูลคนไข้ 10 เคส จาก 43 แฟ้ม ดูประวัติยาแผนปัจจุบันและโรคเรื้อรัง
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="font-bold text-brand-800 text-sm block mb-1">ขั้นตอนที่ 2</span>
            <div className="font-semibold text-slate-900">ประเมินสมุฏฐาน</div>
            <p className="text-slate-500 mt-1 text-[11px]">
              Engine คำนวณ 4 ธาตุจากสภาพอากาศจริง ปรับสัญญาณชีพ แพทย์ Override ได้
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="font-bold text-brand-800 text-sm block mb-1">ขั้นตอนที่ 3</span>
            <div className="font-semibold text-slate-900">สั่งยา & ตรวจ HDI</div>
            <p className="text-slate-500 mt-1 text-[11px]">
              ค้นบัญชียา 21 รายการ คำนวณขนาดยา เตือนอันตรกิริยา กดรับทราบความเสี่ยง
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <span className="font-bold text-brand-800 text-sm block mb-1">ขั้นตอนที่ 4</span>
            <div className="font-semibold text-slate-900">พิมพ์ใบสั่งยา & Analytics</div>
            <p className="text-slate-500 mt-1 text-[11px]">
              ออกใบสั่งยา/ฉลากยา ส่งออก JSON เข้า HIS และประมวลผลต้นทุนทันที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
