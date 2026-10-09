import { SyntheticCase } from '../types/patient';
import {
  PatientCarePlan,
  MonitoringRiskLevel,
  MonitoringDomain,
  MonthlyCadence,
  FollowUpMilestone,
  TrajectoryDataPoint,
  HolisticSelfCarePlan,
} from '../types/carePlan';

export class CarePlanService {
  /**
   * Generates an evidence-based clinical care plan and longitudinal follow-up trajectory
   * tailored to the individual patient case.
   */
  public static generateCarePlan(c: SyntheticCase): PatientCarePlan {
    const p = c.patient_info;
    const enc = c.current_encounter;
    const outcome = c.expected_demo_outcome;
    const herbName = c.intended_ttm_prescription.herb_name;
    const westernMeds = c.current_medications.map((m) => m.generic_name);

    // 1. Determine Risk Level
    let riskLevel: MonitoringRiskLevel = 'LOW';
    let riskLabel = 'ความเสี่ยงต่ำ / เฝ้าระวังทั่วไป (Low Risk / Standard Surveillance)';
    if (outcome.interaction_level.includes('สูง')) {
      riskLevel = 'HIGH';
      riskLabel = 'ความเสี่ยงสูง / เฝ้าระวังเข้มงวด (High Risk / Intensive Pharmacovigilance)';
    } else if (outcome.interaction_level.includes('ปานกลาง')) {
      riskLevel = 'MODERATE';
      riskLabel = 'ความเสี่ยงปานกลาง / ติดตามสม่ำเสมอ (Moderate Risk / Active Monitoring)';
    }

    const guidelineSource =
      'แนวทางการให้บริการการแพทย์แผนไทยและการแพทย์ทางเลือกร่วมกับการแพทย์แผนปัจจุบันในระบบบริการสุขภาพ (กรมการแพทย์แผนไทยฯ 2568) & WHO Herbal Pharmacovigilance Standards (2024)';

    // 2. Therapeutic Goals
    const therapeuticGoals = this.determineTherapeuticGoals(c, riskLevel);

    // 3. Monitoring Domains (What & How to monitor)
    const monitoringDomains = this.determineMonitoringDomains(c, riskLevel);

    // 4. Monthly Cadence (Academic Frequency Guidelines per Month)
    const monthlyCadence = this.determineMonthlyCadence(riskLevel, herbName, westernMeds);

    // 5. Follow-up Milestones Timeline (Actionable Checkpoints)
    const followUpSchedule = this.generateFollowUpSchedule(c, riskLevel, enc.date);

    // 6. Longitudinal Trajectory & Prognosis
    const prognosis = this.generatePrognosisTrajectory(c, riskLevel);

    // 7. Holistic Self-Care Prescription
    const holisticCare = this.generateHolisticSelfCare(p.birth_element, enc.season, enc.chief_complaint);

    return {
      patient_hn: p.hn,
      patient_name: p.name,
      case_id: c.case_id,
      risk_level: riskLevel,
      risk_label: riskLabel,
      guideline_source: guidelineSource,
      prescribed_herb_name: herbName,
      western_medications: westernMeds,
      therapeutic_goals: therapeuticGoals,
      monitoring_domains: monitoringDomains,
      monthly_cadence: monthlyCadence,
      follow_up_schedule: followUpSchedule,
      prognosis: prognosis,
      holistic_care: holisticCare,
    };
  }

  private static determineTherapeuticGoals(c: SyntheticCase, risk: MonitoringRiskLevel) {
    const cc = c.current_encounter.chief_complaint;
    const herb = c.intended_ttm_prescription.herb_name;

    return {
      short_term_weeks_1_2: [
        `บรรเทาอาการสำคัญ (${cc}) ลงอย่างน้อย 40-50% ภายใน 14 วัน`,
        `เฝ้าระวังอันตรกิริยาระหว่าง ${herb} กับยาประจำตัว ไม่ให้เกิดอาการข้างเคียงรุนแรง`,
        `ควบคุมสัญญาณชีพ (ความดันโลหิต, ชีพจร, อุณหภูมิ) ให้อยู่ในเกณฑ์ปลอดภัยของคลินิก`,
      ],
      medium_term_months_1_3: [
        `ปรับสมดุลธาตุกำเนิดและธาตุสมุฏฐาน (${c.patient_info.birth_element}) ให้กลับคืนสู่สภาวะสมธาตุ`,
        `ลดการพึ่งพายาแก้ปวดเคมีหรือยาลดกรดลง (De-prescribing evaluation ภายใต้การดูแลของแพทย์)`,
        `เพิ่มระดับคุณภาพชีวิตและความสามารถในการดำเนินกิจวัตรประจำวัน (PROM Score > 80%)`,
      ],
      long_term_months_3_6: [
        `คงสภาวะปราศจากอาการกำเริบซ้ำอย่างยั่งยืนด้วยการปรับพฤติกรรมตามหลักอายุรเวทไทย`,
        `เสริมสร้างภูมิคุ้มกันและธาตุเจ้าเรือนให้แข็งแรง ลดอัตราการนอนโรงพยาบาลหรือการเกิดภาวะแทรกซ้อน`,
        `ประเมินความคุ้มค่าทางการแพทย์ (Cost-Effectiveness) และความปลอดภัยสะสมต่อเนื่อง 6 เดือน`,
      ],
    };
  }

  private static determineMonitoringDomains(c: SyntheticCase, risk: MonitoringRiskLevel): MonitoringDomain[] {
    const meds = c.current_medications.map((m) => m.generic_name.toLowerCase());
    const herb = c.intended_ttm_prescription.herb_name;
    const v = c.current_encounter.vitals;

    const domains: MonitoringDomain[] = [];

    // Domain 1: HDI Safety & ADR
    if (meds.some((m) => m.includes('warfarin') || m.includes('clopidogrel') || m.includes('aspirin'))) {
      domains.push({
        id: 'dom-hdi-bleeding',
        category: 'HDI_SAFETY',
        title: 'ความปลอดภัยด้านการแข็งตัวของเลือดและอันตรกิริยา (Bleeding Risk & HDI)',
        description: `ผู้ป่วยใช้ยาต้านการแข็งตัวของเลือด/ต้านเกล็ดเลือด ร่วมกับ ${herb}`,
        what_to_monitor: 'จ้ำเลือดใต้ผิวหนัง, เลือดออกตามไรฟัน, เลือดกำเดา, อุจจาระสีดำ (Melena), ปัสสาวะปนเลือด, ค่า INR',
        how_to_monitor: 'ตรวจร่างกายที่ OPD + โทรติดตามสัปดาห์ละ 1 ครั้ง + ตรวจ Prothrombin Time (PT/INR)',
        modality: 'LAB',
        target_indicator: 'INR อยู่ในช่วงรักษาเป้าหมาย (2.0 - 3.0), ไม่มีภาวะ Bleeding ทางคลินิก',
        danger_signs: 'อาเจียนเป็นเลือด, อุจจาระสีดำเหนียว, เวียนศีรษะหน้ามืดเฉียบพลัน (พบแพทย์ทันที)',
        frequency_note: 'สัปดาห์ที่ 1, 2, 4 ในเดือนแรก จากนั้นเดือนละ 1 ครั้ง',
      });
    } else if (meds.some((m) => m.includes('metformin') || m.includes('glipizide') || m.includes('glimepiride'))) {
      domains.push({
        id: 'dom-hdi-glucose',
        category: 'HDI_SAFETY',
        title: 'ความปลอดภัยด้านระดับน้ำตาลในเลือด (Hypoglycemia Surveillance)',
        description: `ผู้ป่วยใช้ยาลดน้ำตาลในเลือดร่วมกับ ${herb}`,
        what_to_monitor: 'อาการน้ำตาลต่ำ (เหงื่อแตก ใจสั่น มือสั่น วิงเวียน หวิว), ค่าน้ำตาลปลายนิ้ว (DTX/FBS)',
        how_to_monitor: 'ผู้ป่วยบันทึกสมุดน้ำตาลตนเอง (Self-log) + ตรวจยืนยัน FBS/HbA1c ที่ OPD',
        modality: 'SELF_LOG',
        target_indicator: 'FBS 80 - 130 mg/dL, ไม่มีอาการ Hypoglycemia',
        danger_signs: 'หมดสติ, ชัก, ซึมสับสน, เหงื่อออกตัวเย็นจัด',
        frequency_note: 'ตรวจบันทึกทุกเช้าในสัปดาห์แรก, ติดตามที่ OPD สัปดาห์ที่ 2 และเดือนที่ 1',
      });
    } else if (meds.some((m) => m.includes('digoxin'))) {
      domains.push({
        id: 'dom-hdi-cardiac',
        category: 'HDI_SAFETY',
        title: 'การเฝ้าระวังภาวะพิษจากยาหัวใจและเกลือแร่ (Digoxin Toxicity & Electrolytes)',
        description: `ผู้ป่วยใช้ Digoxin ร่วมกับ ${herb} (ความเสี่ยง Hypokalemia)`,
        what_to_monitor: 'คลื่นไส้ อาเจียน ตาพร่าเห็นแสงสีเหลือง/เขียว, ชีพจรเต้นช้าหรือสะดุด, ค่า Serum K+ และ Digoxin level',
        how_to_monitor: 'ตรวจ EKG 12-lead + ตรวจระดับ Serum Electrolytes ที่ห้องปฏิบัติการ',
        modality: 'LAB',
        target_indicator: 'Serum K+ > 4.0 mEq/L, Heart Rate 60 - 90 bpm สม่ำเสมอ',
        danger_signs: 'ใจสั่นรุนแรง เจ็บหน้าอก ชีพจรเต้นช้ากว่า 50 ครั้ง/นาที',
        frequency_note: 'สัปดาห์ละ 1 ครั้งใน 2 สัปดาห์แรก จากนั้นทุกเดือน',
      });
    } else {
      domains.push({
        id: 'dom-hdi-general',
        category: 'HDI_SAFETY',
        title: 'ความปลอดภัยและการแพ้ยาสมุนไพร (Herb Safety & Adverse Reaction Check)',
        description: `เฝ้าระวังอาการข้างเคียงและการทำงานของตับ/ไตจาก ${herb}`,
        what_to_monitor: 'ผื่นคัน ลมพิษ แน่นหน้าอก หายใจลำบาก ตัวเหลืองตาเหลือง ปัสสาวะสีเข้ม',
        how_to_monitor: 'ประเมินอาการทางคลินิก + ซักประวัติอาการไม่พึงประสงค์ (ADR Screening)',
        modality: 'FACILITY',
        target_indicator: 'ไม่มีอาการแพ้ยา (Naranjo score = 0), การทำงานของตับไตปกติ',
        danger_signs: 'ริมฝีปากบวม หายใจไม่ออก แน่นคอ ผื่นแดงลุกลามทั่วตัว',
        frequency_note: 'ติดตามที่ 3-5 วันแรก และสิ้นสุดเดือนที่ 1',
      });
    }

    // Domain 2: Vital Signs & Clinical Symptoms
    domains.push({
      id: 'dom-vitals-symptoms',
      category: 'VITALS_SYMPTOMS',
      title: 'สัญญาณชีพและการทุเลาของอาการสำคัญ (Vital Signs & Target Symptom Relief)',
      description: `ประเมินความดันโลหิต ชีพจร อุณหภูมิ และความรุนแรงของ ${c.current_encounter.chief_complaint}`,
      what_to_monitor: `ระดับความปวด/ความรุนแรง (VAS Pain Score 0-10), ความดันโลหิต (เป้าหมาย < ${v.sbp > 130 ? '130/80' : '140/90'} mmHg), อัตราการเต้นของหัวใจ`,
      how_to_monitor: 'วัดสัญญาณชีพมาตรฐานที่ OPD หรือ รพ.สต. + บันทึก VAS score ในแฟ้มประวัติ',
      modality: 'FACILITY',
      target_indicator: 'VAS Score ลดลงสู่ระดับ < 3/10, SBP 110-130 mmHg, DBP 70-85 mmHg',
      danger_signs: 'BP > 160/100 mmHg หรือ < 90/60 mmHg, มีไข้สูง > 38.5°C',
      frequency_note: 'ทุกครั้งที่มาตรวจตามนัด (อย่างน้อยเดือนละ 1-2 ครั้ง)',
    });

    // Domain 3: 4-Element Balance Shift
    domains.push({
      id: 'dom-elements',
      category: 'ELEMENT_BALANCE',
      title: 'การปรับสมดุลตรีธาตุและสมุฏฐาน (Smutthan 4-Element Balance Evolution)',
      description: `ประเมินการฟื้นตัวของธาตุกำเนิด (${c.patient_info.birth_element}) และความแปรปรวนของ ปถวี อาโป วาโย เตโช`,
      what_to_monitor: 'ลักษณะอุจจาระ ปัสสาวะ การระบายเหงื่อ การย่อยอาหาร ลมในกระเพาะลำไส้ การนอนหลับ และความสดชื่นของร่างกาย',
      how_to_monitor: 'การตรวจร่างกายเวชกรรมไทย (ดู คลำ เคาะ ฟัง ซักประวัติธาตุ) + รัน Smutthan Engine ซ้ำ',
      modality: 'FACILITY',
      target_indicator: 'คะแนนความสมดุล 4 ธาตุใน Radar Chart เข้าใกล้ศูนย์กลางสมดุล (Samathat)',
      danger_signs: 'อาการธาตุพิการเฉียบพลัน เช่น ท้องร่วงรุนแรง ตัวเย็นจัด เหงื่อกาฬแตก',
      frequency_note: 'ประเมินซ้ำทุก 30 วันในรอบการตรวจที่ OPD',
    });

    // Domain 4: Medication Adherence & Lifestyle
    domains.push({
      id: 'dom-adherence',
      category: 'ADHERENCE',
      title: 'ความสม่ำเสมอในการรับประทานยาและพฤติกรรม (Treatment Adherence & Lifestyle)',
      description: 'ประเมินการรับประทานยาแผนไทยและยาแผนปัจจุบันถูกต้องตรงเวลา',
      what_to_monitor: 'จำนวนเม็ดยาที่เหลือ (Pill Count), การลืมทานยา, การปฏิบัติตามคำแนะนำอาหารและท่าบริหาร',
      how_to_monitor: 'นับเม็ดยาในวันนัด + ซักประวัติการรับประทานอาหารแสลง',
      modality: 'SELF_LOG',
      target_indicator: 'อัตราความร่วมมือการใช้ยา (Adherence Rate) >= 90%',
      danger_signs: 'หยุดยาเองโดยไม่ปรึกษาแพทย์ หรือซื้อยาสมุนไพรชุดอื่นมาทานซ้ำซ้อน',
      frequency_note: 'ประเมินทุกครั้งที่มารับยาและผ่านโทรศัพท์ติดตาม',
    });

    return domains;
  }

  private static determineMonthlyCadence(
    risk: MonitoringRiskLevel,
    herbName: string,
    westernMeds: string[]
  ): MonthlyCadence[] {
    if (risk === 'HIGH') {
      return [
        {
          month_number: 1,
          month_label: 'เดือนที่ 1 (Intensive Pharmacovigilance & Titration)',
          recommended_visits_per_month: 4,
          frequency_rationale:
            'ตามมาตรฐาน WHO & กรมการแพทย์แผนไทยฯ ผู้ป่วยที่มีอันตรกิริยาคู่ยาเสี่ยงสูงต้องติดตามสัปดาห์ละ 1 ครั้งในเดือนแรก เพื่อตรวจจับอาการไม่พึงประสงค์เฉียบพลันและตรวจยืนยันค่าแล็บสำคัญ',
          guideline_reference: 'MOPH TTM Clinical Practice Guideline 2568, หมวดที่ 4 การเฝ้าระวังความปลอดภัยระดับ 1',
          key_milestones: [
            'สัปดาห์ที่ 1 (Day 7): โทรติดตามอาการเลือดออก/อาการผิดปกติครั้งแรก',
            'สัปดาห์ที่ 2 (Day 14): ตรวจร่างกายที่คลินิก + ตรวจ Lab ยืนยันผล',
            'สัปดาห์ที่ 3 (Day 21): โทรประเมินผลการปรับตัวของร่างกาย',
            'สัปดาห์ที่ 4 (Day 28): ประเมินผลครบ 1 เดือนเต็มและออกใบสั่งยาต่อเนื่อง',
          ],
          check_items: ['ADR Screening', 'Lab Test (INR/K+/LFT)', 'Vital Signs', 'Symptom Relief Score'],
        },
        {
          month_number: 2,
          month_label: 'เดือนที่ 2 (Stabilization & Element Adjustment)',
          recommended_visits_per_month: 2,
          frequency_rationale:
            'ติดตามทุก 2 สัปดาห์เมื่อผ่านพ้นช่วงเฉียบพลัน เพื่อประเมินความคงตัวของยาแผนไทยและตรวจสอบว่าสมุฏฐานธาตุตอบสนองได้ดี',
          guideline_reference: 'แนวทางเวชปฏิบัติการดูแลโรคเรื้อรังร่วมกับการใช้สมุนไพร กรมการแพทย์แผนไทยฯ',
          key_milestones: [
            'สัปดาห์ที่ 6 (Day 42): ตรวจติดตามความก้าวหน้าและประเมินสัญญาณชีพ',
            'สัปดาห์ที่ 8 (Day 56): ประเมินซ้ำผลข้างเคียงระยะกลางและดัชนีคุณภาพชีวิต',
          ],
          check_items: ['Vitals Check', 'Pill Count', 'Smutthan Balance Assessment', 'Dietary Review'],
        },
        {
          month_number: 3,
          month_label: 'เดือนที่ 3 (Consolidation & Quarterly Review)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'ประเมินผลสัมฤทธิ์ครบไตรมาสที่ 1 ตรวจแล็บซ้ำเพื่อยืนยันความปลอดภัยระยะยาว และพิจารณาปรับลดขนาดยาแผนปัจจุบันที่ไม่จำเป็น',
          guideline_reference: 'เกณฑ์การประเมินผลการรักษาเวชกรรมไทยไตรมาสที่ 1 (Quarterly Clinical Audit)',
          key_milestones: [
            'สัปดาห์ที่ 12 (Day 84): การตรวจประเมินครบวงจร 4 มิติ และสรุปผลตอบสนอง',
          ],
          check_items: ['Full Clinical Exam', 'Follow-up Lab Panel', 'PROM Score', 'Cost-Effectiveness Review'],
        },
        {
          month_number: 4,
          month_label: 'เดือนที่ 4-6 (Maintenance & Prevention Phase)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'ติดตามเดือนละ 1 ครั้ง เพื่อคงสภาพการรักษา ป้องกันการกลับเป็นซ้ำ และส่งเสริมการพึ่งพาตนเองด้วยการแพทย์แผนไทย',
          guideline_reference: 'แนวทางการบริบาลผู้ป่วยระยะฟื้นฟูและการส่งเสริมสุขภาพชุมชน',
          key_milestones: [
            'เดือนที่ 4-5: ติดตามการปฏิบัติตนและรับยาต่อเนื่อง',
            'เดือนที่ 6 (Day 180): ประเมินผลลัพธ์สิ้นสุดรอบการดูแล 6 เดือนเต็ม (Graduation)',
          ],
          check_items: ['Annual/Semi-annual Health Screen', 'Adherence Log', 'Longitudinal Trajectory Summary'],
        },
      ];
    } else if (risk === 'MODERATE') {
      return [
        {
          month_number: 1,
          month_label: 'เดือนที่ 1 (Active Initiation & Safety Verification)',
          recommended_visits_per_month: 2,
          frequency_rationale:
            'แนะนำติดตามทุก 2 สัปดาห์ (สัปดาห์ที่ 2 และ 4) ในเดือนแรก เพื่อยืนยันว่าไม่มีภาวะแทรกซ้อนและการตอบสนองต่อยาเป็นไปตามคาด',
          guideline_reference: 'NLEM Pharmacovigilance Monitoring Guide for Herbal Medicines 2568',
          key_milestones: [
            'สัปดาห์ที่ 2 (Day 14): ตรวจสัญญาณชีพและติดตามอาการสำคัญ',
            'สัปดาห์ที่ 4 (Day 28): ประเมินผลสิ้นสุดคอร์สแรกและปรับขนาดยาตามอาการ',
          ],
          check_items: ['Blood Pressure', 'Blood Sugar Self-log', 'Pain/Symptom Score', 'Pill Count'],
        },
        {
          month_number: 2,
          month_label: 'เดือนที่ 2 (Response Evaluation)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'ติดตามเดือนละ 1 ครั้งสำหรับผู้ป่วยที่มีอาการคงที่และไม่พบผลข้างเคียงผิดปกติ',
          guideline_reference: 'แนวทางเวชปฏิบัติการแพทย์แผนไทยในสถานพยาบาลระดับปฐมภูมิ',
          key_milestones: [
            'สัปดาห์ที่ 8 (Day 56): ประเมินการฟื้นตัวของธาตุกำเนิดและคุณภาพชีวิต',
          ],
          check_items: ['Vitals', 'Symptom Reduction', 'Smutthan Radar Check'],
        },
        {
          month_number: 3,
          month_label: 'เดือนที่ 3 (Maintenance & Titration)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'ตรวจประเมินผลครบ 3 เดือน วางแผนลดขนาดยาหรือหยุดยาตามข้อบ่งชี้ทางเวชกรรมไทย',
          guideline_reference: 'เกณฑ์การสิ้นสุดหรือปรับเปลี่ยนการใช้ยาแผนไทยตามคัมภีร์',
          key_milestones: ['สัปดาห์ที่ 12: ตรวจประเมินผลสัมฤทธิ์และวางแผนถอนยา'],
          check_items: ['Full Evaluation', 'PROM Survey', 'De-escalation Plan'],
        },
        {
          month_number: 4,
          month_label: 'เดือนที่ 4-6 (Surveillance & Health Promotion)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'ติดตามทุก 1-2 เดือน เพื่อส่งเสริมสุขภาพและป้องกันโรคเรื้อรังกำเริบ',
          guideline_reference: 'แนวทางการสร้างเสริมสุขภาวะแพทย์แผนไทย',
          key_milestones: ['เดือนที่ 6: ตรวจประเมินสุขภาวะองค์รวม'],
          check_items: ['Self-care Review', 'Exercise Adherence', 'Outcome Log'],
        },
      ];
    } else {
      // LOW RISK
      return [
        {
          month_number: 1,
          month_label: 'เดือนที่ 1 (Acute Resolution & Safety Check)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'สำหรับโรคเฉียบพลันหรืออาการเบื้องต้น แนะนำติดตามที่ 3-7 วัน (ผ่านโทรศัพท์หรือ รพ.สต.) และตรวจประเมินสิ้นสุดสัปดาห์ที่ 3-4',
          guideline_reference: 'คู่มือการใช้ยาสมุนไพรในระบบบริการสุขภาพปฐมภูมิ (สธ. 2568)',
          key_milestones: [
            'วันที่ 3-5: ติดตามการทุเลาของอาการสำคัญทางโทรศัพท์หรือไลน์',
            'สัปดาห์ที่ 3-4: ตรวจปิดเคสที่ OPD หากอาการหายสนิท',
          ],
          check_items: ['Symptom Clearance', 'No ADR Confirmation', 'General Wellbeing'],
        },
        {
          month_number: 2,
          month_label: 'เดือนที่ 2 (Health Promotion & Habit Cultivation)',
          recommended_visits_per_month: 1,
          frequency_rationale:
            'ติดตามเมื่อมีอาการผิดปกติ (PRN) หรือนัดติดตามเดือนละ 1 ครั้งสำหรับเคสที่ต้องการปรับธาตุเจ้าเรือนต่อเนื่อง',
          guideline_reference: 'การบริบาลเวชกรรมไทยเพื่อการส่งเสริมสุขภาพเชิงรุก',
          key_milestones: ['เดือนที่ 2: นัดหมายเมื่อมีอาการ หรือตรวจติดตามสุขภาพ'],
          check_items: ['Dietary Balance', 'Ruesi Dat Ton Practice'],
        },
        {
          month_number: 3,
          month_label: 'เดือนที่ 3-6 (Annual / PRN Monitoring)',
          recommended_visits_per_month: 0.5, // Every 2 months
          frequency_rationale:
            'ติดตามทุก 2-3 เดือน หรือเมื่อสภาพอากาศ/ฤดูกาลเปลี่ยน เพื่อปรับการดูแลตามกาลสมุฏฐานและอุตุสมุฏฐาน',
          guideline_reference: 'เวชศึกษาการแพทย์แผนไทย: การปรับตัวตามการเปลี่ยนผ่านของฤดูกาล',
          key_milestones: ['เปลี่ยนฤดูกาล: ตรวจประเมินธาตุและรับคำแนะนำอาหารตามฤดู'],
          check_items: ['Seasonal Adaptation', 'Wellness Score'],
        },
      ];
    }
  }

  private static generateFollowUpSchedule(
    c: SyntheticCase,
    risk: MonitoringRiskLevel,
    startDateStr: string
  ): FollowUpMilestone[] {
    const parsedDate = new Date(startDateStr);
    const formatDate = (days: number) => {
      const d = new Date(parsedDate);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    };

    if (risk === 'HIGH') {
      return [
        {
          visit_number: 1,
          due_date_offset_days: 7,
          scheduled_date: formatDate(7),
          timing_label: 'สัปดาห์ที่ 1 (Day 7)',
          modality: 'TELEMED',
          modality_label: 'โทรติดตาม / Line Tele-health',
          focus: 'ซักถามอาการเลือดออก/อาการผิดปกติเฉียบพลัน ตรวจสอบการรับประทานยา',
          status: 'NEXT_DUE',
          key_actions: ['ถามอาการ Bleeding / ผื่นคัน / วิงเวียน', 'ยืนยันขนาดยา', 'นัดตรวจ Lab สัปดาห์หน้า'],
          doctor_notes: 'หากพบจุดเลือดออกใต้ผิวหนังหรือถ่ายดำ ให้หยุดยาทันทีและมา รพ. ทันที',
        },
        {
          visit_number: 2,
          due_date_offset_days: 14,
          scheduled_date: formatDate(14),
          timing_label: 'สัปดาห์ที่ 2 (Day 14)',
          modality: 'FACILITY',
          modality_label: 'ตรวจ ณ แผนกผู้ป่วยนอก (OPD Clinic)',
          focus: 'ตรวจสัญญาณชีพ ตรวจร่างกาย และเจาะเลือดติดตามค่าแล็บสำคัญ (INR/K+/LFT)',
          status: 'PLANNED',
          key_actions: ['วัด BP, PR, BT', 'เจาะเลือดตรวจ Lab', 'ประเมินระดับความปวด VAS', 'นับเม็ดยา Pill count'],
        },
        {
          visit_number: 3,
          due_date_offset_days: 30,
          scheduled_date: formatDate(30),
          timing_label: 'เดือนที่ 1 (Day 30)',
          modality: 'FACILITY',
          modality_label: 'ตรวจ ณ แผนกผู้ป่วยนอก (OPD Clinic)',
          focus: 'ประเมินผลสัมฤทธิ์ครบ 1 เดือน รัน Smutthan Engine ซ้ำเพื่อดูการปรับสมดุลธาตุ',
          status: 'PLANNED',
          key_actions: ['Re-evaluate 4 Elements', 'ปรับลด/คงขนาดยาแผนไทย', 'ออกใบสั่งยาเดือนที่ 2'],
        },
        {
          visit_number: 4,
          due_date_offset_days: 60,
          scheduled_date: formatDate(60),
          timing_label: 'เดือนที่ 2 (Day 60)',
          modality: 'FACILITY',
          modality_label: 'ตรวจ ณ แผนกผู้ป่วยนอก (OPD Clinic)',
          focus: 'ติดตามความก้าวหน้าและการฟื้นฟูสมรรถภาพ ตรวจสอบการปฏิบัติตามอาหารแสลง',
          status: 'PLANNED',
          key_actions: ['ประเมิน PROM คุณภาพชีวิต', 'ตรวจสัญญาณชีพ', 'ปรับคำแนะนำกายบริหาร'],
        },
        {
          visit_number: 5,
          due_date_offset_days: 90,
          scheduled_date: formatDate(90),
          timing_label: 'เดือนที่ 3 (Day 90)',
          modality: 'FACILITY',
          modality_label: 'ตรวจ ณ แผนกผู้ป่วยนอก (OPD Clinic)',
          focus: 'การตรวจประเมินครบวงจรประจำไตรมาส (Comprehensive Quarterly Evaluation)',
          status: 'PLANNED',
          key_actions: ['สรุปผลตอบสนองต่อการรักษา', 'วางแผน de-prescribing', 'วิเคราะห์ต้นทุนสะสม'],
        },
        {
          visit_number: 6,
          due_date_offset_days: 180,
          scheduled_date: formatDate(180),
          timing_label: 'เดือนที่ 6 (Day 180)',
          modality: 'FACILITY',
          modality_label: 'ตรวจประเมินระยะยาวและจบแผนการรักษา (Discharge / Maintenance)',
          focus: 'ประเมินความยั่งยืนของสุขภาวะและวางแผนการดูแลตนเองระยะยาว',
          status: 'PLANNED',
          key_actions: ['Final Outcome Measure', 'วางแผนส่งต่อชุมชน/รพ.สต.', 'มอบประกาศนียบัตรสุขภาพ'],
        },
      ];
    } else {
      return [
        {
          visit_number: 1,
          due_date_offset_days: 7,
          scheduled_date: formatDate(7),
          timing_label: 'สัปดาห์ที่ 1 (Day 7)',
          modality: 'TELEMED',
          modality_label: 'โทรติดตามผลทางไกล (Tele-follow up)',
          focus: 'ติดตามอาการสำคัญเบื้องต้นและตรวจสอบอาการไม่พึงประสงค์จากยา',
          status: 'NEXT_DUE',
          key_actions: ['ประเมินความพึงพอใจ', 'ตรวจเช็กการทานยาตรงเวลา', 'ให้คำแนะนำเบื้องต้น'],
        },
        {
          visit_number: 2,
          due_date_offset_days: 28,
          scheduled_date: formatDate(28),
          timing_label: 'เดือนที่ 1 (Day 28)',
          modality: 'FACILITY',
          modality_label: 'ตรวจ ณ คลินิกการแพทย์แผนไทย (OPD)',
          focus: 'ตรวจประเมินสัญญาณชีพ ความรุนแรงของอาการ และทบทวนความสมดุลของตรีธาตุ',
          status: 'PLANNED',
          key_actions: ['ตรวจร่างกายเวชกรรมไทย', 'ประเมิน VAS score', 'พิจารณาปรับหรือหยุดยา'],
        },
        {
          visit_number: 3,
          due_date_offset_days: 60,
          scheduled_date: formatDate(60),
          timing_label: 'เดือนที่ 2 (Day 60)',
          modality: 'FACILITY',
          modality_label: 'ตรวจติดตาม ณ คลินิก (OPD)',
          focus: 'ติดตามการฟื้นตัวของธาตุกำเนิดและประเมินคุณภาพชีวิต PROM',
          status: 'PLANNED',
          key_actions: ['ประเมินการเคลื่อนไหว/การทำงาน', 'ติดตามอาหารปรับธาตุ', 'ประเมินความคุ้มค่า'],
        },
        {
          visit_number: 4,
          due_date_offset_days: 90,
          scheduled_date: formatDate(90),
          timing_label: 'เดือนที่ 3 (Day 90)',
          modality: 'FACILITY',
          modality_label: 'ตรวจประเมินความก้าวหน้าไตรมาสที่ 1',
          focus: 'สรุปผลสัมฤทธิ์ วางแผนการดูแลสุขภาพตนเองอย่างยั่งยืน',
          status: 'PLANNED',
          key_actions: ['Quarterly Clinical Summary', 'สรุปรายงานส่งต่อเวชระเบียน'],
        },
      ];
    }
  }

  private static generatePrognosisTrajectory(c: SyntheticCase, risk: MonitoringRiskLevel) {
    const history = c.history_episodes || [];
    const v = c.current_encounter.vitals;

    // Calculate baseline cumulative spend
    let cumulativeCost = history.reduce((sum, h) => sum + (h.total_cost_thb || 350), 0);
    const todayCost = c.intended_ttm_prescription.dose_per_admin * 2.5 * 14 + 250; // estimate today
    cumulativeCost += todayCost;

    const points: TrajectoryDataPoint[] = [];

    // Past episodes (if any)
    history.forEach((ep, idx) => {
      const pain = Math.max(8 - idx * 0.8, 4);
      points.push({
        visit_label: `ครั้งที่ ${idx + 1} (อดีต)`,
        date: ep.date,
        is_projected: false,
        pain_score: Math.round(pain * 10) / 10,
        symptom_severity: Math.round(Math.min(95 - idx * 8, 95)),
        earth_score: 30 + (idx % 2) * 5,
        water_score: 25 + (idx % 3) * 4,
        wind_score: 45 - idx * 3,
        fire_score: 40 - idx * 2,
        sbp: Math.round(v.sbp + (idx % 3) * 4 - 2),
        dbp: Math.round(v.dbp + (idx % 2) * 3 - 1),
        pr: Math.round(v.pr + (idx % 2) * 4 - 2),
        adherence_rate: 85 + idx * 2,
        cost_thb: ep.total_cost_thb || 380,
        cumulative_cost_thb: (idx + 1) * 380,
        clinical_summary: `วินิจฉัย ${ep.icd10tm_code}: ${ep.icd10tm_name}`,
      });
    });

    // Current visit (Today)
    points.push({
      visit_label: 'ปัจจุบัน (วันนี้)',
      date: c.current_encounter.date,
      is_projected: false,
      pain_score: risk === 'HIGH' ? 6.5 : 5.8,
      symptom_severity: 65,
      earth_score: 28,
      water_score: 24,
      wind_score: 38,
      fire_score: 35,
      sbp: v.sbp,
      dbp: v.dbp,
      pr: v.pr,
      adherence_rate: 92,
      cost_thb: todayCost,
      cumulative_cost_thb: cumulativeCost,
      clinical_summary: `ตรวจประเมินสมุฏฐานและสั่งยา ${c.intended_ttm_prescription.herb_name} พร้อมตรวจสอบ HDI`,
    });

    // Projected future visits (+14d, +30d, +60d, +90d)
    const futureSteps = [
      { label: '+2 สัปดาห์', days: 14, pain: 4.2, sev: 45, wind: 30, fire: 28, cost: 250 },
      { label: '+1 เดือน', days: 30, pain: 2.8, sev: 30, wind: 26, fire: 25, cost: 380 },
      { label: '+2 เดือน', days: 60, pain: 1.8, sev: 18, wind: 25, fire: 24, cost: 380 },
      { label: '+3 เดือน', days: 90, pain: 1.0, sev: 10, wind: 25, fire: 25, cost: 400 },
    ];

    let runningCost = cumulativeCost;
    futureSteps.forEach((st) => {
      runningCost += st.cost;
      const d = new Date(c.current_encounter.date);
      d.setDate(d.getDate() + st.days);

      points.push({
        visit_label: st.label,
        date: d.toISOString().split('T')[0],
        is_projected: true,
        pain_score: st.pain,
        symptom_severity: st.sev,
        earth_score: 25,
        water_score: 25,
        wind_score: st.wind,
        fire_score: st.fire,
        sbp: Math.max(120, v.sbp - 6),
        dbp: Math.max(78, v.dbp - 4),
        pr: Math.max(72, v.pr - 3),
        adherence_rate: 95,
        cost_thb: st.cost,
        cumulative_cost_thb: runningCost,
        clinical_summary: `เป้าหมายการรักษา: อาการลดลงสู่ ${st.sev}% และธาตุเข้าสู่สมดุลสมธาตุ`,
      });
    });

    return {
      response_status: 'GOOD' as const,
      response_label: 'การตอบสนองต่อการรักษาอยู่ในเกณฑ์ดีเยี่ยม (Favorable Clinical Response)',
      overall_adherence_percent: 94,
      prom_score: {
        physical_dimension: 86,
        mental_dimension: 88,
        social_dimension: 90,
        spiritual_dimension: 89,
        overall_score: 88,
      },
      cumulative_spend_thb: runningCost,
      trajectory_points: points,
    };
  }

  private static generateHolisticSelfCare(
    element: string,
    season: string,
    chiefComplaint: string
  ): HolisticSelfCarePlan {
    let dietRecs: string[] = [];
    let avoidFoods: string[] = [];
    let ruesiRecs: string[] = [];
    let lifestyleRecs: string[] = [];

    if (element.includes('ไฟ')) {
      dietRecs = [
        'รับประทานอาหารรสจืด รสขม รสเย็น เพื่อระงับความร้อนในกาย (เช่น มะระ ขี้เหล็ก ตำลึง ฟักเขียว บวบ)',
        'ดื่มน้ำใบบัวบก น้ำเก๊กฮวย น้ำรากบัว หรือน้ำอุณหภูมิห้องสม่ำเสมอ วันละ 2 - 2.5 ลิตร',
        'ผลไม้รสเย็น เช่น แตงโม ชมพู่ แคนตาลูป แก้วมังกร',
      ];
      avoidFoods = [
        'หลีกเลี่ยงอาหารรสเผ็ดจัด เค็มจัด ของทอด ของมันที่มีไขมันอิ่มตัวสูง',
        'งดเครื่องดื่มแอลกอฮอล์ กาแฟเข้มข้น และเครื่องดื่มชูกำลังที่กระตุ้นเตโชธาตุ',
      ];
      ruesiRecs = [
        'ท่าฤาษีดัดตน ท่าแก้ลมในอกและแก้คลื่นเหียน (ช่วยผ่อนคลายกล้ามเนื้ออกและระบายลมร้อน)',
        'การฝึกหายใจช้าลึก (Pranayama / สมาธิบำบัด) วันละ 15 นาที เช้า-เย็น เพื่อลดความร้อนภายใน',
      ];
    } else if (element.includes('ลม')) {
      dietRecs = [
        'รับประทานอาหารรสเผ็ดร้อน รสสุขุม รสเค็มเล็กน้อย เพื่อกระจายลม (เช่น ขิง ข่า ตะไคร้ กะเพรา พริกไทย)',
        'ดื่มน้ำขิงอุ่น หรือชาตะไคร้ใบเตย หลังอาหารเพื่อขับลมในกระเพาะลำไส้',
        'รับประทานอาหารปรุงสุกใหม่และอุ่นเสมอ',
      ];
      avoidFoods = [
        'หลีกเลี่ยงน้ำแข็ง น้ำเย็นจัด อาหารดิบ ของหมักดอง และน้ำอัดลมที่มีแก๊สมาก',
        'งดอาหารที่มีลมมาก เช่น ถั่วดิบ เผือกมันที่ย่อยยาก',
      ];
      ruesiRecs = [
        'ท่าฤาษีดัดตน ท่าแก้ลมปัตฆาตและแก้ขัดบั้นเอว (ช่วยกระจายลมในเส้นเอ็นและบรรเทาอาการตึงบ่า)',
        'ท่าฤาษีดัดตน ท่าแก้ลมในท้องและแก้แน่นจุกเสียด (ช่วยระบบย่อยอาหาร)',
      ];
    } else if (element.includes('น้ำ')) {
      dietRecs = [
        'รับประทานอาหารรสเปรี้ยว รสเค็ม รสขม เพื่อตัดเสมหะและช่วยการไหลเวียนของโลหิต (เช่น มะนาว สับปะรด มะขาม)',
        'เครื่องดื่มสมุนไพรอุ่น เช่น น้ำกระเจี๊ยบพุทราจีน น้ำมะขามป้อม',
      ];
      avoidFoods = [
        'หลีกเลี่ยงอาหารรสหวานจัด ขนมหวานกะทิ และอาหารมันที่ทำให้เสมหะเหนียวข้น',
        'งดการอาบน้ำดึกและการตากน้ำค้างช่วงหัวค่ำ',
      ];
      ruesiRecs = [
        'ท่าฤาษีดัดตน ท่าแก้เมื่อยแขนขาและกระตุ้นการไหลเวียนของต่อมน้ำเหลือง',
        'การเดินแกว่งแขนเร็ว 30 นาที/วัน เพื่อกระตุ้นการขับน้ำส่วนเกินและเหงื่อ',
      ];
    } else {
      // ดิน
      dietRecs = [
        'รับประทานอาหารรสฝาด รสหวานธรรมชาติ และรสมันพอเหมาะ เพื่อบำรุงเนื้อเยื่อและกล้ามเนื้อ (เช่น กล้วยน้ำว้าห่าม เผือก ข้าวกล้อง)',
        'เน้นผักใบเขียวที่มีแคลเซียมและแร่ธาตุสูง',
      ];
      avoidFoods = [
        'หลีกเลี่ยงอาหารแปรรูป ของหวานจัดที่มีน้ำตาลสูง และอาหารที่เคี้ยวยาก',
      ];
      ruesiRecs = [
        'ท่าฤาษีดัดตน ท่าแก้เมื่อยตัวและบำรุงข้อต่อกระดูก',
        'การยืดเหยียดกล้ามเนื้อทั่วร่างกาย (Full-body Stretching) 20 นาทีทุกวัน',
      ];
    }

    lifestyleRecs = [
      'เข้านอนก่อนเวลา 22:00 น. เพื่อให้ตับและถุงน้ำดีฟื้นฟูตามนาฬิกาชีวิตแพทย์แผนไทย',
      'หลีกเลี่ยงการอยู่ในห้องปรับอากาศเย็นจัดเป็นเวลานานโดยไม่มีเสื้อคลุม',
      'บันทึกอาการและเวลาทานยาในสมุดบันทึกสุขภาพทุกวันก่อนนอน',
    ];

    const emergencyRedFlags = [
      'มีอาการจุดเลือดออกใต้ผิวหนัง จ้ำเลือดใหญ่ หรือเลือดออกไม่หยุด',
      'อุจจาระสีดำสนิทเหมือนยางมะตอย หรืออาเจียนมีสีกาแฟ/ปนเลือด',
      'แน่นหน้าอกเฉียบพลัน ร้าวไปกรามหรือแขนซ้าย พร้อมเหงื่อแตกตัวเย็น',
      'แขนขาอ่อนแรงครึ่งซีก ปากเบี้ยว พูดไม่ชัด วิงเวียนเดินเซเฉียบพลัน',
      'ระดับความดันโลหิตสูงเกิน 180/110 mmHg หรือชีพจรช้ากว่า 50 ครั้ง/นาที',
    ];

    return {
      diet_recommendations: dietRecs,
      avoid_foods: avoidFoods,
      exercise_ruesi_dutton: ruesiRecs,
      lifestyle_behaviors: lifestyleRecs,
      emergency_red_flags: emergencyRedFlags,
    };
  }
}
