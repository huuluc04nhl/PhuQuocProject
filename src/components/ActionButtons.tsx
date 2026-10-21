'use client';

import React from 'react';
import { Unit } from '@/types/unit';

interface ActionButtonsProps {
  unit: Unit;
  onOpenBooking: () => void;
  onOpenContact: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  unit,
  onOpenBooking,
  onOpenContact,
}) => {
  // Yêu cầu: "nếu đã thuê thì sẽ mất 2 button đó luôn, còn trống/đang xem thì sẽ có 2 button đó."
  const isRentedOrSold = unit.status === 'Đã cho thuê';

  if (isRentedOrSold) {
    // Ẩn hoàn toàn 2 button khi căn đã thuê/bán theo yêu cầu: "nếu đã thuê thì sẽ mất 2 button đó luôn"
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-3 h-12 shrink-0">
      {/* BOOKING BUTTON - Clean rounded wireframe style */}
      <button
        onClick={onOpenBooking}
        className="rounded-xl border-2 border-slate-900 bg-slate-900 hover:bg-black text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center transition-all shadow-sm active:scale-98"
      >
        BOOKING
      </button>

      {/* CONTACT BUTTON - Clean rounded wireframe style */}
      <button
        onClick={onOpenContact}
        className="rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm tracking-wider uppercase flex items-center justify-center transition-all shadow-sm active:scale-98"
      >
        CONTACT
      </button>
    </div>
  );
};
