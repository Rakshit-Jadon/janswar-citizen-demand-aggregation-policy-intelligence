/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { CitizenPortal } from './components/CitizenPortal';
import { PolicyDashboard } from './components/PolicyDashboard';
import { ResearchLab } from './components/ResearchLab';
import { MedicineCatalogExplorer } from './components/MedicineCatalogExplorer';
import { CitizenDemandForm } from './components/CitizenDemandForm';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { SEED_GRIEVANCES } from './data/seedGrievances';
import { CitizenGrievance, IndicLanguage, MedicineProduct } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'portal' | 'dashboard' | 'research' | 'catalog'>('portal');
  const [selectedLang, setSelectedLang] = useState<IndicLanguage>('hi');
  const [grievances, setGrievances] = useState<CitizenGrievance[]>(SEED_GRIEVANCES);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [preselectedDrug, setPreselectedDrug] = useState<MedicineProduct | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  const handleAddGrievance = (newGrievance: CitizenGrievance) => {
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  const handleUpdateStatus = (id: string, newStatus: CitizenGrievance['status']) => {
    setGrievances((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
    );
  };

  const handleSelectDrugForGrievance = (drug: MedicineProduct) => {
    setPreselectedDrug(drug);
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedLang={selectedLang}
        onChangeLang={setSelectedLang}
        onOpenReportModal={() => {
          setPreselectedDrug(null);
          setIsReportModalOpen(true);
        }}
      />

      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950">
        <strong>Research prototype:</strong> reports, voice input, privacy receipts, and policy outputs are simulated in this browser only. Nothing is encrypted, transmitted, or sent to public authorities.
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'portal' && (
          <CitizenPortal
            onOpenReportModal={() => {
              setPreselectedDrug(null);
              setIsReportModalOpen(true);
            }}
            onSelectDrugForGrievance={handleSelectDrugForGrievance}
            onExploreCatalog={() => setCurrentTab('catalog')}
            onViewDashboard={() => setCurrentTab('dashboard')}
            selectedLang={selectedLang}
          />
        )}

        {currentTab === 'dashboard' && (
          <PolicyDashboard
            grievances={grievances}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {currentTab === 'research' && <ResearchLab />}

        {currentTab === 'catalog' && (
          <MedicineCatalogExplorer
            onSelectDrugForGrievance={handleSelectDrugForGrievance}
          />
        )}
      </main>

      {/* Citizen Demand & Shortage Reporting Modal */}
      <CitizenDemandForm
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setPreselectedDrug(null);
        }}
        onSubmitGrievance={handleAddGrievance}
        initialLanguage={selectedLang}
        preselectedDrug={preselectedDrug}
        onOpenPrivacyPolicy={() => {
          setIsReportModalOpen(false);
          setActiveLegalModal('privacy');
        }}
      />

      {/* Legal Modals (Privacy, Terms, Cookies, Refund) */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenCookiePolicy={() => setActiveLegalModal('cookie')} />

      {/* Footer with Compliance Links and WCAG statement */}
      <Footer onOpenLegalModal={setActiveLegalModal} />
    </div>
  );
}
