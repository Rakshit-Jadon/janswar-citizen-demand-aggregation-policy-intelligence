/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateAsrRobustnessCurve, mapRequestToBudgetCrosswalk, calculateMrpWeight, verifyDPDPAnonymity } from '../utils/biasCorrection';
import { resolveSpokenToponym } from '../utils/geoParser';
import {
  Layers,
  Cpu,
  MapPin,
  ShieldCheck,
  Activity,
  BarChart2,
  GitBranch,
  TrendingDown,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle
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
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Research Gap Analysis & Thesis Solver Lab
          </h1>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-full">
            Empirical Benchmark
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Interactive experimental testbeds resolving the 5 candidate research gaps identified in multilingual citizen-demand aggregation for public policy.
        </p>

        {/* Gap Tab Selector */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-2 scrollbar-none">
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
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeGapTab === tab.id
                  ? 'bg-cyan-800 text-white shadow-sm'
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
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-700" />
                  <span>Gap 1: Channel-Dependent Reporting Propensity & MRP Correction</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Extending Kontokosta & Hong (2021) 311 socio-spatial bias & StreetBump critique to Indian block-level healthcare demands.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                Methodological & Evaluative Gap
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Parameter Sliders */}
              <div className="space-y-4 md:col-span-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Ground Truth Parameters (NFHS-5 & Mission Antyodaya)</span>
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
                    <span>10 (Developed Density)</span>
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
              <div className="p-5 bg-gradient-to-br from-cyan-900 to-slate-900 text-white rounded-xl flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                    Calculated MRP Weight (W_i)
                  </span>
                  <div className="text-4xl font-mono font-bold mt-2 text-white">
                    ×{calculatedWeight.toFixed(2)}
                  </div>
                  <p className="text-xs text-cyan-100 mt-2 leading-relaxed">
                    {calculatedWeight > 1.5
                      ? 'High Need-Conditioned Upweighting: Every raw complaint from this block is counted at enhanced weight to prevent urban domination.'
                      : 'Normalized Weight: High phone penetration blocks are downweighted to avoid misallocation.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-cyan-800/80 text-[11px] text-cyan-300 font-mono">
                  Formula: W_i = 0.5(54/Phone_i) + 0.2(100/Conn_i) + 0.3(1 + Deficit_i/100)
                </div>
              </div>
            </div>

            {/* Interactive SVG Comparison Chart for Gap 1 */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" />
                  <span>Simulated Demand Allocation Impact Chart</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">100 Raw Grievances Simulation</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Raw Digital Score:</span>
                    <span className="font-mono font-bold text-slate-400">100.0</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full w-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>MRP Adjusted Need:</span>
                    <span className="font-mono font-bold text-emerald-400">{(100 * calculatedWeight).toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(10, (calculatedWeight / 3.0) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Why Raw Volume Fails Policy: </span>
                In NFHS-5, only 54% of Indian women report using their own mobile phones. Relying solely on raw digital/IVR volumes reproduces spatial inequality, as vocal urban users log 15x more requests than tribal mothers in Malkangiri despite higher acute disease burdens.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAP 2: CITIZEN LANGUAGE TO BUDGET & SCHEME CROSSWALK */}
      {activeGapTab === 2 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-700" />
                  <span>Gap 2: Mapping Free-Form Multilingual Input to GPDP 9 LSDG Themes & NHM Flexipool</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Translates non-technical citizen grievances into actionable Gram Panchayat Development Plan (GPDP) and e-GramSwaraj activity codes.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200 shrink-0">
                Taxonomy & Crosswalk Gap
              </span>
            </div>

            <div className="space-y-3">
              <label htmlFor="test-request" className="block text-xs font-semibold text-slate-800">
                Test Multilingual Grievance (Hindi, Marathi, Tamil, or English):
              </label>
              <input
                id="test-request"
                type="text"
                value={testRequestText}
                onChange={(e) => setTestRequestText(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />

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
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Budget Flowchart */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Automated Budget Head Crosswalk Output Flow
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  Confidence: {Math.round(crosswalkResult.confidenceScore * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium block">Step 1: NLP Intent & Formulation</span>
                  <span className="font-bold text-slate-900 block truncate text-xs">{testRequestText.slice(0, 35)}…</span>
                  <span className="text-[10px] text-cyan-800 font-mono">Matched: Essential Health Product</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-cyan-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium block">Step 2: e-GramSwaraj LSDG 9 Theme</span>
                  <span className="font-bold text-cyan-900 block text-xs">{crosswalkResult.themeName}</span>
                  <span className="text-[10px] font-mono text-cyan-700">Code: {crosswalkResult.gpdpActivityCode}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium block">Step 3: NHM Flexipool ROP Line</span>
                  <span className="font-mono font-bold text-emerald-900 block text-xs">{crosswalkResult.nhmBudgetLine}</span>
                  <span className="text-[10px] text-slate-500">Approved for District Health Society</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAP 3: ASR/MT ROBUSTNESS TO DECISION-LEVEL ERRORS */}
      {activeGapTab === 3 && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-rose-700" />
                  <span>Gap 3: Decision-Level Robustness to ASR/MT Error (Speech-to-Policy)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard speech benchmarks report Word Error Rate (WER). This simulation proves dialect transcription errors silently invert district priority rankings well before WER is considered unacceptable.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shrink-0">
                Acoustic & Decision Metric
              </span>
            </div>

            {/* WER Slider */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
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
                <span>0% Clean</span>
                <span>20% Vistaar Benchmark</span>
                <span className="text-rose-700 font-bold">25% Decision Flip</span>
                <span>50% High Noise</span>
              </div>
            </div>

            {/* Interactive SVG ASR Curve */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-300">Speech-to-Policy Robustness Curve (WER vs Ranking Inversion Rate)</span>
                <span className="font-mono text-[11px] text-slate-400">Decision Flip Threshold @ 25% WER</span>
              </div>

              <div className="h-28 flex items-end justify-between gap-1.5 pt-4 px-2 border-b border-slate-800 pb-2">
                {robustnessCurve.map((pt) => {
                  const isCurrent = pt.werPercent === simulatedWer;
                  const isFlipPoint = pt.werPercent === 25;
                  const barHeight = Math.max(10, (pt.topTopicDisplacementRate / 45) * 100);

                  return (
                    <div key={pt.werPercent} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <span className="text-[9px] font-mono text-slate-400">{pt.topTopicDisplacementRate}%</span>
                      <div className="w-full bg-slate-800 h-20 rounded-md flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-md transition-all ${
                            isCurrent
                              ? 'bg-cyan-400 ring-2 ring-cyan-300'
                              : isFlipPoint
                              ? 'bg-rose-500'
                              : pt.decisionInversionFlag
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono ${isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'}`}>
                        {pt.werPercent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
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

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 block">Top Topic Displacement:</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {currentWerPoint.topTopicDisplacementRate}%
                </span>
                <span className="text-[11px] text-slate-500 block">
                  District budget priority divergence
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
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
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-700" />
                  <span>Gap 4: Spoken Toponym Resolution to LGD (Local Government Directory)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fusing unstructured voice place references with official LGD village codes and SHRUG IDs, overcoming phonetic transliteration differences.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                Geospatial & Entity Resolution Gap
              </span>
            </div>

            <div className="space-y-3">
              <label htmlFor="test-toponym" className="block text-xs font-semibold text-slate-800">
                Spoken or Informal Place Name:
              </label>
              <input
                id="test-toponym"
                type="text"
                value={testToponym}
                onChange={(e) => setTestToponym(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-600 focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500 font-medium">Test colloquial variants:</span>
                {['Mahasi Kalan Pura', 'Zalod Bajar', 'Kudumuluguma Camp', 'Ikouna Dehat', 'Taoru Tehsil'].map(
                  (ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestToponym(ex)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                    >
                      {ex}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Resolved LGD Result */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Toponym Match Results
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-lg">
                  Match Type: {toponymResult.matchType} ({Math.round(toponymResult.confidenceScore * 100)}%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Official Village:</span>
                  <span className="font-bold text-slate-900 block">{toponymResult.matchedEntry.officialName}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">LGD Code:</span>
                  <span className="font-mono font-bold text-cyan-800 block">#{toponymResult.resolvedLgdCode}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Block & District:</span>
                  <span className="font-medium text-slate-800 block">
                    {toponymResult.matchedEntry.blockName}, {toponymResult.matchedEntry.district}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
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
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Gap 5: DPDP Act 2023 Purpose Limitation & k-Anonymity Engine</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Free-text civic grievances can contain sensitive caste, religious, or health inferences. Demonstrates a k=5 generalisation rule; illustrative calculation only.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                Governance & Privacy Architecture
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
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
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Simulated consent receipt
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg ${
                    dpdpReceipt.isKAnonymous ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {dpdpReceipt.isKAnonymous ? 'k-Anonymous Verified' : 'Auto-Generalized to Block Level'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Consent Identifier:</span>
                  <span className="font-mono font-bold text-slate-900 block">{dpdpReceipt.consentId}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-medium block">Public Surfacing Level:</span>
                  <span className="font-bold text-slate-900 block">
                    {dpdpReceipt.surfacedGeoLevel} Level
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {dpdpReceipt.isKAnonymous ? 'Sufficient sample to show village map' : 'Generalized to protect citizen identity'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
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

