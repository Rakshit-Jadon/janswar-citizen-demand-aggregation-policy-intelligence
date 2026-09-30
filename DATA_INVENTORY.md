# JanSwar Prototype Data Inventory

**Status: technical inventory for a browser-only research prototype, not a legal privacy notice.** Do not deploy this application as a public grievance service without completing the items marked for verification and obtaining legal advice.

## Current behaviour verified in source

| Data / event | Where it comes from | What the current code does | Stored or sent? |
|---|---|---|---|
| Statement text | Form textarea or built-in example filler | Holds it in React component state and displays it in the sample dashboard | Browser memory only; lost on reload; not sent to a server |
| Selected language, dialect, grievance type, urgency | Form controls | Holds values in React state | Browser memory only; lost on reload |
| Selected sample medicine, optional price, locality and derived demo location | Form controls and small built-in sample data | Holds values in React state; the location function is not an official LGD service | Browser memory only; lost on reload |
| Consent checkbox state and generated example receipt | Form and illustrative helper | Validates a local UI acknowledgement; receipt values use `Math.random()` and are not cryptographic proof | Browser memory only; lost on reload |
| Cookie-banner choice and timestamp | Cookie banner | Stores `janswar_cookie_consent` in browser local storage | Remains in local storage until the visitor/browser clears it; not sent by this code |
| CSV download | Visitor clicks export in the sample dashboard | Creates a file in the visitor's browser | Downloaded only when the visitor triggers it; not sent by this code |

## Explicit non-collection in the current code

- No microphone or audio capture, speech-recognition request, account, login, payment, analytics, advertising pixel, map/video/chat embed, server API call, or backend database.
- No name, email address, telephone number, IP address, Aadhaar/national ID, biometric data, or cookie is collected by the supplied client code.
- The package previously declared unused server/AI packages; they were removed because no source code used them.

## Production-launch checklist — must be completed with real facts

If a future version sends data to a server or third party, update this inventory and the Privacy and Cookie Policies in the same change with:

1. Each field, processor/recipient, purpose, lawful basis, retention period, security control, and deletion process.
2. The legal entity name, registered address, privacy contact and grievance contact.
3. The actual hosting, analytics, speech, mapping, email, payment and support providers, including the countries where data is processed.
4. Server-side validation, authentication/authorisation, rate limits, audit logging without sensitive content, and appropriate incident-response procedures.
5. A qualified lawyer's review for the business and visitor jurisdictions.
