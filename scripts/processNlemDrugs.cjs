const fs = require('fs');
const path = require('path');

// 1. Read existing conventional drugs to preserve compatibility
const existingPath = path.join(__dirname, '..', 'data', 'master', 'conventional-drugs.json');
let existingDrugs = [];
if (fs.existsSync(existingPath)) {
  try {
    existingDrugs = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  } catch (e) {
    console.error('Error reading existing conventional drugs:', e);
  }
}

// 2. Read downloaded CSV
const csvPath = path.join(__dirname, '..', 'data_nlem_download.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

function parseLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length >= header.length) {
      const obj = {};
      header.forEach((h, idx) => obj[h] = values[idx] || '');
      rows.push(obj);
    }
  }
  return rows;
}

const csvRows = parseCSV(csvContent);
console.log(`Parsed ${csvRows.length} CSV rows from official NLEM file`);

function determineRoute(dosage) {
  const d = (dosage || '').toLowerCase();
  if (d.includes('tab') || d.includes('cap') || d.includes('oral') || d.includes('susp') || d.includes('syr') || d.includes('mixt') || d.includes('sol') && !d.includes('sterile')) {
    return 'Oral';
  }
  if (d.includes('inj') || d.includes('sterile') || d.includes('infusion')) {
    return 'Injection';
  }
  if (d.includes('cream') || d.includes('ointment') || d.includes('gel') || d.includes('lotion') || d.includes('paste')) {
    return 'Topical';
  }
  if (d.includes('eye')) {
    return 'Ophthalmic';
  }
  if (d.includes('ear')) {
    return 'Otic';
  }
  if (d.includes('nasal') || d.includes('inhal') || d.includes('resp')) {
    return 'Inhalation';
  }
  return 'Oral';
}

function parseDoseMg(strength) {
  if (!strength || strength === '-') return 10;
  const match = strength.match(/(\d+(?:\.\d+)?)\s*mg/i);
  if (match) return parseFloat(match[1]);
  const numMatch = strength.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) return parseFloat(numMatch[1]);
  return 10;
}

// Map CSV rows into system NLEM items
const nlemItems = csvRows.map((row, idx) => {
  const generic = row.generic_name.replace(/"/g, '').trim();
  const dosage = row.dosage.replace(/"/g, '').trim();
  const strength = row.strength_salt.replace(/"/g, '').trim();
  const category = (row['บัญชีย่อยใหม่'] || row['บัญชีย่อยเดิม'] || 'ก').trim();
  const group = row.group_name.trim();
  const subgroup = row.subgroup1_name.trim();
  const warnings = row['คำเตือน/ข้อควรระวัง'] ? row['คำเตือน/ข้อควรระวัง'].replace(/"/g, '').trim() : '';
  const conditions = row['เงื่อนไข'] ? row['เงื่อนไข'].replace(/"/g, '').trim() : '';
  const notes = row['หมายเหตุ'] ? row['หมายเหตุ'].replace(/"/g, '').trim() : '';
  const gazette = row['ประกาศราชกิจจาฯ'] ? row['ประกาศราชกิจจาฯ'].trim() : '30 Mar 26';

  const route = determineRoute(dosage);
  const doseMg = parseDoseMg(strength);

  // Clean brand name examples for common drugs
  const brandNames = [];
  const genLower = generic.toLowerCase();
  if (genLower.includes('warfarin')) brandNames.push('Orfarin');
  else if (genLower.includes('aspirin')) brandNames.push('Aspent-M', 'Aspilets');
  else if (genLower.includes('amlodipine')) brandNames.push('Norvasc', 'Amcard');
  else if (genLower.includes('losartan')) brandNames.push('Cozaar', 'Losar');
  else if (genLower.includes('metformin')) brandNames.push('Glucophage');
  else if (genLower.includes('simvastatin')) brandNames.push('Zocor');
  else if (genLower.includes('omeprazole')) brandNames.push('Miracid', 'Losec');
  else if (genLower.includes('paracetamol')) brandNames.push('Tylenol', 'Sara');
  else if (genLower.includes('ibuprofen')) brandNames.push('Brufen');
  else if (genLower.includes('cetirizine')) brandNames.push('Zyrtec');

  return {
    drug_id: `NLEM-${String(idx + 1).padStart(4, '0')}`,
    generic_name: generic,
    thai_name: `${generic} (บัญชียาหลักแห่งชาติ)`,
    brand_names: brandNames.length > 0 ? brandNames : [generic],
    group_name: group,
    subgroup_name: subgroup,
    atc_code: row.no ? `NLEM-SEC-${row.no}` : `ATC-G${idx + 1}`,
    nlem_category: category,
    dosage_form: dosage || 'Tablet',
    dosage_forms: [
      {
        form: dosage || 'Tablet',
        strengths_mg: [doseMg],
      }
    ],
    strength_mg: doseMg,
    strength_description: strength && strength !== '-' ? strength : `${doseMg} mg`,
    route: route,
    standard_regimen: {
      dose_mg: doseMg,
      dose_per_admin_mg: doseMg,
      frequency_per_day: 1,
      timing: route === 'Oral' ? 'วันละ 1 ครั้ง หลังอาหาร' : 'ตามแพทย์สั่ง',
      calculated_daily_dose_mg: doseMg,
      max_daily_dose_mg: doseMg * 3,
      route: route,
    },
    therapeutic_class: subgroup && subgroup !== '-' ? subgroup : group,
    indications: subgroup && subgroup !== '-' ? `${subgroup} (กลุ่มโรค: ${group})` : group,
    conditions: conditions,
    critical_safety_notes: warnings || (conditions ? `เงื่อนไข: ${conditions}` : ''),
    notes: notes,
    source_reference: `บัญชียาหลักแห่งชาติ (NLEM) ประกาศราชกิจจานุเบกษา ${gazette}`,
  };
});

console.log(`Generated ${nlemItems.length} official NLEM drug records`);

// Merge with existing drugs (so any MED-CONV-001 with custom HDI rules are retained)
const finalDrugsMap = new Map();

// Add existing first
existingDrugs.forEach(d => {
  finalDrugsMap.set(d.generic_name.toLowerCase(), d);
});

// Add all official NLEM items
nlemItems.forEach(item => {
  const key = `${item.generic_name.toLowerCase()}--${item.dosage_form.toLowerCase()}`;
  if (!finalDrugsMap.has(key)) {
    finalDrugsMap.set(key, item);
  }
});

const mergedList = Array.from(finalDrugsMap.values());
console.log(`Total merged NLEM drug database: ${mergedList.length} items`);

// Write out to data/master/conventional-drugs.json
fs.writeFileSync(existingPath, JSON.stringify(mergedList, null, 2), 'utf8');
console.log(`Successfully updated ${existingPath}`);
