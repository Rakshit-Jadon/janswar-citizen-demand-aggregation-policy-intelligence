/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MEDICINE_CATALOG, THERAPEUTIC_GROUPS } from '../data/medicineCatalog';
import { MedicineProduct } from '../types';
import {
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  Package,
  PlusCircle,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface MedicineCatalogExplorerProps {
  onSelectDrugForGrievance: (drug: MedicineProduct) => void;
}

export const MedicineCatalogExplorer: React.FC<MedicineCatalogExplorerProps> = ({
  onSelectDrugForGrievance
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  // Savings calculator state
  const [calcSelectedDrug, setCalcSelectedDrug] = useState<MedicineProduct>(MEDICINE_CATALOG[0]);
  const [calcUnitsPerMonth, setCalcUnitsPerMonth] = useState<number>(3);

  const filteredMedicines = MEDICINE_CATALOG.filter((med) => {
    const matchesQuery =
      searchQuery === '' ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.drugCode.toString().includes(searchQuery) ||
      med.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.commonIndications.some((ind) => ind.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGroup = selectedGroup === 'All' || med.groupName === selectedGroup;
    const matchesPriority = selectedPriority === 'All' || med.essentialPriority === selectedPriority;

    return matchesQuery && matchesGroup && matchesPriority;
  });

  // Calculate monthly savings in calculator
  const monthlyJanAushadhiCost = calcSelectedDrug.mrp * calcUnitsPerMonth;
  const monthlyMarketCost = calcSelectedDrug.marketPriceAvg * calcUnitsPerMonth;
  const monthlySavings = monthlyMarketCost - monthlyJanAushadhiCost;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) Catalog
          </h1>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded">
            National Essential Drug Registry
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Complete transparent price registry of 750+ essential drugs and surgical consumables with statutory MRPs, therapeutic groups, and branded private retail parity comparisons.
        </p>
      </div>

      {/* Interactive Out-of-Pocket Savings Calculator */}
      <div className="p-5 bg-gradient-to-br from-cyan-900 via-slate-900 to-slate-950 text-white rounded-2xl shadow-lg border border-cyan-800/40">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Citizen Out-of-Pocket Expenditure (OOPE) Relief Calculator</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Drug select */}
            <div className="space-y-1.5">
              <label htmlFor="calc-drug" className="text-xs text-slate-300 font-medium">
                Choose Chronic or Acute Medicine:
              </label>
              <select
                id="calc-drug"
                value={calcSelectedDrug.drugCode}
                onChange={(e) => {
                  const drug = MEDICINE_CATALOG.find((m) => m.drugCode === parseInt(e.target.value, 10));
                  if (drug) setCalcSelectedDrug(drug);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-medium"
              >
                {MEDICINE_CATALOG.slice(0, 25).map((m) => (
                  <option key={m.drugCode} value={m.drugCode}>
                    {m.genericName} (₹{m.mrp.toFixed(2)})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-cyan-200/80 block">
                Pack: {calcSelectedDrug.unitSize} · {calcSelectedDrug.groupName}
              </span>
            </div>

            {/* Units quantity */}
            <div className="space-y-1.5">
              <label htmlFor="calc-units" className="text-xs text-slate-300 font-medium">
                Packs Consumed Per Month:
              </label>
              <input
                id="calc-units"
                type="number"
                min="1"
                max="20"
                value={calcUnitsPerMonth}
                onChange={(e) => setCalcUnitsPerMonth(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 text-xs bg-slate-800/90 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <span className="text-[11px] text-slate-400 block">
                Typical chronic treatment duration: 30 days
              </span>
            </div>

            {/* Result Display */}
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-cyan-200 block font-semibold">
                Estimated Monthly Savings
              </span>
              <div className="text-3xl font-mono font-bold text-emerald-400">
                ₹{monthlySavings.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-300 block">
                Jan Aushadhi: ₹{monthlyJanAushadhiCost.toFixed(2)} vs Branded: ₹{monthlyMarketCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search generic formulation, code, or indication (e.g. Paracetamol, Insulin, Amlodipine, Malaria)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            aria-label="Filter by therapeutic category"
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-cyan-600 focus:outline-none"
          >
            <option value="All">All Therapeutic Categories ({THERAPEUTIC_GROUPS.length})</option>
            {THERAPEUTIC_GROUPS.map((grp) => (
              <option key={grp} value={grp}>
                {grp}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            aria-label="Filter by priority tier"
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-cyan-600 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            No medicines match your search criteria. Try a different generic name or group.
          </div>
        ) : (
          filteredMedicines.map((drug) => {
            const savingsPercent = Math.round(
              ((drug.marketPriceAvg - drug.mrp) / drug.marketPriceAvg) * 100
            );

            return (
              <div
                key={drug.drugCode}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      Code #{drug.drugCode}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                        drug.essentialPriority === 'Critical'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : drug.essentialPriority === 'High'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {drug.essentialPriority} Priority
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">
                    {drug.genericName}
                  </h3>

                  <div className="text-[11px] text-slate-500 mt-1">
                    <span>{drug.groupName}</span> · <span>Pack: {drug.unitSize}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {drug.therapeuticUse}
                  </p>

                  {drug.commonIndications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-slate-600">
                      {drug.commonIndications.map((ind, i) => (
                        <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded">
                          {ind}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Statutory Jan Aushadhi MRP
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-700">
                        ₹{drug.mrp.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">
                        Market Avg: <s className="text-slate-400">₹{drug.marketPriceAvg.toFixed(2)}</s>
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {savingsPercent}% Cheaper
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDrugForGrievance(drug)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-cyan-800 hover:text-white bg-cyan-50 hover:bg-cyan-700 border border-cyan-200 rounded-lg transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Report Shortage / Overcharging</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
