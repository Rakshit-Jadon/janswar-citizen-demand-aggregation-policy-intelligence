# JanSwar Assets & Licensing Registry

This file records the origin, licensing status, and verified provenance of all visual and data assets utilized in the **JanSwar - Voices to Better Policies** platform.

---

## 1. Typography

| Font Family | Source | License | Usage Location |
|---|---|---|---|
| System fonts | Visitor device | Platform licence | Current app UI; remote Google Fonts were removed to avoid sending visitor requests to Google. |

---

## 2. Iconography & Brand Marks

| Asset Name | Description | Source | License |
|---|---|---|---|
| JanSwar Brand Icon | Concentric Voice Waves / Magnifying Target in Cyan (#0284c7) & Emerald (#10b981) | Original SVG code matching Image 1 & Image 2 provided in user brief | Proprietary / CC-BY-4.0 |
| Lucide React Icons | Minimalist interface icons (Search, Mic, ShieldCheck, MapPin, Building, Activity, etc.) | Lucide Icons project (`lucide-react`) | ISC License |

---

## 3. Datasets & Public Registries

| Dataset Name | Source & Reference | Authority / License | Description |
|---|---|---|---|
| PMBJP Drug & Consumable Catalog | Pradhan Mantri Bhartiya Janaushadhi Pariyojana CSV | Pharmaceuticals & Medical Devices Bureau of India (PMBI), Government of India | 750+ essential generic medicines, surgical items, and statutory MRP price schedules |
| ABDM Metrics Benchmarks | Ayushman Bharat Digital Mission (`https://dashboard.abdm.gov.in/abdm/`) | National Health Authority (NHA), Government of India | ABHA account registrations, Health Facility Registry (HFR), and Healthcare Professional Registry (HPR) indicators |
| NFHS-5 Ground Truth Parameters | National Family Health Survey (NFHS-5, 2019-21) | Ministry of Health and Family Welfare (MoHFW) | Female mobile phone access percentage (national average ~54%) and rural digital divide indicators |
| Local Government Directory (LGD) | Ministry of Panchayati Raj (`https://lgd.gov.in`) | Open Government Data (OGD) Platform India | Standardized district, block, and village census administrative hierarchy codes |
| e-GramSwaraj LSDG Themes | Ministry of Panchayati Raj (`https://egramswaraj.gov.in`) | Government of India Open Data | 9 Localised Sustainable Development Goals (LSDG) themes and GPDP activity codes |

---

## 4. Third-Party Code & Dependency Audit

- `@tailwindcss/vite`: Tailwind CSS styling framework (MIT License)
- `lucide-react`: Lightweight SVG icon primitives (ISC License)
- `react` & `react-dom`: UI rendering engine (MIT License)
- The production bundle contains no analytics trackers, marketing pixels, or remote-font requests.
- Government datasets and reference prices are unverified illustrative samples in this prototype. Confirm the applicable licences, attribution and update cadence before publishing or calling them official.
