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
  UserPlus,
  Users,
  Activity,
  Layers,
} from 'lucide-react';
import teamLogo from '@/assets/team-logo.png';

interface LandingPageProps {
  onOpenIntake?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenIntake }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 sm:px-6">
      {/* Hero Section with VejVivat Team Branding & Crest */}
      <div className="text-center space-y-5 max-w-3xl mx-auto pt-4">
        {/* Team Logo Badge */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-brand-500 to-teal-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 p-2 shadow-2xl border border-amber-400/40 flex items-center justify-center transform group-hover:scale-105 transition duration-300">
              <img
                src={teamLogo}
                alt="VejVivat Thai Medicine AI Crest"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 via-brand-50 to-teal-50 border border-amber-300/80 text-amber-950 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-900">ทีม VejVivat (เวชวิวัฒน์)</span>
            <span className="text-slate-400">•</span>
            <span className="text-teal-800">Thai Medicine AI Innovation</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          TTM Smutthan Engine Platform
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          แพลตฟอร์มสนับสนุนการตัดสินใจทางคลินิก (CDSS) สำหรับแพทย์แผนไทย เชื่อมโยงข้อมูลสภาพแวดล้อม Real-time ประเมินสมุฏฐานวินิจฉัยอย่างโปร่งใส ตรวจสอบอันตรกิริยายาสมุนไพรกับยาแผนปัจจุบัน (HDI) และวิเคราะห์ความคุ้มค่า ICD-10-TM
        </p>

        {/* Prototype Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Functional Prototype (ระดับ 1.3)
          </span>
          <span className="bg-teal-100 text-teal-900 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-teal-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> MVP-Ready (ระดับ 1.4)
          </span>
          <span className="bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-700" /> 30 เคสสังเคราะห์ทางคลินิก
          </span>
          <span className="bg-indigo-100 text-indigo-950 font-bold px-3 py-1 rounded-full border border-indigo-200 shadow-2xs flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5 text-indigo-700" /> คีย์เพิ่มผู้ป่วยใหม่ได้เอง
          </span>
        </div>

        {/* Action CTAs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/patients')}
            className="bg-gradient-to-r from-brand-700 to-teal-700 hover:from-brand-800 hover:to-teal-800 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-brand-900/20 hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2 text-sm group"
          >
            <span>เริ่มสาธิตระบบห้องตรวจ (30 เคสจำลอง)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          {onOpenIntake ? (
            <button
              onClick={onOpenIntake}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ คีย์เพิ่มเคสผู้ป่วยใหม่</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/patients')}
              className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold px-5 py-3.5 rounded-2xl transition text-sm flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-amber-700" />
              <span>+ เพิ่มเคสผู้ป่วยใหม่</span>
            </button>
          )}

          <button
            onClick={() => navigate('/status')}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium px-5 py-3.5 rounded-2xl transition text-sm shadow-2xs"
          >
            สถานะความพร้อมระบบ (Status Matrix)
          </button>
        </div>
      </div>

      {/* 4 Core Platform Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        {/* Pillar 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-700 flex items-center justify-center border border-teal-100 shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              1. Smutthan Engine (AI-Assisted)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ดึงข้อมูลสภาพอากาศ อุณหภูมิ ความชื้นสดจาก <b>Open-Meteo API</b> แบบ Real-time ประมวลผลร่วมกับกาลสมุฏฐาน อายุ และสัญญาณชีพ เพื่อคำนวณแนวโน้ม 4 ธาตุ (ปถวี อาโป วาโย เตโช) ผ่าน Rule-based scoring ที่โปร่งใสและอธิบายได้
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-brand-700 flex items-center gap-1">
            <span>คำนวณสดด้วย Radar Chart & Explainable Rules</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4">
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4">
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

        {/* Pillar 4 (New) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-sm">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              4. Interactive Intake & 30 Synthetic Cohort
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              รองรับการทดสอบด้วย 30 เคสจำลองทางคลินิก และมีระบบ <b>ลงทะเบียนผู้ป่วยใหม่ (Self-Service Intake)</b> คำนวณธาตุกำเนิดอัตโนมัติจากวันเดือนปีเกิด ดึงพิกัดสภาพอากาศสด และเลือกยาจากบัญชียาหลักแห่งชาติ พ.ศ. 2569
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs font-semibold text-amber-700 flex items-center gap-1">
            <span>บันทึก LocalStorage พร้อมทดสอบทันที</span>
          </div>
        </div>
      </div>

      {/* Clinical Workflow Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-700" />
              <span>เส้นทางการใช้งานในห้องตรวจจริง (Clinician-Facing User Journey)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ออกแบบสอดคล้องกับระเบียบวิธีปฏิบัติงานจริงของแพทย์แผนไทยในสถานพยาบาลระดับปฐมภูมิและทุติยภูมิ
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-800 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full self-start sm:self-auto">
            5-Step Complete Smart Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 transition">
            <span className="font-bold text-brand-800 text-xs block mb-1">ขั้นตอนที่ 1</span>
            <div className="font-bold text-slate-900">เลือกเคส / คีย์ใหม่</div>
            <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
              30 เคสจำลอง หรือลงทะเบียนผู้ป่วยใหม่ ตรวจสอบประวัติยาและโรคประจำตัว
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 transition">
            <span className="font-bold text-brand-800 text-xs block mb-1">ขั้นตอนที่ 2</span>
            <div className="font-bold text-slate-900">ประเมินสมุฏฐาน 4 มิติ</div>
            <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
              วิเคราะห์ 4 ธาตุจากสภาพอากาศสด กาล อายุ สัญญาณชีพ แสดง Radar Chart
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 transition">
            <span className="font-bold text-brand-800 text-xs block mb-1">ขั้นตอนที่ 3</span>
            <div className="font-bold text-slate-900">สั่งยา & ตรวจ HDI</div>
            <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
              ค้นบัญชียา 21 รายการ คำนวณขนาดยา เตือนอันตรกิริยา บันทึก Override
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-300 transition">
            <span className="font-bold text-brand-800 text-xs block mb-1">ขั้นตอนที่ 4</span>
            <div className="font-bold text-slate-900">พิมพ์ใบสั่งยา & ฉลากยา</div>
            <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
              ออกใบสั่งยา/ฉลากยา ส่งออก 43 แฟ้ม & FHIR JSON บูรณาการเข้า HIS
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-teal-50 p-3.5 rounded-2xl border border-amber-300 hover:border-brand-400 transition shadow-xs">
            <span className="font-bold text-amber-800 text-xs block mb-1">ขั้นตอนที่ 5 (ใหม่)</span>
            <div className="font-bold text-slate-900">แผนการรักษา & ติดตามผล</div>
            <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
              กำหนดความถี่ติดตามผลรายเดือนตามหลักวิชาการ พร้อมกราฟแนวโน้มฟื้นฟูรายบุคคล
            </p>
          </div>
        </div>
      </div>

      {/* Team VejVivat Footer Showcase Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 p-1 border border-amber-400/40 shadow-lg shrink-0">
            <img src={teamLogo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              ทีมพัฒนาผู้เข้าแข่งขัน
            </div>
            <h4 className="text-lg font-bold text-white">
              ทีม VejVivat (เวชวิวัฒน์) - Thai Medicine AI
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              มุ่งมั่นพัฒนานวัตกรรมปัญญาประดิษฐ์เพื่อยกระดับระบบบริการสุขภาพการแพทย์แผนไทยสู่มาตรฐานสากล
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/patients')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition"
          >
            เข้าสู่ห้องตรวจ (30 เคส)
          </button>
        </div>
      </div>
    </div>
  );
};
