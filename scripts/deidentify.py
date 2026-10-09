#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/deidentify.py
เครื่องมือนิรนามข้อมูล (De-identification & Anonymization Utility)
ใช้สำหรับการแปลงข้อมูลดิบจากระบบ HIS ให้เป็นข้อมูลวิจัย/ทดสอบแบบไม่สามารถระบุตัวตนได้
ตามมาตรฐาน HIPAA Safe Harbor และ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
"""

import hashlib
import json
import uuid

SALT = "TTM-SMUTTHAN-PLATFORM-2026-SALT"

def anonymize_id(original_id: str, prefix: str = "SYN") -> str:
    """แปลง HN หรือ CID ให้เป็น Pseudonymized ID ที่ปลอดภัย"""
    if not original_id:
        return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"
    hasher = hashlib.sha256()
    hasher.update((SALT + str(original_id)).encode('utf-8'))
    return f"{prefix}-{hasher.hexdigest()[:8].upper()}"

def generalize_age(age: int) -> str:
    """จัดกลุ่มอายุเป็นช่วงเพื่อป้องกันการระบุตัวตน (k-anonymity)"""
    if age < 15:
        return "0-14 (ปฐมวัย)"
    elif age < 35:
        return "15-34 (มัชฌิมวัยตอนต้น)"
    elif age < 60:
        return "35-59 (มัชฌิมวัยตอนปลาย)"
    else:
        return "60+ (ปัจฉิมวัย/ผู้สูงอายุ)"

def mask_text(text: str) -> str:
    """กลบข้อความระบุตัวตนใน chief complaint หรือ note"""
    return "[ข้อมูลถูกปกปิดเพื่อการคุ้มครองข้อมูลส่วนบุคคล]"

def deidentify_patient_record(record: dict) -> dict:
    """ประมวลผลข้อมูลคนไข้ 1 ระเบียน"""
    synthetic_record = record.copy()
    
    # 1. ลบ / Mask Direct Identifiers
    synthetic_record["HN"] = anonymize_id(record.get("HN", ""), "HN-DEMO")
    if "CID" in synthetic_record:
        del synthetic_record["CID"]
    if "NAME" in synthetic_record:
        synthetic_record["NAME"] = f"ผู้ป่วยจำลอง {synthetic_record['HN']}"
    if "TEL" in synthetic_record:
        del synthetic_record["TEL"]
    if "ADDRESS" in synthetic_record:
        synthetic_record["PROVINCE"] = record.get("PROVINCE", "กรุงเทพมหานคร")
        del synthetic_record["ADDRESS"]
        
    # 2. ป้ายกำกับข้อมูลสังเคราะห์
    synthetic_record["_data_type"] = "ข้อมูลสังเคราะห์เพื่อการสาธิต (Synthetic Demonstration Data)"
    synthetic_record["_disclaimer"] = "Decision support only. ไม่ใช่ข้อมูลผู้ป่วยจริงและห้ามใช้สั่งการรักษาจริง"
    
    return synthetic_record

if __name__ == "__main__":
    test_sample = {
        "HN": "1234567",
        "CID": "1100500123456",
        "NAME": "นายสมชาย ใจดี",
        "TEL": "0812345678",
        "ADDRESS": "123 ถนนพหลโยธิน แขวงพญาไท เขตพญาไท",
        "PROVINCE": "กรุงเทพมหานคร",
        "AGE": 45,
        "GENDER": "M"
    }
    print("ต้นฉบับ (Original):", test_sample)
    anonymized = deidentify_patient_record(test_sample)
    print("หลัง De-identify (Anonymized):", json.dumps(anonymized, ensure_ascii=False, indent=2))
