# สถานะของโปรโตไทป์ (Prototype Status & Maturity Assessment)
**โครงการ:** TTM Smutthan Engine Platform — Hackathon 2026  
**ระดับความพร้อม (Maturity Level):** **Functional Prototype (1.3)** ขยับสู่ **MVP-ready (1.4)**  
**ข้อความปฏิเสธความรับผิดชอบ:** *เอกสารนี้ใช้สำหรับข้อมูลสังเคราะห์เพื่อการสาธิตการแข่งขัน Hackathon 2026 เท่านั้น มิใช่ข้อมูลผู้ป่วยจริง*

---

## 1. สรุปความพร้อมของระบบ (System Maturity Overview)

แพลตฟอร์ม **TTM Smutthan Engine** ได้รับการพัฒนาในรูปแบบเว็บแอปพลิเคชันสำหรับแพทย์แผนไทย (Clinician-facing) เพื่อแก้ไข Pain point ด้านความเข้าใจร่วมระหว่างแพทย์แผนปัจจุบันและแพทย์แผนไทย การประเมินสมุฏฐานธาตุที่โปร่งใสตรวจสอบได้ และการตรวจจับอันตรกิริยาระหว่างสมุนไพรกับยาแผนปัจจุบัน (Herb-Drug Interaction: HDI)

```
[ระดับ 1.1: Paper/Concept] 
       ↓
[ระดับ 1.2: Clickable Mockup] 
       ↓
[ระดับ 1.3: Functional Prototype]  <-- [สถานะปัจจุบัน: ฟังก์ชันคำนวณจริง + Mock Data ละเอียด]
       ↓
[ระดับ 1.4: MVP-ready]             <-- [ความพร้อมรองรับ Pilot รพ.สต. ด้วย Adapter Architecture]
       ↓
[ระดับ 2.0: Full Production HIS Integration]
```

---

## 2. เมทริกซ์ฟังก์ชันจริงเทียบกับแบบจำลอง (Real vs. Simulated Feature Matrix)

| ส่วนประกอบระบบ (Component) | ฟังก์ชันการทำงาน (Functionality) | สถานะความพร้อม (Status) | การทำงานจริง (Real) | การจำลอง (Simulated / Mock) |
|---|---|:---:|---|---|
| **1. Smutthan Engine** | การดึงสภาพอากาศและสิ่งแวดล้อม (อุตุสมุฏฐาน) | **Real / Fallback** | เชื่อมต่อ Open-Meteo API ดึงอุณหภูมิและความชื้นแบบ Real-time ตามพิกัด รพ.สต. | มี Mock Fallback หากออฟไลน์หรือ API ขัดข้อง |
| | การคำนวณธาตุสมุฏฐาน (Rule-based Engine) | **Real** | คำนวณคะแนนธาตุดิน น้ำ ลม ไฟ (0-100) ตามกฎเกณฑ์กาล-อายุ-อุตุ-สัญญาณชีพจริง | - |
| | การอธิบายเหตุผลทางคลินิก (Explainability) | **Real** | แสดง Rule Impact Breakdown ทีละข้อ พร้อมผลกระทบต่อธาตุอย่างโปร่งใส | - |
| | การประมวลผลคำอธิบายทางคลินิกด้วย GenAI | **Hybrid** | Prompt Workflow ออกแบบสมบูรณ์ พร้อมเชื่อม Gemini API / Rule-template fallback | Rule-template fallback หากไม่ใส่ GEMINI_API_KEY |
| | การปรับแก้ผลวินิจฉัยโดยแพทย์ (Clinician Override) | **Real** | บันทึกความเห็นต่าง เหตุผล และคำนวณ Inter-rater Agreement (Cohen's Kappa) | - |
| **2. Herb-Drug Interaction (HDI)** | การตรวจจับคู่ยาอันตรกิริยา (C01–C10) | **Real** | อัลกอริทึมจับคู่ 14 กฎความสัมพันธ์ (Warfarin, Amlodipine, Digoxin ฯลฯ) | - |
| | การประเมินความรุนแรงและหลักฐานทางวิชาการ | **Real** | จัดระดับ สูง/ปานกลาง/ต่ำ พร้อม Evidence Level (A–D) และเอกสารอ้างอิง | - |
| | การตรวจสอบขนาดและระยะเวลาใช้ยา (Dosage Check) | **Real** | คำนวณปริมาณยาสูงสุดต่อวัน (Max Daily Dose) และระยะเวลาตามบัญชียา | - |
| | การยืนยันความปลอดภัยและการ Override ใบสั่งยา | **Real** | แพทย์ต้องระบุเหตุผลทางคลินิกก่อนสั่งยาที่มีอันตรกิริยาความเสี่ยงสูง | - |
| **3. ICD-10-TM Analytics** | การประมวลผลต้นทุนต่อเคส (Cost per Case) | **Real** | รวมค่าหัตถการ ค่ายาสมุนไพร และค่ายาแผนปัจจุบัน แยกตามหมวดหมู่ | - |
| | การวิเคราะห์การใช้รหัสโรค (ICD-10-TM Utilization) | **Real** | จัดอันดับรหัสโรคกลุ่ม U ประจำ รพ.สต. พร้อมคำนวณอัตราส่วนค่าใช้จ่าย | - |
| | การตรวจสอบคุณภาพและความครบถ้วนของข้อมูล (Data Quality) | **Real** | ตรวจสอบรหัสมาตรฐาน 43 แฟ้ม, สัญญาณชีพ และรหัสยา 24 หลัก | - |
| **4. HIS Integration Layer** | สถาปัตยกรรม Adapter Pattern | **Real** | มี Interface รองรับ HOSxP, EHP, SSB, Himpro | - |
| | การส่งออกและนำเข้าข้อมูล 43 แฟ้ม (DRUG, DIAG, PROCED) | **Real** | แปลงโครงสร้างข้อมูลสังเคราะห์เป็น CSV ตามโครงสร้างมาตรฐาน สนย. 2568 | ข้อมูลผู้ป่วยเป็นข้อมูลสังเคราะห์ 100% |
| | FHIR Stub Adapter (MedicationRequest) | **Real** | แปลงใบสั่งยาเป็น HL7 FHIR JSON Resource ตามสเปกสากล | ส่งออกในรูปแบบ JSON (ยังไม่ได้ต่อเซิร์ฟเวอร์ FHIR จริง) |

---

## 3. เกณฑ์ชี้วัดความเป็น MVP-ready (MVP Acceptance Criteria)

- [x] **Zero PII Leakage:** ไม่มีข้อมูลระบุตัวตนของผู้ป่วยจริงใน Source code และ Repository (สคริปต์ `scripts/check-pii.py` ยืนยัน 0 PII)
- [x] **Deterministic Clinical Calculation:** ผลการคำนวณสมุฏฐานธาตุและอันตรกิริยายาให้ผลลัพธ์คงเส้นคงวาและตรวจสอบย้อนหลังได้ (ผ่าน Vitest 100%)
- [x] **Interoperability Standards:** ใช้รหัสมาตรฐานกระทรวงสาธารณสุขครบถ้วน (รหัสยาแผนไทย 24 หลัก, ICD-10-TM รหัสกลุ่ม U, รหัสหัตถการ สนย.)
- [x] **Clinician Autonomy:** ไม่มีการตัดสินใจแทนแพทย์ มีกลไก Override และมี Decision Support Disclaimer กำกับทุกหน้าจอ
- [x] **Offline Resilience:** ระบบยังคงทำงานได้แม้ไม่มีอินเทอร์เน็ต (มี Fallback สภาพอากาศและคลังข้อมูลในเครื่อง)
