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
