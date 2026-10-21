'use client';

import React from 'react';
import { Unit } from '@/types/unit';

interface UnitInfoProps {
  unit: Unit;
}

export const UnitInfo: React.FC<UnitInfoProps> = ({ unit }) => {
  return (
    <div className="flex-1 bg-white p-5 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Title & Name */}
        <div className="pb-3 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {unit.subdivision}
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">
            {unit.name}
          </h2>
        </div>

        {/* 6 Core Info Fields requested by user */}
        <div className="mt-4 space-y-3 text-sm">
          {/* 1. Mã căn */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Mã căn:</span>
            <span className="font-mono font-bold text-slate-900 text-base">{unit.code}</span>
          </div>

          {/* 2. Giá tiền */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Giá tiền:</span>
            <span className="font-extrabold text-amber-600 text-lg">{unit.price}</span>
          </div>

          {/* 3. Hướng */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Hướng:</span>
            <span className="font-semibold text-slate-800 text-right">{unit.orientation}</span>
          </div>

          {/* 4. Diện tích */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Diện tích:</span>
            <span className="font-semibold text-slate-800">{unit.area}</span>
          </div>

          {/* 5. Trạng thái */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            <span
              className={`font-black text-xs uppercase px-2 py-0.5 rounded ${
                unit.status === 'Trống'
                  ? 'bg-emerald-100 text-emerald-800'
                  : unit.status === 'Đang xem'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {unit.status}
            </span>
          </div>

          {/* 6. Nội thất */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Nội thất:</span>
            <span className="font-semibold text-slate-800">
              {unit.furnished === 'Có' ? (
                <span className="text-emerald-700 font-bold">Có (Đầy đủ)</span>
              ) : (
                <span className="text-slate-600">Không (Bàn giao thô)</span>
              )}
            </span>
          </div>
        </div>

        {/* Highlights / Features */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Điểm nhấn:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {unit.highlights.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
