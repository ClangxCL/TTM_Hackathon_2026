# TTM Smutthan Engine Platform 🌿🩺
**ระบบสนับสนุนการตัดสินใจทางคลินิกแพทย์แผนไทย เชื่อมโยงสารสนเทศสุขภาพ และตรวจจับอันตรกิริยาสมุนไพร-ยาแผนปัจจุบัน**  
*ผลงานสำหรับ Hackathon 2026 — สาขา Health Informatics & Thai Traditional Medicine Innovation*

[![Tests](https://img.shields.io/badge/tests-21%2F21%20passing-brightgreen.svg)](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/src/tests)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/tsconfig.json)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/package.json)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/tailwind.config.js)
[![Maturity Level](https://img.shields.io/badge/Maturity-Functional%20Prototype%20(1.3)-amber.svg)](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/00-prototype-status.md)
[![Data Privacy](https://img.shields.io/badge/Data%20Privacy-100%25%20Synthetic%20(0%20PII)-success.svg)](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/scripts/check-pii.py)

---

> ### ⚠️ ข้อความปฏิเสธความรับผิดชอบทางการแพทย์และข้อมูลส่วนบุคคล (Clinical & Data Disclaimer)
> 1. **ข้อมูลสังเคราะห์เพื่อการสาธิต (100% Synthetic Data):** ข้อมูลผู้ป่วยทั้งหมด (เคส C01–C10 และประวัติการรักษา 51 ครั้ง) ในระบบนี้เป็น **ข้อมูลที่ถูกสร้างขึ้นเพื่อการจำลองทางวิชาการในการแข่งขัน Hackathon 2026 เท่านั้น** มิใช่ข้อมูลผู้ป่วยจริงจากสถานพยาบาลใดๆ
> 2. **ระบบสนับสนุนการตัดสินใจ (Clinical Decision Support):** ระบบนี้ทำหน้าที่เป็นเครื่องมือสนับสนุนการตัดสินใจ (Decision Support) มิใช่การวินิจฉัยโรคหรือสั่งการรักษาแทนแพทย์แผนไทยผู้ประกอบวิชาชีพ
> 3. **สถานะรายการยาและอันตรกิริยา:** ข้อมูลบัญชียาแผนไทยและคู่ยาอันตรกิริยาในระบบจัดอยู่ในสถานะ **"ตัวอย่าง รอเภสัชกร/แพทย์แผนไทยตรวจสอบ"**

---

## 🎯 วิสัยทัศน์ของระบบ (3 เป้าหมายหลัก)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TTM Smutthan Engine Platform                      │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ 1. Smutthan Engine  │ 2. Centralized HDI       │ 3. ICD-10-TM          │
│    (AI-Assisted)    │    Database              │    Analytics          │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ • สภาพอากาศ Live    │ • ตรวจจับ 14 คู่ยาเสี่ยง │ • ต้นทุนต่อเคสจริง    │
│ • คำนวณธาตุ 4 โปร่งใส│ • Evidence Level A-D     │ • จัดอันดับ U-Codes   │
│ • อธิบายได้ทุกกฎ    │ • Override + ปรับขนาดยา  │ • Data Quality Score  │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

1. **Smutthan Engine:** เครื่องมือช่วยประเมินสมุฏฐานวินิจฉัย (AI-assisted) รวบรวมสภาวะแวดล้อม สภาพอากาศ (อุณหภูมิ, ความชื้น) จาก Open-Meteo API แบบ Real-time ประมวลผลร่วมกับกาลสมุฏฐาน (เวลา), อายุสมุฏฐาน (วัย), สัญญาณชีพ และอาการสำคัญ เพื่อคำนวณและคาดการณ์ความแปรปรวนของธาตุประธานอย่างโปร่งใส ตรวจสอบย้อนหลังได้ 100% ลดความเหลื่อมล้ำของการวิเคราะห์โรคระหว่างผู้ประกอบวิชาชีพ
2. **Centralized Herb-Drug Interaction (HDI) Database:** ฐานข้อมูลกลางตรวจอันตรกิริยาระหว่างยาแผนปัจจุบันกับสมุนไพร รองรับ API กับระบบ HIS ทุกระดับ (HOSxP, EHP, SSB, Himpro) แจ้งเตือนความปลอดภัยทันทีเมื่อมีการสั่งยาร่วมกัน พร้อมระบบรับทราบและบันทึกเหตุผลทางคลินิก (Clinician Override)
3. **ICD-10-TM Real-time Analytics:** ยกระดับการบันทึก ICD-10-TM (กลุ่มรหัส U) ให้ประมวลผลการจ่ายยาและหัตถการไทยแบบ Real-time เพื่อประเมินต้นทุนต่อเคส ความคุ้มค่าทางเศรษฐศาสตร์สาธารณสุข และตรวจสอบคุณภาพข้อมูลตามมาตรฐาน 43 แฟ้มกระทรวงสาธารณสุข (สนย. 2568)

---

## 🚀 ฟังก์ชันเด่นในการสาธิต (Demo Highlights)

- 🌟 **เคสทดสอบไฮไลท์ C02 (นางสมจิตต์ อายุ 68 ปี - Warfarin + ขมิ้นชัน):**  
  ผู้ป่วยมีโรคประจำตัว Atrial Fibrillation รับประทานยาละลายลิ่มเลือด Warfarin อยู่เดิม เมื่อมารับบริการแผนไทยและระบบแนะนำให้ใช้ยาขับลม/แก้ปวด หากเลือกสั่ง "ยาแคปซูลขมิ้นชัน" ระบบจะแสดงการแจ้งเตือน **ระดับความเสี่ยงสูง (HIGH Severity - Evidence Level B)** ทันที เนื่องจากขมิ้นชันยับยั้ง CYP2C9 และต้านการเกาะกลุ่มเกล็ดเลือด ทำให้ค่า INR ยืดผิดปกติและเสี่ยงต่อภาวะเลือดออกในทางเดินอาหาร พร้อมแนะนำทางเลือกอื่นที่ปลอดภัย เช่น การนวดประคบสมุนไพร
- 🌤️ **Live Environmental Fetching:**  
  เชื่อมต่อ Open-Meteo REST API เพื่อดึงอุณหภูมิและความชื้นสัมพัทธ์ตามพิกัด รพ.สต. จริง พร้อมระบบ Fallback หากออฟไลน์
- 📊 **Element Radar Chart & Explainable Breakdown:**  
  แสดงสมดุลธาตุดิน น้ำ ลม ไฟ พร้อมตารางแจกแจงน้ำหนักคะแนนทุกข้ออย่างโปร่งใส
- 📑 **HL7 FHIR & 43-Folders Interoperability:**  
  ส่งออกใบสั่งยาในรูปแบบ **HL7 FHIR R4 MedicationRequest** และไฟล์ CSV ตามมาตรฐาน 43 แฟ้ม (DRUG_OPD, DIAGNOSIS_OPD, PROCEDURE_OPD)

---

## 📂 โครงสร้างไดเรกทอรีโครงการ (Project Structure)

```
ttm-smutthan-engine/
├── .github/workflows/deploy.yml   # GitHub Actions อัตโนมัติ Deploy สู่ GitHub Pages
├── config/
│   └── mapping-43folders.json     # คอนฟิก Mapping ฟิลด์มาตรฐาน 43 แฟ้ม และรหัสยา 24 หลัก
├── data/
│   ├── formulary/                 # บัญชียาสมุนไพร 21 รายการ (NLEM 2568, รหัส 24 หลัก)
│   ├── hdi/                       # ฐานข้อมูล 14 คู่ยาอันตรกิริยา (C01-C10 + Extension)
│   ├── master/                    # รหัสยาแผนปัจจุบัน 12 รายการ และ ICD-10-TM Master
│   ├── rules/                     # กฎการคำนวณสมุฏฐานธาตุ และอภิธานศัพท์ (Glossary)
│   └── synthetic/                 # เคสจำลอง C01-C10 และชุดข้อมูล 43 แฟ้มย้อนหลัง 51 Visits
├── docs/                          # เอกสารข้อกำหนดและการวิเคราะห์ฉบับสมบูรณ์ 10 บท
├── pitch/                         # สไลด์นำเสนอและบทพูด Pitching (5 นาที / 10 นาที)
├── public/openapi.yaml            # OpenAPI 3.0 Specification สำหรับ HIS REST Gateway
├── src/
│   ├── adapters/                  # Clean Architecture Adapter Pattern (Mock, 43-Files, FHIR)
│   ├── components/                # UI Components (Radar Chart, Safety Alert, Prescription Cart)
│   ├── pages/                     # 7 หน้าจอหลักของระบบ
│   ├── services/                  # Business Logic Engines (Smutthan, HDI, Dosage, Analytics)
│   ├── tests/                     # 4 ชุดการทดสอบ Vitest (21 Tests Passed 100%)
│   └── types/                     # TypeScript Domain Model Interfaces
├── scripts/
│   ├── check-pii.py               # สคริปต์สแกนตรวจจับข้อมูลส่วนบุคคล (PII)
│   └── deidentify.py              # สคริปต์ De-identification สำหรับชุดข้อมูล
└── package.json
```

---

## 🛠️ วิธีการติดตั้งและรันระบบ (Quickstart Guide)

### 1. ความต้องการของระบบ (Prerequisites)
- Node.js version 18.0 ขึ้นไป
- npm หรือ yarn

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. รัน Unit Tests (ทดสอบความถูกต้องของกฎและการคำนวณ)
```bash
npm test
```
*ผลการทดสอบ: 4 Test Suites, 21 Tests Passed (100% Passing)*

### 4. รันระบบในโหมด Development
```bash
npm run dev
```
เปิดบราวเซอร์ที่ `http://localhost:5173`

### 5. Build สำหรับ Production และ Deployment
```bash
npm run build
```
ไฟล์ Bundle ที่ผ่านการคอมไพล์จะถูกสร้างไว้ในโฟลเดอร์ `dist/` พร้อมนำไป Deploy บน Web Server หรือ GitHub Pages ได้ทันที

---

## 📚 ดัชนีเอกสารโครงการ (Documentation Index)

| เอกสาร | หัวข้อเนื้อหา |
|---|---|
| [docs/00-prototype-status.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/00-prototype-status.md) | สถานะความพร้อมของโปรโตไทป์ (Functional Prototype 1.3 สู่ MVP-ready 1.4) |
| [docs/01-system-overview.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/01-system-overview.md) | ที่มา ปัญหา 3 เสาหลัก กลุ่มผู้ใช้งาน และตัวชี้วัดความสำเร็จ (KPIs) |
| [docs/02-input-process-output.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/02-input-process-output.md) | ข้อกำหนด IPO, Data Dictionary และการเชื่อมโยงฟิลด์ 43 แฟ้ม |
| [docs/03-architecture.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/03-architecture.md) | สถาปัตยกรรมระบบ ผัง Mermaid, Adapter Pattern และมาตรฐาน FHIR |
| [docs/04-ai-explainability.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/04-ai-explainability.md) | ความโปร่งใสของ AI, สูตรคำนวณธาตุ และกลไก Clinician Override |
| [docs/05-technical-feasibility.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/05-technical-feasibility.md) | ความเป็นไปได้ทางเทคนิค การบริหารความเสี่ยง และประมาณการต้นทุน |
| [docs/06-health-economics.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/06-health-economics.md) | การประเมินความคุ้มค่าทางเศรษฐศาสตร์สาธารณสุข และต้นทุนต่อเคส |
| [docs/07-formulary-and-prescribing.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/07-formulary-and-prescribing.md) | คู่มือบัญชียาสมุนไพร เกณฑ์ขนาดยาสูงสุด และระบบสั่งจ่ายยาปลอดภัย |
| [docs/08-pilot-plan.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/08-pilot-plan.md) | แผนงานการนำร่องในพื้นที่จริง 4 ระยะในเครือข่าย รพ.สต. |
| [docs/09-known-limitations.md](file:///C:/Users/Piyanut/Desktop/Code_Work/ttm-smutthan-engine/docs/09-known-limitations.md) | ข้อจำกัดของระบบในปัจจุบัน และ Roadmap การพัฒนาสู่เวอร์ชัน 2.0 |

---

## 👥 ข้อมูลทีมพัฒนาและการแข่งขัน
- **โครงการ:** TTM Smutthan Engine Platform
- **เวที:** TTM Hackathon 2026
- **Repository:** [https://github.com/ClangxCL/TTM_Hackathon_2026](https://github.com/ClangxCL/TTM_Hackathon_2026)
