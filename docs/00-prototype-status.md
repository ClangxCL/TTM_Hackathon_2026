# สถานะของโปรโตไทป์ (Prototype Status & Maturity Assessment)
**โครงการ:** TTM Smutthan Engine Platform — Hackathon 2026  
**ทีมพัฒนา:** **ทีม VejVivat (เวชวิวัฒน์) — Thai Medicine AI Innovation**  
**ระดับความพร้อม (Maturity Level):** **Functional Prototype (1.3)** ขยับสู่ **MVP-ready (1.4)**  
**ข้อความปฏิเสธความรับผิดชอบ:** *เอกสารนี้ใช้สำหรับข้อมูลสังเคราะห์เพื่อการสาธิตการแข่งขัน Hackathon 2026 เท่านั้น มิใช่ข้อมูลผู้ป่วยจริง*

---

## 1. สรุปความพร้อมของระบบ (System Maturity Overview)

แพลตฟอร์ม **TTM Smutthan Engine** พัฒนาโดย **ทีม VejVivat (เวชวิวัฒน์)** ในรูปแบบเว็บแอปพลิเคชันสำหรับแพทย์แผนไทย (Clinician-facing) เพื่อแก้ไข Pain point ด้านความเข้าใจร่วมระหว่างแพทย์แผนปัจจุบันและแพทย์แผนไทย การประเมินสมุฏฐานธาตุที่โปร่งใสตรวจสอบได้ การตรวจจับอันตรกิริยาระหว่างสมุนไพรกับยาแผนปัจจุบัน (Herb-Drug Interaction: HDI) การขยายชุดเคสทดสอบเป็น **30 เคสจำลองทางคลินิก (C01–C30)** พร้อมระบบ **ลงทะเบียนผู้ป่วยรายใหม่ (Patient Intake)** และหน้า **แผนการรักษาและการติดตามผลรายบุคคล (Clinical Care Plan & Longitudinal Trajectory)**

```
[ระดับ 1.1: Paper/Concept] 
       ↓
[ระดับ 1.2: Clickable Mockup] 
       ↓
[ระดับ 1.3: Functional Prototype]  <-- [สถานะเดิม: 10 เคสจำลอง]
       ↓
[ระดับ 1.4: MVP-ready]             <-- [สถานะปัจจุบัน: 30 เคส + Patient Intake + Care Plan + Trajectory]
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
| | การปรับแก้ผลวินิจฉัยโดยแพทย์ (Clinician Override) | **Real** | บันทึกความเห็นต่าง เหตุผล และคำนวณ Inter-rater Agreement (Cohen's Kappa) | - |
| **2. Herb-Drug Interaction (HDI)** | การตรวจจับคู่ยาอันตรกิริยา (30 เคส C01–C30) | **Real** | อัลกอริทึมจับคู่ 14 กฎความสัมพันธ์ (Warfarin, Amlodipine, Digoxin, Aspirin ฯลฯ) | - |
| | การประเมินความรุนแรงและหลักฐานทางวิชาการ | **Real** | จัดระดับ สูง/ปานกลาง/ต่ำ พร้อม Evidence Level (A–D) และเอกสารอ้างอิง | - |
| | การตรวจสอบขนาดและระยะเวลาใช้ยา (Dosage Check) | **Real** | คำนวณปริมาณยาสูงสุดต่อวัน (Max Daily Dose) และระยะเวลาตามบัญชียา | - |
| | การยืนยันความปลอดภัยและการ Override ใบสั่งยา | **Real** | แพทย์ต้องระบุเหตุผลทางคลินิกก่อนสั่งยาที่มีอันตรกิริยาความเสี่ยงสูง | - |
| **3. Patient Intake & Cohort** | ชุดเคสจำลองทางคลินิก 30 เคส (C01–C30) | **Real Data Models** | ครอบคลุมทุกช่วงวัย ภูมิภาค ระดับความเสี่ยง และภาวะโรคร่วม | ข้อมูลสังเคราะห์ Zero-PII |
| | ระบบลงทะเบียนผู้ป่วยใหม่ (Self-Service Intake) | **Real Engine & Storage** | คำนวณธาตุกำเนิดอัตโนมัติ ดึงสภาพอากาศสด คีย์ยาและโรค บันทึก LocalStorage | - |
| **4. Clinical Care Plan & Follow-up** | แผนการรักษาและตารางติดตามผลรายเดือน | **Real Engine** | กำหนดจำนวนครั้งต่อเดือนตามหลักวิชาการ (Academic Cadence) อิง สธ. และ WHO | - |
| | มิติการติดตาม 4 ด้านหลัก (What & How to Monitor) | **Real Protocol** | เฝ้าระวังความปลอดภัย HDI, สัญญาณชีพ, สมดุลธาตุ และความร่วมมือการใช้ยา | - |
| | แดชบอร์ดแนวโน้มการฟื้นฟูรายบุคคล (Trajectory) | **Real Visualizations** | กราฟแนวโน้มระดับความปวด VAS, กราฟสมดุลตรีธาตุย้อนหลัง-ล่วงหน้า, ต้นทุนสะสม | - |
| **5. ICD-10-TM Analytics** | การประมวลผลต้นทุนต่อเคส (Cost per Episode) | **Real** | รวมค่าหัตถการ ค่ายาสมุนไพร และค่ายาแผนปัจจุบัน แยกตามหมวดหมู่ | - |
| | การวิเคราะห์การใช้รหัสโรค (ICD-10-TM Utilization) | **Real** | จัดอันดับรหัสโรคกลุ่ม U ประจำ รพ.สต. พร้อมคำนวณอัตราส่วนค่าใช้จ่าย | - |
| **6. HIS Integration Layer** | สถาปัตยกรรม Adapter Pattern | **Real** | มี Interface รองรับ HOSxP, EHP, SSB, Himpro | - |
| | การส่งออกข้อมูล 43 แฟ้ม & FHIR (MedicationRequest) | **Real** | แปลงโครงสร้างข้อมูลเป็น CSV 43 แฟ้ม และ HL7 FHIR R4 JSON Resource | ส่งออกในรูปแบบไฟล์ JSON/CSV |

---

## 3. เกณฑ์ชี้วัดความเป็น MVP-ready (MVP Acceptance Criteria)

- [x] **Zero PII Leakage:** ไม่มีข้อมูลระบุตัวตนของผู้ป่วยจริงใน Source code และ Repository (สคริปต์ `scripts/check-pii.py` ยืนยัน 0 PII)
- [x] **Deterministic Clinical Calculation:** ผลการคำนวณสมุฏฐานธาตุและอันตรกิริยายาให้ผลลัพธ์คงเส้นคงวาและตรวจสอบย้อนหลังได้ (ผ่าน Vitest 25/25 tests 100%)
- [x] **30 Synthetic Benchmarks & Intake:** มีชุดเคสทดสอบ 30 เคสครอบคลุมทุกระดับความเสี่ยง และมีระบบคีย์เพิ่มเคสใหม่ได้สดในห้องตรวจ
- [x] **Evidence-Based Care Plan & Cadence:** กำหนดแผนการรักษาและการติดตามผลรายเดือนตามระเบียบกระทรวงสาธารณสุขและแนวทาง WHO
- [x] **Interoperability Standards:** ใช้รหัสมาตรฐานกระทรวงสาธารณสุขครบถ้วน (รหัสยาแผนไทย 24 หลัก, ICD-10-TM รหัสกลุ่ม U, รหัสหัตถการ สนย.)
- [x] **Clinician Autonomy:** ไม่มีการตัดสินใจแทนแพทย์ มีกลไก Override และมี Decision Support Disclaimer กำกับทุกหน้าจอ
- [x] **Offline Resilience & Live Pages:** ระบบยังคงทำงานได้แม้ไม่มีอินเทอร์เน็ต และ Deploy สดบน GitHub Pages พร้อมใช้งานจริง
