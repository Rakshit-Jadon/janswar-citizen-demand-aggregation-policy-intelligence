/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'white';
}

export const JanSwarLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full'
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon matching Image 1 & 2: Concentric Voice Waves / Magnifying Target in Cyan & Emerald */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
        aria-label="JanSwar Logo"
      >
        {/* Outer Circular Soundwave / Eye Ring */}
        <circle
          cx="48"
          cy="44"
          r="34"
          stroke="#0284c7"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray="180 50"
          className="text-cyan-600"
        />
        {/* Inner Focused Core Pupil / Microphone Pulse */}
        <circle cx="48" cy="44" r="14" fill="#0284c7" />
        {/* Diagnostic Voice Wave Sweep / Green Acoustic Crescent */}
        <path
          d="M26 68 L14 84 M28 66 C 42 78, 68 76, 78 58"
          stroke="#10b981"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Precision Sound Dot */}
        <circle cx="78" cy="38" r="4.5" fill="#38bdf8" />
      </svg>

      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-bold tracking-tight ${
                size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl'
              } ${variant === 'white' ? 'text-white' : 'text-slate-900'}`}
            >
              Jan<span className="text-cyan-600">Swar</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-cyan-100 text-cyan-800 rounded font-semibold tracking-wider">
              ABDM · PMBJP
            </span>
          </div>
          <span
            className={`tracking-widest uppercase font-semibold text-[9px] ${
              variant === 'white' ? 'text-slate-300' : 'text-slate-500'
            } mt-0.5`}
          >
            VOICES TO BETTER POLICIES
          </span>
        </div>
      )}
    </div>
  );
};
