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
  TrendingDown,
  Building,
  HeartPulse,
  Radio,
  FileCheck2
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
  // Showcase top essential medicines from the CSV
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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 text-white p-8 md:p-12 shadow-xl border border-cyan-800/30">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-cyan-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Browser-only research prototype</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Explore <span className="text-cyan-400">health-demand</span> policy concepts.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            This prototype demonstrates sample classification, catalog browsing, and policy visualizations. It has no live public-authority connection and must not receive real personal or health information.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-900/40 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <Mic className="w-5 h-5" />
              <span>Try example report</span>
            </button>

            <button
              onClick={onExploreCatalog}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm"
            >
              <Search className="w-4 h-4 text-cyan-300" />
              <span>Browse 56 sample medicines</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Draft privacy notice</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>No live ABDM connection</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Unverified sample prices</span>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Ambient Ring */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none"
        />
      </section>

      {/* How It Works: Citizen to Policy Loop */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xl font-bold text-slate-900">
            Demonstration data flow
          </h2>
          <p className="text-xs text-slate-500">
            Conceptual workflow only; it does not process audio or allocate public funds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
              Step 01 · Example Input
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Multilingual Ingestion</h3>
            <p className="text-xs text-slate-600">
              The prototype inserts sample text in eight selectable languages and runs it against a small built-in place-name list.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Step 02 · MRP De-biasing
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Need-Conditioned Reweighting</h3>
            <p className="text-xs text-slate-600">
              The interface applies illustrative weighting factors. It is not a validated model or a decision-making system.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Step 03 · Scheme Crosswalk
            </span>
            <h3 className="font-bold text-slate-900 text-sm">LSDG & NHM Translation</h3>
            <p className="text-xs text-slate-600">
              The interface maps sample text to illustrative categories; it does not integrate with government budgeting systems.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Step 04 · Supply Closure
            </span>
            <h3 className="font-bold text-slate-900 text-sm">Audit & Replenishment</h3>
            <p className="text-xs text-slate-600">
              No alert, export, dispatch, or authority notification is sent by this prototype.
            </p>
          </div>
        </div>
      </section>

      {/* Critical Medicines Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              High-Frequency Essential Medicines & Surgical Supplies
            </h2>
            <p className="text-xs text-slate-500">
              Illustrative catalog entries and prices. Verify all data against an authorised source before publication or use.
            </p>
          </div>
          <button
            onClick={onExploreCatalog}
            className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 flex items-center gap-1"
          >
            <span>View sample catalog</span>
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
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      Drug Code #{drug.drugCode}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {savingsPercent}% sample price difference
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
                      <span className="text-[10px] text-slate-400 block">Sample reference price</span>
                    <span className="font-mono font-bold text-base text-emerald-700">
                      ₹{drug.mrp.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectDrugForGrievance(drug)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-700 hover:text-white rounded-lg transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ABDM & Grievance Transparency Banner */}
      <section className="p-6 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-slate-900">
            Sample policy dashboard
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Review static sample records and illustrative calculations. Do not use this dashboard for operational or clinical decisions.
          </p>
        </div>

        <button
          onClick={onViewDashboard}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all shrink-0"
        >
          Open sample dashboard
        </button>
      </section>
    </div>
  );
};
