// Speech-to-Text (STT) and Thai Symptom Keyword Extraction Service

export const THAI_SYMPTOMS_DICTIONARY = [
  // ทางเดินหายใจ / ไข้หวัด
  { keyword: 'มีไข้', variations: ['มีไข้', 'ตัวร้อน', 'ไข้', 'รุมๆ', 'ตัวรุม'] },
  { keyword: 'ไอ', variations: ['ไอ', 'ไอแห้ง', 'ไอมีเสมหะ', 'ไอระคายคอ'] },
  { keyword: 'เจ็บคอ', variations: ['เจ็บคอ', 'ระคายคอ', 'คอแห้ง', 'คออักเสบ'] },
  { keyword: 'มีน้ำมูก', variations: ['มีน้ำมูก', 'น้ำมูกไหล', 'น้ำมูกใส', 'น้ำมูกตก'] },
  { keyword: 'จาม', variations: ['จาม', 'ฮัดเชิ่ย'] },
  { keyword: 'เสมหะ', variations: ['เสมหะ', 'เสลด', 'เสมหะเหนียว'] },
  { keyword: 'สะบัดร้อนสะบัดหนาว', variations: ['สะบัดร้อนสะบัดหนาว', 'หนาวสั่น', 'ครั่นเนื้อครั่นตัว', 'หนาวๆ ร้อนๆ'] },

  // ทางเดินอาหาร / กระเพาะ
  { keyword: 'แน่นท้อง', variations: ['แน่นท้อง', 'แน่นพุง', 'อึดอัดท้อง'] },
  { keyword: 'ท้องอืด', variations: ['ท้องอืด', 'ท้องเฟ้อ', 'ลมในท้อง'] },
  { keyword: 'จุกเสียด', variations: ['จุกเสียด', 'จุกแน่น', 'จุกอก', 'แน่นยอดอก'] },
  { keyword: 'เรอบ่อย', variations: ['เรอบ่อย', 'เรอเปรี้ยว', 'มีลมตีขึ้น'] },
  { keyword: 'อาหารไม่ย่อย', variations: ['อาหารไม่ย่อย', 'ไม่ย่อย', 'ทานอาหารแล้วอืด'] },
  { keyword: 'ไม่อยากอาหาร', variations: ['ไม่อยากอาหาร', 'เบื่ออาหาร', 'กินข้าวไม่ลง'] },
  { keyword: 'แสบร้อนยอดอก', variations: ['แสบร้อนยอดอก', 'แสบร้อนกลางอก', 'กรดไหลย้อน'] },
  { keyword: 'คลื่นไส้', variations: ['คลื่นไส้', 'พะอืดพะอม', 'อยากอาเจียน'] },

  // กล้ามเนื้อ กระดูก ข้อ
  { keyword: 'ปวดหลัง', variations: ['ปวดหลัง', 'ปวดเอว', 'ยอกหลัง', 'ปวดหลังส่วนล่าง'] },
  { keyword: 'กษัยเส้น', variations: ['กษัยเส้น', 'ขัดเส้น', 'เส้นตึง', 'ตึงสะโพก'] },
  { keyword: 'ปวดเมื่อย', variations: ['ปวดเมื่อย', 'เมื่อยตัว', 'ปวดเมื่อยตามตัว'] },
  { keyword: 'ปวดเข่า', variations: ['ปวดเข่า', 'เจ็บเข่า', 'ข้อเข่า', 'ข้อเข่าเสื่อม', 'ขัดข้อ', 'กรอบแกรบ'] },
  { keyword: 'นิ้วล็อก', variations: ['นิ้วล็อก', 'นิ้วสะดุด', 'เจ็บโคนนิ้ว', 'เหยียดนิ้วไม่ออก'] },
  { keyword: 'ปวดคอบ่า', variations: ['ปวดคอ', 'ตึงคอบ่า', 'ปวดสะบัก', 'บ่าแข็ง', 'คอตกหมอน'] },

  // ศีรษะและระบบประสาท
  { keyword: 'ปวดศีรษะ', variations: ['ปวดศีรษะ', 'ปวดหัว', 'ปวดตึงท้ายทอย'] },
  { keyword: 'ไมเกรน', variations: ['ไมเกรน', 'ปวดหัวข้างเดียว', 'ปวดตุบๆ'] },
  { keyword: 'ตาพร่า', variations: ['ตาพร่า', 'ตาพร่ามัว', 'ตามัว', 'ไวต่อแสง'] },
  { keyword: 'เวียนหัว', variations: ['เวียนหัว', 'มึนงง', 'บ้านหมุน', 'หน้ามืด'] },

  // ระบบไหลเวียนและผิวหนัง
  { keyword: 'ความดันสูง', variations: ['ความดันสูง', 'ความดันลอย', 'ตึงท้ายทอย'] },
  { keyword: 'ใจสั่น', variations: ['ใจสั่น', 'ใจหวิว', 'ชีพจรเต้นเร็ว'] },
  { keyword: 'ผื่นคัน', variations: ['ผื่นคัน', 'ลมพิษ', 'คันตามตัว', 'เม็ดผื่นแดง'] },
  { keyword: 'กระหายน้ำ', variations: ['กระหายน้ำ', 'คอแห้ง', 'หิวน้ำบ่อย', 'ปัสสาวะบ่อย'] }
];

export interface SpeechSimulationScenario {
  id: string;
  title: string;
  fullSpeech: string;
  expectedSymptoms: string[];
}

export const SPEECH_SIMULATION_SCENARIOS: SpeechSimulationScenario[] = [
  {
    id: 'dyspepsia',
    title: 'คนไข้บ่นจุกเสียด ท้องอืด (U60.10 / K30)',
    fullSpeech: 'หมอครับ ผมมีอาการท้องอืด แน่นท้องมาก แล้วก็จุกเสียดเวลาทานข้าว เรอบ่อย อาหารไม่ย่อยมา 2 วันแล้วครับ',
    expectedSymptoms: ['ท้องอืด', 'แน่นท้อง', 'จุกเสียด', 'เรอบ่อย', 'อาหารไม่ย่อย'],
  },
  {
    id: 'cold',
    title: 'คนไข้บอกอาการไข้หวัด ไอ เจ็บคอ (U56.19 / J00)',
    fullSpeech: 'รู้สึกมีไข้ ตัวร้อน สะบัดร้อนสะบัดหนาว ไอแห้งๆ แล้วก็เจ็บคอ มีน้ำมูกใสไหลตลอดเลยค่ะหมอ',
    expectedSymptoms: ['มีไข้', 'สะบัดร้อนสะบัดหนาว', 'ไอ', 'เจ็บคอ', 'มีน้ำมูก'],
  },
  {
    id: 'backpain',
    title: 'คนไข้ปวดหลัง ยอกเอว (U55.20 / M54.5)',
    fullSpeech: 'ไปยกของหนักมาแล้วปวดหลังส่วนล่างมาก ยอกหลัง กษัยเส้นตึงไปถึงสะโพก ก้มไม่ได้เลยครับ',
    expectedSymptoms: ['ปวดหลัง', 'กษัยเส้น'],
  },
  {
    id: 'migraine',
    title: 'คนไข้ปวดศีรษะ ไมเกรน (U61.2 / G43.9)',
    fullSpeech: 'ปวดศีรษะข้างขวาตุบๆ เป็นไมเกรน ตาพร่ามัว เวียนหัว คลื่นไส้เวลาเจอแสงจ้าค่ะ',
    expectedSymptoms: ['ปวดศีรษะ', 'ไมเกรน', 'ตาพร่า', 'เวียนหัว', 'คลื่นไส้'],
  },
  {
    id: 'knee',
    title: 'คนไข้ขัดข้อเข่า เข่าเสื่อม (U55.11 / M17.9)',
    fullSpeech: 'ปวดเข่ามากค่ะ เดินแล้วขัดข้อ มีเสียงกรอบแกรบในข้อเข่า ข้อเข่าเสื่อม ลุกนั่งลำบากมาก',
    expectedSymptoms: ['ปวดเข่า'],
  },
];

export class SpeechToTextService {
  /**
   * Check if browser natively supports Web Speech API
   */
  public static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Extract recognized symptoms from Thai transcribed text
   */
  public static extractSymptoms(text: string): string[] {
    if (!text || !text.trim()) return [];
    const normalized = text.toLowerCase();
    const matched: string[] = [];

    THAI_SYMPTOMS_DICTIONARY.forEach((entry) => {
      const isFound = entry.variations.some((v) => normalized.includes(v.toLowerCase()));
      if (isFound && !matched.includes(entry.keyword)) {
        matched.push(entry.keyword);
      }
    });

    return matched;
  }

  /**
   * Create and start a native browser SpeechRecognition session (Thai language th-TH)
   */
  public static createRecognitionSession(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void
  ): { stop: () => void } | null {
    if (!this.isSupported()) {
      onError('เบราว์เซอร์นี้ไม่รองรับ Web Speech API');
      return null;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'th-TH'; // ภาษาไทย

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          onTranscript(currentText, !!finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('กรุณาอนุญาตสิทธิ์การใช้ไมโครโฟนในเบราว์เซอร์');
        } else if (event.error !== 'no-speech') {
          onError(`เกิดข้อผิดพลาดในการฟังเสียง: ${event.error}`);
        }
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // Ignore
          }
        },
      };
    } catch (err: any) {
      onError(`ไม่สามารถเปิดใช้งานไมโครโฟนได้: ${err?.message || err}`);
      return null;
    }
  }
}
