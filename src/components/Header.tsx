/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { JanSwarLogo } from './JanSwarLogo';
import { IndicLanguage } from '../types';
import { INDIC_LANGUAGES } from '../data/seedGrievances';
import { Globe, PlusCircle, Menu, X, Layers, Activity, Search, ShieldCheck } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'portal', label: 'Citizen Demand Portal', shortLabel: 'Portal', icon: ShieldCheck },
    { id: 'dashboard', label: 'Policy Intelligence & ABDM', shortLabel: 'Dashboard', icon: Activity },
    { id: 'research', label: 'Research Gaps & MRP Lab', shortLabel: 'Research', icon: Layers },
    { id: 'catalog', label: 'Jan Aushadhi Catalog (750+)', shortLabel: 'Medicines', icon: Search }
  ] as const;

  const handleTabClick = (tab: 'portal' | 'dashboard' | 'research' | 'catalog') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Wordmark */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => handleTabClick('portal')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 rounded-lg group"
          >
            <JanSwarLogo size="md" />
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop md+) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`transition-all py-1 px-1 text-xs font-semibold relative ${
                currentTab === item.id
                  ? 'text-cyan-800 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
              {currentTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Language + CTA + Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedLang}
              onChange={(e) => onChangeLang(e.target.value as IndicLanguage)}
              aria-label="Select Interface Language"
              className="pl-7 pr-6 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 cursor-pointer transition-colors max-w-[120px] sm:max-w-none"
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
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-700 to-cyan-800 hover:from-cyan-800 hover:to-cyan-900 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Voice / File Shortage</span>
            <span className="sm:hidden">Report</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (lg:hidden) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                  currentTab === item.id
                    ? 'bg-cyan-50 text-cyan-800 font-bold border-l-4 border-cyan-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${currentTab === item.id ? 'text-cyan-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick Mobile Tab Bar (Visible on small screens below md) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 px-1 py-1.5 bg-slate-50 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`px-2 py-1 rounded font-semibold text-[11px] transition-all ${
              currentTab === item.id ? 'bg-cyan-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {item.shortLabel}
          </button>
        ))}
      </div>
    </header>
  );
};

