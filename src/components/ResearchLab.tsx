/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateAsrRobustnessCurve, mapRequestToBudgetCrosswalk, calculateMrpWeight, verifyDPDPAnonymity } from '../utils/biasCorrection';
import { resolveSpokenToponym, LGD_BENCHMARK_DIRECTORY } from '../utils/geoParser';
import { LSDG_THEMES } from '../data/abdmDistricts';
import {
  Layers,
  Cpu,
  MapPin,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

export const ResearchLab: React.FC = () => {
  const [activeGapTab, setActiveGapTab] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Gap 1 state: MRP parameters
  const [femalePhoneSim, setFemalePhoneSim] = useState<number>(36.4); // e.g. Bahraich default
  const [infraDeficitSim, setInfraDeficitSim] = useState<number>(84.5);
  const [connectivitySim, setConnectivitySim] = useState<number>(41.2);

  // Gap 2 state: Crosswalk test input
  const [testRequestText, setTestRequestText] = useState<string>(
    'हमारे उपकेंद्र पर महिलाओं के लिए आयरन फोलिक एसिड और सेनेटरी पैड की कमी है'
  );
  const crosswalkResult = mapRequestToBudgetCrosswalk(testRequestText);

  // Gap 3 state: ASR WER simulation
  const [simulatedWer, setSimulatedWer] = useState<number>(20);
  const robustnessCurve = generateAsrRobustnessCurve();
  const currentWerPoint = robustnessCurve.find((p) => p.werPercent === simulatedWer) || robustnessCurve[4];

  // Gap 4 state: Toponym resolution
  const [testToponym, setTestToponym] = useState<string>('Mahasi Kalan Pura');
  const toponymResult = resolveSpokenToponym(testToponym);

  // Gap 5 state: DPDP k-anonymity
  const [simulatedReportsCount, setSimulatedReportsCount] = useState<number>(3);
  const dpdpReceipt = verifyDPDPAnonymity(simulatedReportsCount, 'Mahasi', 'Mahasi Block', 'Bahraich');

  const calculatedWeight = calculateMrpWeight(femalePhoneSim, connectivitySim, infraDeficitSim);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Research Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Research Gap Analysis & Thesis Solver Lab
          </h1>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded">
            Empirical Benchmark
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Interactive experimental testbeds resolving the 5 candidate research gaps identified in multilingual citizen-demand aggregation for public policy.
        </p>

        {/* Gap Tab Selector */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1">
          {[
            { id: 1, label: 'Gap 1: Reporting Bias (MRP)' },
            { id: 2, label: 'Gap 2: Budget Crosswalk' },
            { id: 3, label: 'Gap 3: ASR Robustness' },
            { id: 4, label: 'Gap 4: Toponym Resolution' },
            { id: 5, label: 'Gap 5: DPDP Consent & k-Anonymity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGapTab(tab.id as 1 | 2 | 3 | 4 | 5)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeGapTab === tab.id
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* GAP 1: REPORTING BIAS & POST-STRATIFICATION */}
      {activeGapTab === 1 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gap 1: Channel-Dependent Reporting Propensity & MRP Correction
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extending Kontokosta & Hong (2021) 311 socio-spatial bias & StreetBump critique to Indian block-level healthcare demands.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Methodological & Evaluative Gap
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Parameter Sliders */}
              <div className="space-y-4 md:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ground Truth Parameters (NFHS-5 & Mission Antyodaya)
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">Female Phone Ownership (NFHS-5):</span>
                    <span className="font-mono font-bold text-cyan-800">{femalePhoneSim.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="0.5"
                    value={femalePhoneSim}
                    onChange={(e) => setFemalePhoneSim(parseFloat(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>15% (Severe Gender Divide)</span>
                    <span>National Avg: 54%</span>
                    <span>90% (Metropolitan Urban)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">Infrastructure Deficit Score (Mission Antyodaya):</span>
                    <span className="font-mono font-bold text-amber-700">{infraDeficitSim.toFixed(1)} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    step="0.5"
                    value={infraDeficitSim}
                    onChange={(e) => setInfraDeficitSim(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>10 (Developed Facility Density)</span>
                    <span>95 (Critical Deprivation)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">Rural 4G / Broadband Connectivity:</span>
                    <span className="font-mono font-bold text-slate-800">{connectivitySim.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="98"
                    step="1"
                    value={connectivitySim}
                    onChange={(e) => setConnectivitySim(parseFloat(e.target.value))}
                    className="w-full accent-slate-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Dynamic Weight Output Box */}
              <div className="p-5 bg-cyan-900 text-white rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
                    Calculated MRP Weight (W_i)
                  </span>
                  <div className="text-4xl font-mono font-bold mt-2 text-white">
                    ×{calculatedWeight.toFixed(2)}
                  </div>
                  <p className="text-xs text-cyan-100 mt-2 leading-relaxed">
                    {calculatedWeight > 1.5
                      ? 'High Need-Conditioned Upweighting: Every raw complaint from this block is counted at enhanced weight to prevent urban domination.'
                      : 'Normalized Metropolitan Weight: High phone penetration blocks are downweighted to avoid misallocation.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-cyan-800/80 text-[11px] text-cyan-300 font-mono">
                  Formula: W_i = 0.5(54/Phone_i) + 0.2(100/Conn_i) + 0.3(1 + Deficit_i/100)
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Why Raw Volume Fails Policy: </span>
                In NFHS-5, only 54% of Indian women report using their own mobile phones. Relying solely on raw digital/IVR volumes reproduces spatial inequality, as vocal urban users in Pune or Bengaluru log 15x more requests than tribal mothers in Malkangiri despite higher acute disease burdens.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAP 2: CITIZEN LANGUAGE TO BUDGET & SCHEME CROSSWALK */}
      {activeGapTab === 2 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gap 2: Mapping Free-Form Multilingual Input to GPDP 9 LSDG Themes & NHM Flexipool
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Translates non-technical citizen grievances into actionable Gram Panchayat Development Plan (GPDP) and e-GramSwaraj activity codes.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded border border-cyan-200">
                Taxonomy & Crosswalk Gap
              </span>
            </div>

            <div className="space-y-3">
              <label htmlFor="test-request" className="block text-xs font-semibold text-slate-800">
                Test Multilingual Grievance (Hindi, Marathi, Tamil, or English):
              </label>
              <div className="flex gap-2">
                <input
                  id="test-request"
                  type="text"
                  value={testRequestText}
                  onChange={(e) => setTestRequestText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 font-medium">Preset examples:</span>
                {[
                  'बच्चों की पैरासिटामोल सिरप नहीं है (Paediatric paracetamol shortage)',
                  'गर्भवती महिलाओं के लिए आयरन और सेनेटरी पैड की कमी (Maternal iron shortage)',
                  'मलेरिया का टीका और दवाई नहीं मिल रही (Malaria outbreak supplies)',
                  'डायबिटीज और बीपी की दवा खत्म हो गई (Chronic diabetes & BP stockout)'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTestRequestText(preset)}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Crosswalk Output Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Automated Budget Head Crosswalk Output
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Confidence: {Math.round(crosswalkResult.confidenceScore * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium block">
                    e-GramSwaraj LSDG 9 Themes Alignment:
                  </span>
                  <span className="font-bold text-slate-900 block text-sm">
                    {crosswalkResult.themeName}
                  </span>
                  <span className="font-mono text-cyan-800 text-[11px]">
                    Activity Code: {crosswalkResult.gpdpActivityCode}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium block">
                    National Health Mission (NHM) Budget Head:
                  </span>
                  <span className="font-mono font-bold text-slate-900 block">
                    {crosswalkResult.nhmBudgetLine}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Recognized under District Health Society Annual Work Plan (ROP)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAP 3: ASR/MT ROBUSTNESS TO DECISION-LEVEL ERRORS */}
      {activeGapTab === 3 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gap 3: Decision-Level Robustness to ASR/MT Error (Speech-to-Policy)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard speech benchmarks report Word Error Rate (WER). This simulation proves that dialect transcription errors silently invert district priority rankings well before WER is considered unacceptable.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                Acoustic & Decision Metric
              </span>
            </div>

            {/* WER Slider */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Simulate Dialect Acoustic WER:
                </span>
                <span className="font-mono font-bold text-base text-cyan-800">
                  {simulatedWer}% Word Error Rate
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={simulatedWer}
                onChange={(e) => setSimulatedWer(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0% (Clean Studio)</span>
                <span>20% (Rural Vistaar Benchmark)</span>
                <span className="text-rose-700 font-bold">25% (Decision Inversion Flip Point)</span>
                <span>50% (High Dialect Drift)</span>
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Ranking Inversion Status:</span>
                <span
                  className={`text-base font-bold font-mono ${
                    currentWerPoint.decisionInversionFlag ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {currentWerPoint.decisionInversionFlag ? 'FLIPPED (Critical Distortion)' : 'STABLE (Tolerant)'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {currentWerPoint.decisionInversionFlag
                    ? 'Dialect noise has inverted top allocation priority!'
                    : 'Downstream prioritization preserves ground truth.'}
                </span>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Top Topic Displacement:</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {currentWerPoint.topTopicDisplacementRate}%
                </span>
                <span className="text-[11px] text-slate-500 block">
                  District budget priority divergence
                </span>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Critical Drug Classification F1:</span>
                <span className="text-xl font-bold font-mono tabular-nums text-cyan-800">
                  {currentWerPoint.criticalDrugClassificationF1.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Precision in extracting essential drugs
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAP 4: SPOKEN TOPONYM RESOLUTION TO LGD CODES */}
      {activeGapTab === 4 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gap 4: Spoken Toponym Resolution to LGD (Local Government Directory)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fusing unstructured voice place references with official LGD village codes and SHRUG IDs, overcoming phonetic transliteration differences.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                Geospatial & Entity Resolution Gap
              </span>
            </div>

            <div className="space-y-3">
              <label htmlFor="test-toponym" className="block text-xs font-semibold text-slate-800">
                Spoken or Informal Place Name:
              </label>
              <div className="flex gap-2">
                <input
                  id="test-toponym"
                  type="text"
                  value={testToponym}
                  onChange={(e) => setTestToponym(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 font-medium">Test colloquial variants:</span>
                {['Mahasi Kalan Pura', 'Zalod Bajar', 'Kudumuluguma Camp', 'Ikouna Dehat', 'Taoru Tehsil'].map(
                  (ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestToponym(ex)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    >
                      {ex}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Resolved LGD Result */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Toponym Match Results
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded">
                  Match Type: {toponymResult.matchType} ({Math.round(toponymResult.confidenceScore * 100)}%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Official Village:</span>
                  <span className="font-bold text-slate-900 block">{toponymResult.matchedEntry.officialName}</span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">LGD Code:</span>
                  <span className="font-mono font-bold text-cyan-800 block">#{toponymResult.resolvedLgdCode}</span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Block & District:</span>
                  <span className="font-medium text-slate-800 block">
                    {toponymResult.matchedEntry.blockName}, {toponymResult.matchedEntry.district}
                  </span>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">SHRUG Geo ID:</span>
                  <span className="font-mono text-slate-700 block">{toponymResult.matchedEntry.shrugId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAP 5: DPDP ACT 2023 CONSENT & K-ANONYMITY */}
      {activeGapTab === 5 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Gap 5: DPDP Act 2023 Purpose Limitation & k-Anonymity Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Free-text civic grievances can contain sensitive caste, religious, or health inferences. This illustrative calculation demonstrates a possible k=5 generalisation rule; it is not a production privacy control.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Governance & Privacy Architecture
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Simulate Grievance Cluster Count in Target Village:
                </span>
                <span className="font-mono font-bold text-base text-cyan-800">
                  {simulatedReportsCount} Reports Logged
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={simulatedReportsCount}
                onChange={(e) => setSimulatedReportsCount(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span className="text-rose-700 font-semibold">1 (High Re-Identification Risk)</span>
                <span>k=5 Safe Boundary Threshold</span>
                <span className="text-emerald-700 font-semibold">15 (Full Anonymity Achieved)</span>
              </div>
            </div>

            {/* Privacy Receipt Card */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Simulated consent receipt
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    dpdpReceipt.isKAnonymous ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {dpdpReceipt.isKAnonymous ? 'k-Anonymous Verified' : 'Auto-Generalized to Block Level'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Consent Identifier:</span>
                  <span className="font-mono font-bold text-slate-900 block">{dpdpReceipt.consentId}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Public Surfacing Level:</span>
                  <span className="font-bold text-slate-900 block">
                    {dpdpReceipt.surfacedGeoLevel} Level
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {dpdpReceipt.isKAnonymous ? 'Sufficient sample to show village map' : 'Generalized to protect citizen identity'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Example receipt identifier:</span>
                  <span className="font-mono text-cyan-800 text-[11px] block truncate">
                    {dpdpReceipt.hashDigest}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
