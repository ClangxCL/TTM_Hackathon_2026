# สถาปัตยกรรมระบบและการเชื่อมต่อสารสนเทศ (System Architecture & HIS Integration)
**โครงการ:** TTM Smutthan Engine Platform — Hackathon 2026  
**ทีมพัฒนา:** **ทีม VejVivat (เวชวิวัฒน์) — Thai Medicine AI Innovation**  
**ข้อความปฏิเสธความรับผิดชอบ:** *เอกสารนี้ใช้สำหรับข้อมูลสังเคราะห์เพื่อการสาธิตการแข่งขัน Hackathon 2026 เท่านั้น มิใช่ข้อมูลผู้ป่วยจริง*

---

## 1. แผนผังสถาปัตยกรรมระบบ (System Architecture)

```mermaid
graph TB
    subgraph ClientLayer ["1. Presentation Layer (Clinician-Facing UI)"]
        UI_Intake["Patient Intake Modal<br/>(New Registration & Live Weather)"]
        UI_Smutthan["Smutthan Dashboard<br/>(Element Radar & Explainer)"]
        UI_Prescribe["Prescription Cart & Safety Alerts<br/>(Real-time HDI & Overdose Check)"]
        UI_Print["Clinical Summary & FHIR Export<br/>(Printable Leaflet & Disclaimer)"]
        UI_CarePlan["Care Plan & Trajectory Dashboard<br/>(Cadence Matrix & Recharts Trends)"]
        UI_Analytics["ICD-10-TM Real-time Analytics<br/>(Health Economics & Data Quality)"]
    end

    subgraph ServiceLayer ["2. Application & Core Domain Services"]
        SE["Smutthan Engine<br/>(Rule-based Scoring 0-100)"]
        HDI["Centralized HDI Matcher<br/>(Safety Rules C01-C30)"]
        DV["Dosage & Safety Validator<br/>(Max Daily Dose / Age limits)"]
        CPS["Care Plan & Follow-up Service<br/>(Monthly Cadence & Trajectory)"]
        AE["Analytics Engine<br/>(Cost per Episode / U-Codes)"]
        AI["AI Explainer Service<br/>(Gemini Prompt / Template Fallback)"]
    end

    subgraph AdapterLayer ["3. HIS Integration Layer (Adapter Pattern)"]
        Interface["HIS Adapter Interface"]
        MockAdap["Mock Local Adapter & Storage<br/>(In-Memory / LocalStorage Engine)"]
        Files43Adap["43-Folders Adapter<br/>(CSV Import/Export สนย. 2568)"]
        FhirAdap["HL7 FHIR Adapter<br/>(MedicationRequest JSON)"]
    end

    subgraph ExternalLayer ["4. External Systems & Data Sources"]
        HIS_HOSxP["HOSxP / HOSxP_PCU"]
        HIS_EHP["EHP (กรมการแพทย์แผนไทย)"]
        HIS_Other["SSB / Himpro"]
        MeteoAPI["Open-Meteo Weather API<br/>(Live Ambient Conditions)"]
    end

    UI_Intake --> MockAdap
    UI_Smutthan --> SE
    UI_Smutthan --> AI
    UI_Prescribe --> HDI
    UI_Prescribe --> DV
    UI_Print --> FhirAdap
    UI_CarePlan --> CPS
    UI_Analytics --> AE

    SE --> MeteoAPI
    UI_Intake --> MeteoAPI
    ServiceLayer --> Interface
    Interface --> MockAdap
    Interface --> Files43Adap
    Interface --> FhirAdap

    Files43Adap -.-> HIS_HOSxP
    Files43Adap -.-> HIS_EHP
    FhirAdap -.-> HIS_Other
```

---

## 2. ลำดับการไหลของข้อมูล 5 ขั้นตอน (5-Step Data Flow Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor TTM as แพทย์แผนไทย (TTM Clinician)
    participant UI as Web Application UI
    participant Weather as Open-Meteo Weather API
    participant Smutthan as Smutthan Engine
    participant HIS as HIS Integration Adapter
    participant HDI as HDI & Safety Engine
    participant CarePlan as Care Plan & Trajectory Service

    Note over TTM, CarePlan: ขั้นตอนที่ 1: เลือกเคส (C01-C30) หรือลงทะเบียนคนไข้ใหม่สด
    TTM->>UI: เลือกเคส C02 หรือกรอก Patient Intake Modal
    UI->>HIS: ดึงประวัติยาเดิม (Warfarin 3mg) และสัญญาณชีพ
    HIS-->>UI: ข้อมูลผู้ป่วย & Active Meds
    UI->>Weather: ดึงอุณหภูมิและความชื้นสดตามพิกัดสถานพยาบาล
    Weather-->>UI: อุณหภูมิ 38.5°C, ความชื้น 85%

    Note over TTM, CarePlan: ขั้นตอนที่ 2: ประเมินสมุฏฐานธาตุ 4 กอง
    UI->>Smutthan: ประมวลผลสมุฏฐาน (Vitals + Symptoms + Weather + Time)
    Smutthan-->>UI: เรดาร์ชาร์ตธาตุ (วาโย/เตโช กำเริบ) + Rule Reasons

    Note over TTM, CarePlan: ขั้นตอนที่ 3: สั่งยาสมุนไพรและตรวจจับอันตรกิริยา
    TTM->>UI: เลือกสั่งยา "ยาแคปซูลขมิ้นชัน"
    UI->>HDI: ตรวจสอบอันตรกิริยากับยาเดิม (Warfarin + ขมิ้นชัน)
    HDI-->>UI: แจ้งเตือนความเสี่ยงสูง (HIGH: เลือดออกรุนแรง Level B)
    TTM->>UI: ยืนยัน Clinician Override พร้อมระบุเหตุผลและแผนตรวจ INR

    Note over TTM, CarePlan: ขั้นตอนที่ 4: พิมพ์ใบสั่งยาและสรุปเวชระเบียน
    UI-->>TTM: พิมพ์ Clinical Prescription Sheet & HL7 FHIR Export

    Note over TTM, CarePlan: ขั้นตอนที่ 5: แผนการรักษาและการติดตามผลรายบุคคล
    UI->>CarePlan: สร้างแผนการรักษา & ตารางติดตามผล (MOPH & WHO Cadence)
    CarePlan-->>UI: Cadence Matrix (4 ครั้ง/เดือนแรก), Trajectory Charts (VAS/Tridosha), Red Flags
    UI-->>TTM: แสดงแดชบอร์ดแผนการรักษาและแนวโน้มสุขภาพรายบุคคล
```

---

## 3. สถาปัตยกรรม Adapter Pattern สำหรับเชื่อมต่อ HIS

ระบบได้รับการออกแบบโดยยึดหลัก **Clean Architecture** และ **Hexagonal / Adapter Pattern** เพื่อให้สามารถเสียบต่อกับระบบ HIS ของโรงพยาบาลได้ทุกระบบโดยไม่ต้องแก้ไขโค้ดการทำงานหลัก:

```typescript
export interface HisAdapter {
  getPatientDemographics(hn: string): Promise<PatientInfo>;
  getActiveMedications(hn: string): Promise<CurrentMedication[]>;
  getEncounterVitals(vn: string): Promise<Vitals>;
  submitPrescription(prescription: PrescriptionSubmission): Promise<PrescriptionResponse>;
  exportFortyThreeFolders(dateRange: DateRange): Promise<Blob>;
}
```

### การรองรับระบบ HIS ในประเทศไทย:
1. **HOSxP / HOSxP_PCU:** เชื่อมต่อผ่าน MySQL Replication หรือ REST API Gateway ของ BMS
2. **EHP (Electronic Health Record กรมการแพทย์แผนไทย):** ส่งออกและนำเข้าข้อมูลประวัติการตรวจวินิจฉัยและรหัสยาแผนไทย
3. **SSB / Himpro:** เชื่อมต่อผ่าน HL7 FHIR MedicationRequest Endpoint
4. **Persistent LocalStorage Fallback:** บันทึกข้อมูลและเคสใหม่ที่ลงทะเบียนผ่าน `PatientIntakeModal` บนเบราว์เซอร์อย่างปลอดภัย พร้อมใช้งานแม้ออฟไลน์

---

## 4. โครงสร้างข้อมูล HL7 FHIR MedicationRequest Resource

ใบสั่งยาจากแพลตฟอร์มสามารถแปลงเป็นมาตรฐานสากล **HL7 FHIR R4 MedicationRequest** ได้ทันที:

```json
{
  "resourceType": "MedicationRequest",
  "id": "rx-c02-001",
  "status": "active",
  "intent": "order",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/medicationrequest-category",
          "code": "outpatient",
          "display": "Outpatient"
        }
      ]
    }
  ],
  "medicationCodeableConcept": {
    "coding": [
      {
        "system": "https://moph.go.th/standards/ttm/drug24",
        "code": "410000000122019150011402",
        "display": "ยาแคปซูลขมิ้นชัน"
      }
    ],
    "text": "ยาแคปซูลขมิ้นชัน (500 มก.)"
  },
  "subject": {
    "reference": "Patient/HN-2568002",
    "display": "นางสมจิตต์ (ข้อมูลสังเคราะห์เพื่อการสาธิต)"
  },
  "dosageInstruction": [
    {
      "text": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหาร เช้า-กลางวัน-เย็น",
      "timing": {
        "repeat": {
          "frequency": 3,
          "period": 1,
          "periodUnit": "d"
        }
      }
    }
  ],
  "note": [
    {
      "text": "Decision Support: แจ้งเตือนอันตรกิริยากับ Warfarin ความเสี่ยงสูง (Bleeding risk). แพทย์ยืนยันการสั่งใช้พร้อมนัดติดตาม INR สัปดาห์ละ 1 ครั้งตามแผนบริบาล VejVivat Care Plan"
    }
  ]
}
```

---

## 5. มาตรการความมั่นคงปลอดภัยและการปกป้องข้อมูลส่วนบุคคล (Security & Privacy)

1. **Zero Real Patient Data:** ระบบใช้ชุดข้อมูลสังเคราะห์ 30 เคส (C01–C30) ตามหลักวิชาการเวชกรรมไทย 100%
2. **PII Masking & De-identification:**
   - เลขบัตรประชาชนถูก Masked เป็น `1-1004-XXXXX-01-1`
   - เบอร์โทรศัพท์ถูก Masked เป็น `081-XXX-4501`
   - มีสคริปต์ตรวจสอบก่อน Commit (`scripts/check-pii.py`) รันผ่าน CI/CD ยืนยัน 0 PII
3. **Data Segregation:** ข้อมูลการคำนวณ กฎเกณฑ์ทางการแพทย์ และแดชบอร์ดถูกออกแบบให้ประมวลผลบน Client-side อย่างปลอดภัย ไม่ส่งข้อมูลระบุตัวตนออกนอกเบราว์เซอร์
