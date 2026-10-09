#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_synthetic_cases.py
สร้างชุดข้อมูลสังเคราะห์ 10 เคส (C01 - C10) แบบ High-fidelity
พร้อมประวัติการรักษาย้อนหลัง 6-12 เดือน (3-8 visit/เคส)
และส่งออกเป็น JSON (/data/synthetic/cases.json)
รวมทั้งไฟล์ 43 แฟ้ม (/data/synthetic/43folders/*.csv)
"""

import json
import os
import csv
import sys
from datetime import datetime, timedelta

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data", "synthetic")
CSV_DIR = os.path.join(DATA_DIR, "43folders")

os.makedirs(CSV_DIR, exist_ok=True)

# 10 Synthetic Cases Definitions
CASES_DATA = [
  {
    "case_id": "C01",
    "patient_info": {
      "hn": "HN-DEMO-001",
      "name": "นางมาลี มีสุข (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 45,
      "birth_date": "1981-04-12",
      "province": "กรุงเทพมหานคร",
      "province_code": "10",
      "region": "กรุงเทพฯ และปริมณฑล",
      "occupation": "พนักงานสำนักงาน",
      "birth_element": "เตโชธาตุ (ราศีเมษ)"
    },
    "current_encounter": {
      "vn": "VN25690412001",
      "date": "2026-04-12",
      "time": "10:30:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "กรุงเทพมหานคร",
        "latitude": 13.7563,
        "longitude": 100.5018,
        "temperature_c": 36.5,
        "relative_humidity": 55,
        "weather_condition": "แดดจัด ร้อนระอุ",
        "kala_period": "10:00 - 14:00 (เตโช/ปิตตะ)"
      },
      "chief_complaint": "ท้องอืด จุกเสียด แน่นท้องหลังอาหาร เรอบ่อย ไม่อยากอาหาร 2 วัน",
      "vitals": {
        "btemp": 36.8,
        "sbp": 118,
        "dbp": 76,
        "pr": 74,
        "rr": 18,
        "weight_kg": 58.0,
        "height_cm": 160.0,
        "bmi": 22.7
      },
      "symptoms": ["แน่นท้อง", "จุกเสียด", "เรอเปรี้ยว", "ไฟธาตุย่อยอาหารหย่อน"]
    },
    "chronic_diseases": [],
    "current_medications": [],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000102019150011401",
      "herb_name": "ยาแคปซูลขิง",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 5,
      "total_dispensed": 30,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง หลังอาหาร (หมายเหตุ: เจตนาใส่ขนาดเกินเพื่อทดสอบ Dosage Warning)",
      "is_overdose_demo": True
    },
    "planned_procedure": {
      "code": "9007720",
      "name": "ประคบสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ไม่มีข้อมูล / ไม่พบปฏิกิริยา",
      "interaction_count": 0,
      "dosage_warning": "แจ้งเตือนขนาดเกิน: 3,000 มก./วัน เกินขนาดสูงสุดที่แนะนำ (2,000 มก./วัน หรือ 4 แคปซูล/วัน)",
      "smutthan_dominant": "วาโยธาตุกำเริบ (ลมจุกแน่น) ร่วมกับปริณามัคคีหย่อนในฤดูร้อน"
    }
  },
  {
    "case_id": "C02",
    "patient_info": {
      "hn": "HN-DEMO-002",
      "name": "นายบุญมี สุขสว่าง (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 72,
      "birth_date": "1954-08-20",
      "province": "พระนครศรีอยุธยา",
      "province_code": "14",
      "region": "ภาคกลาง",
      "occupation": "ข้าราชการบำนาญ",
      "birth_element": "วาโยธาตุ (ราศีสิงห์)"
    },
    "current_encounter": {
      "vn": "VN25690820002",
      "date": "2026-08-20",
      "time": "14:15:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "พระนครศรีอยุธยา",
        "latitude": 14.3532,
        "longitude": 100.5684,
        "temperature_c": 29.0,
        "relative_humidity": 88,
        "weather_condition": "ฝนตกปรอยๆ ลมชื้น",
        "kala_period": "14:00 - 18:00 (วาโย/วาตะ)"
      },
      "chief_complaint": "แน่นจุกเสียดท้อง แสบร้อนยอดอก ทานอาหารไม่ย่อย มีลมตีขึ้น 1 สัปดาห์",
      "vitals": {
        "btemp": 36.6,
        "sbp": 132,
        "dbp": 82,
        "pr": 72,
        "rr": 18,
        "weight_kg": 64.0,
        "height_cm": 168.0,
        "bmi": 22.7
      },
      "symptoms": ["แน่นยอดอก", "แสบร้อน", "ท้องอืด", "อาหารไม่ย่อย"]
    },
    "chronic_diseases": [
      { "icd10": "I48.9", "name": "Atrial fibrillation, unspecified", "diag_date": "2023-03-15" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-001",
        "generic_name": "Warfarin sodium",
        "brand_name": "Orfarin",
        "dosage_form": "Tablet",
        "strength_mg": 3.0,
        "dose_per_admin_mg": 3.0,
        "frequency_per_day": 1,
        "timing": "ก่อนนอน",
        "days": 30,
        "calculated_daily_dose_mg": 3.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000122019150011402",
      "herb_name": "ยาแคปซูลขมิ้นชัน",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 10,
      "total_dispensed": 60,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง หลังอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "สูง",
      "interaction_count": 1,
      "target_pair": "Warfarin sodium + ขมิ้นชัน",
      "dosage_warning": "อยู่ในเกณฑ์ปกติ (3,000 มก./วัน <= Max 4,000 มก./วัน)",
      "smutthan_dominant": "ปัจฉิมวัย (72 ปี) วาโยธาตุกำเริบในฤดูฝน ร่วมกับโกฏฐาสยาวาตาติดขัด"
    }
  },
  {
    "case_id": "C03",
    "patient_info": {
      "hn": "HN-DEMO-003",
      "name": "นางสมทรง เวียงพิงค์ (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 60,
      "birth_date": "1966-12-05",
      "province": "เชียงใหม่",
      "province_code": "50",
      "region": "ภาคเหนือ",
      "occupation": "ค้าขาย",
      "birth_element": "อาโปธาตุ (ราศีธนู)"
    },
    "current_encounter": {
      "vn": "VN25691205003",
      "date": "2026-12-05",
      "time": "09:00:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "เชียงใหม่",
        "latitude": 18.7883,
        "longitude": 98.9853,
        "temperature_c": 17.5,
        "relative_humidity": 72,
        "weather_condition": "หนาวเย็น มีหมอกตอนเช้า",
        "kala_period": "06:00 - 10:00 (อาโป/เสมหะ)"
      },
      "chief_complaint": "ไอแห้งๆ ระคายคอ คอแห้ง เจ็บคอ มีเสมหะเหนียวขาวตอนเช้า 4 วัน",
      "vitals": {
        "btemp": 37.0,
        "sbp": 142,
        "dbp": 88,
        "pr": 78,
        "rr": 20,
        "weight_kg": 62.0,
        "height_cm": 155.0,
        "bmi": 25.8
      },
      "symptoms": ["ไอระคายคอ", "เสมหะเหนียว", "คอแห้ง", "ความดันโลหิตลอยสูงเล็กน้อย"]
    },
    "chronic_diseases": [
      { "icd10": "I10", "name": "Essential (primary) hypertension", "diag_date": "2022-07-10" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-002",
        "generic_name": "Amlodipine besilate",
        "brand_name": "Norvasc",
        "dosage_form": "Tablet",
        "strength_mg": 5.0,
        "dose_per_admin_mg": 5.0,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 5.0,
        "route": "Oral"
      },
      {
        "drug_id": "MED-CONV-003",
        "generic_name": "Losartan potassium",
        "brand_name": "Cozaar",
        "dosage_form": "Tablet",
        "strength_mg": 50.0,
        "dose_per_admin_mg": 50.0,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 50.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000154019125011403",
      "herb_name": "ยาชะเอมเทศผง / แคปซูล",
      "dose_per_admin": 1,
      "unit": "แคปซูล (250 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 21,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 750,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007730",
      "name": "อบไอน้ำสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 120.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ปานกลาง",
      "interaction_count": 2,
      "target_pair": "Amlodipine + ชะเอมเทศ และ Losartan + ชะเอมเทศ",
      "dosage_warning": "อยู่ในเกณฑ์ปกติ",
      "smutthan_dominant": "อาโปธาตุกำเริบ (ศอเสมหะ) ในฤดูหนาวร่วมกับกาลยามเช้า และความดันโลหิตสูง"
    }
  },
  {
    "case_id": "C04",
    "patient_info": {
      "hn": "HN-DEMO-004",
      "name": "นายประสิทธิ์ ศรีแก่น (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 55,
      "birth_date": "1971-05-18",
      "province": "ขอนแก่น",
      "province_code": "40",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "เกษตรกร",
      "birth_element": "ปถวีธาตุ (ราศีพฤษภ)"
    },
    "current_encounter": {
      "vn": "VN25690518004",
      "date": "2026-05-18",
      "time": "11:20:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "ขอนแก่น",
        "latitude": 16.4322,
        "longitude": 102.8236,
        "temperature_c": 37.8,
        "relative_humidity": 42,
        "weather_condition": "แดดร้อนระอุ แห้งแล้ง",
        "kala_period": "10:00 - 14:00 (เตโช/ปิตตะ)"
      },
      "chief_complaint": "อ่อนเพลีย ร้อนใน กระหายน้ำ ทานจุ คอแห้ง อยากหาสมุนไพรช่วยคุมน้ำตาล 1 สัปดาห์",
      "vitals": {
        "btemp": 37.1,
        "sbp": 128,
        "dbp": 80,
        "pr": 82,
        "rr": 18,
        "weight_kg": 75.0,
        "height_cm": 170.0,
        "bmi": 25.9
      },
      "symptoms": ["ร้อนใน", "กระหายน้ำ", "คอแห้ง", "อ่อนเพลีย"]
    },
    "chronic_diseases": [
      { "icd10": "E11.9", "name": "Type 2 diabetes mellitus without complications", "diag_date": "2021-11-04" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-004",
        "generic_name": "Metformin hydrochloride",
        "brand_name": "Glucophage",
        "dosage_form": "Tablet",
        "strength_mg": 500.0,
        "dose_per_admin_mg": 500.0,
        "frequency_per_day": 2,
        "timing": "พร้อมอาหาร เช้า-เย็น",
        "days": 30,
        "calculated_daily_dose_mg": 1000.0,
        "route": "Oral"
      },
      {
        "drug_id": "MED-CONV-005",
        "generic_name": "Glipizide",
        "brand_name": "Minidiab",
        "dosage_form": "Tablet",
        "strength_mg": 5.0,
        "dose_per_admin_mg": 5.0,
        "frequency_per_day": 1,
        "timing": "ก่อนอาหารเช้า 30 นาที",
        "days": 30,
        "calculated_daily_dose_mg": 5.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000182019150011404",
      "herb_name": "ยาแคปซูลมะระขี้นก",
      "dose_per_admin": 1,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 2,
      "timing": "ก่อนอาหาร เช้า-เย็น",
      "days": 14,
      "total_dispensed": 28,
      "calculated_daily_dose_units": 2,
      "calculated_daily_dose_mg": 1000,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 2 ครั้ง ก่อนอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ปานกลาง",
      "interaction_count": 2,
      "target_pair": "Metformin + มะระขี้นก และ Glipizide + มะระขี้นก",
      "dosage_warning": "อยู่ในเกณฑ์ปกติ",
      "smutthan_dominant": "เตโชธาตุกำเริบ (ปริทัยหัคคี) ร่วมกับอาโปธาตุหย่อนในสภาพอากาศร้อนจัดภาคอีสาน"
    }
  },
  {
    "case_id": "C05",
    "patient_info": {
      "hn": "HN-DEMO-005",
      "name": "นางสาววิภาวรรณ ชลธี (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 38,
      "birth_date": "1988-09-14",
      "province": "กรุงเทพมหานคร",
      "province_code": "10",
      "region": "กรุงเทพฯ และปริมณฑล",
      "occupation": "ดีไซเนอร์",
      "birth_element": "ปถวีธาตุ (ราศีกันย์)"
    },
    "current_encounter": {
      "vn": "VN25690914005",
      "date": "2026-09-14",
      "time": "15:45:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "กรุงเทพมหานคร",
        "latitude": 13.7563,
        "longitude": 100.5018,
        "temperature_c": 31.0,
        "relative_humidity": 82,
        "weather_condition": "ฝนตกชุก อากาศอบอ้าว",
        "kala_period": "14:00 - 18:00 (วาโย/วาตะ)"
      },
      "chief_complaint": "มีไข้ต่ำ ครั่นเนื้อครั่นตัว เจ็บคอ มีน้ำมูกใส จามบ่อย ปวดเมื่อยตามตัว 2 วัน",
      "vitals": {
        "btemp": 37.6,
        "sbp": 115,
        "dbp": 74,
        "pr": 84,
        "rr": 18,
        "weight_kg": 52.0,
        "height_cm": 162.0,
        "bmi": 19.8
      },
      "symptoms": ["ครั่นเนื้อครั่นตัว", "เจ็บคอ", "น้ำมูกใส", "จาม"]
    },
    "chronic_diseases": [
      { "icd10": "J30.4", "name": "Allergic rhinitis, unspecified", "diag_date": "2024-02-11" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-006",
        "generic_name": "Cetirizine hydrochloride",
        "brand_name": "Zyrtec",
        "dosage_form": "Tablet",
        "strength_mg": 10.0,
        "dose_per_admin_mg": 10.0,
        "frequency_per_day": 1,
        "timing": "ก่อนนอน",
        "days": 10,
        "calculated_daily_dose_mg": 10.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000212019135011405",
      "herb_name": "ยาแคปซูลฟ้าทะลายโจร (ผงยา)",
      "dose_per_admin": 3,
      "unit": "แคปซูล (350 มก.)",
      "frequency_per_day": 4,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น และก่อนนอน",
      "days": 3,
      "total_dispensed": 36,
      "calculated_daily_dose_units": 12,
      "calculated_daily_dose_mg": 4200,
      "instruction": "รับประทานครั้งละ 3 แคปซูล วันละ 4 ครั้ง หลังอาหารและก่อนนอน ติดต่อกัน 3 วัน",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007730",
      "name": "อบไอน้ำสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 120.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 1,
      "target_pair": "Cetirizine + ฟ้าทะลายโจร",
      "dosage_warning": "ขนาดยาอยู่ในเกณฑ์สูงสุดที่ยอมรับได้ (4,200 มก./วัน) แนะนำห้ามใช้เกิน 5 วัน",
      "smutthan_dominant": "อาโปธาตุกำเริบ (ศอเสมหะ) ร่วมกับเตโชธาตุระอุ (ไข้หวัดน้อย) ในฤดูฝน"
    }
  },
  {
    "case_id": "C06",
    "patient_info": {
      "hn": "HN-DEMO-006",
      "name": "นายสมพร เกาะสมุย (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 65,
      "birth_date": "1961-11-28",
      "province": "สงขลา",
      "province_code": "90",
      "region": "ภาคใต้",
      "occupation": "ชาวประมงพื้นบ้าน",
      "birth_element": "อาโปธาตุ (ราศีพิจิก)"
    },
    "current_encounter": {
      "vn": "VN25691128006",
      "date": "2026-11-28",
      "time": "13:30:00",
      "season": "วสันตฤดู (ฤดูฝนภาคใต้)",
      "ambient_context": {
        "location": "สงขลา",
        "latitude": 7.1898,
        "longitude": 100.5954,
        "temperature_c": 28.5,
        "relative_humidity": 90,
        "weather_condition": "มรสุม ฝนตกหนัก ลมทะเลแรง",
        "kala_period": "10:00 - 14:00 (เตโช/ปิตตะ)"
      },
      "chief_complaint": "มึนงงศีรษะ แน่นท้อง อึดอัดตัว ลมตีขึ้นบ่อย อยากใช้กระเทียมช่วยลดไขมัน 5 วัน",
      "vitals": {
        "btemp": 36.5,
        "sbp": 130,
        "dbp": 84,
        "pr": 70,
        "rr": 18,
        "weight_kg": 70.0,
        "height_cm": 165.0,
        "bmi": 25.7
      },
      "symptoms": ["มึนงงศีรษะ", "แน่นท้อง", "ลมตีขึ้น", "อึดอัดตัว"]
    },
    "chronic_diseases": [
      { "icd10": "E78.0", "name": "Pure hypercholesterolaemia", "diag_date": "2023-09-19" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-007",
        "generic_name": "Simvastatin",
        "brand_name": "Zocor",
        "dosage_form": "Tablet",
        "strength_mg": 20.0,
        "dose_per_admin_mg": 20.0,
        "frequency_per_day": 1,
        "timing": "ก่อนนอน",
        "days": 30,
        "calculated_daily_dose_mg": 20.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000252019150011406",
      "herb_name": "ยาแคปซูลกระเทียมสกัด",
      "dose_per_admin": 1,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 2,
      "timing": "หลังอาหาร เช้า-เย็น",
      "days": 30,
      "total_dispensed": 60,
      "calculated_daily_dose_units": 2,
      "calculated_daily_dose_mg": 1000,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 2 ครั้ง หลังอาหาร เช้า-เย็น",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ไม่มีข้อมูล / ไม่มีข้อมูลชัดเจน",
      "interaction_count": 1,
      "target_pair": "Simvastatin + กระเทียมสกัด",
      "dosage_warning": "อยู่ในเกณฑ์ปกติ",
      "smutthan_dominant": "ปัจฉิมวัย วาโยธาตุกำเริบในสภาพอากาศฝนชุกและลมทะเลแรง"
    }
  },
  {
    "case_id": "C07",
    "patient_info": {
      "hn": "HN-DEMO-007",
      "name": "นายธนกร รัตนวงศ์ (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 28,
      "birth_date": "1998-03-25",
      "province": "กรุงเทพมหานคร",
      "province_code": "10",
      "region": "กรุงเทพฯ และปริมณฑล",
      "occupation": "พนักงานขนส่งสินค้า",
      "birth_element": "เตโชธาตุ (ราศีมีน)"
    },
    "current_encounter": {
      "vn": "VN25690325007",
      "date": "2026-03-25",
      "time": "16:20:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "กรุงเทพมหานคร",
        "latitude": 13.7563,
        "longitude": 100.5018,
        "temperature_c": 35.2,
        "relative_humidity": 58,
        "weather_condition": "อากาศร้อน ลมเอื่อย",
        "kala_period": "14:00 - 18:00 (วาโย/วาตะ)"
      },
      "chief_complaint": "ปวดเมื่อยกล้ามเนื้อน่องและหลังส่วนล่าง กล้ามเนื้อตึงยึดหลังยกของหนัก 2 วัน",
      "vitals": {
        "btemp": 36.7,
        "sbp": 122,
        "dbp": 78,
        "pr": 76,
        "rr": 16,
        "weight_kg": 68.0,
        "height_cm": 175.0,
        "bmi": 22.2
      },
      "symptoms": ["ปวดกล้ามเนื้อหลัง", "กล้ามเนื้อน่องตึงยึด", "ขัดยอก", "เคลื่อนไหวลำบาก"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-008",
        "generic_name": "Ibuprofen",
        "brand_name": "Brufen",
        "dosage_form": "Tablet",
        "strength_mg": 400.0,
        "dose_per_admin_mg": 400.0,
        "frequency_per_day": 3,
        "timing": "หลังอาหารทันที เช้า-กลางวัน-เย็น",
        "days": 5,
        "calculated_daily_dose_mg": 1200.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000299429114011407",
      "herb_name": "ยาน้ำมันไพล / ครีมไพล",
      "dose_per_admin": 1,
      "unit": "หลอด (30 กรัม)",
      "frequency_per_day": 3,
      "timing": "ทาและถูนวดเบาๆ เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 1,
      "calculated_daily_dose_units": 1,
      "calculated_daily_dose_mg": 0,
      "instruction": "ทาและถูนวดบริเวณหลังและน่องที่มีอาการปวด วันละ 3 ครั้ง",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 1,
      "target_pair": "Ibuprofen + น้ำมันไพล (ยาทาภายนอก)",
      "dosage_warning": "อยู่ในเกณฑ์ปกติ (ยาใช้ภายนอก ปลอดภัยสูง)",
      "smutthan_dominant": "มัชฌิมวัย มังสังพิการและนหารูพิการจากพฤติกรรมยกของหนัก ลมปลายปัตฆาตขัดยอก"
    }
  },
  {
    "case_id": "C08",
    "patient_info": {
      "hn": "HN-DEMO-008",
      "name": "นางพวงเพ็ญ จันทร์แจ่ม (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 70,
      "birth_date": "1956-01-15",
      "province": "เชียงใหม่",
      "province_code": "50",
      "region": "ภาคเหนือ",
      "occupation": "แม่บ้าน",
      "birth_element": "อาโปธาตุ (ราศีมังกร)"
    },
    "current_encounter": {
      "vn": "VN25690115008",
      "date": "2026-01-15",
      "time": "14:40:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "เชียงใหม่",
        "latitude": 18.7883,
        "longitude": 98.9853,
        "temperature_c": 19.0,
        "relative_humidity": 65,
        "weather_condition": "หนาวแห้ง ลมพัดเย็น",
        "kala_period": "14:00 - 18:00 (วาโย/วาตะ)"
      },
      "chief_complaint": "ท้องอืด ลมในท้อง แน่นลิ้นปี่ หนาวในตัว แขนขาเย็น มือชา 3 วัน",
      "vitals": {
        "btemp": 36.4,
        "sbp": 135,
        "dbp": 82,
        "pr": 68,
        "rr": 18,
        "weight_kg": 54.0,
        "height_cm": 152.0,
        "bmi": 23.4
      },
      "symptoms": ["แน่นท้อง", "ลมในท้อง", "มือเท้าเย็น", "หนาวในตัว"]
    },
    "chronic_diseases": [
      { "icd10": "I25.1", "name": "Atherosclerotic heart disease", "diag_date": "2020-05-12" },
      { "icd10": "I63.9", "name": "Cerebral infarction, unspecified", "diag_date": "2023-08-30" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-009",
        "generic_name": "Clopidogrel bisulfate",
        "brand_name": "Plavix",
        "dosage_form": "Tablet",
        "strength_mg": 75.0,
        "dose_per_admin_mg": 75.0,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 75.0,
        "route": "Oral"
      },
      {
        "drug_id": "MED-CONV-010",
        "generic_name": "Aspirin (Acetylsalicylic acid)",
        "brand_name": "Aspent",
        "dosage_form": "Tablet",
        "strength_mg": 81.0,
        "dose_per_admin_mg": 81.0,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้าทันที",
        "days": 30,
        "calculated_daily_dose_mg": 81.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000102019150011401",
      "herb_name": "ยาแคปซูลขิง",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 42,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง หลังอาหาร (ขนาดเกิน max แนะนำ)",
      "is_overdose_demo": True
    },
    "planned_procedure": {
      "code": "9007720",
      "name": "ประคบสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "สูง",
      "interaction_count": 2,
      "target_pair": "Clopidogrel + ขิง และ Aspirin + ขิง (Dual antiplatelet + Ginger)",
      "dosage_warning": "แจ้งเตือนขนาดเกิน: 3,000 มก./วัน เกินขนาดสูงสุดที่แนะนำ (2,000 มก./วัน)",
      "smutthan_dominant": "ปัจฉิมวัย ไฟย่อยอาหารหย่อน วาโยธาตุกำเริบในฤดูหนาว อังคมังคานุสารีวาตาไหลเวียนช้า"
    }
  },
  {
    "case_id": "C09",
    "patient_info": {
      "hn": "HN-DEMO-009",
      "name": "เด็กชายกิตติศักดิ์ เจริญดี (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 8,
      "birth_date": "2018-07-10",
      "province": "นครปฐม",
      "province_code": "73",
      "region": "ภาคกลาง",
      "occupation": "นักเรียนประถมศึกษา",
      "birth_element": "อาโปธาตุ (ราศีกรกฎ)"
    },
    "current_encounter": {
      "vn": "VN25690710009",
      "date": "2026-07-10",
      "time": "08:30:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "นครปฐม",
        "latitude": 13.8196,
        "longitude": 100.0601,
        "temperature_c": 27.2,
        "relative_humidity": 86,
        "weather_condition": "ฝนตกพรำๆ อากาศชื้นเย็น",
        "kala_period": "06:00 - 10:00 (อาโป/เสมหะ)"
      },
      "chief_complaint": "ตัวร้อน ร้องงอแง เจ็บคอ มีน้ำมูกใส ปวดเมื่อยตามตัว 1 วัน",
      "vitals": {
        "btemp": 38.2,
        "sbp": 102,
        "dbp": 64,
        "pr": 108,
        "rr": 24,
        "weight_kg": 24.0,
        "height_cm": 125.0,
        "bmi": 15.4
      },
      "symptoms": ["ไข้สูง 38.2C", "เจ็บคอ", "น้ำมูกใส", "ชีพจรเร็ว 108 bpm"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-011",
        "generic_name": "Paracetamol (Acetaminophen)",
        "brand_name": "Sara Syrup 120mg/5ml",
        "dosage_form": "Syrup",
        "strength_mg": 120.0,
        "dose_per_admin_mg": 240.0,
        "frequency_per_day": 4,
        "timing": "ทุก 4-6 ชั่วโมง เมื่อมีไข้",
        "days": 3,
        "calculated_daily_dose_mg": 960.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000212019135011405",
      "herb_name": "ยาแคปซูลฟ้าทะลายโจร (ผงยา)",
      "dose_per_admin": 1,
      "unit": "แคปซูล (350 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 3,
      "total_dispensed": 9,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 1050,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหาร ติดต่อกันไม่เกิน 3 วัน",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007740",
      "name": "พอกยาหรือทายาสมุนไพรเฉพาะที่",
      "fee": 80.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 1,
      "target_pair": "Paracetamol + ฟ้าทะลายโจร ในผู้ป่วยเด็ก",
      "dosage_warning": "อยู่ในเกณฑ์ปลอดภัยสำหรับเด็ก 8 ขวบ (1,050 มก./วัน <= Max เด็ก 1,400 มก./วัน)",
      "smutthan_dominant": "อายุสมุฏฐานปฐมวัย (8 ขวบ: อาโปธาตุเป็นเจ้าเรือน) ร่วมกับเตโชธาตุกำเริบเฉียบพลันจากพิษไข้ในฤดูฝน"
    }
  },
  {
    "case_id": "C10",
    "patient_info": {
      "hn": "HN-DEMO-010",
      "name": "นายสมศักดิ์ วารินชำราบ (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 58,
      "birth_date": "1968-10-10",
      "province": "อุบลราชธานี",
      "province_code": "34",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "ค้าขายของชำ",
      "birth_element": "วาโยธาตุ (ราศีตุล)"
    },
    "current_encounter": {
      "vn": "VN25691010010",
      "date": "2026-10-10",
      "time": "10:15:00",
      "season": "เหมันตฤดู (ปลายฝนต้นหนาว)",
      "ambient_context": {
        "location": "อุบลราชธานี",
        "latitude": 15.2449,
        "longitude": 104.8473,
        "temperature_c": 21.5,
        "relative_humidity": 68,
        "weather_condition": "ลมหนาวเริ่มพัด อากาศแห้งเย็น",
        "kala_period": "10:00 - 14:00 (เตโช/ปิตตะ)"
      },
      "chief_complaint": "ไอแห้งๆ คอแห้ง เจ็บคอ อ่อนเพลีย แน่นหน้าอกเล็กน้อย อยากได้ยาสมุนไพรชุ่มคอ 3 วัน",
      "vitals": {
        "btemp": 36.9,
        "sbp": 126,
        "dbp": 80,
        "pr": 64,
        "rr": 18,
        "weight_kg": 65.0,
        "height_cm": 167.0,
        "bmi": 23.3
      },
      "symptoms": ["ไอแห้ง", "คอแห้ง", "เจ็บคอ", "เหนื่อยเพลีย"]
    },
    "chronic_diseases": [
      { "icd10": "I50.9", "name": "Heart failure, unspecified", "diag_date": "2021-04-18" },
      { "icd10": "I48", "name": "Atrial fibrillation and flutter", "diag_date": "2021-04-18" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-012",
        "generic_name": "Digoxin",
        "brand_name": "Lanoxin",
        "dosage_form": "Tablet",
        "strength_mg": 0.25,
        "dose_per_admin_mg": 0.25,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 0.25,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000154019125011403",
      "herb_name": "ยาชะเอมเทศผง / แคปซูล",
      "dose_per_admin": 1,
      "unit": "แคปซูล (250 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 21,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 750,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "สูง",
      "interaction_count": 1,
      "target_pair": "Digoxin + ชะเอมเทศ (Severe Contraindication)",
      "dosage_warning": "อยู่ในเกณฑ์ปกติ แต่มีข้อห้ามใช้เด็ดขาด (Contraindicated) เนื่องจากเสี่ยงต่อ Digoxin Toxicity จากภาวะโพแทสเซียมในเลือดต่ำ",
      "smutthan_dominant": "ปัจฉิมวัย หทัยวาตะอ่อนแรง ร่วมกับอาโปธาตุ (ศอเสมหะ) ระคายเคืองในลมหนาว"
    }
  }
]

# Generate 6-12 months history episodes for each case (3-8 visits)
def generate_history_episodes(case):
    episodes = []
    current_date = datetime.strptime(case["current_encounter"]["date"], "%Y-%m-%d")
    
    # generate 3 to 7 historical visits spaced 30-60 days apart
    num_visits = 4 if int(case["case_id"][1:]) % 2 == 0 else 5
    if case["case_id"] in ["C02", "C08", "C10"]:
        num_visits = 6  # chronic cardiac cases have more visits
    
    for i in range(num_visits, 0, -1):
        visit_date = current_date - timedelta(days=i * 35 + 10)
        vn = f"VN{visit_date.strftime('%Y%m%d')}{i:03d}"
        
        # Pick realistic TTM diagnoses and procedures based on case profile
        if case["case_id"] in ["C01", "C02", "C04"]:
            u_code = "U60.10"
            u_name = "ลมกษัยจุกเสียด (ท้องอืด ท้องเฟ้อ)"
            icd10 = "K30"
            proc_code = "9007720"
            proc_name = "ประคบสมุนไพรเพื่อการบำบัดรักษา"
            proc_fee = 150.0
            drug_name = "ยาธาตุอบเชย"
            drug_code = "420000000489469118011411"
            drug_qty = 1
            drug_cost = 35.0
        elif case["case_id"] in ["C07"]:
            u_code = "U55.20"
            u_name = "ลมปลายปัตฆาตสัญญาณ 4, 5 หลัง"
            icd10 = "M54.5"
            proc_code = "9007710"
            proc_name = "นวดไทยเพื่อการบำบัดรักษา"
            proc_fee = 250.0
            drug_name = "ยาน้ำมันไพล"
            drug_code = "410000000299429114011407"
            drug_qty = 1
            drug_cost = 45.0
        elif case["case_id"] in ["C03", "C05", "C09"]:
            u_code = "U56.19"
            u_name = "ไข้หวัด, ไม่ระบุรายละเอียด"
            icd10 = "J00"
            proc_code = "9007730"
            proc_name = "อบไอน้ำสมุนไพรเพื่อการบำบัดรักษา"
            proc_fee = 120.0
            drug_name = "ยาประสะมะแว้ง"
            drug_code = "420000000452159102011410"
            drug_qty = 20
            drug_cost = 20.0
        else: # C06, C08, C10
            u_code = "U61.2"
            u_name = "ลมปะกัง หรือ ลมตะกัง"
            icd10 = "G43.9"
            proc_code = "9007710"
            proc_name = "นวดไทยเพื่อการบำบัดรักษา"
            proc_fee = 250.0
            drug_name = "ยาหอมนวโกฐ"
            drug_code = "420000000414019120011409"
            drug_qty = 10
            drug_cost = 50.0
            
        total_visit_cost = proc_fee + drug_cost + 50.0 # 50 THB OPD card fee
        
        episodes.append({
          "vn": vn,
          "date": visit_date.strftime("%Y-%m-%d"),
          "icd10tm_code": u_code,
          "icd10tm_name": u_name,
          "icd10_conventional": icd10,
          "procedure": {
            "code": proc_code,
            "name": proc_name,
            "fee_thb": proc_fee
          },
          "drug": {
            "code_24": drug_code,
            "name": drug_name,
            "quantity": drug_qty,
            "cost_thb": drug_cost
          },
          "total_cost_thb": total_visit_cost
        })
    return episodes

for c in CASES_DATA:
    c["history_episodes"] = generate_history_episodes(c)

# Save cases.json
cases_file = os.path.join(DATA_DIR, "cases.json")
with open(cases_file, "w", encoding="utf-8") as f:
    json.dump(CASES_DATA, f, ensure_ascii=False, indent=2)
print(f"✅ Generated {len(CASES_DATA)} cases to {cases_file}")

# Generate 43 Folders CSVs
person_rows = []
service_rows = []
diag_rows = []
chronic_rows = []
drug_rows = []
proc_rows = []
provider_rows = [
  {"HOSPCODE": "11400", "PROVIDER": "TTM001", "NAME": "พท.ป. ศิริพร พงษ์ไพจิตร", "PROVIDERTYPE": "07", "REGISTERNO": "พท.ป.4512"},
  {"HOSPCODE": "11400", "PROVIDER": "TTM002", "NAME": "พท. กฤษณะ ธนบดี", "PROVIDERTYPE": "06", "REGISTERNO": "พท.ว.8901"}
]

for c in CASES_DATA:
    pid = c["patient_info"]["hn"]
    hosp = "11400"
    
    # 1. PERSON
    person_rows.append({
      "HOSPCODE": hosp,
      "PID": pid,
      "CID_HASH": f"SYNTH_CID_{pid}",
      "NAME": c["patient_info"]["name"],
      "SEX": c["patient_info"]["sex_code"],
      "BIRTH": c["patient_info"]["birth_date"],
      "AGE_Y": c["patient_info"]["age"],
      "PROVINCE": c["patient_info"]["province_code"],
      "DISTRICT": "01"
    })
    
    # 2. CHRONIC
    for ch in c["chronic_diseases"]:
        chronic_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "CHRONIC_CODE": ch["icd10"],
          "CHRONIC_NAME": ch["name"],
          "D_DIAG": ch["diag_date"]
        })
        
    # Historical Visits
    for ep in c["history_episodes"]:
        seq = ep["vn"]
        # SERVICE
        service_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "SEQ": seq,
          "DATE_SERV": ep["date"],
          "TIME_SERV": "09:30:00",
          "CHIEFCOMP": ep["icd10tm_name"],
          "BTEMP": 36.6,
          "SBP": 120,
          "DBP": 80,
          "PR": 75,
          "RR": 18,
          "WEIGHT": c["current_encounter"]["vitals"]["weight_kg"],
          "HEIGHT": c["current_encounter"]["vitals"]["height_cm"]
        })
        # DIAGNOSIS_OPD
        diag_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "SEQ": seq,
          "DIAGCODE": ep["icd10tm_code"],
          "DIAGTYPE": "1", # Principal TTM diag
          "CLINIC": "01100",
          "PROVIDER": "TTM001"
        })
        diag_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "SEQ": seq,
          "DIAGCODE": ep["icd10_conventional"],
          "DIAGTYPE": "2", # Secondary conventional diag
          "CLINIC": "01100",
          "PROVIDER": "TTM001"
        })
        # DRUG_OPD
        drug_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "SEQ": seq,
          "DCODE": ep["drug"]["code_24"],
          "DNAME": ep["drug"]["name"],
          "AMOUNT": ep["drug"]["quantity"],
          "UNIT": "หน่วย",
          "UNIT_PRICE": round(ep["drug"]["cost_thb"] / ep["drug"]["quantity"], 2),
          "TOTAL_PRICE": ep["drug"]["cost_thb"],
          "COST_PRICE": round(ep["drug"]["cost_thb"] * 0.7, 2),
          "DRUG_TYPE": "2", # แผนไทย
          "USAGE_INSTRUCTION": "รับประทานตามคำแนะนำแพทย์แผนไทย"
        })
        # PROCEDURE_OPD
        proc_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "SEQ": seq,
          "PROCEDCODE": ep["procedure"]["code"],
          "PROCEDNAME": ep["procedure"]["name"],
          "SERVICEPRICE": ep["procedure"]["fee_thb"],
          "CLINIC": "01100",
          "PROVIDER": "TTM001"
        })
        
    # Current Encounter Visit
    cur = c["current_encounter"]
    cur_seq = cur["vn"]
    service_rows.append({
      "HOSPCODE": hosp,
      "PID": pid,
      "SEQ": cur_seq,
      "DATE_SERV": cur["date"],
      "TIME_SERV": cur["time"],
      "CHIEFCOMP": cur["chief_complaint"],
      "BTEMP": cur["vitals"]["btemp"],
      "SBP": cur["vitals"]["sbp"],
      "DBP": cur["vitals"]["dbp"],
      "PR": cur["vitals"]["pr"],
      "RR": cur["vitals"]["rr"],
      "WEIGHT": cur["vitals"]["weight_kg"],
      "HEIGHT": cur["vitals"]["height_cm"]
    })
    
    # Current medications in DRUG_OPD (Conventional)
    for m in c["current_medications"]:
        drug_rows.append({
          "HOSPCODE": hosp,
          "PID": pid,
          "SEQ": cur_seq,
          "DCODE": f"24D_{m['drug_id']}",
          "DNAME": f"{m['generic_name']} {m['strength_mg']} mg",
          "AMOUNT": m["days"],
          "UNIT": "เม็ด",
          "UNIT_PRICE": 5.0,
          "TOTAL_PRICE": m["days"] * 5.0,
          "COST_PRICE": m["days"] * 3.5,
          "DRUG_TYPE": "1", # แผนปัจจุบัน
          "USAGE_INSTRUCTION": f"รับประทาน {m['timing']}"
        })

# Write CSV helper
def write_csv(filename, rows, fieldnames):
    filepath = os.path.join(CSV_DIR, filename)
    with open(filepath, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    print(f"📁 Exported {len(rows)} records to {filename}")

write_csv("PERSON.csv", person_rows, ["HOSPCODE", "PID", "CID_HASH", "NAME", "SEX", "BIRTH", "AGE_Y", "PROVINCE", "DISTRICT"])
write_csv("SERVICE.csv", service_rows, ["HOSPCODE", "PID", "SEQ", "DATE_SERV", "TIME_SERV", "CHIEFCOMP", "BTEMP", "SBP", "DBP", "PR", "RR", "WEIGHT", "HEIGHT"])
write_csv("DIAGNOSIS_OPD.csv", diag_rows, ["HOSPCODE", "PID", "SEQ", "DIAGCODE", "DIAGTYPE", "CLINIC", "PROVIDER"])
write_csv("CHRONIC.csv", chronic_rows, ["HOSPCODE", "PID", "CHRONIC_CODE", "CHRONIC_NAME", "D_DIAG"])
write_csv("DRUG_OPD.csv", drug_rows, ["HOSPCODE", "PID", "SEQ", "DCODE", "DNAME", "AMOUNT", "UNIT", "UNIT_PRICE", "TOTAL_PRICE", "COST_PRICE", "DRUG_TYPE", "USAGE_INSTRUCTION"])
write_csv("PROCEDURE_OPD.csv", proc_rows, ["HOSPCODE", "PID", "SEQ", "PROCEDCODE", "PROCEDNAME", "SERVICEPRICE", "CLINIC", "PROVIDER"])
write_csv("PROVIDER.csv", provider_rows, ["HOSPCODE", "PROVIDER", "NAME", "PROVIDERTYPE", "REGISTERNO"])

print("✨ Phase 0 synthetic datasets successfully generated!")
