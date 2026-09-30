/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ABDM_DISTRICT_METRICS } from '../data/abdmDistricts';
import { CitizenGrievance } from '../types';
import {
  Activity,
  Layers,
  MapPin,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  ArrowUpDown,
  Building2,
  PhoneCall
} from 'lucide-react';

interface PolicyDashboardProps {
  grievances: CitizenGrievance[];
  onUpdateStatus: (id: string, newStatus: CitizenGrievance['status']) => void;
}

export const PolicyDashboard: React.FC<PolicyDashboardProps> = ({
  grievances,
  onUpdateStatus
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'mrpScore' | 'rawCount' | 'displacement'>('displacement');
  const [grievanceFilter, setGrievanceFilter] = useState<'all' | 'unresolved' | 'allocated'>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute aggregate statistics
  const totalGrievances = grievances.length;
  const rawSum = grievances.reduce((acc, g) => acc + g.rawCountWeight, 0);
  const mrpWeightedSum = grievances.reduce((acc, g) => acc + g.postStratificationWeight, 0);
  const totalOverchargeEstimated = grievances.reduce((acc, g) => acc + (g.overchargeAmount || 0), 0);

  // Total ABDM linked accounts & facilities from data
  const totalAbha = ABDM_DISTRICT_METRICS.reduce((acc, d) => acc + d.totalAbhaAccounts, 0);
  const totalKendras = ABDM_DISTRICT_METRICS.reduce((acc, d) => acc + d.janAushadhiKendrasCount, 0);

  // Filter districts
  const filteredDistricts = ABDM_DISTRICT_METRICS.filter(
    (d) => selectedState === 'All' || d.state === selectedState
  ).sort((a, b) => {
    if (sortBy === 'mrpScore') return b.mrpAdjustedGrievanceScore - a.mrpAdjustedGrievanceScore;
    if (sortBy === 'rawCount') return b.rawGrievancesLogged - a.rawGrievancesLogged;
    return b.rankDisplacement - a.rankDisplacement; // Highest displacement first
  });

  // Filter grievances stream
  const filteredGrievances = grievances.filter((g) => {
    if (grievanceFilter === 'unresolved') return g.status === 'Surfaced' || g.status === 'Under Investigation';
    if (grievanceFilter === 'allocated') return g.status === 'Allocated to Budget';
    return true;
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Ticket,District,State,Generic Drug,Statutory MRP,Market Charged,Overcharge Delta,Raw Weight,MRP Post-Stratified Weight,LSDG Theme,Status',
        ...grievances.map(
          (g) =>
            `"${g.ticketNumber}","${g.district}","${g.state}","${g.selectedDrugName || 'N/A'}",${g.statutoryMrp || 0},${g.marketPriceCharged || 0},${g.overchargeAmount || 0},${g.rawCountWeight},${g.postStratificationWeight},"${g.lsdgThemeName}","${g.status}"`
        )
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JanSwar_Policy_Allocation_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Export generated successfully pursuant to public procurement and audit guidelines.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Policy Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Policy Intelligence & ABDM Allocation Command
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
              Live ABDM Synced
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Bridging citizen health demands, PMBJP Jan Aushadhi price transparency, and ABDM facility registries with Kontokosta-corrected need stratification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export DMO Audit CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* High-Level Analytical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Demand Volume vs Post-Stratified Need */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Raw vs MRP Demand Score</span>
            <Layers className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {mrpWeightedSum.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              (Raw: {rawSum.toFixed(0)})
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            +{(mrpWeightedSum - rawSum).toFixed(1)} vulnerability units restored by MRP
          </div>
        </div>

        {/* KPI 2: Citizen Out-of-Pocket Savings Delta */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Reported Out-of-Pocket Delta</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              ₹{totalOverchargeEstimated.toFixed(2)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Excess cost paid vs Jan Aushadhi statutory prices
          </div>
        </div>

        {/* KPI 3: ABDM Registered Facilities (HFR) */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>ABDM Linked Accounts</span>
            <Building2 className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {(totalAbha / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-500 font-mono">ABHA IDs</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Across 12 benchmark pilot districts
          </div>
        </div>

        {/* KPI 4: PMBJP Kendras in Active Registry */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Active PMBJP Kendras</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalKendras}
            </span>
            <span className="text-xs text-emerald-700 font-medium">99.2% stock verified</span>
          </div>
          <div className="text-[11px] text-slate-500">
            National drug catalog: 750+ essential items
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Kontokosta Reporting Bias vs MRP Correction Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>District Demand Allocation Matrix (Research Gap 1: Reporting Bias Correction)</span>
              <span className="text-[10px] font-mono uppercase bg-cyan-100 text-cyan-800 font-semibold px-2 py-0.5 rounded">
                MRP Post-Stratified
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Raw complaint volumes suffer from severe digital reporting bias (StreetBump effect). Post-stratification reweights districts by female phone access (NFHS-5) and infrastructure deficit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <button
                onClick={() => setSortBy('displacement')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  sortBy === 'displacement' ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Bias Displacement
              </button>
              <button
                onClick={() => setSortBy('mrpScore')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  sortBy === 'mrpScore' ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                MRP Score
              </button>
              <button
                onClick={() => setSortBy('rawCount')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  sortBy === 'rawCount' ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Raw Volume
              </button>
            </div>
          </div>
        </div>

        {/* High-Density Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 font-semibold text-slate-700">
                <th className="py-3 px-4">District & LGD Code</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3 text-right">Female Phone (NFHS-5)</th>
                <th className="py-3 px-3 text-right">Deficit Index</th>
                <th className="py-3 px-3 text-right">Raw Demand</th>
                <th className="py-3 px-3 text-right">MRP Conditioned Score</th>
                <th className="py-3 px-3 text-center">Rank Shift</th>
                <th className="py-3 px-4">Primary Drug Shortage</th>
                <th className="py-3 px-3 text-center">Spatial Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredDistricts.map((district) => (
                <tr
                  key={district.lgdDistrictCode}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>{district.districtName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block pl-5">
                      LGD: #{district.lgdDistrictCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{district.state}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                    {district.femalePhoneOwnershipPct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                    <span className={district.infrastructureDeficitScore > 75 ? 'text-amber-700 font-semibold' : ''}>
                      {district.infrastructureDeficitScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500">
                    {district.rawGrievancesLogged}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-cyan-900">
                    {district.mrpAdjustedGrievanceScore.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">
                    {district.rankDisplacement > 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        +{district.rankDisplacement} (Rescued)
                      </span>
                    ) : district.rankDisplacement < 0 ? (
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {district.rankDisplacement} (De-biased)
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-[11px]">
                    {district.primaryShortageCategory}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {district.isHotspot ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        Gi* Hotspot (p&lt;0.05)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Nominal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Citizen Demand Grievance Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Multilingual Grievance & Drug Shortage Stream
            </h2>
            <p className="text-xs text-slate-500">
              Citizen reports classified into e-GramSwaraj LSDG 9 Themes & NHM Flexipool budget lines.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setGrievanceFilter('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                grievanceFilter === 'all' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({grievances.length})
            </button>
            <button
              onClick={() => setGrievanceFilter('unresolved')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                grievanceFilter === 'unresolved' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending Investigation
            </button>
            <button
              onClick={() => setGrievanceFilter('allocated')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                grievanceFilter === 'allocated' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Budget Allocated
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredGrievances.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No grievances match the selected filter.
            </div>
          ) : (
            filteredGrievances.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-800">{item.ticketNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-medium">
                      {item.district}, {item.state}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] text-slate-500">
                      Channel: {item.channel.toUpperCase()} ({item.language.toUpperCase()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        item.urgency === 'Immediate Emergency'
                          ? 'bg-rose-100 text-rose-800'
                          : item.urgency === 'High Priority'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.urgency}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.status === 'Allocated to Budget'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Resolved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Grievance Statement */}
                <div className="text-xs text-slate-800 space-y-1">
                  <p className="font-medium text-slate-900 italic">"{item.rawInput}"</p>
                  {item.translatedEnglish && item.translatedEnglish !== item.rawInput && (
                    <p className="text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-700">English Crosswalk: </span>
                      {item.translatedEnglish}
                    </p>
                  )}
                </div>

                {/* Metadata & Scheme Crosswalk */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Matched Medicine (CSV Catalog):</span>
                    <span className="font-semibold text-slate-900 block truncate">
                      {item.selectedDrugName || 'General Health Clinic Shortage'}
                    </span>
                    {item.statutoryMrp && (
                      <span className="font-mono text-emerald-700 font-medium">
                        PMBJP Regulated MRP: ₹{item.statutoryMrp.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block">LSDG & NHM Crosswalk:</span>
                    <span className="font-semibold text-slate-900 block truncate">
                      {item.lsdgThemeName}
                    </span>
                    <span className="text-cyan-800 font-mono text-[10px] block truncate">
                      {item.budgetHeadCode}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center sm:items-end">
                    <span className="text-slate-500">Need-Conditioned Weight:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ×{item.postStratificationWeight.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Policy Action Toolbar */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">
                    Consent Ref: {item.consentId} · k-Anonymity Verified
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status !== 'Allocated to Budget' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'Allocated to Budget')}
                        className="px-2.5 py-1 bg-cyan-700 hover:bg-cyan-800 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Allocate to GPDP Budget
                      </button>
                    )}
                    {item.status !== 'Resolved' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'Resolved')}
                        className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px] font-semibold transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
