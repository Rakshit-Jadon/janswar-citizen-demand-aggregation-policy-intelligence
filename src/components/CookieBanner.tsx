/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('janswar_cookie_consent');
    if (!saved) {
      // Delay presentation slightly to avoid jarring layout shift
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'janswar_cookie_consent',
      JSON.stringify({ essential: true, analytics: true, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(
      'janswar_cookie_consent',
      JSON.stringify({ essential: true, analytics: false, timestamp: Date.now() })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'janswar_cookie_consent',
      JSON.stringify({ essential: true, analytics: analyticsOptIn, timestamp: Date.now() })
    );
    setShowManageModal(false);
    setIsVisible(false);
  };

  if (!isVisible && !showManageModal) return null;

  return (
    <>
      {/* Banner */}
      {isVisible && !showManageModal && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 sm:bottom-4 inset-x-0 sm:inset-x-auto sm:right-4 sm:max-w-2xl z-50 bg-white/98 backdrop-blur-md border border-slate-200/90 shadow-2xl p-4 sm:p-5 sm:rounded-2xl animate-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Cookie className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Your Privacy & Consent: </span>
                This prototype uses browser local storage only to remember this cookie choice. It loads no third-party trackers.{' '}
                <button
                  onClick={onOpenCookiePolicy}
                  className="text-cyan-700 font-semibold underline hover:text-cyan-900 inline"
                >
                  Cookie Policy
                </button>
                .
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={handleRejectNonEssential}
                className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              >
                Reject Optional
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 rounded-xl shadow-xs transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showManageModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-title"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setShowManageModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 id="cookie-preferences-title" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-700" />
                <span>Cookie & Tracking Preferences</span>
              </h3>
              <button
                onClick={() => setShowManageModal(false)}
                aria-label="Close cookie preferences"
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block">Strictly Necessary Cookies</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    Stores your choice about the banner. It does not provide CSRF or server-side rate-limiting protection.
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-200 px-2 py-0.5 rounded">
                  Always Active
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block">Aggregated Telemetry (Optional)</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    No telemetry is currently collected. This switch is retained only as a future integration placeholder and does not activate a service.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsOptIn}
                  onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                  aria-label="Enable anonymous aggregated telemetry"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowManageModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
