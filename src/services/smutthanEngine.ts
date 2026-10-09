import { Vitals, PatientInfo, AmbientContext } from '../types/patient';
import { ElementScores, SmutthanAnalysisResult, RuleImpact } from '../types/smutthan';
import smutthanRulesJson from '../../data/rules/smutthan-rules.json';

export function calculateSmutthan(
  patient: PatientInfo,
  vitals: Vitals,
  symptoms: string[],
  ambient: AmbientContext,
  currentTime: Date = new Date()
): SmutthanAnalysisResult {
  // 1. Initial baseline scores
  const scores: ElementScores = {
    earth: 25.0,
    water: 25.0,
    wind: 25.0,
    fire: 25.0,
  };

  const reasons: RuleImpact[] = [];

  // Helper to apply delta and track explainability
  const applyRule = (
    category: RuleImpact['category'],
    title: string,
    condition: string,
    delta: Partial<ElementScores>,
    reason_th: string
  ) => {
    if (delta.earth) scores.earth += delta.earth;
    if (delta.water) scores.water += delta.water;
    if (delta.wind) scores.wind += delta.wind;
    if (delta.fire) scores.fire += delta.fire;

    reasons.push({
      category,
      rule_title: title,
      condition_matched: condition,
      delta,
      reason_th,
    });
  };

  // 2. อุตุสมุฏฐาน (Environmental / Weather Factors)
  const temp = ambient.temperature_c;
  if (temp >= 35.0) {
    applyRule(
      'อุตุสมุฏฐาน (อากาศ)',
      'ความร้อนภายนอกระดับสูงจัด',
      `อุณหภูมิ ${temp}°C >= 35°C`,
      { fire: 18, wind: 5, water: -10 },
      'อุณหภูมิภายนอกสูงจัด (>35°C) กระตุ้นเตโชธาตุให้กำเริบ ระเหยของเหลวในร่างกาย'
    );
  } else if (temp >= 32.0) {
    applyRule(
      'อุตุสมุฏฐาน (อากาศ)',
      'อากาศร้อน',
      `อุณหภูมิ ${temp}°C อยู่ในช่วง 32-34.9°C`,
      { fire: 10, wind: 2, water: -5 },
      'อากาศร้อนกระตุ้นเตโชธาตุให้มีแนวโน้มสูงขึ้น'
    );
  } else if (temp <= 22.0) {
    applyRule(
      'อุตุสมุฏฐาน (อากาศ)',
      'อากาศหนาวเย็น',
      `อุณหภูมิ ${temp}°C <= 22°C`,
      { water: 15, wind: 5, fire: -10 },
      'อากาศหนาวเย็นกระตุ้นอาโปธาตุ (เสมหะ) และทำให้วาโยธาตุตึงขัด บั่นทอนไฟธาตุ'
    );
  }

  const hum = ambient.relative_humidity;
  if (hum >= 80) {
    applyRule(
      'อุตุสมุฏฐาน (อากาศ)',
      'ความชื้นสัมพัทธ์สูงจัด',
      `ความชื้น ${hum}% >= 80%`,
      { water: 14, wind: 5, fire: -5 },
      'ความชื้นสัมพัทธ์ในบรรยากาศสูงมาก ส่งผลให้อาโปธาตุในทางเดินหายใจคั่งค้าง'
    );
  } else if (hum <= 45) {
    applyRule(
      'อุตุสมุฏฐาน (อากาศ)',
      'อากาศแห้ง',
      `ความชื้น ${hum}% <= 45%`,
      { water: -8, fire: 8, wind: 4 },
      'อากาศแห้งจัด ดึงความชื้นออกจากเยื่อบุ อาโปธาตุมีแนวโน้มหย่อน'
    );
  }

  // 3. กาลสมุฏฐาน (Time Period)
  const hour = currentTime.getHours();
  if (hour >= 6 && hour < 10) {
    applyRule('กาลสมุฏฐาน (เวลา)', 'ยามเช้า (เสมหะกาล)', 'เวลา 06:00 - 10:00 น.', { water: 10, fire: -3 }, 'ช่วงเช้าอิทธิพลของอาโปธาตุ (เสมหะสมุฏฐาน) กำเริบตามธรรมชาติ');
  } else if (hour >= 10 && hour < 14) {
    applyRule('กาลสมุฏฐาน (เวลา)', 'ยามเที่ยง (ปิตตะกาล)', 'เวลา 10:00 - 14:00 น.', { fire: 12, water: -4 }, 'ช่วงเที่ยงพระอาทิตย์แผ่ความร้อนสูงสุด เตโชธาตุ (ปิตตะ) ทวีความรุนแรง');
  } else if (hour >= 14 && hour < 18) {
    applyRule('กาลสมุฏฐาน (เวลา)', 'ยามบ่าย (วาตะกาล)', 'เวลา 14:00 - 18:00 น.', { wind: 12, water: -3 }, 'ช่วงบ่ายอิทธิพลของวาโยธาตุ (วาตะ) พัดกำเริบ ร่างกายเริ่มอ่อนล้า');
  } else if (hour >= 18 && hour < 22) {
    applyRule('กาลสมุฏฐาน (เวลา)', 'ยามค่ำ (เสมหะกาล 2)', 'เวลา 18:00 - 22:00 น.', { water: 10, fire: -3 }, 'ช่วงค่ำน้ำค้างตก อิทธิพลอาโปธาตุระลอกสอง');
  } else {
    applyRule('กาลสมุฏฐาน (เวลา)', 'ยามดึก/ใกล้รุ่ง (วาตะกาล)', 'เวลา 22:00 - 06:00 น.', { wind: 10, fire: 5 }, 'ช่วงดึกถึงใกล้รุ่ง วาโยธาตุและไฟเผาผลาญภายใน');
  }

  // 4. อายุสมุฏฐาน (Age Stage)
  const age = patient.age;
  if (age <= 16) {
    applyRule('อายุสมุฏฐาน (วัย)', 'ปฐมวัย (แรกเกิด - 16 ปี)', `อายุ ${age} ปี <= 16 ปี`, { water: 15, wind: -5 }, 'ปฐมวัยมีอาโปธาตุ (เสมหะ) เป็นเจ้าเรือน มักไวต่อโรคทางเดินหายใจและน้ำมูก');
  } else if (age <= 32) {
    applyRule('อายุสมุฏฐาน (วัย)', 'มัชฌิมวัย (16 - 32 ปี)', `อายุ ${age} ปี (16-32)`, { fire: 14, water: -5 }, 'มัชฌิมวัยมีเตโชธาตุ (ปิตตะ) เป็นเจ้าเรือน การเผาผลาญสูง ไวต่อไข้และการอักเสบ');
  } else {
    applyRule('อายุสมุฏฐาน (วัย)', 'ปัจฉิมวัย (32 ปีขึ้นไป)', `อายุ ${age} ปี >= 32 ปี`, { wind: 15, earth: 5, fire: -4 }, 'ปัจฉิมวัยมีวาโยธาตุ (วาตะ) เป็นเจ้าเรือน เส้นเอ็นตึงขัด ปวดเมื่อย วิงเวียนง่าย');
  }

  // 5. สัญญาณชีพ (Vital Signs)
  if (vitals.btemp >= 37.8) {
    applyRule('สัญญาณชีพ', 'มีไข้สูงเฉียบพลัน', `BTEMP ${vitals.btemp}°C >= 37.8°C`, { fire: 25, water: -8, wind: 5 }, 'อุณหภูมิร่างกายสูง บ่งชี้ภาวะเตโชธาตุกำเริบเฉียบพลัน (ไข้พิษ/สันตัปปัคคี)');
  } else if (vitals.btemp >= 37.3) {
    applyRule('สัญญาณชีพ', 'มีไข้ต่ำ / รุมๆ', `BTEMP ${vitals.btemp}°C`, { fire: 14, water: -4 }, 'อุณหภูมิกายเริ่มสูง เตโชธาตุเริ่มคุกรุ่น');
  }

  if (vitals.sbp >= 140 || vitals.dbp >= 90) {
    applyRule('สัญญาณชีพ', 'ความดันโลหิตสูง', `BP ${vitals.sbp}/${vitals.dbp} mmHg`, { wind: 16, fire: 12 }, 'ความดันโลหิตสูง สัมพันธ์กับลมอุทธังคมาวาตาและสุมนาวาตะกำเริบ ร่วมกับไฟกำเริบ');
  }

  if (vitals.pr >= 95) {
    applyRule('สัญญาณชีพ', 'ชีพจรเต้นเร็ว', `PR ${vitals.pr} bpm >= 95`, { wind: 12, fire: 10 }, 'ชีพจรเต้นเร็ว สัมพันธ์กับหทัยวาตะกำเริบและเตโชธาตุเร่งการไหลเวียน');
  }

  // 6. อาการสำคัญ (Symptoms Analysis)
  const symText = symptoms.join(' ') + ' ' + patient.birth_element;
  
  if (symText.includes('ปวด') || symText.includes('ตึง') || symText.includes('ชา') || symText.includes('เมื่อย')) {
    applyRule('อาการสำคัญ', 'กลุ่มอาการปวดเมื่อย/เส้นตึง', 'ตรวจพบอาการปวดเมื่อย เส้นเอ็น กล้ามเนื้อ', { wind: 20, earth: 8 }, 'อาการปวดเมื่อยเส้นเอ็นบ่งชี้อังคมังคานุสารีวาตาพิการ และมังสัง/นหารูพิการ');
  }

  if (symText.includes('ท้องอืด') || symText.includes('จุกเสียด') || symText.includes('แน่น') || symText.includes('ลมในท้อง')) {
    applyRule('อาการสำคัญ', 'กลุ่มอาการลมในทางเดินอาหาร', 'ตรวจพบอาการท้องอืด จุกเสียด แน่นท้อง', { wind: 22, fire: -8 }, 'บ่งชี้โกฏฐาสยาวาตาและกุจฉิสยาวาตากำเริบ ร่วมกับปริณามัคคี (ไฟย่อย) หย่อน');
  }

  if (symText.includes('ไอ') || symText.includes('เสมหะ') || symText.includes('น้ำมูก') || symText.includes('หวัด')) {
    applyRule('อาการสำคัญ', 'กลุ่มอาการทางเดินหายใจ/เสมหะ', 'ตรวจพบอาการไอ น้ำมูก เสมหะ เจ็บคอ', { water: 22, fire: 6 }, 'บ่งชี้ศอเสมหะและอุระเสมหะในอาโปธาตุกำเริบ');
  }

  if (symText.includes('ร้อนใน') || symText.includes('กระหายน้ำ') || symText.includes('แสบร้อน')) {
    applyRule('อาการสำคัญ', 'กลุ่มอาการความร้อนภายใน', 'ตรวจพบอาการร้อนใน กระหายน้ำ แสบร้อน', { fire: 22, water: -8 }, 'บ่งชี้เตโชธาตุ (ปริทัยหัคคี) กำเริบ อาโปธาตุเหือดแห้ง');
  }

  if (symText.includes('วิงเวียน') || symText.includes('หน้ามืด') || symText.includes('ใจสั่น')) {
    applyRule('อาการสำคัญ', 'กลุ่มอาการลมกองละเอียด', 'ตรวจพบอาการวิงเวียน หน้ามืด ตาลาย', { wind: 24 }, 'บ่งชี้หทัยวาตะและลมอุทธังคมาวาตาแปรปรวน');
  }

  // 7. Clamp scores to 0-100 scale
  scores.earth = Math.min(100, Math.max(10, Math.round(scores.earth * 10) / 10));
  scores.water = Math.min(100, Math.max(10, Math.round(scores.water * 10) / 10));
  scores.wind = Math.min(100, Math.max(10, Math.round(scores.wind * 10) / 10));
  scores.fire = Math.min(100, Math.max(10, Math.round(scores.fire * 10) / 10));

  // 8. Determine dominant element
  let dominant_element: 'earth' | 'water' | 'wind' | 'fire' = 'wind';
  let maxScore = scores.wind;

  if (scores.fire > maxScore) {
    dominant_element = 'fire';
    maxScore = scores.fire;
  }
  if (scores.water > maxScore) {
    dominant_element = 'water';
    maxScore = scores.water;
  }
  if (scores.earth > maxScore) {
    dominant_element = 'earth';
    maxScore = scores.earth;
  }

  const elementNameMap = {
    earth: 'ปถวีธาตุ (ธาตุดิน)',
    water: 'อาโปธาตุ (ธาตุน้ำ)',
    wind: 'วาโยธาตุ (ธาตุลม)',
    fire: 'เตโชธาตุ (ธาตุไฟ)',
  };

  const status: SmutthanAnalysisResult['status'] =
    maxScore >= 65 ? 'กำเริบ (Aggravated)' : maxScore <= 35 ? 'หย่อน (Deficient)' : 'สมดุล (Normal)';

  // 9. Prescribing & lifestyle recommendations based on dominant element
  let tastes: string[] = [];
  let advice: string[] = [];

  switch (dominant_element) {
    case 'wind':
      tastes = ['รสสุขุม', 'รสเผ็ดร้อน (เพื่อกระจายลม)', 'รสมัน (เพื่อหล่อลื่นเส้นเอ็น)'];
      advice = [
        'หลีกเลี่ยงการอยู่ในที่ลมโกรกจัดหรือห้องแอร์เย็นเกินไป',
        'รับประทานอาหารตรงเวลาเพื่อป้องกันลมตีขึ้นในกระเพาะ',
        'การนวดไทยเพื่อผ่อนคลายกล้ามเนื้อและประคบสมุนไพรรสร้อนจะช่วยกระจายลมในเส้นได้ดี',
      ];
      break;
    case 'fire':
      tastes = ['รสขม (ดับพิษร้อน)', 'รสเย็น', 'รสจืด (ถอนพิษไข้)'];
      advice = [
        'หลีกเลี่ยงการตากแดด อาหารรสจัด เผ็ดจัด และของทอด',
        'ดื่มน้ำอุณหภูมิห้องบ่อยๆ เพื่อระบายความร้อน',
        'งดใช้ยาตำรับรสร้อนจัด เช่น ยาสหัศธารา หรือยาขิงขนาดสูง',
      ];
      break;
    case 'water':
      tastes = ['รสเปรี้ยว (กัดเสมหะ)', 'รสเผ็ดร้อนเล็กน้อย', 'รสฝาด (คุมเสมหะ)'];
      advice = [
        'หลีกเลี่ยงการดื่มน้ำเย็นจัด ไอศกรีม และของทอดมันเลี่ยน',
        'รักษาความอบอุ่นของร่างกายบริเวณลำคอและหน้าอกโดยเฉพาะช่วงเช้าและค่ำ',
        'การอบไอน้ำสมุนไพรช่วยเปิดทางเดินหายใจและระบายเสมหะได้ดี',
      ];
      break;
    case 'earth':
      tastes = ['รสฝาด (สมานเนื้อ)', 'รสหวานน้อย', 'รสมัน'];
      advice = [
        'บริหารร่างกายเพื่อฟื้นฟูกำลังของกล้ามเนื้อและข้อต่อ',
        'รับประทานอาหารที่มีกากใยสูงเพื่อช่วยการขับถ่ายกะรีสัง (อาหารเก่า)',
      ];
      break;
  }

  const summary = `ผลการวิเคราะห์พบแนวโน้ม ${elementNameMap[dominant_element]} อยู่ในภาวะ ${status} (คะแนนประเมิน ${maxScore}/100) โดยมีปัจจัยกระตุ้นหลักจาก ${reasons[0]?.rule_title || 'สภาวะแวดล้อม'} และ ${reasons[1]?.rule_title || 'อาการสำคัญ'}`;

  return {
    scores,
    dominant_element,
    dominant_element_th: elementNameMap[dominant_element],
    status,
    clinical_summary: summary,
    reasons_list: reasons,
    recommended_taste: tastes,
    lifestyle_advice: advice,
    disclaimer: 'ผลการประเมินนี้เป็น Clinical Decision Support จาก Rule-based Algorithm ตามหลักทฤษฎีการแพทย์แผนไทย มิใช่การวินิจฉัยโรคแทนแพทย์แผนไทยผู้ประกอบวิชาชีพ',
  };
}
