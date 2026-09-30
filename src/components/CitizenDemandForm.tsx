/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MEDICINE_CATALOG } from '../data/medicineCatalog';
import { INDIC_LANGUAGES } from '../data/seedGrievances';
import { CitizenGrievance, GrievanceType, IndicLanguage, MedicineProduct } from '../types';
import { checkRateLimit, validateCitizenText, validateNumericPrice } from '../utils/security';
import { resolveSpokenToponym } from '../utils/geoParser';
import { calculateMrpWeight, mapRequestToBudgetCrosswalk, verifyDPDPAnonymity } from '../utils/biasCorrection';
import {
  Mic,
  MicOff,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingDown,
  MapPin,
  Sparkles
} from 'lucide-react';

interface CitizenDemandFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGrievance: (grievance: CitizenGrievance) => void;
  initialLanguage: IndicLanguage;
  preselectedDrug: MedicineProduct | null;
  onOpenPrivacyPolicy: () => void;
}

export const CitizenDemandForm: React.FC<CitizenDemandFormProps> = ({
  isOpen,
  onClose,
  onSubmitGrievance,
  initialLanguage,
  preselectedDrug,
  onOpenPrivacyPolicy
}) => {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [selectedLang, setSelectedLang] = useState<IndicLanguage>(initialLanguage);
  const [dialect, setDialect] = useState<string>('Standard Rural');
  const [spokenText, setSpokenText] = useState('');
  const [translatedEnglish, setTranslatedEnglish] = useState('');
  const [grievanceType, setGrievanceType] = useState<GrievanceType>('stockout');
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<MedicineProduct | null>(null);
  const [marketPriceCharged, setMarketPriceCharged] = useState<string>('');
  const [spokenLocality, setSpokenLocality] = useState('');
  const [urgency, setUrgency] = useState<'Immediate Emergency' | 'High Priority' | 'Routine Demand'>('High Priority');
  const [dpdpConsentChecked, setDpdpConsentChecked] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number } | null>(null);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  // Sync initial language
  useEffect(() => {
    setSelectedLang(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    if (preselectedDrug) {
      setSelectedDrug(preselectedDrug);
      setDrugSearchQuery(preselectedDrug.genericName);
    }
  }, [preselectedDrug]);

  // Voice recording timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  // Filter medicines by search query
  const filteredDrugs = drugSearchQuery.trim()
    ? MEDICINE_CATALOG.filter(
        (m) =>
          m.genericName.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
          m.groupName.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
          m.commonIndications.some((i) => i.toLowerCase().includes(drugSearchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSimulateVoiceInput = () => {
    if (isRecording) {
      // Finish recording simulation
      setIsRecording(false);
      // Generate sample realistic dialect utterance based on language
      if (selectedLang === 'hi') {
        setSpokenText("हमारे स्वास्थ्य केंद्र में 15 दिन से बच्चों की पैरासिटामोल सिरप नहीं है। मेडिकल वाले 90 रुपये मांग रहे हैं।");
        setTranslatedEnglish("In our health centre, paediatric paracetamol syrup has been unavailable for 15 days. Private chemists demand Rs 90.");
        if (!selectedDrug) {
          const drug = MEDICINE_CATALOG.find((m) => m.drugCode === 22) || null;
          setSelectedDrug(drug);
          setMarketPriceCharged('90');
        }
        if (!spokenLocality) setSpokenLocality('Mahasi Kalan, Bahraich');
      } else if (selectedLang === 'mr') {
        setSpokenText("प्राथमिक आरोग्य केंद्रात बीपी चे औषध टेलमिसार्टन संपले आहे. बाहेर खूप महाग मिळते.");
        setTranslatedEnglish("Hypertension drug Telmisartan is exhausted in the Primary Health Centre. Outside pharmacies charge exorbitant prices.");
        if (!selectedDrug) {
          const drug = MEDICINE_CATALOG.find((m) => m.drugCode === 300) || null;
          setSelectedDrug(drug);
          setMarketPriceCharged('90');
        }
        if (!spokenLocality) setSpokenLocality('Kothrud, Pune');
      } else if (selectedLang === 'ta') {
        setSpokenText("ஆரம்ப சுகாதார நிலையத்தில் சர்க்கரை நோய் பரிசோதனைக்கான குளுக்கோமீட்டர் ஸ்ட்ரிப்ஸ் இல்லை.");
        setTranslatedEnglish("In the Primary Health Centre, glucometer test strips for diabetes screening are missing.");
        if (!selectedDrug) {
          const drug = MEDICINE_CATALOG.find((m) => m.drugCode === 8121) || null;
          setSelectedDrug(drug);
          setMarketPriceCharged('750');
        }
        if (!spokenLocality) setSpokenLocality('Alangulam, Tenkasi');
      } else {
        setSpokenText("Essential antibiotic amoxycillin-clavulanic acid is stockout at our block CHC. Private shops are charging Rs 210.");
        setTranslatedEnglish("Essential antibiotic amoxycillin-clavulanic acid is stockout at our block CHC. Private shops are charging Rs 210.");
        if (!selectedDrug) {
          const drug = MEDICINE_CATALOG.find((m) => m.drugCode === 39) || null;
          setSelectedDrug(drug);
          setMarketPriceCharged('210');
        }
        if (!spokenLocality) setSpokenLocality('Jhalod, Dahod');
      }
    } else {
      // Start recording
      setIsRecording(true);
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Rate Limiting Check
    const rateCheck = checkRateLimit('grievance_submission');
    if (!rateCheck.allowed) {
      setValidationError(rateCheck.error || 'Rate limit triggered. Please wait before submitting another report.');
      return;
    }
    setRateLimitInfo({ remaining: rateCheck.remaining });

    // 2. Strict Input Validation
    const textValidation = validateCitizenText(spokenText, 'Grievance description', 8, 1000);
    if (!textValidation.isValid) {
      setValidationError(textValidation.errorMessage || 'Please describe your medicine access issue.');
      return;
    }

    if (!spokenLocality.trim()) {
      setValidationError('Please enter your village, town, or local health centre name.');
      return;
    }

    // 3. DPDP Act 2023 Consent validation
    if (!dpdpConsentChecked) {
      setValidationError('You must accept the purpose-limitation consent checkbox pursuant to DPDP Act 2023.');
      return;
    }

    // 4. Overcharge Price validation (if entered)
    let parsedPrice: number | undefined;
    let overchargeDelta: number | undefined;
    if (marketPriceCharged) {
      const priceValidation = validateNumericPrice(marketPriceCharged, 0, 100000);
      if (!priceValidation.isValid) {
        setValidationError(priceValidation.errorMessage || 'Invalid market price amount.');
        return;
      }
      parsedPrice = priceValidation.sanitizedValue;
      if (selectedDrug && parsedPrice !== undefined) {
        overchargeDelta = Number(Math.max(0, parsedPrice - selectedDrug.mrp).toFixed(2));
      }
    }

    // 5. Research Gap 4: Spoken Toponym Resolution to LGD Code
    const toponymResult = resolveSpokenToponym(spokenLocality);
    if (!toponymResult.isConfident) {
      setValidationError('This locality does not match the small demonstration directory closely enough. Choose a listed sample locality or do not submit it as an LGD match.');
      return;
    }

    // 6. Research Gap 2: Crosswalk to GPDP LSDG Theme and NHM Budget Head
    const crosswalk = mapRequestToBudgetCrosswalk(
      translatedEnglish || spokenText,
      selectedDrug?.groupName
    );

    // 7. Research Gap 1: Need-conditioned MRP reweighting
    // Default district parameters: NFHS-5 45% female phone, 50% rural broadband, 75 deficit
    const mrpWeight = calculateMrpWeight(45.0, 50.0, 75.0);

    // 8. Research Gap 5: DPDP Act Anonymity verification
    const dpdpReceipt = verifyDPDPAnonymity(
      3,
      toponymResult.matchedEntry.officialName,
      toponymResult.matchedEntry.blockName,
      toponymResult.matchedEntry.district
    );

    const ticketNumber = `JS-${toponymResult.matchedEntry.state.substring(0, 2).toUpperCase()}-${toponymResult.matchedEntry.district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGrievance: CitizenGrievance = {
      id: `GRV-${Date.now()}`,
      ticketNumber,
      createdAt: new Date().toISOString(),
      language: selectedLang,
      dialect,
      channel: inputMode,
      rawInput: textValidation.sanitizedValue || spokenText,
      translatedEnglish: translatedEnglish || spokenText,
      grievanceType,
      selectedDrugCode: selectedDrug?.drugCode,
      selectedDrugName: selectedDrug?.genericName,
      unitSize: selectedDrug?.unitSize,
      statutoryMrp: selectedDrug?.mrp,
      marketPriceCharged: parsedPrice,
      overchargeAmount: overchargeDelta,
      spokenLocality,
      resolvedLgdVillage: `${toponymResult.matchedEntry.officialName} (LGD: ${toponymResult.resolvedLgdCode})`,
      resolvedLgdCode: toponymResult.resolvedLgdCode,
      district: toponymResult.matchedEntry.district,
      state: toponymResult.matchedEntry.state,
      urgency,
      rawCountWeight: 1.0,
      postStratificationWeight: mrpWeight,
      lsdgThemeId: crosswalk.themeId,
      lsdgThemeName: crosswalk.themeName,
      budgetHeadCode: crosswalk.nhmBudgetLine,
      budgetHeadName: crosswalk.themeName,
      confidenceScore: crosswalk.confidenceScore,
      consentId: dpdpReceipt.consentId,
      consentTimestamp: new Date().toISOString(),
      purposeLimitationAcknowledged: true,
      kAnonymityProtected: dpdpReceipt.isKAnonymous,
      status: 'Surfaced'
    };

    onSubmitGrievance(newGrievance);
    setSuccessTicket(ticketNumber);
  };

  const handleReset = () => {
    setSuccessTicket(null);
    setSpokenText('');
    setTranslatedEnglish('');
    setSelectedDrug(null);
    setMarketPriceCharged('');
    setSpokenLocality('');
    setDpdpConsentChecked(false);
    setValidationError(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Health-Demand Shortage Form</span>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                Demo Prototype
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Browser-only demonstration of voice/text grievance classification. Do not submit real personal data.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {successTicket ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Demand Successfully Recorded</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ticket Reference:</span>
                  <span className="font-mono font-bold text-cyan-800">{successTicket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolved LGD Location:</span>
                  <span className="font-semibold text-slate-800">
                    {resolveSpokenToponym(spokenLocality).matchedEntry.officialName} (District: {resolveSpokenToponym(spokenLocality).matchedEntry.district})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">LSDG Budget Crosswalk:</span>
                  <span className="font-semibold text-slate-800">
                    {mapRequestToBudgetCrosswalk(translatedEnglish || spokenText).themeName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MRP Needs-Weight Applied:</span>
                  <span className="font-mono text-emerald-700 font-bold">×{calculateMrpWeight(45, 50, 75)}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                This example report is held only in this browser until the page is reloaded. It has not been encrypted, transmitted, or forwarded to a District Medical Officer or any other authority.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {validationError && (
                <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Mode Selector & Language Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInputMode('voice')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      inputMode === 'voice'
                        ? 'bg-cyan-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Input</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      inputMode === 'text'
                        ? 'bg-cyan-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                    }`}
                  >
                    <span>Text Input</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <label htmlFor="modal-lang-select" className="text-slate-500 font-medium">
                    Language:
                  </label>
                  <select
                    id="modal-lang-select"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value as IndicLanguage)}
                    className="px-2 py-1 bg-white border border-slate-300 rounded font-medium text-slate-800 text-xs focus:ring-1 focus:ring-cyan-600 focus:outline-none"
                  >
                    {INDIC_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.nativeName} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Voice Recording Simulator Area (if Voice Mode) */}
              {inputMode === 'voice' && (
                <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/50 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleSimulateVoiceInput}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isRecording
                          ? 'bg-rose-600 text-white shadow-lg animate-pulse ring-4 ring-rose-200'
                          : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow'
                      }`}
                      aria-label={isRecording ? 'Stop example input timer' : 'Fill example input'}
                    >
                      {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">
                      {isRecording ? `Preparing example in ${selectedLang.toUpperCase()} (${recordingSeconds}s)… Activate to finish` : 'Fill an example grievance'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      No microphone is accessed. This control only fills built-in demonstration text.
                    </span>
                  </div>

                  {isRecording && (
                    <div className="flex items-center gap-1 h-5">
                      <div className="w-1 bg-cyan-600 animate-[bounce_0.6s_infinite] h-3 rounded-full" />
                      <div className="w-1 bg-cyan-600 animate-[bounce_0.7s_infinite_0.1s] h-5 rounded-full" />
                      <div className="w-1 bg-cyan-600 animate-[bounce_0.5s_infinite_0.2s] h-4 rounded-full" />
                      <div className="w-1 bg-cyan-600 animate-[bounce_0.8s_infinite_0.3s] h-2 rounded-full" />
                      <div className="w-1 bg-cyan-600 animate-[bounce_0.6s_infinite_0.15s] h-5 rounded-full" />
                    </div>
                  )}
                </div>
              )}

              {/* Spoken/Typed Grievance Textarea */}
              <div className="space-y-1.5">
                <label htmlFor="grievance-text" className="block text-xs font-semibold text-slate-800">
                  Citizen Statement / Grievance Content *
                </label>
                <textarea
                  id="grievance-text"
                  rows={3}
                  value={spokenText}
                  onChange={(e) => setSpokenText(e.target.value)}
                  placeholder="Describe the drug shortage, clinic closure, or price overcharged..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 outline-none text-slate-800 resize-none font-sans"
                />
                {translatedEnglish && translatedEnglish !== spokenText && (
                  <div className="text-[11px] bg-slate-100 p-2 rounded border border-slate-200 text-slate-700">
                    <span className="font-semibold text-slate-900">Standardized English Crosswalk: </span>
                    {translatedEnglish}
                  </div>
                )}
              </div>

              {/* Medicine Lookup against provided CSV Catalog */}
              <div className="space-y-1.5">
                <label htmlFor="medicine-search" className="block text-xs font-semibold text-slate-800">
                  Match with the sample medicine catalog (56 entries)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="medicine-search"
                    type="text"
                    value={drugSearchQuery}
                    onChange={(e) => setDrugSearchQuery(e.target.value)}
                    placeholder="Search generic formulation (e.g. Paracetamol, Metformin, Telmisartan, Artesunate, ORS)..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {filteredDrugs.length > 0 && (
                  <div className="border border-slate-200 rounded-lg bg-white shadow-lg overflow-hidden divide-y divide-slate-100 max-h-44 overflow-y-auto">
                    {filteredDrugs.map((drug) => (
                      <button
                        key={drug.drugCode}
                        type="button"
                        onClick={() => {
                          setSelectedDrug(drug);
                          setDrugSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-cyan-50 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{drug.genericName}</div>
                          <div className="text-[10px] text-slate-500">
                            Code: {drug.drugCode} · {drug.groupName} · Pack: {drug.unitSize}
                          </div>
                        </div>
                        <span className="font-mono text-cyan-800 font-bold text-xs">
                          ₹{drug.mrp.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Drug Badge & Statutory MRP Display */}
                {selectedDrug && (
                  <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{selectedDrug.genericName}</span>
                      <span className="text-[11px] text-slate-600">
                        PMBJP Code #{selectedDrug.drugCode} · {selectedDrug.groupName} · Pack {selectedDrug.unitSize}
                      </span>
                    </div>
                    <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Sample reference price</span>
                      <span className="text-sm font-mono font-bold text-emerald-700">₹{selectedDrug.mrp.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Overcharging Price Differential Calculator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="market-price-input" className="block text-xs font-semibold text-slate-800 mb-1">
                    Price Charged at Private Pharmacy (₹)
                  </label>
                  <input
                    id="market-price-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={marketPriceCharged}
                    onChange={(e) => setMarketPriceCharged(e.target.value)}
                    placeholder="e.g. 120.00"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none font-mono"
                  />
                  {selectedDrug && marketPriceCharged && parseFloat(marketPriceCharged) > selectedDrug.mrp && (
                    <span className="text-[11px] font-medium text-rose-700 flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3 rotate-180 shrink-0" />
                      <span>
                        Overcharged by ₹{(parseFloat(marketPriceCharged) - selectedDrug.mrp).toFixed(2)} (
                        {Math.round(((parseFloat(marketPriceCharged) - selectedDrug.mrp) / selectedDrug.mrp) * 100)}% above regulated price)
                      </span>
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="grievance-type" className="block text-xs font-semibold text-slate-800 mb-1">
                    Grievance Category
                  </label>
                  <select
                    id="grievance-type"
                    value={grievanceType}
                    onChange={(e) => setGrievanceType(e.target.value as GrievanceType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  >
                    <option value="stockout">Out of Stock at Public Clinic / Kendra</option>
                    <option value="overcharging">Overcharged by Private Retailer</option>
                    <option value="absenteeism">Doctor or Pharmacist Absent</option>
                    <option value="quality_packaging">Quality / Damaged Packaging</option>
                    <option value="facility_infrastructure">Missing Diagnostic Strip / Consumable</option>
                  </select>
                </div>
              </div>

              {/* Spoken Locality & LGD Auto-Resolver (Research Gap 4) */}
              <div className="space-y-1.5">
                <label htmlFor="locality-input" className="block text-xs font-semibold text-slate-800">
                  Village, Locality, or Health Facility *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="locality-input"
                    type="text"
                    value={spokenLocality}
                    onChange={(e) => setSpokenLocality(e.target.value)}
                    placeholder="Enter spoken/colloquial name (e.g. Mahasi Kalan, Jhalod Bajar, Kudumulugumma)..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-600 focus:outline-none"
                  />
                </div>
                {spokenLocality.trim().length > 2 && (
                  <div className="p-2 bg-slate-100 rounded text-[11px] text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">
                        Resolved LGD Village: {resolveSpokenToponym(spokenLocality).matchedEntry.officialName}
                      </span>{' '}
                      (District: {resolveSpokenToponym(spokenLocality).matchedEntry.district},{' '}
                      {resolveSpokenToponym(spokenLocality).matchedEntry.state})
                    </div>
                    <span className="font-mono text-cyan-800 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      LGD #{resolveSpokenToponym(spokenLocality).resolvedLgdCode}
                    </span>
                  </div>
                )}
                {spokenLocality.trim().length > 2 && !resolveSpokenToponym(spokenLocality).isConfident && (
                  <p className="text-[11px] text-amber-800">
                    No confident match in this prototype's small sample directory. The displayed suggestion must not be treated as an official LGD result.
                  </p>
                )}
              </div>

              {/* DPDP Act 2023 Consent Checkbox (Unticked by default) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="dpdp-consent"
                    checked={dpdpConsentChecked}
                    onChange={(e) => setDpdpConsentChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600 cursor-pointer"
                  />
                  <label htmlFor="dpdp-consent" className="text-slate-700 leading-snug cursor-pointer">
                    <span className="font-semibold text-slate-900">Purpose Limitation & Anonymity Consent (DPDP Act 2023): </span>
                     I understand this demonstration keeps this entry in browser memory only until the page is reloaded. It is not anonymized, encrypted, transmitted, or used for government allocation. I will not enter real personal, health, or location information. See the{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacyPolicy}
                      className="text-cyan-700 font-semibold underline hover:text-cyan-900 inline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save demo report locally</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
