'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-14 px-6 bg-white border-b border-slate-900 flex items-center justify-between shrink-0 z-30">
      {/* Exact Logo matching wireframe */}
      <div className="flex items-center gap-4">
        <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
          Logo
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-sm font-semibold text-slate-700">
          Phu Quoc Rental &bull; Sales Gallery Showroom 86&quot;
        </span>
      </div>

      <div className="text-xs font-semibold text-slate-500 hidden sm:block">
        Tương tác trực tiếp trên mặt bằng bên dưới
      </div>
    </header>
  );
};
