import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MockDataService } from './services/mockDataService';
import { SyntheticCase, Vitals } from './types/patient';

// Pages
import { LandingPage } from './pages/LandingPage';
import { PatientSelectPage } from './pages/PatientSelectPage';
import { SmutthanPage } from './pages/SmutthanPage';
import { PrescribePage } from './pages/PrescribePage';
import { PrescriptionPrintPage } from './pages/PrescriptionPrintPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { InterRaterPage } from './pages/InterRaterPage';
import { AdminHdiPage } from './pages/AdminHdiPage';
import { SystemStatusPage } from './pages/SystemStatusPage';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cases, setCases] = useState<SyntheticCase[]>(() => MockDataService.getCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>('C01');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const currentCase = cases.find((c) => c.case_id === selectedCaseId) || cases[0];

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleUpdateVitals = (vitals: Vitals, symptoms: string[]) => {
    MockDataService.updateCaseVitalsAndSymptoms(currentCase.case_id, vitals, symptoms);
    setCases([...MockDataService.getCases()]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. Persistent Top Disclaimer Banner */}
      <DisclaimerBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* 2. Collapsible Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* 3. Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar with Active Case Summary & Live Weather */}
          <Navbar
            currentCase={currentCase}
            onSelectCaseClick={() => navigate('/patients')}
          />

          {/* Page Routing */}
          <main className="flex-1 p-3 sm:p-6 pb-12">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/patients"
                element={
                  <PatientSelectPage
                    cases={cases}
                    selectedCaseId={selectedCaseId}
                    onSelectCase={handleSelectCase}
                  />
                }
              />
              <Route
                path="/smutthan"
                element={
                  <SmutthanPage
                    currentCase={currentCase}
                    onUpdateCaseVitals={handleUpdateVitals}
                  />
                }
              />
              <Route
                path="/prescribe"
                element={<PrescribePage currentCase={currentCase} />}
              />
              <Route
                path="/prescription-print"
                element={<PrescriptionPrintPage currentCase={currentCase} />}
              />
              <Route
                path="/analytics"
                element={<AnalyticsPage cases={cases} />}
              />
              <Route path="/inter-rater" element={<InterRaterPage />} />
              <Route path="/admin-hdi" element={<AdminHdiPage />} />
              <Route path="/status" element={<SystemStatusPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
