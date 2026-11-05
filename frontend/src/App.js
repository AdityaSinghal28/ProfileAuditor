import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/AppShell';
import CookieConsentBanner from './components/CookieConsentBanner';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import ResumeEditorPage from './pages/ResumeEditorPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import RefundPolicyPage from './pages/RefundPolicyPage';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/editor" element={<ResumeEditorPage />} />
          <Route path="/editor/:resumeId" element={<ResumeEditorPage />} />
          <Route path="/results/:resumeId" element={<ResultsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
        </Routes>
      </AppShell>
      <CookieConsentBanner />
    </Router>
  );
}

export default App;
