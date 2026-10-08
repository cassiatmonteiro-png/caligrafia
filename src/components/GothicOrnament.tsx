import React from 'react';

export const GothicDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 my-6 text-amber-700/60 ${className}`}>
    <div className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-amber-600/80 w-24 sm:w-36" />
    <svg className="w-5 h-5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
    </svg>
    <div className="h-px bg-gradient-to-l from-transparent via-amber-600/40 to-amber-600/80 w-24 sm:w-36" />
  </div>
);

export const CornerFlourish: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position, className = '' }) => {
  const rotation = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <svg
      className={`w-6 h-6 text-amber-500/70 select-none pointer-events-none transform ${rotation} ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 30V10C2 5.58 5.58 2 10 2H30" strokeLinecap="round" />
      <path d="M6 30V12C6 8.68 8.68 6 12 6H30" strokeLinecap="round" opacity="0.6" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
};

export const WaxSealEmblem: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg',
  }[size];

  return (
    <div
      className={`relative rounded-full flex items-center justify-center font-serif font-bold text-amber-100 shadow-xl select-none shrink-0 ${sizeClasses} ${className}`}
      style={{
        background: 'radial-gradient(circle at 35% 35%, #a51d24 0%, #751419 60%, #4a0c10 100%)',
        boxShadow:
          '0 4px 14px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.7)',
        border: '2px solid #5c0f13',
      }}
    >
      <div className="absolute inset-1 rounded-full border border-amber-900/40 pointer-events-none" />
      <div className="text-center font-gothic tracking-widest text-amber-200/90 drop-shadow">
        SG
      </div>
    </div>
  );
};
