#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/generate_synthetic_cases.py
สร้างชุดข้อมูลสังเคราะห์ 30 เคส (C01 - C30) แบบ High-fidelity
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

# 30 Synthetic Cases Definitions
NEW_CASES = [
  {
    "case_id": "C11",
    "patient_info": {
      "hn": "HN-DEMO-011",
      "name": "นางทองใบ ชนะศึก (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 68,
      "birth_date": "1958-05-12",
      "province": "นครราชสีมา",
      "province_code": "30",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "เกษตรกร",
      "birth_element": "ปถวีธาตุ (ราศีพฤษภ)"
    },
    "current_encounter": {
      "vn": "VN25691102011",
      "date": "2026-11-02",
      "time": "09:30:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "นครราชสีมา",
        "latitude": 14.9799,
        "longitude": 102.0978,
        "temperature_c": 24.0,
        "relative_humidity": 62,
        "weather_condition": "ลมหนาวพัดแห้ง อากาศเย็นสบาย",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "ปวดขัดในข้อเข่าทั้งสองข้าง เสียวและมีเสียงกรอบแกรบ เดินขึ้นบันไดลำบาก 2 สัปดาห์",
      "vitals": {
        "btemp": 36.6,
        "sbp": 138,
        "dbp": 84,
        "pr": 74,
        "rr": 18,
        "weight_kg": 68.0,
        "height_cm": 155.0,
        "bmi": 28.3
      },
      "symptoms": ["ปวดข้อเข่า", "ขัดข้อ", "ลสิกาแห้ง", "เสียงกรอบแกรบในข้อ"]
    },
    "chronic_diseases": [
      { "icd10": "I10", "name": "Essential (primary) hypertension", "diag_date": "2020-03-12" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-012",
        "generic_name": "Amlodipine besylate",
        "brand_name": "Norvasc",
        "dosage_form": "Tablet",
        "strength_mg": 5.0,
        "dose_per_admin_mg": 5.0,
        "frequency_per_day": 1,
        "timing": "ตอนเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 5.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาสหัศธารา",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "ก่อนอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 42,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง ก่อนอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007740",
      "name": "พอกยาหรือทายาสมุนไพรเฉพาะที่ (พอกเข่า)",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ (ห้ามใช้ในผู้ที่มีไข้หรือสตรีมีครรภ์)",
      "smutthan_dominant": "ปัจฉิมวัย วาโยธาตุกำเริบขัดในข้อเข่า ลสิกา (น้ำไขข้อ) หย่อน"
    }
  },
  {
    "case_id": "C12",
    "patient_info": {
      "hn": "HN-DEMO-012",
      "name": "นายกานต์ ธนโชติ (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 32,
      "birth_date": "1994-04-05",
      "province": "นนทบุรี",
      "province_code": "12",
      "region": "กรุงเทพฯ และปริมณฑล",
      "occupation": "วิศวกรซอฟต์แวร์",
      "birth_element": "เตโชธาตุ (ราศีเมษ)"
    },
    "current_encounter": {
      "vn": "VN25690405012",
      "date": "2026-04-05",
      "time": "14:20:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "นนทบุรี",
        "latitude": 13.8591,
        "longitude": 100.5217,
        "temperature_c": 36.2,
        "relative_humidity": 52,
        "weather_condition": "แดดจัด อากาศร้อนจัด",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "ปวดตึงบ่า ต้นคอ และสะบัก นั่งทำงานหน้าคอมพิวเตอร์นาน ปวดร้าวขึ้นท้ายทอย 1 สัปดาห์",
      "vitals": {
        "btemp": 36.7,
        "sbp": 124,
        "dbp": 78,
        "pr": 76,
        "rr": 16,
        "weight_kg": 72.0,
        "height_cm": 174.0,
        "bmi": 23.8
      },
      "symptoms": ["ปวดตึงบ่า", "ปวดสะบัก", "กล้ามเนื้อคอตึงเกร็ง", "มึนท้ายทอย"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-013",
        "generic_name": "Paracetamol",
        "brand_name": "Tylenol 500mg",
        "dosage_form": "Tablet",
        "strength_mg": 500.0,
        "dose_per_admin_mg": 500.0,
        "frequency_per_day": 2,
        "timing": "เมื่อมีอาการปวด",
        "days": 5,
        "calculated_daily_dose_mg": 1000.0,
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
      "instruction": "ทาบริเวณคอ บ่า สะบัก วันละ 3 ครั้ง",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ไม่มีข้อมูล / ไม่พบปฏิกิริยา",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัยสูง",
      "smutthan_dominant": "มัชฌิมวัย ลมปลายปัตฆาตขัดยอก นหารูและมังสังตึงเกร็งจากพฤติกรรมนั่งนาน"
    }
  },
  {
    "case_id": "C13",
    "patient_info": {
      "hn": "HN-DEMO-013",
      "name": "เด็กหญิงกัญญาณัฐ สดใส (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 11,
      "birth_date": "2015-02-18",
      "province": "เชียงราย",
      "province_code": "57",
      "region": "ภาคเหนือ",
      "occupation": "นักเรียน",
      "birth_element": "ปถวีธาตุ (ราศีกุมภ์)"
    },
    "current_encounter": {
      "vn": "VN25690218013",
      "date": "2026-02-18",
      "time": "08:15:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "เชียงราย",
        "latitude": 19.9072,
        "longitude": 99.8325,
        "temperature_c": 16.0,
        "relative_humidity": 78,
        "weather_condition": "หมอกหนา อากาศหนาวจัด",
        "kala_period": "06:00 - 09:00 (เสมหะกาล)"
      },
      "chief_complaint": "ไอมีเสมหะขาว คันคอ น้ำมูกไหลใส คัดจมูกช่วงเช้า 3 วัน",
      "vitals": {
        "btemp": 37.1,
        "sbp": 105,
        "dbp": 66,
        "pr": 88,
        "rr": 20,
        "weight_kg": 32.0,
        "height_cm": 140.0,
        "bmi": 16.3
      },
      "symptoms": ["ไอมีเสมหะ", "คันคอ", "น้ำมูกใส", "คัดจมูก"]
    },
    "chronic_diseases": [],
    "current_medications": [],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000452159102011410",
      "herb_name": "ยาน้ำแก้ไอผสมมะขามป้อม",
      "dose_per_admin": 1,
      "unit": "ช้อนชา (5 มล.)",
      "frequency_per_day": 3,
      "timing": "จิบบ่อยๆ เมื่อมีอาการไอ",
      "days": 5,
      "total_dispensed": 1,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 0,
      "instruction": "จิบครั้งละ 1 ช้อนชา วันละ 3-4 ครั้ง เมื่อมีอาการไอ",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007730",
      "name": "อบไอน้ำสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 120.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ไม่มีข้อมูล / ไม่พบปฏิกิริยา",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปลอดภัยสำหรับเด็ก",
      "smutthan_dominant": "ปฐมวัย (11 ปี) อาโปธาตุ (ศอเสมหะ) กำเริบในสภาพอากาศหนาวชื้นยามเช้า"
    }
  },
  {
    "case_id": "C14",
    "patient_info": {
      "hn": "HN-DEMO-014",
      "name": "นายวีระพล สุริยันต์ (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 42,
      "birth_date": "1984-06-25",
      "province": "ภูเก็ต",
      "province_code": "83",
      "region": "ภาคใต้",
      "occupation": "มัคคุเทศก์",
      "birth_element": "เตโชธาตุ (ราศีมิถุน)"
    },
    "current_encounter": {
      "vn": "VN25690625014",
      "date": "2026-06-25",
      "time": "11:45:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "ภูเก็ต",
        "latitude": 7.8804,
        "longitude": 98.3923,
        "temperature_c": 32.5,
        "relative_humidity": 84,
        "weather_condition": "แดดร้อนสลับฝนตก ลมทะเลชื้น",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "ผื่นแดงคันตามแขนขา แสบร้อนผิวหนัง ลมพิษเห่อขึ้นหลังโดนแดดและไอทะเล 2 วัน",
      "vitals": {
        "btemp": 37.3,
        "sbp": 122,
        "dbp": 78,
        "pr": 80,
        "rr": 18,
        "weight_kg": 70.0,
        "height_cm": 172.0,
        "bmi": 23.7
      },
      "symptoms": ["ผื่นคันแดง", "แสบร้อนผิว", "ลมพิษเห่อ", "ผิวแห้งลอก"]
    },
    "chronic_diseases": [
      { "icd10": "L50.9", "name": "Urticaria, unspecified", "diag_date": "2022-08-14" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-014",
        "generic_name": "Loratadine",
        "brand_name": "Clarityne",
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
      "drug_code_24": "420000000452159102011410",
      "herb_name": "ยาประสะจันทน์แดง",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "ก่อนอาหาร เช้า-กลางวัน-เย็น",
      "days": 5,
      "total_dispensed": 30,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง ก่อนอาหาร เพื่อดับพิษร้อนถอนพิษไข้",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007740",
      "name": "พอกยาหรือทายาสมุนไพรเฉพาะที่",
      "fee": 100.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาอยู่ในเกณฑ์ปกติ",
      "smutthan_dominant": "เตโชธาตุกำเริบขึ้นตะโจ (ผิวหนัง) โลหิตระส่ำระสายในสภาพอากาศร้อนชื้น"
    }
  },
  {
    "case_id": "C15",
    "patient_info": {
      "hn": "HN-DEMO-015",
      "name": "นางประนอม ศรีสวัสดิ์ (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 55,
      "birth_date": "1971-08-10",
      "province": "สุพรรณบุรี",
      "province_code": "72",
      "region": "ภาคกลาง",
      "occupation": "ข้าราชการครู",
      "birth_element": "วาโยธาตุ (ราศีสิงห์)"
    },
    "current_encounter": {
      "vn": "VN25690810015",
      "date": "2026-08-10",
      "time": "10:10:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "สุพรรณบุรี",
        "latitude": 14.4745,
        "longitude": 100.1177,
        "temperature_c": 33.0,
        "relative_humidity": 75,
        "weather_condition": "อากาศอบอ้าว แดดสลับครึ้ม",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "วิงเวียนศีรษะ ตาลาย หน้ามืดเวลาเปลี่ยนท่า ตึงท้ายทอย ใจสั่น 4 วัน",
      "vitals": {
        "btemp": 36.8,
        "sbp": 148,
        "dbp": 92,
        "pr": 84,
        "rr": 18,
        "weight_kg": 62.0,
        "height_cm": 158.0,
        "bmi": 24.8
      },
      "symptoms": ["วิงเวียนศีรษะ", "หน้ามืด", "ตึงท้ายทอย", "ใจสั่น", "ลมอุทธังคมาวาตากำเริบ"]
    },
    "chronic_diseases": [
      { "icd10": "I10", "name": "Essential (primary) hypertension", "diag_date": "2021-05-19" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-015",
        "generic_name": "Enalapril maleate",
        "brand_name": "Anapril",
        "dosage_form": "Tablet",
        "strength_mg": 10.0,
        "dose_per_admin_mg": 10.0,
        "frequency_per_day": 1,
        "timing": "ตอนเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 10.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาหอมเทพจิตร",
      "dose_per_admin": 1,
      "unit": "เม็ด (1 กรัม)",
      "frequency_per_day": 3,
      "timing": "ละลายน้ำกระสายยาเมื่อมีอาการ",
      "days": 10,
      "total_dispensed": 30,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 3000,
      "instruction": "ละลายน้ำสุกครั้งละ 1 เม็ด วันละ 3 ครั้ง หรือเมื่อมีอาการวิงเวียน",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัย",
      "smutthan_dominant": "ปัจฉิมวัย สุมนาวาตะและลมอุทธังคมาวาตากำเริบ ความดันโลหิตสูง"
    }
  },
  {
    "case_id": "C16",
    "patient_info": {
      "hn": "HN-DEMO-016",
      "name": "นายณัฐดนัย ภูริภัทร (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 26,
      "birth_date": "2000-10-18",
      "province": "ขอนแก่น",
      "province_code": "40",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "นักกีฬา / โค้ชฟุตบอล",
      "birth_element": "อาโปธาตุ (ราศีตุล)"
    },
    "current_encounter": {
      "vn": "VN25691018016",
      "date": "2026-10-18",
      "time": "16:15:00",
      "season": "เหมันตฤดู (ปลายฝนต้นหนาว)",
      "ambient_context": {
        "location": "ขอนแก่น",
        "latitude": 16.4322,
        "longitude": 102.8236,
        "temperature_c": 28.0,
        "relative_humidity": 65,
        "weather_condition": "ลมพัดแรง อากาศแห้งเริ่มเย็น",
        "kala_period": "15:00 - 18:00 (วาตะกาล)"
      },
      "chief_complaint": "ข้อเท้าพลิกจากการเล่นกีฬา บวมตึง ปวดเวลาลงน้ำหนัก ขัดยอก 1 วัน",
      "vitals": {
        "btemp": 36.8,
        "sbp": 120,
        "dbp": 76,
        "pr": 72,
        "rr": 16,
        "weight_kg": 75.0,
        "height_cm": 178.0,
        "bmi": 23.7
      },
      "symptoms": ["ข้อเท้าบวม", "ปวดขัดยอก", "เอ็นตึงเกร็ง", "ลงน้ำหนักไม่ได้"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-016",
        "generic_name": "Diclofenac diethylammonium gel",
        "brand_name": "Voltaren Emulgel",
        "dosage_form": "Gel",
        "strength_mg": 10.0,
        "dose_per_admin_mg": 10.0,
        "frequency_per_day": 3,
        "timing": "ทาภายนอก",
        "days": 5,
        "calculated_daily_dose_mg": 30.0,
        "route": "Topical"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000299429114011407",
      "herb_name": "ยาน้ำมันไพล / ครีมไพล",
      "dose_per_admin": 1,
      "unit": "หลอด (30 กรัม)",
      "frequency_per_day": 3,
      "timing": "ทาและถูนวดเบาๆ",
      "days": 7,
      "total_dispensed": 1,
      "calculated_daily_dose_units": 1,
      "calculated_daily_dose_mg": 0,
      "instruction": "ทาบริเวณข้อเท้าที่ขัดยอก วันละ 3 ครั้ง",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007720",
      "name": "ประคบสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 1,
      "target_pair": "Diclofenac + ไพล (Topical Combination)",
      "dosage_warning": "ปลอดภัยสูง (ยาทาภายนอก)",
      "smutthan_dominant": "มัชฌิมวัย นหารูพิการจากอุบัติเหตุข้อเท้าพลิก ลมอังคมังคานุสารีวาตาคั่งค้าง"
    }
  },
  {
    "case_id": "C17",
    "patient_info": {
      "hn": "HN-DEMO-017",
      "name": "นางสาวจารุณี บุณยเกียรติ (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 49,
      "birth_date": "1977-11-20",
      "province": "เชียงใหม่",
      "province_code": "50",
      "region": "ภาคเหนือ",
      "occupation": "เจ้าของกิจการโรงแรม",
      "birth_element": "อาโปธาตุ (ราศีพิจิก)"
    },
    "current_encounter": {
      "vn": "VN25691120017",
      "date": "2026-11-20",
      "time": "15:00:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "เชียงใหม่",
        "latitude": 18.7883,
        "longitude": 98.9853,
        "temperature_c": 22.0,
        "relative_humidity": 68,
        "weather_condition": "อากาศเย็น ลมพัดเอื่อย",
        "kala_period": "15:00 - 18:00 (วาตะกาล)"
      },
      "chief_complaint": "นอนไม่หลับ หลับยาก หลับไม่สนิท ตื่นกลางดึก วิตกกังวล อ่อนเพลียตอนกลางวัน 3 สัปดาห์",
      "vitals": {
        "btemp": 36.6,
        "sbp": 126,
        "dbp": 80,
        "pr": 82,
        "rr": 18,
        "weight_kg": 56.0,
        "height_cm": 160.0,
        "bmi": 21.9
      },
      "symptoms": ["นอนไม่หลับ", "หลับไม่สนิท", "ใจสั่น", "วิตกกังวล", "หทัยวาตากำเริบ"]
    },
    "chronic_diseases": [
      { "icd10": "G47.0", "name": "Insomnia, unspecified", "diag_date": "2024-01-10" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-017",
        "generic_name": "Lorazepam",
        "brand_name": "Ativan",
        "dosage_form": "Tablet",
        "strength_mg": 0.5,
        "dose_per_admin_mg": 0.5,
        "frequency_per_day": 1,
        "timing": "ก่อนนอน",
        "days": 14,
        "calculated_daily_dose_mg": 0.5,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาหอมนวโกฐ",
      "dose_per_admin": 1,
      "unit": "ซอง (3 กรัม)",
      "frequency_per_day": 2,
      "timing": "ละลายน้ำอุ่น ก่อนนอนและเมื่อมีอาการ",
      "days": 10,
      "total_dispensed": 20,
      "calculated_daily_dose_units": 2,
      "calculated_daily_dose_mg": 6000,
      "instruction": "ละลายน้ำอุ่น 1 ซอง ดื่มก่อนนอน ช่วยปรับลมหทัยวาตาและผ่อนคลายจิตใจ",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ปานกลาง",
      "interaction_count": 1,
      "target_pair": "Lorazepam + ยาหอมนวโกฐ (Sedation additive)",
      "dosage_warning": "เฝ้าระวังอาการง่วงซึมเสริมฤทธิ์กัน",
      "smutthan_dominant": "ปัจฉิมวัย หทัยวาตาระส่ำระสาย วาโยธาตุพัดกำเริบทำให้นอนไม่หลับ"
    }
  },
  {
    "case_id": "C18",
    "patient_info": {
      "hn": "HN-DEMO-018",
      "name": "นางสมใจ นวลละออง (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 63,
      "birth_date": "1963-01-28",
      "province": "ชลบุรี",
      "province_code": "20",
      "region": "ภาคตะวันออก",
      "occupation": "แม่บ้าน",
      "birth_element": "ปถวีธาตุ (ราศีมังกร)"
    },
    "current_encounter": {
      "vn": "VN25690128018",
      "date": "2026-01-28",
      "time": "10:40:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "ชลบุรี",
        "latitude": 13.3611,
        "longitude": 100.9847,
        "temperature_c": 29.5,
        "relative_humidity": 70,
        "weather_condition": "ลมทะเลพัดเอื่อย แดดจัด",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "ท้องผูก ถ่ายอุจจาระยาก 3-4 วันถ่ายครั้ง อุจจาระแข็ง อึดอัดแน่นท้อง 1 เดือน",
      "vitals": {
        "btemp": 36.7,
        "sbp": 130,
        "dbp": 82,
        "pr": 70,
        "rr": 18,
        "weight_kg": 60.0,
        "height_cm": 156.0,
        "bmi": 24.7
      },
      "symptoms": ["ท้องผูกเรื้อรัง", "อุจจาระแข็ง", "แน่นท้อง", "กะรีสังคั่งค้าง"]
    },
    "chronic_diseases": [
      { "icd10": "K59.0", "name": "Constipation, unspecified", "diag_date": "2023-04-11" }
    ],
    "current_medications": [],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000489469118011411",
      "herb_name": "ยาธรณีสัณฑะฆาต",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 1,
      "timing": "ก่อนนอน",
      "days": 5,
      "total_dispensed": 10,
      "calculated_daily_dose_units": 2,
      "calculated_daily_dose_mg": 1000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 1 ครั้ง ก่อนนอน ดื่มน้ำตามมากๆ",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา (นวดประคบท้อง)",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ไม่มีข้อมูล / ไม่พบปฏิกิริยา",
      "interaction_count": 0,
      "dosage_warning": "ห้ามใช้ติดต่อกันเกิน 7 วัน และห้ามใช้ในสตรีมีครรภ์",
      "smutthan_dominant": "ปัจฉิมวัย กะรีสัง (อุจจาระ) และอโธคมาวาตา (ลมเบื้องต่ำ) หย่อนพิการ"
    }
  },
  {
    "case_id": "C19",
    "patient_info": {
      "hn": "HN-DEMO-019",
      "name": "นายสมพร แสนสุข (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 57,
      "birth_date": "1969-12-14",
      "province": "อุบลราชธานี",
      "province_code": "34",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "ข้าราชการท้องถิ่น",
      "birth_element": "อาโปธาตุ (ราศีธนู)"
    },
    "current_encounter": {
      "vn": "VN25691214019",
      "date": "2026-12-14",
      "time": "13:40:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "อุบลราชธานี",
        "latitude": 15.2449,
        "longitude": 104.8473,
        "temperature_c": 23.5,
        "relative_humidity": 58,
        "weather_condition": "ลมหนาวพัดแรง แห้งแล้ง",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "แน่นหน้าอกเล็กน้อย อึดอัดตัว มึนงงศีรษะ ไขมันในเลือดสูง อยากได้สมุนไพรช่วยลดไขมัน 1 สัปดาห์",
      "vitals": {
        "btemp": 36.6,
        "sbp": 136,
        "dbp": 86,
        "pr": 74,
        "rr": 18,
        "weight_kg": 76.0,
        "height_cm": 168.0,
        "bmi": 26.9
      },
      "symptoms": ["แน่นอึดอัดในอก", "มึนศีรษะ", "โลหิตไหลเวียนช้า", "ไขมันสูง"]
    },
    "chronic_diseases": [
      { "icd10": "E78.5", "name": "Hyperlipidemia, unspecified", "diag_date": "2021-09-02" },
      { "icd10": "I25.1", "name": "Atherosclerotic heart disease", "diag_date": "2022-11-15" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-018",
        "generic_name": "Aspirin",
        "brand_name": "Aspent-M 81mg",
        "dosage_form": "Tablet",
        "strength_mg": 81.0,
        "dose_per_admin_mg": 81.0,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้าทันที",
        "days": 30,
        "calculated_daily_dose_mg": 81.0,
        "route": "Oral"
      },
      {
        "drug_id": "MED-CONV-019",
        "generic_name": "Simvastatin",
        "brand_name": "Zocor 20mg",
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
      "drug_code_24": "410000000102019150011401",
      "herb_name": "ยาแคปซูลกระเทียม",
      "dose_per_admin": 1,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 2,
      "timing": "หลังอาหาร เช้า-เย็น",
      "days": 14,
      "total_dispensed": 28,
      "calculated_daily_dose_units": 2,
      "calculated_daily_dose_mg": 1000,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 2 ครั้ง หลังอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ปานกลาง",
      "interaction_count": 1,
      "target_pair": "Aspirin + กระเทียม (Increased Bleeding Risk)",
      "dosage_warning": "ระวังการเสริมฤทธิ์ต้านการเกาะกลุ่มเกล็ดเลือด",
      "smutthan_dominant": "ปัจฉิมวัย โลหิตข้นหนืด ลมในหลอดเลือดติดขัด วาโยธาตุกำเริบ"
    }
  },
  {
    "case_id": "C20",
    "patient_info": {
      "hn": "HN-DEMO-020",
      "name": "นายเจริญ มั่งมี (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 66,
      "birth_date": "1960-02-14",
      "province": "นครสวรรค์",
      "province_code": "60",
      "region": "ภาคกลาง",
      "occupation": "เกษตรกรทำสวน",
      "birth_element": "ปถวีธาตุ (ราศีกุมภ์)"
    },
    "current_encounter": {
      "vn": "VN25690214020",
      "date": "2026-02-14",
      "time": "14:50:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "นครสวรรค์",
        "latitude": 15.6987,
        "longitude": 100.1199,
        "temperature_c": 31.0,
        "relative_humidity": 55,
        "weather_condition": "แดดร้อน ลมแห้ง",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "ปวดหลังส่วนล่างร้าวลงสะโพกและต้นขา กษัยเส้น ก้มเงยลำบาก 2 สัปดาห์",
      "vitals": {
        "btemp": 36.7,
        "sbp": 134,
        "dbp": 82,
        "pr": 70,
        "rr": 18,
        "weight_kg": 66.0,
        "height_cm": 166.0,
        "bmi": 24.0
      },
      "symptoms": ["ปวดหลังร้าวลงขา", "กษัยเส้น", "นหารูตึงขัด", "เคลื่อนไหวติดขัด"]
    },
    "chronic_diseases": [
      { "icd10": "M54.5", "name": "Low back pain", "diag_date": "2021-07-20" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-020",
        "generic_name": "Tramadol hydrochloride",
        "brand_name": "Tramal 50mg",
        "dosage_form": "Capsule",
        "strength_mg": 50.0,
        "dose_per_admin_mg": 50.0,
        "frequency_per_day": 2,
        "timing": "หลังอาหาร เช้า-เย็น เมื่อปวด",
        "days": 5,
        "calculated_daily_dose_mg": 100.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000299429114011407",
      "herb_name": "ยาแคปซูลเถาวัลย์เปรียง",
      "dose_per_admin": 1,
      "unit": "แคปซูล (400 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 21,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 1200,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ระวังการระคายเคืองกระเพาะอาหาร",
      "smutthan_dominant": "ปัจฉิมวัย อังคมังคานุสารีวาตาและลมกษัยเส้นกำเริบ มังสังนหารูทรุดโทรม"
    }
  },
  {
    "case_id": "C21",
    "patient_info": {
      "hn": "HN-DEMO-021",
      "name": "นางสาวมัณฑนา อัมพร (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 36,
      "birth_date": "1990-05-08",
      "province": "กรุงเทพมหานคร",
      "province_code": "10",
      "region": "กรุงเทพฯ และปริมณฑล",
      "occupation": "เจ้าหน้าที่การเงิน",
      "birth_element": "เตโชธาตุ (ราศีพฤษภ)"
    },
    "current_encounter": {
      "vn": "VN25690508021",
      "date": "2026-05-08",
      "time": "12:30:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "กรุงเทพมหานคร",
        "latitude": 13.7563,
        "longitude": 100.5018,
        "temperature_c": 37.0,
        "relative_humidity": 50,
        "weather_condition": "แดดจัด ร้อนระอุ",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "แสบร้อนกลางอก ลมตีขึ้นลำคอ เรอเปรี้ยว แน่นใต้ลิ้นปี่หลังมื้ออาหาร 5 วัน",
      "vitals": {
        "btemp": 36.8,
        "sbp": 116,
        "dbp": 74,
        "pr": 76,
        "rr": 16,
        "weight_kg": 54.0,
        "height_cm": 162.0,
        "bmi": 20.6
      },
      "symptoms": ["แสบร้อนยอดอก", "เรอเปรี้ยว", "ลมตีขึ้น", "ไฟย่อยอาหารกำเริบ"]
    },
    "chronic_diseases": [
      { "icd10": "K21.9", "name": "Gastro-esophageal reflux disease without esophagitis", "diag_date": "2023-09-12" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-021",
        "generic_name": "Omeprazole",
        "brand_name": "Miracid 20mg",
        "dosage_form": "Capsule",
        "strength_mg": 20.0,
        "dose_per_admin_mg": 20.0,
        "frequency_per_day": 1,
        "timing": "ก่อนอาหารเช้า 30 นาที",
        "days": 14,
        "calculated_daily_dose_mg": 20.0,
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
      "code": "9007720",
      "name": "ประคบสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัย",
      "smutthan_dominant": "มัชฌิมวัย ปริทัยหัคคีกำเริบร่วมกับอุทธังคมาวาตาพัดขึ้นยอดอกในฤดูร้อน"
    }
  },
  {
    "case_id": "C22",
    "patient_info": {
      "hn": "HN-DEMO-022",
      "name": "นายเฉลิมพล วงศ์สว่าง (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 51,
      "birth_date": "1975-11-04",
      "province": "ลำปาง",
      "province_code": "52",
      "region": "ภาคเหนือ",
      "occupation": "ช่างไม้",
      "birth_element": "อาโปธาตุ (ราศีพิจิก)"
    },
    "current_encounter": {
      "vn": "VN25691104022",
      "date": "2026-11-04",
      "time": "08:45:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "ลำปาง",
        "latitude": 18.2888,
        "longitude": 99.4928,
        "temperature_c": 19.5,
        "relative_humidity": 74,
        "weather_condition": "หมอกบาง อากาศหนาวเย็น",
        "kala_period": "06:00 - 09:00 (เสมหะกาล)"
      },
      "chief_complaint": "ไอโขลกๆ เจ็บหน้าอกเวลาไอ เสมหะข้นเหนียว ระคายคอ 1 สัปดาห์",
      "vitals": {
        "btemp": 37.2,
        "sbp": 128,
        "dbp": 82,
        "pr": 78,
        "rr": 20,
        "weight_kg": 68.0,
        "height_cm": 170.0,
        "bmi": 23.5
      },
      "symptoms": ["ไอโขลก", "เสมหะเหนียวข้น", "เจ็บหน้าอกเวลาไอ", "คอแห้ง"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-022",
        "generic_name": "Dextromethorphan HBr",
        "brand_name": "Romilar 15mg",
        "dosage_form": "Tablet",
        "strength_mg": 15.0,
        "dose_per_admin_mg": 15.0,
        "frequency_per_day": 3,
        "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
        "days": 5,
        "calculated_daily_dose_mg": 45.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000452159102011410",
      "herb_name": "ยาประสะมะแว้ง",
      "dose_per_admin": 4,
      "unit": "เม็ด",
      "frequency_per_day": 4,
      "timing": "อมหรือเคี้ยวกลืนเมื่อมีอาการไอ",
      "days": 5,
      "total_dispensed": 20,
      "calculated_daily_dose_units": 16,
      "calculated_daily_dose_mg": 0,
      "instruction": "อมครั้งละ 3-4 เม็ด วันละ 4 ครั้ง หรืออมบ่อยๆ เมื่อไอ",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007730",
      "name": "อบไอน้ำสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 120.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ช่วยขับเสมหะ",
      "smutthan_dominant": "ปัจฉิมวัย อุระเสมหะและศอเสมหะกำเริบคั่งค้างในปอดในฤดูหนาว"
    }
  },
  {
    "case_id": "C23",
    "patient_info": {
      "hn": "HN-DEMO-023",
      "name": "นางสาวพิมพา พรประเสริฐ (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 29,
      "birth_date": "1997-06-12",
      "province": "ระยอง",
      "province_code": "21",
      "region": "ภาคตะวันออก",
      "occupation": "เภสัชกรโรงงาน",
      "birth_element": "เตโชธาตุ (ราศีมิถุน)"
    },
    "current_encounter": {
      "vn": "VN25690612023",
      "date": "2026-06-12",
      "time": "15:30:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "ระยอง",
        "latitude": 12.6814,
        "longitude": 101.2816,
        "temperature_c": 31.0,
        "relative_humidity": 80,
        "weather_condition": "ฝนตกพรำๆ อากาศชื้น",
        "kala_period": "15:00 - 18:00 (วาตะกาล)"
      },
      "chief_complaint": "ปวดศีรษะตุ๊บๆ ข้างเดียว (ลมปะกัง) ตาพร่ามัว คลื่นไส้ ไวต่อแสง 1 วัน",
      "vitals": {
        "btemp": 36.6,
        "sbp": 118,
        "dbp": 76,
        "pr": 80,
        "rr": 18,
        "weight_kg": 50.0,
        "height_cm": 163.0,
        "bmi": 18.8
      },
      "symptoms": ["ปวดศีรษะข้างเดียว", "ตาพร่ามัว", "คลื่นไส้", "ลมอุทธังคมาวาตาติดขัด"]
    },
    "chronic_diseases": [
      { "icd10": "G43.9", "name": "Migraine, unspecified", "diag_date": "2022-03-18" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-023",
        "generic_name": "Domperidone",
        "brand_name": "Motilium 10mg",
        "dosage_form": "Tablet",
        "strength_mg": 10.0,
        "dose_per_admin_mg": 10.0,
        "frequency_per_day": 2,
        "timing": "ก่อนอาหาร เช้า-เย็น เมื่อคลื่นไส้",
        "days": 3,
        "calculated_daily_dose_mg": 20.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาหอมนวโกฐ",
      "dose_per_admin": 1,
      "unit": "ซอง (3 กรัม)",
      "frequency_per_day": 3,
      "timing": "ละลายน้ำอุ่นเมื่อมีอาการ",
      "days": 7,
      "total_dispensed": 21,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 9000,
      "instruction": "ละลายน้ำอุ่น 1 ซอง ดื่มเมื่อเริ่มมีอาการปวดศีรษะ วันละ 3 ครั้ง",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา (นวดแก้อาการลมปะกัง)",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัย",
      "smutthan_dominant": "มัชฌิมวัย ลมอุทธังคมาวาตาและสุมนาวาตากำเริบ เลือดลมตีขึ้นเบื้องสูง"
    }
  },
  {
    "case_id": "C24",
    "patient_info": {
      "hn": "HN-DEMO-024",
      "name": "นางบุญเรือน วารีศรี (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 59,
      "birth_date": "1967-08-30",
      "province": "ร้อยเอ็ด",
      "province_code": "45",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "ค้าขาย",
      "birth_element": "วาโยธาตุ (ราศีสิงห์)"
    },
    "current_encounter": {
      "vn": "VN25690830024",
      "date": "2026-08-30",
      "time": "10:50:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "ร้อยเอ็ด",
        "latitude": 16.0538,
        "longitude": 103.6520,
        "temperature_c": 32.0,
        "relative_humidity": 78,
        "weather_condition": "อากาศร้อนชื้น ลมสงบ",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "ปัสสาวะบ่อย กระหายน้ำ คอแห้ง อ่อนเพลีย เบาหวานระดับน้ำตาลสะสมเริ่มสูง 2 สัปดาห์",
      "vitals": {
        "btemp": 36.9,
        "sbp": 132,
        "dbp": 82,
        "pr": 76,
        "rr": 18,
        "weight_kg": 64.0,
        "height_cm": 154.0,
        "bmi": 27.0
      },
      "symptoms": ["ปัสสาวะบ่อย", "กระหายน้ำ", "คอแห้ง", "อ่อนเพลีย", "มุตตังแปรปรวน"]
    },
    "chronic_diseases": [
      { "icd10": "E11.9", "name": "Type 2 diabetes mellitus without complications", "diag_date": "2020-10-05" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-024",
        "generic_name": "Metformin hydrochloride",
        "brand_name": "Glucophage 500mg",
        "dosage_form": "Tablet",
        "strength_mg": 500.0,
        "dose_per_admin_mg": 500.0,
        "frequency_per_day": 2,
        "timing": "พร้อมอาหาร เช้า-เย็น",
        "days": 30,
        "calculated_daily_dose_mg": 1000.0,
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
      "interaction_count": 1,
      "target_pair": "Metformin + มะระขี้นก (Hypoglycemia risk)",
      "dosage_warning": "แนะนำตรวจติดตามระดับน้ำตาลปลายนิ้วเป็นประจำ",
      "smutthan_dominant": "ปัจฉิมวัย อาโปธาตุกำเริบ (มุตตังหวาน) ปริณามัคคีแปรปรวน"
    }
  },
  {
    "case_id": "C25",
    "patient_info": {
      "hn": "HN-DEMO-025",
      "name": "เด็กชายธนกร ปิ่นแก้ว (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 14,
      "birth_date": "2012-03-02",
      "province": "ตรัง",
      "province_code": "92",
      "region": "ภาคใต้",
      "occupation": "นักเรียน",
      "birth_element": "ปถวีธาตุ (ราศีมีน)"
    },
    "current_encounter": {
      "vn": "VN25690302025",
      "date": "2026-03-02",
      "time": "09:00:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "ตรัง",
        "latitude": 7.5563,
        "longitude": 99.6114,
        "temperature_c": 30.0,
        "relative_humidity": 82,
        "weather_condition": "อากาศชื้น ลมพัดแรง",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "จามบ่อยตอนเช้า น้ำมูกใสไหล คัดจมูก หายใจไม่สะดวก เป็นหวัดภูมิแพ้ 1 สัปดาห์",
      "vitals": {
        "btemp": 36.8,
        "sbp": 110,
        "dbp": 70,
        "pr": 80,
        "rr": 18,
        "weight_kg": 48.0,
        "height_cm": 158.0,
        "bmi": 19.2
      },
      "symptoms": ["จามบ่อย", "น้ำมูกใส", "คัดจมูก", "คันตา", "เสมหะกำเริบ"]
    },
    "chronic_diseases": [
      { "icd10": "J30.4", "name": "Allergic rhinitis, unspecified", "diag_date": "2023-01-15" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-025",
        "generic_name": "Cetirizine hydrochloride",
        "brand_name": "Zyrtec 10mg",
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
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาปราบชมพูทวีป",
      "dose_per_admin": 1,
      "unit": "แคปซูล (250 มก.)",
      "frequency_per_day": 3,
      "timing": "ก่อนอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 21,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 750,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง ก่อนอาหาร เพื่อบรรเทาอาการหวัดภูมิแพ้",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007730",
      "name": "อบไอน้ำสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 120.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาเหมาะสมกับเด็กโต ปลอดภัย",
      "smutthan_dominant": "ปฐมวัย (14 ปี) อาโปธาตุ (ศอเสมหะ) กำเริบในสภาพอากาศชื้นภาคใต้"
    }
  },
  {
    "case_id": "C26",
    "patient_info": {
      "hn": "HN-DEMO-026",
      "name": "นางประเทือง รัตนโกศ (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 74,
      "birth_date": "1952-09-15",
      "province": "สงขลา",
      "province_code": "90",
      "region": "ภาคใต้",
      "occupation": "ผู้สูงอายุในครอบครัว",
      "birth_element": "ปถวีธาตุ (ราศีกันย์)"
    },
    "current_encounter": {
      "vn": "VN25690915026",
      "date": "2026-09-15",
      "time": "14:10:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "สงขลา",
        "latitude": 7.1898,
        "longitude": 100.5954,
        "temperature_c": 30.5,
        "relative_humidity": 82,
        "weather_condition": "ลมทะเลพัดแรง เมฆมาก",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "วิงเวียนศีรษะ รู้สึกโคลงเคลง เดินไม่มั่นคง หทัยวาตาระส่ำระสาย แน่นหน้าอกเล็กน้อย 3 วัน",
      "vitals": {
        "btemp": 36.5,
        "sbp": 142,
        "dbp": 84,
        "pr": 68,
        "rr": 18,
        "weight_kg": 52.0,
        "height_cm": 150.0,
        "bmi": 23.1
      },
      "symptoms": ["วิงเวียนบ้านหมุน", "เดินโคลงเคลง", "ใจสั่น", "หทัยวาตาอ่อนแรง"]
    },
    "chronic_diseases": [
      { "icd10": "I10", "name": "Essential (primary) hypertension", "diag_date": "2018-06-20" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-026",
        "generic_name": "Losartan potassium",
        "brand_name": "Cozaar 50mg",
        "dosage_form": "Tablet",
        "strength_mg": 50.0,
        "dose_per_admin_mg": 50.0,
        "frequency_per_day": 1,
        "timing": "ตอนเช้า",
        "days": 30,
        "calculated_daily_dose_mg": 50.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาหอมทิพโอสถ",
      "dose_per_admin": 1,
      "unit": "เม็ด (1 กรัม)",
      "frequency_per_day": 3,
      "timing": "ละลายน้ำกระสายยาเมื่อมีอาการ",
      "days": 10,
      "total_dispensed": 30,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 3000,
      "instruction": "ละลายน้ำสุก 1 เม็ด รับประทานเมื่อมีอาการวิงเวียน ใจสั่น",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007710",
      "name": "นวดไทยเพื่อการบำบัดรักษา",
      "fee": 250.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัยในผู้สูงอายุ",
      "smutthan_dominant": "ปัจฉิมวัย (74 ปี) หทัยวาตาและลมอุทธังคมาวาตาแปรปรวนในวัยชรา"
    }
  },
  {
    "case_id": "C27",
    "patient_info": {
      "hn": "HN-DEMO-027",
      "name": "นางสุภาณี กลิ่นสุคนธ์ (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 52,
      "birth_date": "1974-10-09",
      "province": "ราชบุรี",
      "province_code": "70",
      "region": "ภาคตะวันตก",
      "occupation": "แม่ค้าทำขนมหวาน",
      "birth_element": "อาโปธาตุ (ราศีตุล)"
    },
    "current_encounter": {
      "vn": "VN25691009027",
      "date": "2026-10-09",
      "time": "11:15:00",
      "season": "เหมันตฤดู (ปลายฝนต้นหนาว)",
      "ambient_context": {
        "location": "ราชบุรี",
        "latitude": 13.5283,
        "longitude": 99.8134,
        "temperature_c": 31.5,
        "relative_humidity": 68,
        "weather_condition": "แดดร่ม ลมพัดสบาย",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "นิ้วนางและนิ้วกลางมือขวาติดขัด งอแล้วเหยียดไม่ออก เจ็บโคนนิ้ว (นิ้วล็อก) 3 สัปดาห์",
      "vitals": {
        "btemp": 36.7,
        "sbp": 126,
        "dbp": 78,
        "pr": 72,
        "rr": 16,
        "weight_kg": 58.0,
        "height_cm": 157.0,
        "bmi": 23.5
      },
      "symptoms": ["นิ้วล็อก", "งอนิ้วสะดุด", "ปวดขัดโคนนิ้ว", "เอ็นข้อนิ้วตึงยึด"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-027",
        "generic_name": "Celecoxib",
        "brand_name": "Celebrex 200mg",
        "dosage_form": "Capsule",
        "strength_mg": 200.0,
        "dose_per_admin_mg": 200.0,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้า",
        "days": 7,
        "calculated_daily_dose_mg": 200.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "410000000299429114011407",
      "herb_name": "ยาน้ำมันไพล / ครีมไพล",
      "dose_per_admin": 1,
      "unit": "หลอด (30 กรัม)",
      "frequency_per_day": 3,
      "timing": "ทาและถูนวดเบาๆ โคนนิ้ว",
      "days": 10,
      "total_dispensed": 1,
      "calculated_daily_dose_units": 1,
      "calculated_daily_dose_mg": 0,
      "instruction": "ทาและคลึงเบาๆ บริเวณโคนนิ้วมือ วันละ 3 ครั้ง ร่วมกับการแช่น้ำอุ่น",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007720",
      "name": "ประคบสมุนไพรเพื่อการบำบัดรักษา",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัยสูง",
      "smutthan_dominant": "ปัจฉิมวัย นหารูพิการ (เส้นเอ็นติดขัด) จากการเกร็งนิ้วมือทำขนมเป็นเวลานาน"
    }
  },
  {
    "case_id": "C28",
    "patient_info": {
      "hn": "HN-DEMO-028",
      "name": "นายพิชัย อริยวงศ์ (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 39,
      "birth_date": "1987-04-22",
      "province": "อุดรธานี",
      "province_code": "41",
      "region": "ภาคตะวันออกเฉียงเหนือ",
      "occupation": "พนักงานธนาคาร",
      "birth_element": "เตโชธาตุ (ราศีเมษ)"
    },
    "current_encounter": {
      "vn": "VN25690422028",
      "date": "2026-04-22",
      "time": "12:15:00",
      "season": "คิมหันตฤดู (ฤดูร้อน)",
      "ambient_context": {
        "location": "อุดรธานี",
        "latitude": 17.4138,
        "longitude": 102.7872,
        "temperature_c": 38.2,
        "relative_humidity": 45,
        "weather_condition": "แดดร้อนจัด อากาศแห้งแล้ง",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "ตัวร้อนจัด ปวดเมื่อยตามตัว ครั่นเนื้อครั่นตัว ปวดศีรษะ กระหายน้ำ 2 วัน",
      "vitals": {
        "btemp": 38.5,
        "sbp": 124,
        "dbp": 78,
        "pr": 98,
        "rr": 20,
        "weight_kg": 73.0,
        "height_cm": 175.0,
        "bmi": 23.8
      },
      "symptoms": ["ไข้สูง 38.5C", "ปวดศีรษะ", "ปวดเมื่อยตัว", "กระหายน้ำ", "เตโชธาตุกำเริบ"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-028",
        "generic_name": "Paracetamol",
        "brand_name": "Sara 500mg",
        "dosage_form": "Tablet",
        "strength_mg": 500.0,
        "dose_per_admin_mg": 500.0,
        "frequency_per_day": 4,
        "timing": "ทุก 4-6 ชั่วโมง เมื่อมีไข้",
        "days": 3,
        "calculated_daily_dose_mg": 2000.0,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000452159102011410",
      "herb_name": "ยาจันทน์ลีลา",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "ก่อนอาหาร เช้า-กลางวัน-เย็น",
      "days": 3,
      "total_dispensed": 18,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง ก่อนอาหาร เพื่อลดไข้ถอนพิษไข้",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007740",
      "name": "พอกยาหรือทายาสมุนไพรเฉพาะที่",
      "fee": 100.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ระวังใช้ร่วมกับพาราเซตามอลเกินขนาด",
      "smutthan_dominant": "มัชฌิมวัย สันตัปปัคคีและเตโชธาตุกำเริบจัดจากพิษไข้ในสภาพอากาศร้อนจัด"
    }
  },
  {
    "case_id": "C29",
    "patient_info": {
      "hn": "HN-DEMO-029",
      "name": "นางสาวศิรินทร์ ชัยมงคล (ข้อมูลสังเคราะห์)",
      "gender": "หญิง",
      "sex_code": "2",
      "age": 23,
      "birth_date": "2003-06-18",
      "province": "กรุงเทพมหานคร",
      "province_code": "10",
      "region": "กรุงเทพฯ และปริมณฑล",
      "occupation": "นักศึกษาปริญญาโท",
      "birth_element": "เตโชธาตุ (ราศีมิถุน)"
    },
    "current_encounter": {
      "vn": "VN25690618029",
      "date": "2026-06-18",
      "time": "14:45:00",
      "season": "วสันตฤดู (ฤดูฝน)",
      "ambient_context": {
        "location": "กรุงเทพมหานคร",
        "latitude": 13.7563,
        "longitude": 100.5018,
        "temperature_c": 34.0,
        "relative_humidity": 70,
        "weather_condition": "แดดร้อนอบอ้าว ก่อนฝนตก",
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
      },
      "chief_complaint": "มีแผลร้อนในในปากและลิ้น เจ็บแสบเวลาทานอาหาร ปากแห้ง คอแห้ง พักผ่อนน้อย 4 วัน",
      "vitals": {
        "btemp": 37.0,
        "sbp": 112,
        "dbp": 72,
        "pr": 74,
        "rr": 16,
        "weight_kg": 49.0,
        "height_cm": 161.0,
        "bmi": 18.9
      },
      "symptoms": ["แผลร้อนในในปาก", "เจ็บแสบลิ้น", "กระหายน้ำ", "เตโชกำเริบในช่องปาก"]
    },
    "chronic_diseases": [],
    "current_medications": [
      {
        "drug_id": "MED-CONV-029",
        "generic_name": "Triamcinolone acetonide oral paste",
        "brand_name": "Kanolone 0.1%",
        "dosage_form": "Paste",
        "strength_mg": 1.0,
        "dose_per_admin_mg": 1.0,
        "frequency_per_day": 2,
        "timing": "ป้ายแผลในปาก หลังอาหารเช้า-ก่อนนอน",
        "days": 5,
        "calculated_daily_dose_mg": 2.0,
        "route": "Topical"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000452159102011410",
      "herb_name": "ยาแคปซูลบัวบก",
      "dose_per_admin": 1,
      "unit": "แคปซูล (400 มก.)",
      "frequency_per_day": 3,
      "timing": "หลังอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 21,
      "calculated_daily_dose_units": 3,
      "calculated_daily_dose_mg": 1200,
      "instruction": "รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง หลังอาหาร เพื่อขับความร้อนและสมานแผล",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007740",
      "name": "พอกยาหรือทายาสมุนไพรเฉพาะที่",
      "fee": 80.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ไม่มีข้อมูล / ไม่พบปฏิกิริยา",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ช่วยสมานแผลและลดการอักเสบ",
      "smutthan_dominant": "มัชฌิมวัย ปริทัยหัคคีกำเริบทำให้อาโปธาตุในช่องปากแห้ง เกิดแผลร้อนใน"
    }
  },
  {
    "case_id": "C30",
    "patient_info": {
      "hn": "HN-DEMO-030",
      "name": "นายสมบูรณ์ พิทักษ์ธรรม (ข้อมูลสังเคราะห์)",
      "gender": "ชาย",
      "sex_code": "1",
      "age": 61,
      "birth_date": "1965-12-08",
      "province": "พิษณุโลก",
      "province_code": "65",
      "region": "ภาคเหนือ",
      "occupation": "เกษตรกร",
      "birth_element": "อาโปธาตุ (ราศีธนู)"
    },
    "current_encounter": {
      "vn": "VN25691208030",
      "date": "2026-12-08",
      "time": "10:30:00",
      "season": "เหมันตฤดู (ฤดูหนาว)",
      "ambient_context": {
        "location": "พิษณุโลก",
        "latitude": 16.8211,
        "longitude": 100.2659,
        "temperature_c": 21.0,
        "relative_humidity": 66,
        "weather_condition": "ลมหนาวพัดโกรก อากาศแห้งเย็น",
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
      },
      "chief_complaint": "ข้อเข่าขวาบวม แดง ร้อน มีน้ำในข้อ ลมจับโปงน้ำเข่า ยืนเดินลำบาก ปวดตึง 5 วัน",
      "vitals": {
        "btemp": 37.4,
        "sbp": 136,
        "dbp": 84,
        "pr": 76,
        "rr": 18,
        "weight_kg": 74.0,
        "height_cm": 169.0,
        "bmi": 25.9
      },
      "symptoms": ["ข้อเข่าบวมแดง", "ร้อนในข้อ", "ลมจับโปงน้ำ", "มีน้ำในข้อ", "ขัดข้อ"]
    },
    "chronic_diseases": [
      { "icd10": "M17.1", "name": "Other primary osteoarthritis of knee", "diag_date": "2021-12-01" }
    ],
    "current_medications": [
      {
        "drug_id": "MED-CONV-030",
        "generic_name": "Meloxicam",
        "brand_name": "Mobic 7.5mg",
        "dosage_form": "Tablet",
        "strength_mg": 7.5,
        "dose_per_admin_mg": 7.5,
        "frequency_per_day": 1,
        "timing": "หลังอาหารเช้าทันที",
        "days": 7,
        "calculated_daily_dose_mg": 7.5,
        "route": "Oral"
      }
    ],
    "intended_ttm_prescription": {
      "drug_code_24": "420000000414019120011409",
      "herb_name": "ยาประสะไพล",
      "dose_per_admin": 2,
      "unit": "แคปซูล (500 มก.)",
      "frequency_per_day": 3,
      "timing": "ก่อนอาหาร เช้า-กลางวัน-เย็น",
      "days": 7,
      "total_dispensed": 42,
      "calculated_daily_dose_units": 6,
      "calculated_daily_dose_mg": 3000,
      "instruction": "รับประทานครั้งละ 2 แคปซูล วันละ 3 ครั้ง ก่อนอาหาร",
      "is_overdose_demo": False
    },
    "planned_procedure": {
      "code": "9007740",
      "name": "พอกยาหรือทายาสมุนไพรเฉพาะที่ (พอกเข่าสูตรเย็น)",
      "fee": 150.0
    },
    "expected_demo_outcome": {
      "interaction_level": "ต่ำ",
      "interaction_count": 0,
      "dosage_warning": "ขนาดยาปกติ ปลอดภัย",
      "smutthan_dominant": "ปัจฉิมวัย ลมจับโปงน้ำเข่า อาโปธาตุคั่งค้างในข้อร่วมกับเตโชธาตุกำเริบเฉพาะที่"
    }
  }
]

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
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
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
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
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
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
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
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
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
        "kala_period": "15:00 - 18:00 (วาตะกาล)"
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
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
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
        "kala_period": "15:00 - 18:00 (วาตะกาล)"
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
        "kala_period": "12:00 - 15:00 (ปิตตะกาล)"
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
        "kala_period": "06:00 - 09:00 (เสมหะกาล)"
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
        "kala_period": "09:00 - 12:00 (โลหิตกาล)"
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
  }] + NEW_CASES

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
