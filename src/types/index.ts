/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IndicLanguage =
  | 'hi' // Hindi
  | 'en' // English
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'kn'; // Kannada

export interface LanguageOption {
  code: IndicLanguage;
  name: string;
  nativeName: string;
  script: string;
}

export interface MedicineProduct {
  srNo: number;
  drugCode: number;
  genericName: string;
  unitSize: string;
  mrp: number; // In INR
  groupName: string;
  mfgDate: string;
  expDate: string;
  marketPriceAvg: number; // Approximate branded private retail market price in INR
  therapeuticUse: string;
  essentialPriority: 'Critical' | 'High' | 'Standard';
  commonIndications: string[];
}

export type GrievanceType =
  | 'stockout' // Medicine out of stock at public clinic / Jan Aushadhi
  | 'overcharging' // Charged higher than Jan Aushadhi statutory MRP
  | 'absenteeism' // PHC/Arogya Mandir doctor/pharmacist unavailable
  | 'quality_packaging' // Quality, packaging or broken seal issue
  | 'denial_of_service' // Refused medication despite valid prescription
  | 'facility_infrastructure'; // Basic diagnostic equipment missing

export interface CitizenGrievance {
  id: string;
  ticketNumber: string;
  createdAt: string;
  language: IndicLanguage;
  dialect?: string;
  channel: 'voice' | 'text' | 'whatsapp' | 'ivr' | 'web';
  rawInput: string;
  translatedEnglish: string;
  grievanceType: GrievanceType;
  selectedDrugCode?: number;
  selectedDrugName?: string;
  unitSize?: string;
  statutoryMrp?: number;
  marketPriceCharged?: number;
  overchargeAmount?: number;
  spokenLocality: string;
  resolvedLgdVillage: string;
  resolvedLgdCode: string;
  district: string;
  state: string;
  urgency: 'Immediate Emergency' | 'High Priority' | 'Routine Demand';
  // Research Gap 1 & 2 Attributes:
  rawCountWeight: number; // 1.0 baseline
  postStratificationWeight: number; // MRP conditioned weight (correcting for phone access NFHS-5)
  lsdgThemeId: number; // e-GramSwaraj LSDG 9 Themes
  lsdgThemeName: string;
  budgetHeadCode: string; // NHM or GPDP budget line
  budgetHeadName: string;
  confidenceScore: number;
  // Research Gap 5 (DPDP Consent):
  consentId: string;
  consentTimestamp: string;
  purposeLimitationAcknowledged: boolean;
  kAnonymityProtected: boolean;
  status: 'Surfaced' | 'Under Investigation' | 'Allocated to Budget' | 'Resolved';
}

export interface AbdmDistrictMetric {
  districtName: string;
  state: string;
  lgdDistrictCode: string;
  femalePhoneOwnershipPct: number; // NFHS-5 ground truth (national avg ~54%)
  ruralConnectivityPct: number; // 4G/optical fiber broadband penetration
  infrastructureDeficitScore: number; // Mission Antyodaya / SHRUG composite deficit (0 - 100)
  totalAbhaAccounts: number;
  registeredFacilitiesHfr: number;
  janAushadhiKendrasCount: number;
  rawGrievancesLogged: number;
  mrpAdjustedGrievanceScore: number; // Post-stratification score
  rawRank: number;
  mrpCorrectedRank: number;
  rankDisplacement: number; // High positive means neglected by raw volume, rescued by MRP!
  primaryShortageCategory: string;
  getisOrdGiZScore: number; // Spatial hotspot statistic (> 1.96 = Hotspot p<0.05)
  isHotspot: boolean;
}

export interface LsdgTheme {
  id: number;
  name: string;
  code: string;
  description: string;
  gpdpActivityCodes: string[];
  nhmBudgetLine: string;
  allocationCeilingLakhs: number;
}

export interface AsrRobustnessPoint {
  werPercent: number; // 0% to 50%
  topTopicDisplacementRate: number; // % ranking flip
  criticalDrugClassificationF1: number;
  decisionInversionFlag: boolean;
}
