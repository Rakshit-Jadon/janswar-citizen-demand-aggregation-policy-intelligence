/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JanSwarLogo } from './JanSwarLogo';
import { IndicLanguage } from '../types';
import { INDIC_LANGUAGES } from '../data/seedGrievances';
import { Globe, PlusCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: 'portal' | 'dashboard' | 'research' | 'catalog';
  onSelectTab: (tab: 'portal' | 'dashboard' | 'research' | 'catalog') => void;
  selectedLang: IndicLanguage;
  onChangeLang: (lang: IndicLanguage) => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  selectedLang,
  onChangeLang,
  onOpenReportModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => onSelectTab('portal')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded-lg"
          >
            <JanSwarLogo size="md" />
          </button>
        </div>

        {/* Zone 2: 4 Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('portal')}
            className={`transition-colors pb-1 text-sm ${
              currentTab === 'portal'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            Citizen Demand Portal
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors pb-1 text-sm ${
              currentTab === 'dashboard'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            Policy Intelligence & ABDM
          </button>
          <button
            onClick={() => onSelectTab('research')}
            className={`transition-colors pb-1 text-sm ${
              currentTab === 'research'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            Research Gaps & MRP Lab
          </button>
          <button
            onClick={() => onSelectTab('catalog')}
            className={`transition-colors pb-1 text-sm ${
              currentTab === 'catalog'
                ? 'text-cyan-700 font-semibold border-b-2 border-cyan-600'
                : 'hover:text-slate-900 border-b-2 border-transparent'
            }`}
          >
            Jan Aushadhi Catalog (750+ Drugs)
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedLang}
              onChange={(e) => onChangeLang(e.target.value as IndicLanguage)}
              aria-label="Select Interface Language"
              className="pl-8 pr-7 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 cursor-pointer transition-colors"
            >
              {INDIC_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 rounded-lg shadow-sm transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Voice / File Shortage</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 px-2 py-2 bg-slate-50 text-xs">
        <button
          onClick={() => onSelectTab('portal')}
          className={`px-2 py-1 rounded font-medium ${
            currentTab === 'portal' ? 'bg-cyan-100 text-cyan-800' : 'text-slate-600'
          }`}
        >
          Citizen
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 rounded font-medium ${
            currentTab === 'dashboard' ? 'bg-cyan-100 text-cyan-800' : 'text-slate-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('research')}
          className={`px-2 py-1 rounded font-medium ${
            currentTab === 'research' ? 'bg-cyan-100 text-cyan-800' : 'text-slate-600'
          }`}
        >
          Research Lab
        </button>
        <button
          onClick={() => onSelectTab('catalog')}
          className={`px-2 py-1 rounded font-medium ${
            currentTab === 'catalog' ? 'bg-cyan-100 text-cyan-800' : 'text-slate-600'
          }`}
        >
          Medicines
        </button>
      </div>
    </header>
  );
};
