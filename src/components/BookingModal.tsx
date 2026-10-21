'use client';

import React, { useState } from 'react';
import { Unit } from '@/types/unit';
import { X, Calendar, User, Phone, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

interface BookingModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (unitId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  unit,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-11-01');
  const [rentalPeriod, setRentalPeriod] = useState('12');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !unit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onConfirmBooking(unit.id);
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">ĐẶT GIỮ CHỖ THÀNH CÔNG!</h3>
            <p className="text-sm text-slate-300 mt-2 max-w-xs">
              Mã căn <b className="text-amber-400">{unit.code}</b> đã được chuyển sang trạng thái <b>ĐÃ CHỌN</b>. Chuyên viên sẽ liên hệ ngay cho bạn!
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                {unit.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">{unit.subdivision}</span>
            </div>
            <h3 className="text-xl font-black text-white">YÊU CẦU ĐẶT GIỮ CĂN</h3>
            <p className="text-xs text-slate-400 mt-1">
              Giá thuê: <b className="text-amber-400">{unit.price}</b> &bull; Diện tích: {unit.area}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Họ và tên khách hàng</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Số điện thoại liên hệ</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0987 654 321"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ngày nhận bàn giao</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Thời hạn thuê</label>
                  <select
                    value={rentalPeriod}
                    onChange={(e) => setRentalPeriod(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="6">6 tháng</option>
                    <option value="12">12 tháng (1 năm)</option>
                    <option value="24">24 tháng (2 năm)</option>
                    <option value="custom">Thuê ngắn ngày</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Hệ thống sa bàn và phòng quản trị sẽ tự động khóa căn và bảo lưu quyền ưu tiên trong 24 giờ.
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition"
                >
                  HỦY
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:brightness-110 transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>XÁC NHẬN GIỮ CĂN NGAY</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
