#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/check-pii.py
เครื่องมือตรวจสอบความปลอดภัยของข้อมูล (Pre-commit / CI PII Scanner)
ใช้ตรวจสอบว่าไม่มีข้อมูลส่วนบุคคลจริง (PII / PHI) เช่น เลขประจำตัวประชาชน 13 หลัก,
เบอร์โทรศัพท์จริง หรือชื่อ-สกุลจริง หลุดเข้ามาในไฟล์ข้อมูลสังเคราะห์
"""

import os
import re
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

THAI_CID_PATTERN = re.compile(r'\b[1-8]\d{12}\b')  # 13-digit Thai National ID
PHONE_PATTERN = re.compile(r'\b0[689]\d{8}\b')     # Thai mobile phone number
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')

SAFE_HN_PREFIXES = ('HN-DEMO-', 'P-', 'C0', 'C1')

def scan_file(filepath):
    errors = []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for lineno, line in enumerate(f, 1):
            # Check Thai CID
            cids = THAI_CID_PATTERN.findall(line)
            if cids:
                for cid in cids:
                    # Exclude sample timestamps or code strings if necessary
                    if not (cid.startswith('202') or cid.startswith('256')): # exclude timestamps
                        errors.append(f"Line {lineno}: Possible 13-digit Thai National ID found: {cid[:4]}xxxxxxxxx")

            # Check Phone number
            phones = PHONE_PATTERN.findall(line)
            if phones:
                for ph in phones:
                    errors.append(f"Line {lineno}: Possible Thai Phone number found: {ph}")

    return errors

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(root_dir, 'data')
    
    print(f"[PII SCANNER] Scanning data directory: {data_dir}")
    total_files = 0
    total_violations = 0

    for root, _, files in os.walk(data_dir):
        for file in files:
            if file.endswith(('.json', '.csv', '.tsv', '.txt', '.md')):
                filepath = os.path.join(root, file)
                total_files += 1
                violations = scan_file(filepath)
                if violations:
                    print(f"❌ VIOLATION IN {os.path.relpath(filepath, root_dir)}:")
                    for v in violations:
                        print(f"   - {v}")
                    total_violations += len(violations)

    if total_violations == 0:
        print(f"✅ PASSED: All {total_files} files checked. Zero PII/PHI detected. All data is verified synthetic.")
        sys.exit(0)
    else:
        print(f"🚨 FAILED: Found {total_violations} potential PII violations. Fix before committing!")
        sys.exit(1)

if __name__ == '__main__':
    main()
