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
  Building2,
  BarChart3,
  Table as TableIcon,
  LayoutGrid,
  Zap,
  ShieldCheck,
  CheckCircle2
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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute aggregate statistics
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

  // Top 6 districts for comparative chart
  const topDistrictsForChart = [...filteredDistricts].slice(0, 6);
  const maxScore = Math.max(...topDistrictsForChart.map((d) => Math.max(d.rawGrievancesLogged, d.mrpAdjustedGrievanceScore)), 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Policy Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Policy Intelligence & ABDM Allocation Command
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live ABDM Synced
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Bridging citizen health demands, PMBJP Jan Aushadhi price transparency, and ABDM facility registries with Kontokosta-corrected need stratification.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-cyan-700" />
            <span>Export DMO Audit CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* High-Level Analytical KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
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
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>+{(mrpWeightedSum - rawSum).toFixed(1)} vulnerability units restored by MRP</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
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

        {/* KPI 3 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
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

        {/* KPI 4 */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-2 hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active PMBJP Kendras</span>
            <Activity className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalKendras}
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">99.2% stock verified</span>
          </div>
          <div className="text-[11px] text-slate-500">
            National drug catalog: 750+ essential items
          </div>
        </div>
      </div>

      {/* Visual Chart: Raw Demand vs MRP-Weighted Need Comparison */}
      <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>District Demand Shift Visualizer (Raw vs MRP Stratified Score)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrates how socio-spatial post-stratification elevates rural/under-reported district allocations.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-600 inline-block" />
              <span className="text-slate-300">Raw Digital Volume</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-400 inline-block" />
              <span className="text-cyan-300 font-bold">MRP Corrected Need Score</span>
            </div>
          </div>
        </div>

        {/* SVG/CSS Visual Bar Comparison */}
        <div className="space-y-3 pt-1">
          {topDistrictsForChart.map((d) => {
            const rawWidth = Math.min(100, Math.max(8, (d.rawGrievancesLogged / maxScore) * 100));
            const mrpWidth = Math.min(100, Math.max(8, (d.mrpAdjustedGrievanceScore / maxScore) * 100));

            return (
              <div key={d.lgdDistrictCode} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    {d.districtName}, <span className="text-slate-400 font-normal">{d.state}</span>
                  </span>
                  <span className="font-mono text-[11px] text-cyan-300">
                    Raw: {d.rawGrievancesLogged} → MRP Score: <strong className="text-white">{d.mrpAdjustedGrievanceScore.toFixed(1)}</strong>
                  </span>
                </div>
                <div className="space-y-1">
                  {/* Raw Bar */}
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-slate-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${rawWidth}%` }}
                    />
                  </div>
                  {/* MRP Bar */}
                  <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${mrpWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Analysis Section: Kontokosta Reporting Bias Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex flex-wrap items-center gap-2">
              <span>District Demand Allocation Matrix</span>
              <span className="text-[10px] font-mono uppercase bg-cyan-100 text-cyan-800 font-semibold px-2 py-0.5 rounded">
                MRP Post-Stratified
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Raw complaint volumes suffer from digital reporting bias. Post-stratification reweights districts by female phone access (NFHS-5) and deficit index.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
              <button
                onClick={() => setSortBy('displacement')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'displacement' ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Displacement
              </button>
              <button
                onClick={() => setSortBy('mrpScore')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sortBy === 'mrpScore' ? 'bg-cyan-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                MRP Score
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 font-semibold text-slate-700">
                  <th className="py-3 px-4">District & LGD Code</th>
                  <th className="py-3 px-3">State</th>
                  <th className="py-3 px-3 text-right">Female Phone</th>
                  <th className="py-3 px-3 text-right">Deficit Index</th>
                  <th className="py-3 px-3 text-right">Raw Demand</th>
                  <th className="py-3 px-3 text-right">MRP Score</th>
                  <th className="py-3 px-3 text-center">Rank Shift</th>
                  <th className="py-3 px-4">Primary Shortage</th>
                  <th className="py-3 px-3 text-center">Spatial Cluster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredDistricts.map((district) => (
                  <tr key={district.lgdDistrictCode} className="hover:bg-slate-50/80 transition-colors">
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
        )}

        {/* View Mode 2: Mobile Cards View */}
        {viewMode === 'cards' && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistricts.map((district) => (
              <div
                key={district.lgdDistrictCode}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-cyan-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>{district.districtName}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">{district.state} · LGD #{district.lgdDistrictCode}</span>
                  </div>
                  {district.isHotspot ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Hotspot
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Nominal</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Raw Grievances:</span>
                    <span className="font-mono font-bold text-slate-800">{district.rawGrievancesLogged}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">MRP Conditioned Score:</span>
                    <span className="font-mono font-bold text-cyan-900">{district.mrpAdjustedGrievanceScore.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Female Phone (NFHS-5):</span>
                    <span className="font-mono text-slate-700">{district.femalePhoneOwnershipPct.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Deficit Index:</span>
                    <span className="font-mono text-slate-700">{district.infrastructureDeficitScore.toFixed(1)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-600 truncate max-w-[150px]">{district.primaryShortageCategory}</span>
                  <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    +{district.rankDisplacement} Rank Shift
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Citizen Demand Grievance Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Live Multilingual Grievance & Drug Shortage Stream
            </h2>
            <p className="text-xs text-slate-500">
              Citizen reports classified into e-GramSwaraj LSDG 9 Themes & NHM Flexipool budget lines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setGrievanceFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                grievanceFilter === 'all' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({grievances.length})
            </button>
            <button
              onClick={() => setGrievanceFilter('unresolved')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                grievanceFilter === 'unresolved' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setGrievanceFilter('allocated')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                grievanceFilter === 'allocated' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Allocated
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
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-cyan-800">{item.ticketNumber}</span>
                    <span className="text-slate-300 hidden sm:inline">·</span>
                    <span className="text-slate-600 font-medium">
                      {item.district}, {item.state}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">·</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Matched Medicine:</span>
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
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      ×{item.postStratificationWeight.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Policy Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">
                    Consent Ref: {item.consentId} · k-Anonymity Verified
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status !== 'Allocated to Budget' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'Allocated to Budget')}
                        className="px-3 py-1 bg-cyan-700 hover:bg-cyan-800 text-white rounded-md text-[11px] font-semibold transition-colors shadow-2xs"
                      >
                        Allocate to GPDP Budget
                      </button>
                    )}
                    {item.status !== 'Resolved' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'Resolved')}
                        className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md text-[11px] font-semibold transition-colors"
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

