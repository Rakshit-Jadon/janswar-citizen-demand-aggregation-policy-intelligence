/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Shield, FileText, Cookie, AlertCircle, RefreshCw } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'cookie' | 'refund' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {activeModal === 'privacy' && <Shield className="w-5 h-5 text-cyan-700" />}
            {activeModal === 'terms' && <FileText className="w-5 h-5 text-cyan-700" />}
            {activeModal === 'cookie' && <Cookie className="w-5 h-5 text-cyan-700" />}
            {activeModal === 'refund' && <RefreshCw className="w-5 h-5 text-cyan-700" />}
            <h2 id="legal-modal-title" className="text-base font-bold text-slate-900">
              {activeModal === 'privacy' && 'Privacy Policy (Digital Personal Data Protection Act 2023)'}
              {activeModal === 'terms' && 'Terms and Conditions of Use'}
              {activeModal === 'cookie' && 'Cookie Policy and Tracking Technologies'}
              {activeModal === 'refund' && 'Public Service & Drug Return / Refund Charter'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close legal modal"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Advisory Notice */}
        <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Draft Legal Policy: </strong>This policy is clearly marked as a preliminary draft prepared for the JanSwar research prototype and requires formal review and sign-off by a qualified legal practitioner prior to commercial or official government production launch.
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Data Collected & Purpose</h3>
                <p className="mt-1">
                  Current prototype behaviour: the form can process a statement, language/dialect choice, selected sample drug, optional price, locality, urgency, and acknowledgement checkbox in React memory. No audio is recorded, no account, name, phone number, payment, IP address, or biometric data is collected by this code, and no form data is sent to a server. Data disappears on page reload unless the visitor manually downloads a CSV from the sample dashboard. Visitors must not enter real personal or health information.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Purpose Limitation & Statutory Basis</h3>
                <p className="mt-1">
                  The site stores one browser local-storage item, <code>janswar_cookie_consent</code>, containing the visitor's banner choice and timestamp. It has no configured expiry and remains until cleared by the visitor or browser. Before a real launch, the operator must document the lawful purpose, data fiduciary/contact details, recipients, retention periods, deletion process, security measures, and every server-side or third-party processor actually used. A qualified lawyer must review that production notice.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">3. k-Anonymity & Differential Privacy</h3>
                <p className="mt-1">
                  The visible k-anonymity, consent receipt, location matching, and policy-allocation outputs are illustrative calculations only. They are not cryptographic controls and must not be represented as a privacy safeguard in a production service.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">4. Data Retention & Erasure Rights</h3>
                <p className="mt-1">
                  No retention schedule or deletion contact can be verified from this codebase. For production, insert the legal business name, physical address, privacy contact, retention schedule, and rights-request procedure after obtaining legal advice; do not use the previous placeholder government email address.
                </p>
              </div>
            </div>
          )}

          {activeModal === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h3>
                <p className="mt-1">
                  By accessing or utilizing the JanSwar platform, you agree to these Terms and Conditions. This platform is a civic technology research and policy intelligence tool designed to bridge citizen demands with public healthcare budgets.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Honesty and Authenticity of Grievances</h3>
                <p className="mt-1">
                  Users agree to provide truthful, authentic information regarding medicine availability and retail prices paid. Submitting deliberately fraudulent, defamatory, or commercially malicious claims against legitimate healthcare facilities is strictly prohibited.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">3. Not a Clinical Emergency Dispatch</h3>
                <p className="mt-1">
                  JanSwar is an aggregation and policy planning tool, not an emergency response ambulance dispatch. In acute clinical emergencies, citizens must immediately contact National Emergency Medical Services (108 / 112) or visit the nearest emergency trauma facility.
                </p>
              </div>
            </div>
          )}

          {activeModal === 'cookie' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Strictly Essential Cookies Only</h3>
                <p className="mt-1">
                  The current build sets no HTTP cookies. It stores only the browser local-storage entry described below and loads no analytics, advertising, map, video, chat, payment, or remote-font service.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-800">
                    <tr>
                       <th className="p-2.5">Storage key</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Purpose</th>
                      <th className="p-2.5">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                       <td className="p-2.5 text-slate-900 font-semibold">janswar_cookie_consent</td>
                      <td className="p-2.5 text-slate-600">Essential</td>
                       <td className="p-2.5 font-sans">Records the visitor's banner choice and timestamp</td>
                       <td className="p-2.5">Until browser data is cleared</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeModal === 'refund' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">1. Zero-Cost Public Civic Service</h3>
                <p className="mt-1">
                  JanSwar is a free, non-commercial public service research platform. We do not sell pharmaceuticals, process financial transactions, or charge citizens for lodging grievances.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">2. Jan Aushadhi Kendra Return / Replacement Norms</h3>
                <p className="mt-1">
                  For medicines purchased at physical Pradhan Mantri Bhartiya Janaushadhi Kendras (PMBJP), refunds and replacements are governed under statutory Drugs & Cosmetics Rules: sealed medicines with damaged packaging, broken integrity seals, or recall batch notifications are entitled to full replacement or refund at the dispensing Kendra with original cash memo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
