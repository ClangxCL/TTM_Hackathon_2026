import { ThaiHerbFormularyItem, DrugWarning } from '../types/drug';
import { PatientInfo } from '../types/patient';

export interface DosageCheckInput {
  herb: ThaiHerbFormularyItem;
  dose_per_admin: number;
  frequency_per_day: number;
  days: number;
  patient: PatientInfo;
}

export function validateDosageAndSafety(input: DosageCheckInput): DrugWarning[] {
  const { herb, dose_per_admin, frequency_per_day, days, patient } = input;
  const warnings: DrugWarning[] = [];

  const isChild = patient.age < 15;
  const dosingRule = isChild && herb.standard_dosing.child ? herb.standard_dosing.child : herb.standard_dosing.adult;

  // 1. Check Age Eligibility
  if (dosingRule.eligible_age_min && patient.age < dosingRule.eligible_age_min) {
    warnings.push({
      type: 'PRECAUTION',
      severity: 'HIGH',
      title: 'ข้อจำกัดด้านอายุผู้ป่วย',
      message: `ยานี้ไม่แนะนำในผู้ป่วยอายุต่ำกว่า ${dosingRule.eligible_age_min} ปี (ผู้ป่วยปัจจุบันอายุ ${patient.age} ปี)`,
      recommendation: 'โปรดพิจารณาปรับเปลี่ยนเป็นตำรับยาสำหรับเด็กหรือลดขนาดยาอย่างใกล้ชิด',
    });
  }

  // 2. Calculate Daily Intake
  const dailyUnits = dose_per_admin * frequency_per_day;
  const dailyMg = dailyUnits * herb.unit_amount_mg;

  // 3. Overdose Check (Daily Units / Daily Mg)
  if (dosingRule.max_daily_dose_units && dailyUnits > dosingRule.max_daily_dose_units) {
    warnings.push({
      type: 'OVERDOSE',
      severity: 'HIGH',
      title: 'ขนาดยาเกินขนาดสูงสุดต่อวัน (Max Daily Dose Exceeded)',
      message: `ขนาดยาที่สั่งรวม ${dailyUnits} ${herb.unit}/วัน (${dailyMg.toLocaleString()} มก.) เกินขนาดสูงสุดที่แนะนำคือ ${dosingRule.max_daily_dose_units} ${herb.unit}/วัน (${dosingRule.max_daily_dose_mg.toLocaleString()} มก.)`,
      recommendation: `ควรปรับลดขนาดต่อครั้ง หรือลดความถี่ให้อยู่ในเกณฑ์ไม่เกิน ${dosingRule.max_daily_dose_units} ${herb.unit}/วัน`,
    });
  } else if (dosingRule.max_daily_dose_mg && dailyMg > dosingRule.max_daily_dose_mg) {
    warnings.push({
      type: 'OVERDOSE',
      severity: 'HIGH',
      title: 'ปริมาณตัวยาสำคัญเกินขนาดสูงสุดต่อวัน',
      message: `ขนาดยารวม ${dailyMg.toLocaleString()} มก./วัน เกินเกณฑ์สูงสุด (${dosingRule.max_daily_dose_mg.toLocaleString()} มก./วัน)`,
      recommendation: 'โปรดทบทวนขนาดยาตามข้อกำหนดในบัญชียา',
    });
  }

  // 4. Duration Check
  if (dosingRule.max_duration_days && days > dosingRule.max_duration_days) {
    warnings.push({
      type: 'DURATION',
      severity: 'MODERATE',
      title: 'ระยะเวลาใช้ยาเกินกำหนดที่แนะนำ',
      message: `สั่งจ่ายเป็นเวลา ${days} วัน ซึ่งเกินระยะเวลาที่แนะนำสำหรับยานี้ (สูงสุดไม่เกิน ${dosingRule.max_duration_days} วัน)`,
      recommendation: `การใช้ติดต่อกันนานอาจสะสมความเป็นพิษต่อตับ/ไต ควรจำกัดไม่เกิน ${dosingRule.max_duration_days} วันแล้วนัดประเมินอาการซ้ำ`,
    });
  }

  // 5. Special Precautions by Age Group
  if (patient.age >= 65 && herb.precautions.elderly) {
    warnings.push({
      type: 'PRECAUTION',
      severity: 'LOW',
      title: 'ข้อควรระวังในผู้สูงอายุ',
      message: herb.precautions.elderly,
      recommendation: 'เฝ้าระวังอาการข้างเคียงและการทำงานของไต',
    });
  }

  if (patient.age <= 12 && herb.precautions.pediatric) {
    warnings.push({
      type: 'PRECAUTION',
      severity: 'MODERATE',
      title: 'ข้อควรระวังในเด็ก',
      message: herb.precautions.pediatric,
      recommendation: 'คำนวณขนาดยาตามน้ำหนักตัวอย่างเคร่งครัด',
    });
  }

  return warnings;
}
