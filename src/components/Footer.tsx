/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { JanSwarLogo } from './JanSwarLogo';
import { LegalModalType } from './LegalModals';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegalModal: (type: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <JanSwarLogo size="md" />
            <p className="text-slate-500 max-w-sm text-xs leading-relaxed">
              JanSwar is a browser-only research prototype demonstrating civic-health data and policy concepts with sample data. It does not operate a public grievance service or connect to government systems.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Draft privacy materials — legal review required before launch</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider">
              Data & Schemas
            </span>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <span className="hover:text-slate-900 transition-colors cursor-default">
                  PMBJP 750+ Drug Catalog
                </span>
              </li>
              <li>
                <span className="hover:text-slate-900 transition-colors cursor-default">
                  ABDM Health Facility Registry (HFR)
                </span>
              </li>
              <li>
                <span className="hover:text-slate-900 transition-colors cursor-default">
                  Local Government Directory (LGD)
                </span>
              </li>
              <li>
                <span className="hover:text-slate-900 transition-colors cursor-default">
                  e-GramSwaraj LSDG 9 Themes
                </span>
              </li>
            </ul>
          </div>

          {/* Mandatory Legal Links in Footer of Every Page */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider">
              Legal & Compliance
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-cyan-700 transition-colors text-left"
                >
                  Privacy Policy (DPDP Act)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-cyan-700 transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('cookie')}
                  className="hover:text-cyan-700 transition-colors text-left"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('refund')}
                  className="hover:text-cyan-700 transition-colors text-left"
                >
                  Public Service Charter & Refunds
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accessibility statement */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} JanSwar Research Initiative. Built for citizen health equity and policy transparency.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Targeting WCAG 2.1 AA Accessibility Standards</span>
            <span aria-hidden="true">·</span>
            <span>Draft Legal Policies for Review</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
