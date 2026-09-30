/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { IndicLanguage, MedicineProduct } from '../types';
import { MEDICINE_CATALOG } from '../data/medicineCatalog';
import {
  Mic,
  PlusCircle,
  ShieldCheck,
  Search,
  ArrowRight,
  Building,
  HeartPulse,
  Radio,
  Sparkles,
  Zap
} from 'lucide-react';

interface CitizenPortalProps {
  onOpenReportModal: () => void;
  onSelectDrugForGrievance: (drug: MedicineProduct) => void;
  onExploreCatalog: () => void;
  onViewDashboard: () => void;
  selectedLang: IndicLanguage;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onOpenReportModal,
  onSelectDrugForGrievance,
  onExploreCatalog,
  onViewDashboard,
  selectedLang
}) => {
  // Showcase top essential medicines from the catalog
  const showcaseDrugs = [
    MEDICINE_CATALOG.find((m) => m.drugCode === 22)!, // Paracetamol paediatric syrup
    MEDICINE_CATALOG.find((m) => m.drugCode === 142)!, // Insulin Soluble
    MEDICINE_CATALOG.find((m) => m.drugCode === 39)!, // Amoxycillin Clavulanic
    MEDICINE_CATALOG.find((m) => m.drugCode === 300)!, // Telmisartan 40mg
    MEDICINE_CATALOG.find((m) => m.drugCode === 8121)!, // Glucometer test strips
    MEDICINE_CATALOG.find((m) => m.drugCode === 574)! // Rabies vaccine
  ].filter(Boolean);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 text-white p-6 sm:p-10 md:p-12 shadow-xl border border-cyan-800/40">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/15 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Browser-Only Policy Research Prototype</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">health-demand</span> policy concepts & civic intelligence.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            This prototype demonstrates sample classification, catalog browsing, and policy visualizations. It has no live public-authority connection and must not receive real personal or health information.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenReportModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 active:from-cyan-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-950/50 transition-all text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Try Example Shortage Report</span>
            </button>

            <button
              onClick={onExploreCatalog}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all text-xs sm:text-sm backdrop-blur-xs"
            >
              <Search className="w-4 h-4 text-cyan-300" />
              <span>Browse 750+ Medicine Catalog</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>DPDP Act 2023 Consent Model</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>ABDM & LGD Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
              <span>PMBJP Jan Aushadhi MRP</span>
            </div>
          </div>
        </div>

        {/* Ambient Glow Orbs */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute right-1/3 -top-20 w-60 h-60 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"
        />
      </section>

      {/* How It Works: Citizen to Policy Loop */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Demonstration Data Flow & Crosswalk Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Conceptual workflow demonstrating multilingual ingestion to GPDP budget allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-cyan-300 transition-all">
            <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md inline-block">
              Step 01 · Ingestion
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Multilingual Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The prototype inserts sample text in 8 selectable languages and runs it against a built-in place-name directory.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-emerald-300 transition-all">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
              Step 02 · MRP De-biasing
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Need-Conditioned Reweighting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Applies Kontokosta post-stratification weighting factors (NFHS-5 phone access & Mission Antyodaya deficit).
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-purple-300 transition-all">
            <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md inline-block">
              Step 03 · Crosswalk
            </span>
            <h3 className="font-bold text-slate-900 text-sm">LSDG & NHM Translation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maps citizen input into e-GramSwaraj LSDG 9 Themes and National Health Mission Flexipool budget lines.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition-all">
            <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block">
              Step 04 · Supply Closure
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Audit & Replenishment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates audit-ready CSV reports for District Medical Officers; browser-only prototype mode.
            </p>
          </div>
        </div>
      </section>

      {/* Critical Medicines Spotlight */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              High-Frequency Essential Medicines & Surgical Supplies
            </h2>
            <p className="text-xs text-slate-500">
              PMBJP statutory MRP vs commercial market price reference comparisons.
            </p>
          </div>
          <button
            onClick={onExploreCatalog}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 shrink-0"
          >
            <span>View 750+ Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcaseDrugs.map((drug) => {
            const savingsPercent = Math.round(
              ((drug.marketPriceAvg - drug.mrp) / drug.marketPriceAvg) * 100
            );

            return (
              <div
                key={drug.drugCode}
                className="p-4 bg-white rounded-2xl border border-slate-200/90 hover:border-cyan-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      Drug Code #{drug.drugCode}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {savingsPercent}% Savings
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug">
                    {drug.genericName}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {drug.groupName} · Pack {drug.unitSize}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Regulated MRP</span>
                    <span className="font-mono font-bold text-base text-emerald-700">
                      ₹{drug.mrp.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectDrugForGrievance(drug)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-700 hover:text-white rounded-xl transition-all shadow-2xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABDM & Grievance Transparency Banner */}
      <section className="p-6 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Policy Command Control</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Open Sample Policy Intelligence Dashboard
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Review live district matrices, ABDM facility links, Kontokosta rank shifts, and LSDG budget allocation streams.
          </p>
        </div>

        <button
          onClick={onViewDashboard}
          className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-950/40 transition-all shrink-0"
        >
          Open Sample Dashboard
        </button>
      </section>
    </div>
  );
};

