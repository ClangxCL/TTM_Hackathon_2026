import { SyntheticCase, Vitals } from '../types/patient';
import { MatchedInteractionResult } from '../types/hdi';

export interface RedFlagAlert {
  id: string;
  category: 'VITALS' | 'EMERGENCY_SYMPTOM' | 'PROCEDURE_CONTRAINDICATION' | 'CRITICAL_HDI';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  description: string;
  actionRequired: string;
  procedureRestriction?: 'PROHIBIT_ALL_PROCEDURES' | 'PRECAUTION_AREA' | 'ALLOW';
  suggestedDepartment: 'ห้องฉุกเฉิน (ER)' | 'อายุรกรรม (OPD)' | 'ศัลยกรรมกระดูกและข้อ (Ortho)' | 'คลินิกเฉพาะทาง';
}

export interface RedFlagAssessment {
  hasCriticalRedFlags: boolean;
  hasWarnings: boolean;
  overallStatus: 'EMERGENCY_REFERRAL_REQUIRED' | 'HIGH_PRECAUTION' | 'SAFE_FOR_TTM';
  alerts: RedFlagAlert[];
  procedureStatus: {
    canPerformMassage: boolean;
    massageRestrictionMessage: string;
  };
  sbarSummary: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
}

export class RedFlagService {
  /**
   * Evaluates patient data for critical red flags, medical emergencies,
   * contraindications to Thai massage / physical procedures, and critical HDI.
   */
  public static evaluatePatientSafety(
    patientCase: SyntheticCase,
    currentVitals?: Vitals,
    currentSymptoms?: string[],
    liveInteractions?: MatchedInteractionResult[]
  ): RedFlagAssessment {
    const vitals = currentVitals || patientCase.current_encounter.vitals;
    const symptoms = currentSymptoms || patientCase.current_encounter.symptoms;
    const chiefComplaint = patientCase.current_encounter.chief_complaint || '';
    const chronic = patientCase.chronic_diseases || [];
    const meds = patientCase.current_medications || [];

    const alerts: RedFlagAlert[] = [];

    // 1. Vitals Red Flags
    const sbp = vitals.sbp || 120;
    const dbp = vitals.dbp || 80;
    const btemp = vitals.btemp || 36.6;
    const pr = vitals.pr || 74;
    const rr = vitals.rr || 18;

    // 1.1 Hypertensive Crisis / Severe Hypertension
    if (sbp >= 180 || dbp >= 110) {
      alerts.push({
        id: 'RF-BP-CRISIS',
        category: 'VITALS',
        severity: 'CRITICAL',
        title: `ความดันโลหิตวิกฤต (Hypertensive Crisis): ${sbp}/${dbp} mmHg`,
        description: 'ความดันโลหิตสูงในระดับวิกฤต เสี่ยงต่อภาวะเส้นเลือดในสมองแตก (Hemorrhagic Stroke) หรือกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน',
        actionRequired: 'ห้ามนวดไทยและห้ามทำหัตถการทุกชนิดเด็ดขาด! ส่งต่อห้องฉุกเฉิน (ER) ทันทีเพื่อรับยาลดความดัน',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    } else if (sbp >= 160 || dbp >= 100) {
      alerts.push({
        id: 'RF-BP-STAGE2',
        category: 'VITALS',
        severity: 'CRITICAL',
        title: `ความดันโลหิตสูงระดับ 2 เกินเกณฑ์ปลอดภัย: ${sbp}/${dbp} mmHg`,
        description: 'ตามมาตรฐานกรมการแพทย์แผนไทยฯ ห้ามนวดไทยหากความดันโลหิตสูงเกิน 160/100 mmHg เนื่องจากแรงกดจุดจะกระตุ้น sympathetic tone ทำให้ความดันพุ่งสูงขึ้น',
        actionRequired: 'งดการนวดไทย/หัตถการดัดดึง ส่งพบแพทย์แผนปัจจุบันเพื่อประเมินและปรับยา',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'อายุรกรรม (OPD)',
      });
    }

    // 1.2 High Fever (ไข้สูงเกิน 38.5 C)
    if (btemp >= 38.5) {
      alerts.push({
        id: 'RF-TEMP-HIGH',
        category: 'VITALS',
        severity: 'CRITICAL',
        title: `มีไข้สูงเกินเกณฑ์ปลอดภัย: ${btemp}°C`,
        description: 'อุณหภูมิกายสูงเกิน 38.5°C เป็นข้อห้ามเด็ดขาดในการนวดไทยและหัตถการประคบสมุนไพร เพราะจะเร่งการไหลเวียนและกระตุ้นการติดเชื้อรุนแรง',
        actionRequired: 'ห้ามนวดเด็ดขาด ให้ยาลดไข้ เช็ดตัวลดไข้ และส่งตรวจหาสาเหตุการติดเชื้อ',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'อายุรกรรม (OPD)',
      });
    } else if (btemp >= 37.8) {
      alerts.push({
        id: 'RF-TEMP-MODERATE',
        category: 'VITALS',
        severity: 'WARNING',
        title: `มีไข้ต่ำ/ปานกลาง: ${btemp}°C`,
        description: 'ผู้ป่วยมีภาวะตัวร้อนรุมๆ ควรหลีกเลี่ยงการนวดหนักและการอบประคบร้อนจัด',
        actionRequired: 'เฝ้าระวังอาการไข้ หากไข้สูงขึ้นเกิน 38.5°C ให้งดหัตถการทันที',
        procedureRestriction: 'PRECAUTION_AREA',
        suggestedDepartment: 'อายุรกรรม (OPD)',
      });
    }

    // 1.3 Abnormal Pulse (Tachycardia / Bradycardia)
    if (pr >= 120) {
      alerts.push({
        id: 'RF-PR-TACHY',
        category: 'VITALS',
        severity: 'CRITICAL',
        title: `หัวใจเต้นเร็วผิดปกติ (Tachycardia): ${pr} ครั้ง/นาที`,
        description: 'ชีพจรเต้นเร็วเกิน 120 bpm อาจเกิดจากภาวะหัวใจเต้นผิดจังหวะ ภาวะขาดน้ำ หรือการติดเชื้อในกระแสเลือด',
        actionRequired: 'งดหัตถการกระตุ้นหัวใจ ให้ผู้ป่วยพักสงบ และส่งตรวจคลื่นไฟฟ้าหัวใจ (EKG)',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    } else if (pr <= 45) {
      alerts.push({
        id: 'RF-PR-BRADY',
        category: 'VITALS',
        severity: 'CRITICAL',
        title: `หัวใจเต้นช้าผิดปกติ (Severe Bradycardia): ${pr} ครั้ง/นาที`,
        description: 'ชีพจรต่ำกว่า 45 bpm เสี่ยงต่อภาวะ Heart Block หรือการไหลเวียนเลือดไปสมองไม่เพียงพอ (วูบ/หมดสติ)',
        actionRequired: 'งดหัตถการและส่งพบแพทย์เพื่อประเมินการนำกระแสหัวใจ',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    }

    // 1.4 Respiratory Distress
    if (rr >= 28) {
      alerts.push({
        id: 'RF-RR-TACHYPNEA',
        category: 'VITALS',
        severity: 'CRITICAL',
        title: `หายใจหอบเหนื่อยผิดปกติ (Tachypnea): ${rr} ครั้ง/นาที`,
        description: 'อัตราการหายใจเร็วผิดปกติ เสี่ยงต่อภาวะหอบหืดเฉียบพลัน ปอดอักเสบ หรือภาวะน้ำท่วมปอด',
        actionRequired: 'ให้ออกซิเจน จัดท่านั่งศีรษะสูง และส่งต่อห้องฉุกเฉินทันที',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    }

    // 2. Emergency Symptoms & Clinical Red Flags
    const allSymptomsText = [...symptoms, chiefComplaint].join(' ').toLowerCase();

    // 2.1 Acute Stroke (FAST)
    if (
      allSymptomsText.includes('อ่อนแรงครึ่งซีก') ||
      allSymptomsText.includes('ปากเบี้ยว') ||
      allSymptomsText.includes('พูดไม่ชัด') ||
      allSymptomsText.includes('ตามัวฉับพลัน') ||
      allSymptomsText.includes('ชาครึ่งซีก')
    ) {
      alerts.push({
        id: 'RF-SYM-STROKE',
        category: 'EMERGENCY_SYMPTOM',
        severity: 'CRITICAL',
        title: 'สงสัยโรคหลอดเลือดสมองเฉียบพลัน (Acute Stroke / FAST)',
        description: 'ตรวจพบอาการทางระบบประสาทเฉียบพลัน (ปากเบี้ยว แขนขาอ่อนแรง พูดไม่ชัด) ต้องได้รับยาละลายลิ่มเลือดภายใน 4.5 ชั่วโมง',
        actionRequired: 'เปิด Stroke Fast Track ทันที ห้ามนวด ห้ามประคบ นำส่งห้องฉุกเฉินด่วนที่สุด!',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    }

    // 2.2 Acute Chest Pain / Coronary Syndrome
    if (
      allSymptomsText.includes('แน่นหน้าอก') ||
      allSymptomsText.includes('เจ็บแน่นหน้าอก') ||
      allSymptomsText.includes('เจ็บหน้าอกร้าว') ||
      allSymptomsText.includes('เหมือนมีช้างเหยียบ')
    ) {
      alerts.push({
        id: 'RF-SYM-ACS',
        category: 'EMERGENCY_SYMPTOM',
        severity: 'CRITICAL',
        title: 'สงสัยภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (Acute Coronary Syndrome)',
        description: 'อาการแน่นหน้าอกร้าวไปกรามหรือแขนซ้าย ร่วมกับเหงื่อแตกหรือหายใจไม่อิ่ม เข้าได้กับภาวะกล้ามเนื้อหัวใจตายเฉียบพลัน',
        actionRequired: 'เปิด STEMI Fast Track ห้ามทำหัตถการ ให้ออกซิเจนและตรวจคลื่นไฟฟ้าหัวใจ EKG 12 leads ด่วน',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    }

    // 2.3 Acute Abdomen / Appendicitis
    if (
      allSymptomsText.includes('ปวดท้องรุนแรง') ||
      allSymptomsText.includes('ปวดท้องเฉียบพลัน') ||
      allSymptomsText.includes('ท้องแข็งเกร็ง') ||
      allSymptomsText.includes('กดปล่อยเจ็บ')
    ) {
      alerts.push({
        id: 'RF-SYM-ACUTE-ABDOMEN',
        category: 'EMERGENCY_SYMPTOM',
        severity: 'CRITICAL',
        title: 'สงสัยภาวะช่องท้องอักเสบเฉียบพลัน (Acute Abdomen / ไส้ติ่งอักเสบ)',
        description: 'ปวดท้องรุนแรง ท้องแข็งเกร็ง ห้ามกดจุดบริเวณหน้าท้องเด็ดขาด เสี่ยงไส้ติ่งแตกหรืออวัยวะภายในทะลุ',
        actionRequired: 'งดน้ำ งดอาหาร ห้ามนวดท้องเด็ดขาด ส่งตรวจศัลยกรรมเพื่อตรวจร่างกายและทำอัลตราซาวด์',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    }

    // 2.4 Fracture or Severe Joint Dislocation
    if (
      allSymptomsText.includes('กระดูกหัก') ||
      allSymptomsText.includes('ข้อหลุด') ||
      allSymptomsText.includes('ผิดรูป') ||
      allSymptomsText.includes('ล้มกระแทก')
    ) {
      alerts.push({
        id: 'RF-SYM-FRACTURE',
        category: 'EMERGENCY_SYMPTOM',
        severity: 'CRITICAL',
        title: 'สงสัยภาวะกระดูกหักหรือข้อหลุด (Fracture / Dislocation)',
        description: 'มีประวัติอุบัติเหตุหรือสงสัยกระดูกแตกหัก ห้ามดัด ดึง หรือนวดลงน้ำหนักเด็ดขาด',
        actionRequired: 'ดามประคองตำแหน่งที่บาดเจ็บ ห้ามบิดดัด ส่งถ่ายภาพรังสี X-ray ที่แผนกศัลยกรรมกระดูกและข้อ',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ศัลยกรรมกระดูกและข้อ (Ortho)',
      });
    }

    // 3. Chronic History & Medication Contraindications
    // 3.1 Anticoagulant Therapy (Warfarin / DOACs / Aspirin)
    const hasWarfarin = meds.some(
      (m) => m.generic_name.toLowerCase().includes('warfarin') || m.brand_name.toLowerCase().includes('orfarin')
    );
    const hasAspirin = meds.some(
      (m) => m.generic_name.toLowerCase().includes('aspirin') || m.brand_name.toLowerCase().includes('aspent')
    );

    if (hasWarfarin) {
      alerts.push({
        id: 'RF-MED-WARFARIN',
        category: 'PROCEDURE_CONTRAINDICATION',
        severity: 'WARNING',
        title: 'ผู้ป่วยได้รับยาต้านการแข็งตัวของเลือด (Warfarin) — เสี่ยงภาวะเลือดออกในกล้ามเนื้อ',
        description: 'การนวดไทยแบบลงน้ำหนักลึก (Deep tissue) หรือการกดจุดรุนแรง อาจทำให้เกิด Hemarthrosis หรือ Hematoma เลือดออกในกล้ามเนื้อขนาดใหญ่ได้',
        actionRequired: 'ห้ามนวดไทยแบบกดจุดหนัก ห้ามดัดดึงรุนแรง อนุญาตเฉพาะการลูบสัมผัสเบาๆ (Effleurage) หรือประคบอุ่นเบาเท่านั้น',
        procedureRestriction: 'PRECAUTION_AREA',
        suggestedDepartment: 'อายุรกรรม (OPD)',
      });
    } else if (hasAspirin) {
      alerts.push({
        id: 'RF-MED-ASPIRIN',
        category: 'PROCEDURE_CONTRAINDICATION',
        severity: 'WARNING',
        title: 'ผู้ป่วยได้รับยาต้านเกล็ดเลือด (Aspirin) — เสี่ยงต่อการเกิดรอยช้ำจ้ำเลือด',
        description: 'เกล็ดเลือดทำงานลดลง หลอดเลือดฝอยแตกง่าย เกิดรอยฟกช้ำขนาดใหญ่ได้ง่ายหลังการนวด',
        actionRequired: 'ใช้แรงนวดระดับเบาถึงปานกลาง หลีกเลี่ยงการกดย้ำจุดเดิมซ้ำๆ',
        procedureRestriction: 'PRECAUTION_AREA',
        suggestedDepartment: 'อายุรกรรม (OPD)',
      });
    }

    // 3.2 Deep Vein Thrombosis / Vascular Aneurysm
    const hasDvtOrAneurysm = chronic.some(
      (c) =>
        c.icd10.startsWith('I80') ||
        c.icd10.startsWith('I82') ||
        c.icd10.startsWith('I71') ||
        c.name.includes('ลิ่มเลือด') ||
        c.name.includes('โป่งพอง')
    );

    if (hasDvtOrAneurysm) {
      alerts.push({
        id: 'RF-HX-DVT-ANEURYSM',
        category: 'PROCEDURE_CONTRAINDICATION',
        severity: 'CRITICAL',
        title: 'ประวัติโรคหลอดเลือดดำอุดตัน (DVT) หรือหลอดเลือดโป่งพอง (Aneurysm)',
        description: 'ข้อห้ามเด็ดขาดในการนวดไทย! การนวดบริเวณขาหรือลำตัวอาจทำให้ลิ่มเลือดหลุดไปอุดตันเส้นเลือดปอด (Pulmonary Embolism) เสียชีวิตเฉียบพลัน',
        actionRequired: 'ห้ามนวดไทยและห้ามทำหัตถการทุกชนิดเด็ดขาด!',
        procedureRestriction: 'PROHIBIT_ALL_PROCEDURES',
        suggestedDepartment: 'ห้องฉุกเฉิน (ER)',
      });
    }

    // 4. Critical Herb-Drug Interactions (HIGH severity)
    if (liveInteractions && liveInteractions.length > 0) {
      const highInteractions = liveInteractions.filter(
        (i) => i.interaction?.severity_code === 'HIGH' || i.interaction?.severity === 'สูง'
      );
      if (highInteractions.length > 0) {
        alerts.push({
          id: 'RF-HDI-CRITICAL',
          category: 'CRITICAL_HDI',
          severity: 'CRITICAL',
          title: `พบอันตรกิริยาระดับรุนแรงสูง (Critical HDI) จำนวน ${highInteractions.length} รายการ`,
          description: highInteractions.map((h) => `${h.drug_name}: ${h.interaction.clinical_effects}`).join('; '),
          actionRequired: 'งดสั่งจ่ายยาสมุนไพรคู่เสี่ยงนี้ทันที หรือปรึกษาเภสัชกร/แพทย์แผนปัจจุบันเพื่อปรับเปลี่ยนการรักษา',
          procedureRestriction: 'ALLOW',
          suggestedDepartment: 'อายุรกรรม (OPD)',
        });
      }
    }

    // Overall Status Computation
    const hasCriticalRedFlags = alerts.some((a) => a.severity === 'CRITICAL');
    const hasWarnings = alerts.some((a) => a.severity === 'WARNING');

    let overallStatus: RedFlagAssessment['overallStatus'] = 'SAFE_FOR_TTM';
    if (hasCriticalRedFlags) {
      overallStatus = 'EMERGENCY_REFERRAL_REQUIRED';
    } else if (hasWarnings) {
      overallStatus = 'HIGH_PRECAUTION';
    }

    const prohibitAll = alerts.some((a) => a.procedureRestriction === 'PROHIBIT_ALL_PROCEDURES');
    const canPerformMassage = !prohibitAll;
    const massageRestrictionMessage = prohibitAll
      ? '❌ ห้ามนวดไทยและหัตถการทุกชนิดเด็ดขาด เนื่องจากตรวจพบภาวะอันตราย/ข้อห้ามทางการแพทย์'
      : hasWarnings
      ? '⚠️ นวดไทยได้ด้วยความระมัดระวังเป็นพิเศษ (หลีกเลี่ยงการกดจุดลึกหรือดัดรุนแรง)'
      : '✓ สามารถให้บริการนวดไทยและหัตถการได้ตามมาตรฐานปกติ';

    // Formulate Standard SBAR Summary for Emergency Referral
    const criticalTitles = alerts.map((a) => a.title).join(', ');
    const sbarSituation = `ผู้ป่วย ${patientCase.patient_info.name} (HN: ${patientCase.patient_info.hn}, อายุ ${patientCase.patient_info.age} ปี) มาด้วยอาการ "${chiefComplaint}" ตรวจพบสัญญาณอันตราย/ข้อห้ามทางการแพทย์: ${criticalTitles || 'มีอาการรุนแรงเกินขอบเขตบริการแผนไทย'}`;
    const sbarBackground = `สัญญาณชีพแรกรับ: BTEMP ${btemp}°C, BP ${sbp}/${dbp} mmHg, PR ${pr} bpm, RR ${rr} ครั้ง/นาที. โรคประจำตัว: ${chronic.map((c) => c.name).join(', ') || 'ไม่มี'}. ยาแผนปัจจุบันที่กำลังใช้อยู่: ${meds.map((m) => `${m.generic_name} (${m.brand_name})`).join(', ') || 'ไม่มี'}`;
    const sbarAssessment = `แพทย์แผนไทยประเมินพบข้อห้ามการนวดไทย/หัตถการ และสงสัยภาวะอันตรายที่ต้องได้รับการตรวจวินิจฉัยและรักษาโดยแพทย์แผนปัจจุบันอย่างเร่งด่วน ได้แก่ ${alerts.map((a) => `[${a.title}] - ${a.description}`).join(' | ')}`;
    const sbarRecommendation = `ขอส่งต่อผู้ป่วยเข้ารับการตรวจรักษาที่ ${alerts[0]?.suggestedDepartment || 'ห้องฉุกเฉิน (ER)'} เพื่อประเมินทางคลินิก ตรวจทางห้องปฏิบัติการ และให้การรักษาอย่างปลอดภัยต่อไป`;

    return {
      hasCriticalRedFlags,
      hasWarnings,
      overallStatus,
      alerts,
      procedureStatus: {
        canPerformMassage,
        massageRestrictionMessage,
      },
      sbarSummary: {
        situation: sbarSituation,
        background: sbarBackground,
        assessment: sbarAssessment,
        recommendation: sbarRecommendation,
      },
    };
  }
}
