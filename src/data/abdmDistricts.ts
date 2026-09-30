/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ABDM (Ayushman Bharat Digital Mission) Health Facility & Pharmacy Registry
 * linked with LGD (Local Government Directory) District Codes and NFHS-5
 * ground truth parameters (female mobile ownership, rural connectivity,
 * Mission Antyodaya infrastructure deficit index).
 */

import { AbdmDistrictMetric } from '../types';

export const ABDM_DISTRICT_METRICS: AbdmDistrictMetric[] = [
  {
    districtName: "Bahraich",
    state: "Uttar Pradesh",
    lgdDistrictCode: "128",
    femalePhoneOwnershipPct: 36.4, // NFHS-5 low female phone access
    ruralConnectivityPct: 41.2,
    infrastructureDeficitScore: 84.5, // High deficit
    totalAbhaAccounts: 184520,
    registeredFacilitiesHfr: 112,
    janAushadhiKendrasCount: 6,
    rawGrievancesLogged: 34, // Suppressed due to digital divide
    mrpAdjustedGrievanceScore: 92.4, // Rescued by MRP need-conditioning
    rawRank: 19,
    mrpCorrectedRank: 2,
    rankDisplacement: 17, // Highly underserved district rescued!
    primaryShortageCategory: "Paediatric Antibiotics & Iron Syrups",
    getisOrdGiZScore: 3.42,
    isHotspot: true
  },
  {
    districtName: "Dahod",
    state: "Gujarat",
    lgdDistrictCode: "447",
    femalePhoneOwnershipPct: 39.8,
    ruralConnectivityPct: 48.0,
    infrastructureDeficitScore: 78.2,
    totalAbhaAccounts: 142100,
    registeredFacilitiesHfr: 98,
    janAushadhiKendrasCount: 5,
    rawGrievancesLogged: 42,
    mrpAdjustedGrievanceScore: 88.6,
    rawRank: 16,
    mrpCorrectedRank: 4,
    rankDisplacement: 12,
    primaryShortageCategory: "Anti-Malarial & Snake Antivenom",
    getisOrdGiZScore: 2.95,
    isHotspot: true
  },
  {
    districtName: "Malkangiri",
    state: "Odisha",
    lgdDistrictCode: "367",
    femalePhoneOwnershipPct: 31.2,
    ruralConnectivityPct: 35.6,
    infrastructureDeficitScore: 91.0,
    totalAbhaAccounts: 98400,
    registeredFacilitiesHfr: 64,
    janAushadhiKendrasCount: 3,
    rawGrievancesLogged: 21,
    mrpAdjustedGrievanceScore: 95.8,
    rawRank: 24,
    mrpCorrectedRank: 1,
    rankDisplacement: 23,
    primaryShortageCategory: "Artesunate Injections & Maternal Folate",
    getisOrdGiZScore: 3.88,
    isHotspot: true
  },
  {
    districtName: "Shrawasti",
    state: "Uttar Pradesh",
    lgdDistrictCode: "184",
    femalePhoneOwnershipPct: 33.1,
    ruralConnectivityPct: 38.5,
    infrastructureDeficitScore: 88.7,
    totalAbhaAccounts: 84300,
    registeredFacilitiesHfr: 52,
    janAushadhiKendrasCount: 4,
    rawGrievancesLogged: 27,
    mrpAdjustedGrievanceScore: 91.2,
    rawRank: 22,
    mrpCorrectedRank: 3,
    rankDisplacement: 19,
    primaryShortageCategory: "Tetanus Vaccine & Paediatric Paracetamol",
    getisOrdGiZScore: 3.21,
    isHotspot: true
  },
  {
    districtName: "Nuh (Mewat)",
    state: "Haryana",
    lgdDistrictCode: "82",
    femalePhoneOwnershipPct: 38.6,
    ruralConnectivityPct: 52.4,
    infrastructureDeficitScore: 76.9,
    totalAbhaAccounts: 112000,
    registeredFacilitiesHfr: 74,
    janAushadhiKendrasCount: 7,
    rawGrievancesLogged: 58,
    mrpAdjustedGrievanceScore: 82.5,
    rawRank: 13,
    mrpCorrectedRank: 6,
    rankDisplacement: 7,
    primaryShortageCategory: "Maternal Iron-Folic & ORS Sachets",
    getisOrdGiZScore: 2.45,
    isHotspot: true
  },
  {
    districtName: "Kiphire",
    state: "Nagaland",
    lgdDistrictCode: "263",
    femalePhoneOwnershipPct: 44.5,
    ruralConnectivityPct: 39.2,
    infrastructureDeficitScore: 82.0,
    totalAbhaAccounts: 38200,
    registeredFacilitiesHfr: 31,
    janAushadhiKendrasCount: 2,
    rawGrievancesLogged: 18,
    mrpAdjustedGrievanceScore: 84.1,
    rawRank: 25,
    mrpCorrectedRank: 5,
    rankDisplacement: 20,
    primaryShortageCategory: "Cold Chain Insulin & Asthma Inhalers",
    getisOrdGiZScore: 2.80,
    isHotspot: true
  },
  {
    districtName: "Gaya",
    state: "Bihar",
    lgdDistrictCode: "216",
    femalePhoneOwnershipPct: 46.2,
    ruralConnectivityPct: 56.8,
    infrastructureDeficitScore: 71.4,
    totalAbhaAccounts: 412500,
    registeredFacilitiesHfr: 210,
    janAushadhiKendrasCount: 14,
    rawGrievancesLogged: 118,
    mrpAdjustedGrievanceScore: 79.3,
    rawRank: 9,
    mrpCorrectedRank: 7,
    rankDisplacement: 2,
    primaryShortageCategory: "Anti-Diabetic Metformin & Glimepiride",
    getisOrdGiZScore: 2.12,
    isHotspot: true
  },
  {
    districtName: "Barwani",
    state: "Madhya Pradesh",
    lgdDistrictCode: "392",
    femalePhoneOwnershipPct: 37.9,
    ruralConnectivityPct: 45.2,
    infrastructureDeficitScore: 79.5,
    totalAbhaAccounts: 134200,
    registeredFacilitiesHfr: 82,
    janAushadhiKendrasCount: 6,
    rawGrievancesLogged: 49,
    mrpAdjustedGrievanceScore: 78.4,
    rawRank: 15,
    mrpCorrectedRank: 8,
    rankDisplacement: 7,
    primaryShortageCategory: "Sickle Cell Screening Kits & Folic Acid",
    getisOrdGiZScore: 2.30,
    isHotspot: true
  },
  {
    districtName: "Kupwara",
    state: "Jammu and Kashmir",
    lgdDistrictCode: "12",
    femalePhoneOwnershipPct: 51.0,
    ruralConnectivityPct: 58.4,
    infrastructureDeficitScore: 68.0,
    totalAbhaAccounts: 189000,
    registeredFacilitiesHfr: 115,
    janAushadhiKendrasCount: 8,
    rawGrievancesLogged: 82,
    mrpAdjustedGrievanceScore: 74.2,
    rawRank: 11,
    mrpCorrectedRank: 9,
    rankDisplacement: 2,
    primaryShortageCategory: "Cardiac Amlodipine & Salbutamol Inhalers",
    getisOrdGiZScore: 1.84,
    isHotspot: false
  },
  {
    districtName: "Varanasi",
    state: "Uttar Pradesh",
    lgdDistrictCode: "193",
    femalePhoneOwnershipPct: 62.4,
    ruralConnectivityPct: 79.1,
    infrastructureDeficitScore: 42.0,
    totalAbhaAccounts: 784000,
    registeredFacilitiesHfr: 412,
    janAushadhiKendrasCount: 38,
    rawGrievancesLogged: 245, // High raw volume because connected!
    mrpAdjustedGrievanceScore: 61.2, // Downweighted because facility density is high
    rawRank: 3,
    mrpCorrectedRank: 14,
    rankDisplacement: -11, // Over-prioritized by raw counts
    primaryShortageCategory: "Specialist Oncology Trastuzumab",
    getisOrdGiZScore: 0.94,
    isHotspot: false
  },
  {
    districtName: "Pune",
    state: "Maharashtra",
    lgdDistrictCode: "492",
    femalePhoneOwnershipPct: 78.5,
    ruralConnectivityPct: 91.2,
    infrastructureDeficitScore: 22.4,
    totalAbhaAccounts: 1820000,
    registeredFacilitiesHfr: 890,
    janAushadhiKendrasCount: 94,
    rawGrievancesLogged: 520, // Massive raw volume (StreetBump effect)
    mrpAdjustedGrievanceScore: 42.1,
    rawRank: 1,
    mrpCorrectedRank: 22,
    rankDisplacement: -21, // Classic Kontokosta bias artifact!
    primaryShortageCategory: "Branded vs Generic MRP Discrepancy",
    getisOrdGiZScore: -0.42,
    isHotspot: false
  },
  {
    districtName: "Bengaluru Urban",
    state: "Karnataka",
    lgdDistrictCode: "524",
    femalePhoneOwnershipPct: 84.1,
    ruralConnectivityPct: 96.5,
    infrastructureDeficitScore: 16.5,
    totalAbhaAccounts: 2950000,
    registeredFacilitiesHfr: 1240,
    janAushadhiKendrasCount: 142,
    rawGrievancesLogged: 480,
    mrpAdjustedGrievanceScore: 35.8,
    rawRank: 2,
    mrpCorrectedRank: 24,
    rankDisplacement: -22,
    primaryShortageCategory: "Digital ABHA QR scan queue delays",
    getisOrdGiZScore: -1.15,
    isHotspot: false
  }
];

export const LSDG_THEMES = [
  {
    id: 1,
    name: "Poverty Free and Enhanced Livelihoods Village",
    code: "LSDG-01",
    description: "Social protection schemes, MGNREGA health support, micro-insurance",
    gpdpActivityCodes: ["GPDP-ACT-101", "GPDP-ACT-104"],
    nhmBudgetLine: "FMR-B.1.1 (Community Mobilization & Vulnerable Subsidies)",
    allocationCeilingLakhs: 45.0
  },
  {
    id: 2,
    name: "Healthy Village (Swastha Panchayat)",
    code: "LSDG-02",
    description: "Ayushman Arogya Mandir drugs, Maternal/Child immunization, PMBJP Kendra supply chain",
    gpdpActivityCodes: ["GPDP-ACT-201", "GPDP-ACT-202", "GPDP-ACT-208"],
    nhmBudgetLine: "FMR-B.3 (Essential Drugs & Consumables Flexipool)",
    allocationCeilingLakhs: 85.0
  },
  {
    id: 3,
    name: "Child Friendly Village",
    code: "LSDG-03",
    description: "Anganwadi nutrition, deworming syrups, paediatric paracetamol & antibiotic availability",
    gpdpActivityCodes: ["GPDP-ACT-302", "GPDP-ACT-305"],
    nhmBudgetLine: "FMR-B.4 (RBSK & Paediatric Emergency Buffer)",
    allocationCeilingLakhs: 35.0
  },
  {
    id: 4,
    name: "Water Sufficient Village",
    code: "LSDG-04",
    description: "Jal Jeevan Mission chlorine water disinfection, cholera & ORS emergency caches",
    gpdpActivityCodes: ["GPDP-ACT-401"],
    nhmBudgetLine: "FMR-B.7 (Water-borne Disease Surveillance)",
    allocationCeilingLakhs: 40.0
  },
  {
    id: 5,
    name: "Clean and Green Village",
    code: "LSDG-05",
    description: "Bio-medical waste management, disinfectant spraying, anti-larval mosquito vector control",
    gpdpActivityCodes: ["GPDP-ACT-503"],
    nhmBudgetLine: "FMR-B.8 (NVBDCP Vector Borne Program)",
    allocationCeilingLakhs: 28.0
  },
  {
    id: 6,
    name: "Self-Sufficient Infrastructure in Village",
    code: "LSDG-06",
    description: "Sub-centre building repairs, solar backup for vaccine cold chains, PMGSY health connectivity",
    gpdpActivityCodes: ["GPDP-ACT-601", "GPDP-ACT-604"],
    nhmBudgetLine: "FMR-B.11 (Infrastructure & Cold Chain Upgradation)",
    allocationCeilingLakhs: 60.0
  },
  {
    id: 7,
    name: "Socially Just and Socially Secured Village",
    code: "LSDG-07",
    description: "Elderly palliative care, free chronic hypertension and diabetes medicine doorstep distribution",
    gpdpActivityCodes: ["GPDP-ACT-702"],
    nhmBudgetLine: "FMR-B.14 (National NCD Program & Geriatric Care)",
    allocationCeilingLakhs: 50.0
  },
  {
    id: 8,
    name: "Village with Good Governance (Sushasan)",
    code: "LSDG-08",
    description: "Citizen grievance charter, drug stock transparency boards, social audit of Arogya Mandirs",
    gpdpActivityCodes: ["GPDP-ACT-801"],
    nhmBudgetLine: "FMR-B.16 (Monitoring, Evaluation & Citizen Voice Audits)",
    allocationCeilingLakhs: 20.0
  },
  {
    id: 9,
    name: "Women Friendly Village",
    code: "LSDG-09",
    description: "Jan Aushadhi Suvidha biodegradable sanitary napkin distribution, maternal anemia iron-sucrose clinics",
    gpdpActivityCodes: ["GPDP-ACT-901", "GPDP-ACT-903"],
    nhmBudgetLine: "FMR-B.18 (Maternal Health, PMSMA & Menstrual Hygiene)",
    allocationCeilingLakhs: 55.0
  }
];
