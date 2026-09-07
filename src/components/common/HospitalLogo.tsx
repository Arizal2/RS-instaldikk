import React from 'react';

export interface HospitalLogoProps {
  variant?: 'full' | 'emblem' | 'compact' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showSubtitle?: boolean;
}

/**
 * Official Hospital Logo Component for RSKH (Rumah Sakit Kartika Husada)
 * Renders the accurate emblem (cross with blue/red ribbons, yellow accents & caring hands)
 * and the emerald green RSKH typography.
 */
export const HospitalLogo: React.FC<HospitalLogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'light',
  className = '',
  showSubtitle = true
}) => {
  // Dimension scales
  const emblemSizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const subtitleSizeClasses = {
    xs: 'text-[7px]',
    sm: 'text-[8.5px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  // Pure SVG Emblem of RSKH (Red & Blue cross with yellow quadrants and caring hands in center)
  const EmblemSvg = ({ className: emblemClass = '' }: { className?: string }) => (
    <svg
      viewBox="0 0 120 120"
      className={`${emblemClass}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RSKH Emblem"
    >
      {/* Background soft circular backdrop if on dark */}
      <defs>
        <clipPath id="centerHole">
          <rect x="0" y="0" width="120" height="120" rx="20" />
        </clipPath>
      </defs>

      {/* Top-Left Yellow Accent Block */}
      <rect x="26" y="26" width="26" height="26" rx="4" fill="#F4B400" />

      {/* Bottom-Right Yellow Accent Block */}
      <rect x="68" y="68" width="26" height="26" rx="4" fill="#F4B400" />

      {/* Top Red Cross Wing */}
      <path
        d="M34 14C34 10.6863 36.6863 8 40 8H80C83.3137 8 86 10.6863 86 14V42C86 44 84 46 82 46H74C68 46 64 50 64 56V64H34V14Z"
        fill="#E50914"
      />

      {/* Bottom Red Cross Wing */}
      <path
        d="M86 106C86 109.314 83.3137 112 80 112H40C36.6863 112 34 109.314 34 106V78C34 76 36 74 38 74H46C52 74 56 70 56 64V56H86V106Z"
        fill="#E50914"
      />

      {/* Left Blue Curved Cross Wing */}
      <path
        d="M14 34C10.6863 34 8 36.6863 8 40V80C8 83.3137 10.6863 86 14 86H42C44 86 46 84 46 82V74C46 68 50 64 56 64H64V34H14Z"
        fill="#1A73E8"
      />

      {/* Right Blue Curved Cross Wing */}
      <path
        d="M106 86C109.314 86 112 83.3137 112 80V40C112 36.6863 109.314 34 106 34H78C76 34 74 36 74 38V46C74 52 70 56 64 56H56V86H106Z"
        fill="#1A73E8"
      />

      {/* Center White Caring Hands & Health Connection Silhouette */}
      {/* Lower Hand Reaching Upward */}
      <path
        d="M40 76C48 76 56 66 65 65C62 61 58 60 52 62C46 64 42 70 40 76Z"
        fill="white"
      />
      <path
        d="M42 74C49 71 58 68 64 63C60 60 54 62 48 66L42 74Z"
        fill="white"
      />

      {/* Upper Hand Reaching Downward (Interlocking) */}
      <path
        d="M80 44C72 44 64 54 55 55C58 59 62 60 68 58C74 56 78 50 80 44Z"
        fill="white"
      />
      <path
        d="M78 46C71 49 62 52 56 57C60 60 66 58 72 54L78 46Z"
        fill="white"
      />
      
      {/* Central Heart/Touch Pulse */}
      <circle cx="60" cy="60" r="3.5" fill="white" />
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <EmblemSvg className={emblemSizeClasses[size]} />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-emerald-600/30 shadow-xs backdrop-blur-xs ${className}`}
      >
        <EmblemSvg className="w-5 h-5 shrink-0" />
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight text-[#008744] font-serif leading-none">
            RSKH
          </span>
          <span className="text-[8px] font-bold text-slate-700 tracking-wider uppercase leading-tight">
            Kartika Husada
          </span>
        </div>
      </div>
    );
  }

  // Full & Compact Logo Variants
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#008744]';
  const subTextColor = isDark ? 'text-emerald-400' : 'text-[#008744]';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Emblem */}
      <div className="shrink-0 relative">
        <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-100/50 flex items-center justify-center">
          <EmblemSvg className={emblemSizeClasses[size]} />
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-black tracking-tight leading-none font-serif ${titleSizeClasses[size]} ${
              isDark ? 'text-emerald-400' : 'text-[#008744]'
            }`}
            style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}
          >
            RSKH
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-bold tracking-wider uppercase mt-0.5 leading-tight ${subtitleSizeClasses[size]} ${
              isDark ? 'text-slate-200' : 'text-[#007038]'
            }`}
          >
            RUMAH SAKIT KARTIKA HUSADA
          </span>
        )}
      </div>
    </div>
  );
};
