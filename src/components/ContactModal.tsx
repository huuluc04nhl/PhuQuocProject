'use client';

import React from 'react';
import { Unit } from '@/types/unit';
import { X, Phone, MessageSquare, QrCode, MapPin, Clock, Award } from 'lucide-react';

interface ContactModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  unit,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
              {unit.code}
            </span>
            <span className="text-xs font-semibold text-slate-400">Tư vấn viên dự án</span>
          </div>
          <h3 className="text-xl font-black text-white">LIÊN HỆ &amp; HỖ TRỢ TRỰC TIẾP</h3>
          <p className="text-xs text-slate-400 mt-1">
            Đang hiển thị tại Sales Gallery Showroom &bull; Sa bàn 86&quot;
          </p>

          <div className="mt-5 space-y-3">
            {/* Hotline card */}
            <a
              href="tel:1900888999"
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">
                    Hotline Trực Sa Bàn (24/7)
                  </span>
                  <span className="text-base font-black text-white group-hover:text-amber-400 transition">
                    0909.123.456 &bull; 1900.888.999
                  </span>
                </div>
              </div>
            </a>

            {/* Zalo / Chat card */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500 text-white">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold block">
                    Zalo Official / Hỗ trợ số
                  </span>
                  <span className="text-sm font-black text-white">
                    Zalo.me/phuquocrental
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Scan To Mobile */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 text-center flex flex-col items-center">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                Quét mã QR để nhận hồ sơ căn {unit.code} về điện thoại
              </span>
              <div className="p-2 bg-white rounded-xl shadow-lg">
                {/* Visual placeholder for QR code */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://phuquocrental.vn/unit/${unit.code}`}
                  alt="QR Code căn hộ"
                  className="w-28 h-28"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-2">
                Tự động gửi brochure PDF, bảng giá và video 3D
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Đại lý phân phối độc quyền
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Phản hồi trong 3 phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
