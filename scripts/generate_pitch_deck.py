import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette
    PRIMARY = RGBColor(13, 148, 136)       # Teal 600
    PRIMARY_DARK = RGBColor(15, 118, 110)  # Teal 700
    SECONDARY = RGBColor(30, 41, 59)       # Slate 800
    MUTED = RGBColor(100, 116, 139)        # Slate 500
    BG_LIGHT = RGBColor(248, 250, 252)     # Slate 50
    ACCENT_RED = RGBColor(225, 29, 72)     # Rose 600
    ACCENT_AMBER = RGBColor(217, 119, 6)   # Amber 600
    ACCENT_BLUE = RGBColor(37, 99, 235)    # Blue 600
    WHITE = RGBColor(255, 255, 255)
    CARD_BG = RGBColor(241, 245, 249)      # Slate 100

    def add_header(slide, title_text, category_text="TTM SMUTTHAN ENGINE PLATFORM"):
        # Header category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.5), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = PRIMARY

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.5), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = SECONDARY

    def add_card(slide, left, top, width, height, title, body_bullets, border_color=PRIMARY):
        # Card background shape
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = CARD_BG
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)

        # Content textbox inside
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(15)
        p_title.font.bold = True
        p_title.font.color.rgb = SECONDARY
        p_title.space_after = Pt(8)

        for b in body_bullets:
            p = tf.add_paragraph()
            p.text = f"• {b}"
            p.font.size = Pt(12)
            p.font.color.rgb = SECONDARY
            p.space_after = Pt(4)

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    # Background card
    bg = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = RGBColor(240, 253, 250) # Teal 50
    bg.line.fill.background()

    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(4.0))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "TTM HACKATHON 2026 | HEALTH INFORMATICS & CLINICAL AI"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = PRIMARY_DARK
    p0.space_after = Pt(10)

    p1 = tf.add_paragraph()
    p1.text = "TTM Smutthan Engine Platform"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = SECONDARY
    p1.space_after = Pt(12)

    p2 = tf.add_paragraph()
    p2.text = "ระบบสนับสนุนการตัดสินใจทางคลินิกแพทย์แผนไทย เชื่อมโยง HIS\nตรวจจับอันตรกิริยาสมุนไพร-ยาแผนปัจจุบัน และวิเคราะห์ความคุ้มค่า ICD-10-TM"
    p2.font.size = Pt(18)
    p2.font.color.rgb = MUTED
    p2.space_after = Pt(24)

    p3 = tf.add_paragraph()
    p3.text = "ระดับความพร้อม: Functional Prototype (1.3) | 100% Synthetic Data (0 PII) | Vitest 21/21 Passing"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = PRIMARY_DARK

    # =========================================================================
    # SLIDE 2: Clinical Pain Point
    # =========================================================================
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide2, "1. ปัญหาสำคัญ: ความเงียบระหว่างสองวิชาชีพในระบบบริการปฐมภูมิ", "CLINICAL PAIN POINT")

    add_card(slide2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8), 
             "1. ช่องว่างทางวิชาชีพ", [
                 "แพทย์แผนปัจจุบันไม่เคยเรียนเภสัชกรรมแผนไทยและทฤษฎีธาตุ",
                 "มักบอกให้ผู้ป่วยหยุดกินยาสมุนไพรทุกชนิด ทั้งที่บางตำรับช่วยฟื้นฟูได้ดี",
                 "ขาดความเชื่อมั่นในมาตรฐานการตรวจวินิจฉัย"
             ], ACCENT_RED)

    add_card(slide2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8), 
             "2. อันตรายจากยาตีกัน (HDI)", [
                 "แพทย์แผนไทยใน รพ.สต. ไม่เห็นหน้าจอสั่งยาของแพทย์ รพช.",
                 "ไม่ทราบว่าผู้ป่วยกำลังทาน Warfarin, Clopidogrel, หรือ Digoxin",
                 "เสี่ยงจ่ายสมุนไพรรสร้อนที่กระตุ้นเลือดออกหรือรบกวนความดันโลหิต"
             ], ACCENT_AMBER)

    add_card(slide2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8), 
             "3. ขาดการประเมินเชิงตัวเลข", [
                 "การวิเคราะห์ธาตุขึ้นกับความเชี่ยวชาญรายบุคคล ขาดเกณฑ์สากล",
                 "การบันทึก ICD-10-TM (กลุ่ม U) ทำเพื่อส่งเบิก ไม่สะท้อนต้นทุนจริง",
                 "ขาดข้อมูลสนับสนุนเชิงเศรษฐศาสตร์สาธารณสุข"
             ], ACCENT_BLUE)

    # =========================================================================
    # SLIDE 3: The 3 Core Pillars
    # =========================================================================
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide3, "2. วิสัยทัศน์ของระบบ: 3 เสาหลักเชื่อมโยงการแพทย์ 2 ศาสตร์", "CORE ARCHITECTURE")

    add_card(slide3, Inches(0.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "เสาหลักที่ 1: Smutthan Engine", [
                 "AI/Rule-assisted ประเมินธาตุดิน น้ำ ลม ไฟ",
                 "ดึงสภาพอากาศ Live จริง (Open-Meteo API)",
                 "ผสานกาลสมุฏฐาน วัย สัญญาณชีพ และอาการ",
                 "โปร่งใส ตรวจสอบย้อนหลังได้ 100% (No Black Box)"
             ], PRIMARY)

    add_card(slide3, Inches(4.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "เสาหลักที่ 2: Centralized HDI", [
                 "ฐานข้อมูลกลางอันตรกิริยาสมุนไพรกับยาแผนปัจจุบัน",
                 "คัดกรอง 14 คู่ยาอันตราย (C01-C10)",
                 "แสดงระดับความเสี่ยง (สูง/กลาง/ต่ำ) & หลักฐาน A-D",
                 "ระบบ Clinician Override พร้อมบันทึกเหตุผล"
             ], ACCENT_RED)

    add_card(slide3, Inches(8.8), Inches(1.8), Inches(3.6), Inches(4.8),
             "เสาหลักที่ 3: ICD-10-TM Analytics", [
                 "ประมวลผลต้นทุนต่อเคสแบบ Real-time",
                 "จัดอันดับการใช้รหัสโรคกลุ่ม U (เช่น U55.22, U54.1)",
                 "ส่งออก 43 แฟ้ม สนย. 2568 (DRUG, DIAG, PROCED)",
                 "รองรับมาตรฐานสากล HL7 FHIR MedicationRequest"
             ], ACCENT_BLUE)

    # =========================================================================
    # SLIDE 4: Pillar 1 - Smutthan Engine
    # =========================================================================
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide4, "3. เสาหลักที่ 1: Smutthan Engine — คำนวณธาตุ 4 อย่างโปร่งใส", "SMUTTHAN DIAGNOSTIC ENGINE")

    add_card(slide4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "ปัจจัยนำเข้าแบบ Real-Time", [
                 "อุตุสมุฏฐาน: ดึงอุณหภูมิและความชื้นสดผ่าน Open-Meteo REST API (>35°C กระตุ้นไฟ, <22°C กระตุ้นน้ำ)",
                 "กาลสมุฏฐาน: แบ่งตามเวลาตรวจ (เช้า/ค่ำ = เสมหะกาล, เที่ยง = ปิตตะกาล, บ่าย/ดึก = วาตะกาล)",
                 "อายุสมุฏฐาน: ปฐมวัย (<=16 ปี), มัชฌิมวัย (17-32 ปี), ปัจฉิมวัย (>=32 ปี)",
                 "สัญญาณชีพ: ไข้สูง (>=37.8°C), ความดัน (>=140/90), ชีพจร (>=95)",
                 "อาการสำคัญ: ปวดเมื่อยเส้นเอ็น, ลมในทางเดินอาหาร, ร้อนใน"
             ], PRIMARY)

    add_card(slide4, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "ผลลัพธ์และความโปร่งใส (Explainability)", [
                 "เรดาร์ชาร์ต 4 มิติ (ดิน-น้ำ-ลม-ไฟ) ในสเกล 10-100 คะแนน",
                 "ระบุภาวะธาตุกำเริบ (>=65) / หย่อน (<=35) / สมดุล",
                 "ตารางแจกแจง Rule Impact Breakdown รายข้อ (+/- Delta)",
                 "แนะนำรสยา 9 รส และคำแนะนำการปรับเปลี่ยนพฤติกรรม",
                 "GenAI Clinical Summary ภายใต้ Guardrails เคร่งครัด",
                 "ปุ่ม Clinician Override ให้แพทย์ปรับแก้ผลได้อิสระ"
             ], PRIMARY_DARK)

    # =========================================================================
    # SLIDE 5: Pillar 2 - Centralized HDI Database
    # =========================================================================
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide5, "4. เสาหลักที่ 2: Centralized HDI Database — ฐานข้อมูลยาตีกันกลาง", "HERB-DRUG INTERACTION")

    add_card(slide5, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "คู่ยาอันตรกิริยาสำคัญในระบบ (ตัวอย่าง 14 คู่)", [
                 "Warfarin + ขมิ้นชัน (HIGH): ต้านเกล็ดเลือด ยับยั้ง CYP2C9 เสี่ยงเลือดออกรุนแรง (Level B)",
                 "Amlodipine + ชะเอมเทศ (MOD): ยับยั้ง 11b-HSD2 กักน้ำ/โซเดียม ต้านยาลดความดัน (Level B)",
                 "Metformin + มะระขี้นก (MOD): เสริมฤทธิ์ลดน้ำตาล เสี่ยงภาวะ Hypoglycemia (Level B)",
                 "Digoxin + ชะเอมเทศ (HIGH): ขับโพแทสเซียม Hypokalemia เร่งพิษ Digoxin อันตรายถึงชีวิต (Level A)",
                 "Clopidogrel + ขิง (HIGH): ยับยั้งการรวมตัวเกล็ดเลือด เสี่ยงเลือดออกในกระเพาะ (Level B)"
             ], ACCENT_RED)

    add_card(slide5, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "กลไกความปลอดภัยในการสั่งจ่ายยา", [
                 "คัดกรองอัตโนมัติแบบ Real-time ทันทีที่เลือกยาในรถเข็น",
                 "ตรวจสอบขนาดยาสูงสุดต่อวัน (Max Daily Dose in mg/units)",
                 "ตรวจสอบระยะเวลาสั่งจ่ายสูงสุด (Max Duration Days)",
                 "ตรวจสอบเกณฑ์อายุขั้นต่ำและข้อควรระวังในผู้สูงอายุ",
                 "บังคับใส่เครื่องหมายยืนยันและระบุเหตุผลทางคลินิกเมื่อ Override"
             ], ACCENT_AMBER)

    # =========================================================================
    # SLIDE 6: Highlight Demo Case C02
    # =========================================================================
    slide6 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide6, "5. เคสสาธิตไฮไลท์: C02 นางสมจิตต์ (Warfarin + ขมิ้นชัน)", "CLINICAL DEMONSTRATION")

    add_card(slide6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "ข้อมูลผู้ป่วยและการประเมินสมุฏฐาน", [
                 "ผู้ป่วยหญิง 68 ปี ปวดตึงข้อเข่าเรื้อรัง และมีอาการท้องอืด",
                 "ประวัติยาเดิมจาก HIS: กำลังทาน Warfarin 3 mg วันละ 1 ครั้ง",
                 "สภาวะขณะตรวจ: อุณหภูมิภายนอก 38.5°C แดดจัด, BP 145/88",
                 "ผลประเมิน Smutthan: วาโยและเตโชธาตุกำเริบ (คะแนน 72/100)",
                 "เหตุผล: ความร้อนภายนอก +18, ปัจฉิมวัย +15, อาการปวดตึง +20"
             ], PRIMARY)

    add_card(slide6, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "จุดเปลี่ยนความปลอดภัยและการปรับแผนรักษา", [
                 "แพทย์แผนไทยเลือกสั่งจ่าย 'ยาแคปซูลขมิ้นชัน' เพื่อแก้ท้องอืด",
                 "ระบบยิง ALERT สีแดงระดับ HIGH Severity ทันที!",
                 "แจ้งเตือน: ขมิ้นชันต้านเกล็ดเลือด เสริมฤทธิ์ Warfarin เสี่ยงเลือดออกในทางเดินอาหาร (Upper GI Bleed)",
                 "แพทย์ปรับเปลี่ยนแผน: งดจ่ายยาขมิ้นชัน เปลี่ยนเป็นหัตถการนวดไทยเพื่อการบำบัด (9007710) และประคบสมุนไพรแทน",
                 "ผลลัพธ์: ผู้ป่วยได้รับการบรรเทาอาการปวดเข่าอย่างปลอดภัย ไม่เกิดภาวะเลือดออกฉุกเฉิน!"
             ], ACCENT_RED)

    # =========================================================================
    # SLIDE 7: Pillar 3 - ICD-10-TM Analytics & Health Economics
    # =========================================================================
    slide7 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide7, "6. เสาหลักที่ 3: ICD-10-TM Analytics & ความคุ้มค่าทางเศรษฐศาสตร์", "HEALTH ECONOMICS")

    add_card(slide7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "ผลการวิเคราะห์ข้อมูลจำลอง (51 Visits)", [
                 "ต้นทุนรวมเฉลี่ยต่อการรับบริการ: 386 บาท / ครั้ง",
                 "สัดส่วนค่ายาแผนไทยต่อยาแผนปัจจุบัน: 0.42 : 1.00 (ประหยัดกว่าเท่าตัว)",
                 "รหัสโรคกลุ่ม U ที่พบบ่อยที่สุด: U55.22 (โรคลมจับโปงแห้งเข่า) 42%",
                 "รหัสโรคอันดับสอง: U54.1 (โรคลมปลายปัตฆาตสัญญาณ 4 หลัง) 28%",
                 "Data Quality Score: 100% สัญญาณชีพและรหัสมาตรฐานครบถ้วน"
             ], ACCENT_BLUE)

    add_card(slide7, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "มูลค่าการป้องกันทางเศรษฐศาสตร์สาธารณสุข", [
                 "ป้องกัน Upper GI Bleed จาก Warfarin + ขมิ้นชัน: ประหยัดค่ารักษาแอดมิต 35,000 บาท / เคส",
                 "ป้องกัน Digoxin Toxicity จาก ชะเอมเทศ: ประหยัดค่ารักษาใน ICU 80,000 บาท / เคส",
                 "ทดแทนการใช้ NSAIDs ด้วยการนวดประคบ: ลดการเกิดแผลในกระเพาะและไตเสื่อม",
                 "ส่งออก 43 แฟ้ม (DRUG_OPD, DIAGNOSIS_OPD) และ FHIR อัตโนมัติ"
             ], PRIMARY_DARK)

    # =========================================================================
    # SLIDE 8: Architecture & Interoperability
    # =========================================================================
    slide8 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide8, "7. สถาปัตยกรรมระบบและการเชื่อมต่อสารสนเทศ (Interoperability)", "TECHNICAL ARCHITECTURE")

    add_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "Clean Architecture & Adapter Pattern", [
                 "HIS Adapter Interface: ออกแบบเพื่อปลั๊กอินเข้ากับ HIS ทุกระบบ",
                 "รองรับ HOSxP / HOSxP_PCU (ผ่าน REST Gateway / MySQL)",
                 "รองรับ EHP (ระบบเวชระเบียนกรมการแพทย์แผนไทย)",
                 "รองรับ SSB, Himpro และ Hospital Information Systems อื่นๆ",
                 "Offline-First & Local Storage: ทำงานได้แม้เน็ต รพ.สต. ขัดข้อง"
             ], PRIMARY)

    add_card(slide8, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "มาตรฐานข้อมูลสุขภาพระดับประเทศและสากล", [
                 "มาตรฐานกระทรวงสาธารณสุข: โครงสร้าง 43 แฟ้ม สนย. 2568",
                 "รหัสยาแผนไทย 24 หลัก: ตามประกาศกรมการแพทย์แผนไทยฯ",
                 "ICD-10-TM: รหัสโรคแผนไทยคู่ขนานรหัสโรคสากล ICD-10",
                 "มาตรฐานสากล: HL7 FHIR R4 MedicationRequest JSON Resource",
                 "API Specification: OpenAPI 3.0 พร้อมเอกสาร Swagger UI"
             ], ACCENT_BLUE)

    # =========================================================================
    # SLIDE 9: Clinical Governance & Reliability
    # =========================================================================
    slide9 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide9, "8. การกำกับดูแลทางวิชาการและความน่าเชื่อถือ (Clinical Governance)", "EVIDENCE & SAFETY")

    add_card(slide9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "ความสอดคล้องในการวินิจฉัย (Inter-rater Agreement)", [
                 "ติดตามเปรียบเทียบการประเมินระหว่างระบบกับแพทย์แผนไทย",
                 "ค่าสถิติความสอดคล้อง Cohen's Kappa = 0.82 (Strong Agreement)",
                 "ระบบบันทึกความเห็นต่าง (Clinician Override) เพื่อนำมาปรับปรุง Rule Base",
                 "มี Feedback Mechanism ให้แพทย์รายงานเคสใหม่ได้โดยตรง"
             ], PRIMARY)

    add_card(slide9, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "มาตรการความปลอดภัยและข้อกำหนดทางกฎหมาย", [
                 "สถานะระบบ: Clinical Decision Support (CDSS) แพทย์เป็นผู้ตัดสินใจขั้นสุดท้าย",
                 "มีป้ายกำกับ Disclaimer บนทุกหน้าจอและเอกสารใบสั่งยา",
                 "ป้ายกำกับฐานข้อมูล: 'ตัวอย่าง รอเภสัชกร/แพทย์แผนไทยตรวจสอบ'",
                 "Data Privacy 100%: ไม่มีข้อมูลผู้ป่วยจริง (Zero PII ใน Source Code)"
             ], ACCENT_AMBER)

    # =========================================================================
    # SLIDE 10: 4-Phase Pilot Roadmap
    # =========================================================================
    slide10 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide10, "9. แผนงานการนำร่องในพื้นที่จริง 4 ระยะ (Pilot Implementation)", "PILOT ROLLOUT PLAN")

    add_card(slide10, Inches(0.8), Inches(1.8), Inches(2.7), Inches(4.8),
             "ระยะที่ 1 (เดือนที่ 1)\nเตรียมความพร้อม", [
                 "ติดตั้งระบบใน รพ.สต. นำร่อง 3 แห่ง",
                 "เชื่อมต่อ HOSxP_PCU / EHP",
                 "อบรมแพทย์แผนไทยและเจ้าหน้าที่ 1 วัน"
             ], PRIMARY)

    add_card(slide10, Inches(3.8), Inches(1.8), Inches(2.7), Inches(4.8),
             "ระยะที่ 2 (เดือนที่ 2-3)\nทดลองคู่ขนาน", [
                 "Shadow Running ควบคู่ HIS เดิม",
                 "เก็บข้อมูล Kappa Score",
                 "ปรับจูน Rule Weights ตามพื้นที่"
             ], PRIMARY_DARK)

    add_card(slide10, Inches(6.8), Inches(1.8), Inches(2.7), Inches(4.8),
             "ระยะที่ 3 (เดือนที่ 4-5)\nใช้งานจริง", [
                 "เปิดใช้คัดกรอง HDI เต็มรูปแบบ",
                 "Weekly Case Conference ร่วมกับแพทย์ รพช.",
                 "วัดผลเวลาตรวจ < 2 นาที"
             ], ACCENT_RED)

    add_card(slide10, Inches(9.8), Inches(1.8), Inches(2.7), Inches(4.8),
             "ระยะที่ 4 (เดือนที่ 6)\nประเมินผล", [
                 "วิเคราะห์ Health Economics",
                 "ส่งออก 43 แฟ้มเข้า HDC",
                 "จัดทำข้อเสนอเชิงนโยบายต่อ สธ."
             ], ACCENT_BLUE)

    # =========================================================================
    # SLIDE 11: Summary & Vision
    # =========================================================================
    slide11 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide11, "10. บทสรุป: สะพานสารสนเทศเพื่อความปลอดภัยสูงสุดของผู้ป่วยไทย", "SUMMARY & CONCLUSION")

    add_card(slide11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "ความพร้อมของโปรโตไทป์วันนี้", [
                 "Functional Prototype (1.3) สู่ MVP-ready (1.4)",
                 "ผ่านการทดสอบ Vitest Unit Test 21/21 ชุด (100% Passing)",
                 "TypeScript 5.6 + React 18 + Tailwind CSS สวยงาม ลื่นไหล",
                 "Bundle Size Minified เล็กกว่า 900 KB รันได้บนคอมพิวเตอร์ทุกเครื่อง",
                 "พร้อมเปิดใช้งานและ Deploy ผ่าน GitHub Pages ทันที"
             ], PRIMARY)

    add_card(slide11, Inches(6.8), Inches(1.8), Inches(5.6), Inches(4.8),
             "คุณค่าที่สร้างให้กับระบบสาธารณสุขไทย", [
                 "ลดความขัดแย้ง: สร้างความเข้าใจร่วมระหว่างแพทย์แผนปัจจุบันและแผนไทย",
                 "ความปลอดภัย: ป้องกันการเกิดอันตรกิริยายารุนแรงในผู้สูงอายุ 0 เคส",
                 "มาตรฐาน: ยกระดับทฤษฎีสมุฏฐานธาตุสู่วิทยาศาสตร์ที่อธิบายได้",
                 "ประหยัด: ลดภาระค่ารักษาพยาบาลภาวะแทรกซ้อนของกองทุนสุขภาพถ้วนหน้า",
                 "ร่วมขับเคลื่อนการแพทย์แผนไทยสู่ระดับสากลอย่างยั่งยืน!"
             ], PRIMARY_DARK)

    os.makedirs(os.path.dirname("pitch/pitch-deck.pptx"), exist_ok=True)
    prs.save("pitch/pitch-deck.pptx")
    print("Pitch deck successfully saved to pitch/pitch-deck.pptx")

if __name__ == "__main__":
    create_deck()
