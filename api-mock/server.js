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

// Load data files
const dataDir = path.join(__dirname, '..', 'data');
const formulary = JSON.parse(fs.readFileSync(path.join(dataDir, 'formulary', 'thai-formulary.json'), 'utf-8'));
const interactions = JSON.parse(fs.readFileSync(path.join(dataDir, 'hdi', 'herb-drug-interactions.json'), 'utf-8'));
const cases = JSON.parse(fs.readFileSync(path.join(dataDir, 'synthetic', 'cases.json'), 'utf-8'));

// 1. Health & Status
app.get('/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    version: '1.0.0',
    service: 'TTM Smutthan Engine Mock Server',
    timestamp: new Date().toISOString(),
  });
});

// 2. GET /v1/formulary
app.get('/v1/formulary', (req, res) => {
  res.json(formulary);
});

// 3. GET /v1/interactions
app.get('/v1/interactions', (req, res) => {
  res.json(interactions);
});

// 4. GET /v1/interactions/:id
app.get('/v1/interactions/:id', (req, res) => {
  const item = interactions.find((i) => i.interaction_id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Interaction ID not found' });
  res.json(item);
});

// 5. POST /v1/interactions/check
app.post('/v1/interactions/check', (req, res) => {
  const { active_medications = [], intended_herbs = [] } = req.body;
  const matchedList = [];

  for (const convDrug of active_medications) {
    const drugName = (convDrug.generic_name || '').toLowerCase();
    for (const herb of intended_herbs) {
      const herbName = (herb.herb_name || '').toLowerCase();
      const herbCode = herb.drug_code_24 || '';

      for (const rule of interactions) {
        const isDrugMatch = drugName.includes(rule.drug_generic_name.toLowerCase()) || rule.drug_generic_name.toLowerCase().includes(drugName);
        const isHerbMatch = herbName.includes(rule.herb_thai_name.toLowerCase()) || rule.herb_thai_name.toLowerCase().includes(herbName) || herbCode === rule.herb_code_24;

        if (isDrugMatch && isHerbMatch) {
          matchedList.push({
            interaction_id: rule.interaction_id,
            severity: rule.severity,
            drug_name: convDrug.generic_name,
            herb_name: herb.herb_name,
            mechanism: rule.mechanism,
            clinical_effects: rule.clinical_effects,
            recommendation: rule.recommendation,
            evidence_level: rule.evidence_level,
          });
        }
      }
    }
  }

  const hasHigh = matchedList.some((m) => m.severity === 'สูง');
  res.json({
    has_high_risk: hasHigh,
    alerts_count: matchedList.length,
    interactions: matchedList,
    dosage_warnings: [],
  });
});

// 6. POST /v1/prescriptions
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

app.listen(PORT, () => {
  console.log(`🚀 TTM Smutthan Engine Mock API running at http://localhost:${PORT}/v1`);
  console.log(`📋 OpenAPI specification available at http://localhost:${PORT}/v1/openapi.yaml`);
});
