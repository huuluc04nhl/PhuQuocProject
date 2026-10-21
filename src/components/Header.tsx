'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-12 sm:h-14 px-3 sm:px-6 bg-white border-b-2 border-slate-900 flex items-center justify-between shrink-0 z-30">
      {/* Exact Logo matching wireframe */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase shrink-0">
          Logo
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate">
          Phu Quoc Rental &bull; Sales Gallery Showroom 86&quot;
        </span>
      </div>

      <div className="text-xs font-semibold text-slate-500 hidden md:block shrink-0 ml-4">
        Tương tác trực tiếp trên mặt bằng bên dưới
      </div>
    </header>
  );
};
