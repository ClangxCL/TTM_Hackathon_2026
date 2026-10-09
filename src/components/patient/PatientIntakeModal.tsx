import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SyntheticCase, PatientInfo, Vitals, AmbientContext, CurrentMedication, ChronicDisease } from '../../types/patient';
import { MockDataService } from '../../services/mockDataService';
import { fetchLiveWeather, determineKalaPeriod } from '../../services/weatherService';
import {
  UserPlus,
  X,
  Sparkles,
  Calendar,
  MapPin,
  Heart,
  Activity,
  Pill,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';

interface PatientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCase: (newCase: SyntheticCase) => void;
}

const COMMON_SYMPTOMS = [
  'ท้องอืด จุกเสียด แน่นท้อง',
  'ปวดตึงบ่า ต้นคอ สะบัก',
  'ปวดเมื่อยกล้ามเนื้อ ขัดยอก',
  'ชาปลายมือ ปลายเท้า',
  'ไอแห้ง ระคายคอ มีเสมหะ',
  'เจ็บคอ น้ำมูกไหล จามบ่อย',
  'วิงเวียนศีรษะ หน้ามืด ตาลาย',
  'ปวดศีรษะข้างเดียว (ลมปะกัง)',
  'ปวดขัดข้อเข่า (ลมจับโปง)',
  'แสบร้อนยอดอก เรอเปรี้ยว',
  'ผื่นแดงคัน ลมพิษ',
  'นอนไม่หลับ วิตกกังวล ใจสั่น',
  'ตัวร้อน มีไข้ ครั่นเนื้อครั่นตัว',
  'ปัสสาวะบ่อย กระหายน้ำ',
];

const COMMON_CHRONIC = [
  { icd10: 'I10', name: 'ความดันโลหิตสูง (Essential Hypertension)' },
  { icd10: 'E11.9', name: 'เบาหวานชนิดที่ 2 (Type 2 Diabetes)' },
  { icd10: 'E78.5', name: 'ไขมันในเลือดสูง (Hyperlipidemia)' },
  { icd10: 'I48.9', name: 'หัวใจเต้นผิดจังหวะ (Atrial Fibrillation)' },
  { icd10: 'J30.4', name: 'ภูมิแพ้อากาศ (Allergic Rhinitis)' },
  { icd10: 'K21.9', name: 'กรดไหลย้อน (GERD)' },
  { icd10: 'M17.9', name: 'ข้อเข่าเสื่อม (Osteoarthritis Knee)' },
  { icd10: 'G43.9', name: 'ไมเกรน (Migraine)' },
];

const COMMON_DRUGS = [
  { generic: 'Warfarin sodium', brand: 'Orfarin 3mg', dose: 3.0, form: 'Tablet', freq: 1, timing: 'ก่อนนอน' },
  { generic: 'Aspirin', brand: 'Aspent-M 81mg', dose: 81.0, form: 'Tablet', freq: 1, timing: 'หลังอาหารเช้าทันที' },
  { generic: 'Metformin hydrochloride', brand: 'Glucophage 500mg', dose: 500.0, form: 'Tablet', freq: 2, timing: 'พร้อมอาหาร เช้า-เย็น' },
  { generic: 'Glipizide', brand: 'Minidiab 5mg', dose: 5.0, form: 'Tablet', freq: 1, timing: 'ก่อนอาหารเช้า 30 นาที' },
  { generic: 'Amlodipine besylate', brand: 'Norvasc 5mg', dose: 5.0, form: 'Tablet', freq: 1, timing: 'ตอนเช้า' },
  { generic: 'Enalapril maleate', brand: 'Anapril 10mg', dose: 10.0, form: 'Tablet', freq: 1, timing: 'ตอนเช้า' },
  { generic: 'Losartan potassium', brand: 'Cozaar 50mg', dose: 50.0, form: 'Tablet', freq: 1, timing: 'ตอนเช้า' },
  { generic: 'Simvastatin', brand: 'Zocor 20mg', dose: 20.0, form: 'Tablet', freq: 1, timing: 'ก่อนนอน' },
  { generic: 'Ibuprofen', brand: 'Brufen 400mg', dose: 400.0, form: 'Tablet', freq: 3, timing: 'หลังอาหารทันที' },
  { generic: 'Omeprazole', brand: 'Miracid 20mg', dose: 20.0, form: 'Capsule', freq: 1, timing: 'ก่อนอาหารเช้า 30 นาที' },
  { generic: 'Paracetamol', brand: 'Tylenol 500mg', dose: 500.0, form: 'Tablet', freq: 3, timing: 'เมื่อมีอาการปวด/ไข้' },
  { generic: 'Digoxin', brand: 'Lanoxin 0.25mg', dose: 0.25, form: 'Tablet', freq: 1, timing: 'ตอนเช้า' },
  { generic: 'Cetirizine', brand: 'Zyrtec 10mg', dose: 10.0, form: 'Tablet', freq: 1, timing: 'ก่อนนอน' },
];

const PROVINCE_OPTIONS = [
  { name: 'กรุงเทพมหานคร', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.7563, lon: 100.5018 },
  { name: 'นนทบุรี', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.8591, lon: 100.5217 },
  { name: 'พระนครศรีอยุธยา', region: 'ภาคกลาง', lat: 14.3532, lon: 100.5684 },
  { name: 'เชียงใหม่', region: 'ภาคเหนือ', lat: 18.7883, lon: 98.9853 },
  { name: 'เชียงราย', region: 'ภาคเหนือ', lat: 19.9072, lon: 99.8325 },
  { name: 'พิษณุโลก', region: 'ภาคเหนือ', lat: 16.8211, lon: 100.2659 },
  { name: 'ขอนแก่น', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.4322, lon: 102.8236 },
  { name: 'นครราชสีมา', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.9799, lon: 102.0978 },
  { name: 'อุบลราชธานี', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.2449, lon: 104.8473 },
  { name: 'อุดรธานี', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4138, lon: 102.7872 },
  { name: 'สงขลา', region: 'ภาคใต้', lat: 7.1898, lon: 100.5954 },
  { name: 'ภูเก็ต', region: 'ภาคใต้', lat: 7.8804, lon: 98.3923 },
  { name: 'สุราษฎร์ธานี', region: 'ภาคใต้', lat: 9.1382, lon: 99.3215 },
  { name: 'ชลบุรี', region: 'ภาคตะวันออก', lat: 13.3611, lon: 100.9847 },
  { name: 'ระยอง', region: 'ภาคตะวันออก', lat: 12.6814, lon: 101.2816 },
  { name: 'สุพรรณบุรี', region: 'ภาคกลาง', lat: 14.4745, lon: 100.1177 },
  { name: 'นครสวรรค์', region: 'ภาคกลาง', lat: 15.6987, lon: 100.1199 },
  { name: 'ราชบุรี', region: 'ภาคตะวันตก', lat: 13.5283, lon: 99.8134 },
];

export const PatientIntakeModal: React.FC<PatientIntakeModalProps> = ({
  isOpen,
  onClose,
  onSaveCase,
}) => {
  const navigate = useNavigate();

  // 1. Demographics State
  const [hn, setHn] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'ชาย' | 'หญิง'>('หญิง');
  const [age, setAge] = useState<number>(45);
  const [birthDate, setBirthDate] = useState('1981-05-15');
  const [selectedProvince, setSelectedProvince] = useState(PROVINCE_OPTIONS[0]);
  const [occupation, setOccupation] = useState('พนักงานบริษัท');
  const [birthElement, setBirthElement] = useState('ปถวีธาตุ (ธาตุดิน)');

  // 2. Encounter & Symptoms
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptomInput, setCustomSymptomInput] = useState('');

  // 3. Vitals State
  const [btemp, setBtemp] = useState<number>(36.6);
  const [sbp, setSbp] = useState<number>(120);
  const [dbp, setDbp] = useState<number>(80);
  const [pr, setPr] = useState<number>(74);
  const [rr, setRr] = useState<number>(18);
  const [weightKg, setWeightKg] = useState<number>(62.0);
  const [heightCm, setHeightCm] = useState<number>(162.0);

  // 4. Ambient Weather State
  const [temperatureC, setTemperatureC] = useState<number>(32.0);
  const [humidity, setHumidity] = useState<number>(65);
  const [weatherDesc, setWeatherDesc] = useState<string>('แจ่มใส ลมสงบ');
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  // 5. Medical History State
  const [selectedChronic, setSelectedChronic] = useState<ChronicDisease[]>([]);
  const [activeMeds, setActiveMeds] = useState<CurrentMedication[]>([]);
  const [selectedMedTemplate, setSelectedMedTemplate] = useState('');

  // 6. Intended TTM Formulary Item
  const formulary = MockDataService.getFormulary();
  const [intendedHerbCode, setIntendedHerbCode] = useState(formulary[0]?.drug_code_24 || '410000000102019150011401');

  // Generate HN on initial open
  useEffect(() => {
    if (isOpen && !hn) {
      const yearBe = new Date().getFullYear() + 543;
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setHn(`HN-${yearBe}-${randNum}`);
    }
  }, [isOpen]);

  // Recalculate Birth Element when birthDate changes
  useEffect(() => {
    if (birthDate) {
      const dateObj = new Date(birthDate);
      const month = dateObj.getMonth() + 1;
      const autoElem = MockDataService.calculateBirthElement(month);
      setBirthElement(autoElem.element);

      // Recalculate age
      const now = new Date();
      let calculatedAge = now.getFullYear() - dateObj.getFullYear();
      if (now.getMonth() < dateObj.getMonth() || (now.getMonth() === dateObj.getMonth() && now.getDate() < dateObj.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0 && calculatedAge < 120) {
        setAge(calculatedAge);
      }
    }
  }, [birthDate]);

  // Fetch live weather for selected province
  const handleFetchWeather = async () => {
    setIsFetchingWeather(true);
    try {
      const data = await fetchLiveWeather(selectedProvince.lat, selectedProvince.lon);
      setTemperatureC(data.temperature_c);
      setHumidity(data.relative_humidity);
      setWeatherDesc(data.weather_condition);
    } catch {
      // fallback
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const handleToggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
      if (!chiefComplaint) {
        setChiefComplaint(sym);
      }
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptomInput.trim() && !selectedSymptoms.includes(customSymptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptomInput.trim()]);
      if (!chiefComplaint) {
        setChiefComplaint(customSymptomInput.trim());
      }
      setCustomSymptomInput('');
    }
  };

  const handleAddMedication = () => {
    const medTmpl = COMMON_DRUGS.find((d) => d.generic === selectedMedTemplate);
    if (!medTmpl) return;

    if (activeMeds.some((m) => m.generic_name === medTmpl.generic)) return;

    const newMed: CurrentMedication = {
      drug_id: `MED-CONV-${Date.now().toString().slice(-4)}`,
      generic_name: medTmpl.generic,
      brand_name: medTmpl.brand,
      dosage_form: medTmpl.form,
      strength_mg: medTmpl.dose,
      dose_per_admin_mg: medTmpl.dose,
      frequency_per_day: medTmpl.freq,
      timing: medTmpl.timing,
      days: 30,
      calculated_daily_dose_mg: medTmpl.dose * medTmpl.freq,
      route: 'Oral',
    };

    setActiveMeds([...activeMeds, newMed]);
  };

  const handleRemoveMedication = (generic: string) => {
    setActiveMeds(activeMeds.filter((m) => m.generic_name !== generic));
  };

  const handleToggleChronic = (ch: typeof COMMON_CHRONIC[0]) => {
    if (selectedChronic.some((c) => c.icd10 === ch.icd10)) {
      setSelectedChronic(selectedChronic.filter((c) => c.icd10 !== ch.icd10));
    } else {
      setSelectedChronic([
        ...selectedChronic,
        {
          icd10: ch.icd10,
          name: ch.name,
          diag_date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
  };

  // Submit and Save Case
  const handleSubmit = (e: React.FormEvent, proceedToEngine: boolean = true) => {
    e.preventDefault();

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    const kala = determineKalaPeriod(now);

    const calculatedBmi =
      heightCm > 0 ? Math.round((weightKg / Math.pow(heightCm / 100, 2)) * 10) / 10 : 22.0;

    // Determine season from current month
    const m = now.getMonth() + 1;
    let seasonStr = 'คิมหันตฤดู (ฤดูร้อน)';
    if (m >= 7 && m <= 10) seasonStr = 'วสันตฤดู (ฤดูฝน)';
    else if (m >= 11 || m <= 2) seasonStr = 'เหมันตฤดู (ฤดูหนาว)';

    const newCaseId = `CUSTOM-${Date.now().toString().slice(-4)}`;

    const selectedHerb =
      formulary.find((h) => h.drug_code_24 === intendedHerbCode) || formulary[0];

    const finalCase: SyntheticCase = {
      case_id: newCaseId,
      patient_info: {
        hn: hn || `HN-DEMO-${newCaseId}`,
        name: name.trim() || 'ผู้ป่วยรายใหม่ (เพิ่มโดยผู้ใช้งาน)',
        gender: gender,
        sex_code: gender === 'ชาย' ? '1' : '2',
        age: Number(age) || 45,
        birth_date: birthDate,
        province: selectedProvince.name,
        province_code: '10',
        region: selectedProvince.region,
        occupation: occupation || 'พนักงาน',
        birth_element: birthElement,
      },
      current_encounter: {
        vn: `VN${dateStr.replace(/-/g, '')}${Math.floor(100 + Math.random() * 900)}`,
        date: dateStr,
        time: timeStr,
        season: seasonStr,
        ambient_context: {
          location: selectedProvince.name,
          latitude: selectedProvince.lat,
          longitude: selectedProvince.lon,
          temperature_c: Number(temperatureC) || 32.0,
          relative_humidity: Number(humidity) || 65,
          weather_condition: weatherDesc || 'แจ่มใส',
          kala_period: kala.period,
        },
        chief_complaint: chiefComplaint.trim() || 'มีอาการปวดเมื่อยและแน่นท้อง',
        vitals: {
          btemp: Number(btemp) || 36.6,
          sbp: Number(sbp) || 120,
          dbp: Number(dbp) || 80,
          pr: Number(pr) || 74,
          rr: Number(rr) || 18,
          weight_kg: Number(weightKg) || 60,
          height_cm: Number(heightCm) || 165,
          bmi: calculatedBmi,
        },
        symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : [chiefComplaint || 'ปวดเมื่อย'],
      },
      chronic_diseases: selectedChronic,
      current_medications: activeMeds,
      intended_ttm_prescription: {
        drug_code_24: selectedHerb.drug_code_24,
        herb_name: selectedHerb.thai_name,
        dose_per_admin: 2,
        unit: selectedHerb.unit,
        frequency_per_day: 3,
        timing: 'หลังอาหาร เช้า-กลางวัน-เย็น',
        days: 7,
        total_dispensed: 42,
        calculated_daily_dose_units: 6,
        calculated_daily_dose_mg: 3000,
        instruction: 'รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง หลังอาหาร',
        is_overdose_demo: false,
      },
      planned_procedure: {
        code: '9007710',
        name: 'นวดไทยเพื่อการบำบัดรักษา',
        fee: 250.0,
      },
      expected_demo_outcome: {
        interaction_level: activeMeds.length > 0 ? 'ตรวจสดจากระบบ' : 'ไม่มีข้อมูล / ไม่พบปฏิกิริยา',
        interaction_count: 0,
        dosage_warning: 'ขนาดยาอยู่ในเกณฑ์ปกติ',
        smutthan_dominant: 'รอผลประเมินจาก Smutthan Engine',
      },
      history_episodes: [
        {
          vn: `VN${dateStr.replace(/-/g, '')}001`,
          date: dateStr,
          icd10tm_code: 'U60.10',
          icd10tm_name: 'ลมกษัยจุกเสียด (ท้องอืด ท้องเฟ้อ)',
          icd10_conventional: 'K30',
          procedure: {
            code: '9007710',
            name: 'นวดไทยเพื่อการบำบัดรักษา',
            fee_thb: 250.0,
          },
          drug: {
            code_24: selectedHerb.drug_code_24,
            name: selectedHerb.thai_name,
            quantity: 1,
            cost_thb: 35.0,
          },
          total_cost_thb: 335.0,
        },
      ],
    };

    onSaveCase(finalCase);
    onClose();

    if (proceedToEngine) {
      navigate('/smutthan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-brand-900 via-brand-800 to-teal-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-teal-300 shadow-inner">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight text-white">
                  ลงทะเบียนผู้ป่วยรายใหม่ (New Patient Intake)
                </h3>
                <span className="text-[10px] bg-teal-400/20 text-teal-200 border border-teal-300/30 px-2 py-0.5 rounded-full font-semibold">
                  Custom Case Entry
                </span>
              </div>
              <p className="text-xs text-brand-100/90 mt-0.5">
                คีย์ข้อมูลผู้ป่วยเพื่อทดสอบระบบ Smutthan Engine, ตรวจสอบ HDI และเชื่อมโยง 43 แฟ้มแบบ Real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={(e) => handleSubmit(e, true)} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Section 1: Demographics */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <UserPlus className="w-4 h-4 text-brand-700" />
                <span>1. ข้อมูลประชากรศาสตร์ (Patient Demographics)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">HN: {hn}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น นายสุขใจ สุขสมบูรณ์"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">เพศ</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('หญิง')}
                    className={`flex-1 py-2 rounded-xl font-medium border transition ${
                      gender === 'หญิง'
                        ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    หญิง
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('ชาย')}
                    className={`flex-1 py-2 rounded-xl font-medium border transition ${
                      gender === 'ชาย'
                        ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ชาย
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">วันเกิด (คำนวณอายุและธาตุ)</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">อายุ (ปี)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">จังหวัดภูมิลำเนา (ประเทศสมุฏฐาน)</label>
                <select
                  value={selectedProvince.name}
                  onChange={(e) => {
                    const found = PROVINCE_OPTIONS.find((p) => p.name === e.target.value);
                    if (found) setSelectedProvince(found);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                >
                  {PROVINCE_OPTIONS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">อาชีพ</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="เช่น ค้าขาย, ข้าราชการ, พนักงานบริษัท"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Birth Element Banner */}
            <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-brand-900 block">
                  ธาตุเจ้าเรือนกำเนิด: <span className="text-brand-700 font-extrabold">{birthElement}</span>
                </span>
                <span className="text-[10px] text-brand-700">
                  (คำนวณอัตโนมัติตามเดือนเกิด อิงวงกลมธาตุเจ้าเรือน พญ.เพ็ญนภา ทรัพย์เจริญ / คัมภีร์ปฐมจินดา)
                </span>
              </div>
              <select
                value={birthElement}
                onChange={(e) => setBirthElement(e.target.value)}
                className="bg-white border border-brand-300 text-brand-900 text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="เตโชธาตุ (ธาตุไฟ)">เตโชธาตุ (ธาตุไฟ)</option>
                <option value="วาโยธาตุ (ธาตุลม)">วาโยธาตุ (ธาตุลม)</option>
                <option value="อาโปธาตุ (ธาตุน้ำ)">อาโปธาตุ (ธาตุน้ำ)</option>
                <option value="ปถวีธาตุ (ธาตุดิน)">ปถวีธาตุ (ธาตุดิน)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Clinical Symptoms & Chief Complaint */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-200/60 pb-2">
              <Activity className="w-4 h-4 text-teal-700" />
              <span>2. อาการสำคัญและอาการทางคลินิก (Chief Complaint & Symptoms)</span>
            </span>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">อาการสำคัญ (Chief Complaint) *</label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="เช่น ท้องอืด จุกเสียด แน่นท้องหลังอาหาร เรอบ่อย 2 วัน"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                เลือกกลุ่มอาการที่ตรวจพบ (คลิกเพื่อเลือกหรือพิมพ์เพิ่ม):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition ${
                        isChecked
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {sym}
                    </button>
                  );
                })}
              </div>

              {/* Custom symptom input */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customSymptomInput}
                  onChange={(e) => setCustomSymptomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSymptom();
                    }
                  }}
                  placeholder="พิมพ์อาการอื่นๆ แล้วกดเพิ่ม..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSymptom}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-xl transition"
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Vital Signs */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-200/60 pb-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>3. สัญญาณชีพและมาตรวัดทางกายภาพ (Vital Signs)</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  อุณหภูมิกาย (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={btemp}
                  onChange={(e) => setBtemp(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  BP ตัวบน (SBP)
                </label>
                <input
                  type="number"
                  value={sbp}
                  onChange={(e) => setSbp(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  BP ตัวล่าง (DBP)
                </label>
                <input
                  type="number"
                  value={dbp}
                  onChange={(e) => setDbp(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  ชีพจร (PR bpm)
                </label>
                <input
                  type="number"
                  value={pr}
                  onChange={(e) => setPr(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  อัตราหายใจ (RR)
                </label>
                <input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  น้ำหนัก (กก.)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  ส่วนสูง (ซม.)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  BMI (คำนวณอัตโนมัติ)
                </label>
                <div className="bg-slate-100 rounded-xl px-3 py-1.5 font-bold font-mono text-slate-800">
                  {heightCm > 0
                    ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)
                    : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Ambient Weather & Environmental Context */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span>4. อุตุสมุฏฐานและสภาพแวดล้อม (Ambient Weather Context)</span>
              </span>
              <button
                type="button"
                onClick={handleFetchWeather}
                disabled={isFetchingWeather}
                className="text-[11px] bg-white border border-slate-300 hover:border-brand-500 text-slate-700 px-2.5 py-1 rounded-xl flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingWeather ? 'animate-spin' : ''}`} />
                <span>ดึงสภาพอากาศจริง (Open-Meteo)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  อุณหภูมิภายนอก (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  ความชื้นสัมพัทธ์ (%)
                </label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  ลักษณะสภาพอากาศ
                </label>
                <input
                  type="text"
                  value={weatherDesc}
                  onChange={(e) => setWeatherDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Medical History & Active Medications */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs border-b border-slate-200/60 pb-2">
              <Pill className="w-4 h-4 text-purple-600" />
              <span>5. โรคเรื้อรังและยาแผนปัจจุบัน (Active Medications & Chronic History)</span>
            </span>

            {/* Chronic Disease Pills */}
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                เลือกโรคประจำตัว (Chronic Diseases):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_CHRONIC.map((ch) => {
                  const isChecked = selectedChronic.some((c) => c.icd10 === ch.icd10);
                  return (
                    <button
                      key={ch.icd10}
                      type="button"
                      onClick={() => handleToggleChronic(ch)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition ${
                        isChecked
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {ch.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Medications Selector */}
            <div className="space-y-2 pt-1 border-t border-slate-200/60">
              <label className="text-[11px] font-semibold text-slate-700 block">
                เพิ่มยาแผนปัจจุบันที่กำลังใช้อยู่ (นำไปตรวจสอบอันตรกิริยา HDI):
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedMedTemplate}
                  onChange={(e) => setSelectedMedTemplate(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="">-- เลือกยาเคมีจากฐานข้อมูลมาตรฐาน NLEM 2569 --</option>
                  {COMMON_DRUGS.map((d) => (
                    <option key={d.generic} value={d.generic}>
                      {d.generic} ({d.brand}) - {d.timing}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  disabled={!selectedMedTemplate}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  + เพิ่มยา
                </button>
              </div>

              {/* Added Meds List */}
              {activeMeds.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {activeMeds.map((med) => (
                    <div
                      key={med.generic_name}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{med.generic_name}</span>
                        <span className="text-slate-500 font-mono ml-1">({med.brand_name})</span>
                        <span className="text-slate-400 block text-[11px]">
                          ขนาด {med.strength_mg} มก. วันละ {med.frequency_per_day} ครั้ง ({med.timing})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(med.generic_name)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Intended Herbal Drug */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>6. ยาสมุนไพรในบัญชีที่ประสงค์จะสั่งจ่ายเบื้องต้น (Initial TTM Prescription)</span>
            </span>
            <select
              value={intendedHerbCode}
              onChange={(e) => setIntendedHerbCode(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
            >
              {formulary.map((h) => (
                <option key={h.drug_code_24} value={h.drug_code_24}>
                  {h.thai_name} ({h.strength_per_unit}) - สรรพคุณ: {h.indications.slice(0, 40)}...
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>ข้อมูลจะถูกบันทึกและประมวลผลตามมาตรฐาน ICD-10-TM ทันที</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
              >
                บันทึกลงระบบ
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold bg-brand-700 hover:bg-brand-800 text-white shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <span>บันทึก & เข้าห้องตรวจ</span>
                <span>🚀</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
