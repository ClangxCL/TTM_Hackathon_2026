import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Load data files safely
const dataDir = path.join(__dirname, '..', 'data');
const openApiPath = path.join(__dirname, 'openapi.yaml');

let formulary = [];
let interactions = [];
let cases = [];

try {
  formulary = JSON.parse(fs.readFileSync(path.join(dataDir, 'formulary', 'thai-formulary.json'), 'utf-8'));
  interactions = JSON.parse(fs.readFileSync(path.join(dataDir, 'hdi', 'herb-drug-interactions.json'), 'utf-8'));
  cases = JSON.parse(fs.readFileSync(path.join(dataDir, 'synthetic', 'cases.json'), 'utf-8'));
} catch (err) {
  console.error('Error loading data files:', err);
}

// 0. Serve OpenAPI YAML directly
const serveOpenApi = (req, res) => {
  if (fs.existsSync(openApiPath)) {
    res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
    res.sendFile(openApiPath);
  } else {
    res.status(404).json({ error: 'OpenAPI specification file not found' });
  }
};

app.get('/openapi.yaml', serveOpenApi);
app.get('/v1/openapi.yaml', serveOpenApi);

// 1. Root & /v1 HTML Dashboard for browser visits
const renderDashboardHtml = () => `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TTM Smutthan Engine Mock API Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🌿</span>
          <div>
            <h1 class="text-2xl font-bold text-slate-900">TTM Smutthan Engine Mock API Gateway</h1>
            <p class="text-sm text-slate-500">จำลอง REST API Gateway สำหรับเชื่อมต่อระบบ HIS (HOSxP, EHP, SSB, Himpro)</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ONLINE (Port ${PORT})
        </span>
      </div>
      
      <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
        <a href="/v1/health" target="_blank" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition">/v1/health</a>
        <a href="/v1/formulary" target="_blank" class="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-medium rounded-lg border border-teal-200 transition">/v1/formulary</a>
        <a href="/v1/interactions" target="_blank" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium rounded-lg border border-rose-200 transition">/v1/interactions</a>
        <a href="/v1/patients" target="_blank" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-medium rounded-lg border border-blue-200 transition">/v1/patients</a>
        <a href="/v1/openapi.yaml" target="_blank" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-medium rounded-lg border border-purple-200 transition">/v1/openapi.yaml</a>
      </div>
    </div>

    <!-- Endpoints Directory -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4">
      <h2 class="text-lg font-bold text-slate-900">รายการ Endpoints พร้อมใช้งาน (REST API Endpoints)</h2>
      
      <div class="space-y-3">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[11px] font-bold rounded">GET</span>
              <a href="/v1/health" class="font-mono text-sm font-semibold text-slate-900 hover:text-emerald-700">/v1/health</a>
            </div>
            <p class="text-xs text-slate-500">ตรวจสอบสถานะการทำงานและ Timestamp ปัจจุบัน</p>
          </div>
          <a href="/v1/health" target="_blank" class="text-xs text-emerald-600 hover:underline">ทดสอบ &rarr;</a>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[11px] font-bold rounded">GET</span>
              <a href="/v1/formulary" class="font-mono text-sm font-semibold text-slate-900 hover:text-emerald-700">/v1/formulary</a>
            </div>
            <p class="text-xs text-slate-500">ดึงบัญชียาสมุนไพร 21 รายการ (รหัสยา 24 หลัก, NLEM 2568)</p>
          </div>
          <a href="/v1/formulary" target="_blank" class="text-xs text-emerald-600 hover:underline">ทดสอบ &rarr;</a>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[11px] font-bold rounded">GET</span>
              <a href="/v1/interactions" class="font-mono text-sm font-semibold text-slate-900 hover:text-emerald-700">/v1/interactions</a>
            </div>
            <p class="text-xs text-slate-500">ดึงฐานข้อมูลคู่ยาอันตรกิริยา 14 กฎ (C01–C10) พร้อมหลักฐานทางวิชาการ</p>
          </div>
          <a href="/v1/interactions" target="_blank" class="text-xs text-emerald-600 hover:underline">ทดสอบ &rarr;</a>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[11px] font-bold rounded">GET</span>
              <a href="/v1/patients" class="font-mono text-sm font-semibold text-slate-900 hover:text-emerald-700">/v1/patients</a>
            </div>
            <p class="text-xs text-slate-500">ดึงรายชื่อผู้ป่วยจำลอง 10 เคส (C01–C10) พร้อมประวัติยาเดิม</p>
          </div>
          <a href="/v1/patients" target="_blank" class="text-xs text-emerald-600 hover:underline">ทดสอบ &rarr;</a>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-600 text-white font-mono text-[11px] font-bold rounded">POST</span>
              <span class="font-mono text-sm font-semibold text-slate-900">/v1/interactions/check</span>
            </div>
            <p class="text-xs text-slate-500">ส่งคู่ยาเพื่อตรวจสอบอันตรกิริยาแบบ Real-time</p>
          </div>
          <span class="text-xs text-slate-400">JSON Payload</span>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-600 text-white font-mono text-[11px] font-bold rounded">POST</span>
              <span class="font-mono text-sm font-semibold text-slate-900">/v1/smutthan/calculate</span>
            </div>
            <p class="text-xs text-slate-500">คำนวณคะแนนธาตุ 4 กองตามสัญญาณชีพ อากาศ และอาการ</p>
          </div>
          <span class="text-xs text-slate-400">JSON Payload</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

app.get('/', (req, res) => {
  res.send(renderDashboardHtml());
});

app.get('/v1', (req, res) => {
  res.send(renderDashboardHtml());
});

// 2. Health & Status
app.get('/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    version: '1.0.0',
    service: 'TTM Smutthan Engine Mock Server',
    formulary_count: formulary.length,
    interactions_count: interactions.length,
    patients_count: cases.length,
    timestamp: new Date().toISOString(),
  });
});

// 3. GET /v1/formulary
app.get('/v1/formulary', (req, res) => {
  res.json(formulary);
});

// 4. GET /v1/interactions
app.get('/v1/interactions', (req, res) => {
  res.json(interactions);
});

// 5. GET /v1/interactions/:id
app.get('/v1/interactions/:id', (req, res) => {
  const item = interactions.find((i) => i.interaction_id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Interaction ID not found' });
  res.json(item);
});

// 6. GET /v1/patients
app.get('/v1/patients', (req, res) => {
  res.json(cases);
});

// 7. GET /v1/patients/:hn
app.get('/v1/patients/:hn', (req, res) => {
  const patientCase = cases.find((c) => c.patient_info.hn === req.params.hn || c.case_id === req.params.hn);
  if (!patientCase) return res.status(404).json({ error: 'Patient HN or Case ID not found' });
  res.json(patientCase);
});

// 8. POST /v1/interactions/check
app.post('/v1/interactions/check', (req, res) => {
  const { active_medications = [], intended_herbs = [] } = req.body;
  const matchedList = [];

  for (const convDrug of active_medications) {
    const drugName = (convDrug.generic_name || '').toLowerCase();
    for (const herb of intended_herbs) {
      const herbName = (herb.herb_name || herb.thai_name || '').toLowerCase();
      const herbCode = herb.drug_code_24 || herb.herb_code_24 || '';

      for (const rule of interactions) {
        const isDrugMatch = drugName.includes(rule.drug_generic_name.toLowerCase()) || rule.drug_generic_name.toLowerCase().includes(drugName);
        const isHerbMatch = herbName.includes(rule.herb_thai_name.toLowerCase()) || rule.herb_thai_name.toLowerCase().includes(herbName) || (herbCode && herbCode === rule.herb_code_24);

        if (isDrugMatch && isHerbMatch) {
          matchedList.push({
            interaction_id: rule.interaction_id,
            severity: rule.severity,
            severity_code: rule.severity_code,
            drug_name: convDrug.generic_name,
            herb_name: rule.herb_thai_name,
            mechanism: rule.mechanism,
            clinical_effects: rule.clinical_effects,
            recommendation: rule.recommendation,
            evidence_level: rule.evidence_level,
          });
        }
      }
    }
  }

  const hasHigh = matchedList.some((m) => m.severity === 'สูง' || m.severity_code === 'HIGH');
  res.json({
    has_high_risk: hasHigh,
    alerts_count: matchedList.length,
    interactions: matchedList,
    dosage_warnings: [],
  });
});

// 9. POST /v1/smutthan/calculate
app.post('/v1/smutthan/calculate', (req, res) => {
  const { patient_age = 45, vitals = {}, ambient = {}, symptoms = [] } = req.body;

  let wind = 25.0;
  let fire = 25.0;
  let water = 25.0;
  let earth = 25.0;

  if (ambient.temperature_c >= 35) fire += 18;
  if (ambient.temperature_c <= 22) water += 15;
  if (vitals.btemp >= 37.8) fire += 25;
  if (vitals.sbp >= 140) wind += 16;
  if (patient_age >= 32) wind += 15;
  if (symptoms.some((s) => s.includes('ปวด') || s.includes('ตึง'))) wind += 20;

  wind = Math.min(100, Math.max(10, Math.round(wind)));
  fire = Math.min(100, Math.max(10, Math.round(fire)));
  water = Math.min(100, Math.max(10, Math.round(water)));
  earth = Math.min(100, Math.max(10, Math.round(earth)));

  res.json({
    dominant_element: wind > fire ? 'wind' : 'fire',
    dominant_element_th: wind > fire ? 'วาโยธาตุ (ธาตุลม)' : 'เตโชธาตุ (ธาตุไฟ)',
    scores: { earth, water, wind, fire },
    status: wind >= 65 || fire >= 65 ? 'กำเริบ (Aggravated)' : 'สมดุล (Normal)',
  });
});

// 10. POST /v1/prescriptions
app.post('/v1/prescriptions', (req, res) => {
  const { patient_hn, prescription_items = [] } = req.body;
  res.status(201).json({
    success: true,
    transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    patient_hn,
    items_count: prescription_items.length,
    timestamp: new Date().toISOString(),
  });
});

// Error handling fallback
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 TTM Smutthan Engine Mock API running at http://localhost:${PORT}/v1`);
  console.log(`📋 OpenAPI specification available at http://localhost:${PORT}/v1/openapi.yaml`);
});
