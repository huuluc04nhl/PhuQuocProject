'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DEMO_UNITS, DEMO_ZONES } from '@/data/units';
import { Unit, Zone } from '@/types/unit';
import { Header } from '@/components/Header';
import { ProjectPlan } from '@/components/ProjectPlan';

// Tải InteractiveMap ở Client-side (ssr: false) để tránh lỗi hydration và hiển thị hoàn hảo trên mọi thiết bị / máy khác
const InteractiveMap = dynamic(
  () => import('@/components/InteractiveMap').then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold tracking-widest uppercase">Đang khởi tạo bản đồ...</span>
      </div>
    ),
  }
);
import { MediaShowcase } from '@/components/MediaShowcase';
import { UnitInfo } from '@/components/UnitInfo';
import { ActionButtons } from '@/components/ActionButtons';
import { BookingModal } from '@/components/BookingModal';
import { ContactModal } from '@/components/ContactModal';

export default function Home() {
  const [zones] = useState<Zone[]>(DEMO_ZONES);
  const [selectedZone, setSelectedZone] = useState<Zone>(DEMO_ZONES[0]);
  const [units, setUnits] = useState<Unit[]>(DEMO_UNITS);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(DEMO_UNITS[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  // Chế độ hiển thị trên Mobile / Tablet: 'split' (chồng chuẩn wireframe) | 'map' (toàn bản đồ) | 'plan' (toàn mặt bằng)
  const [mobileView, setMobileView] = useState<'split' | 'map' | 'plan'>('split');

  // 1. Khi chọn phân khu được đóng khung ở PROJECT PLAN
  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    // Tự động kích hoạt căn đầu tiên thuộc phân khu đó
    if (selectedUnit.zoneId !== zone.id) {
      const firstUnitInZone = units.find((u) => u.zoneId === zone.id);
      if (firstUnitInZone) {
        setSelectedUnit(firstUnitInZone);
      }
    }
  };

  // 2. Khi click vào khung căn hộ trên MAP để xem thông tin
  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    // Đồng bộ phân khu nếu căn hộ được chọn thuộc phân khu khác
    if (unit.zoneId !== selectedZone.id) {
      const matchingZone = zones.find((z) => z.id === unit.zoneId);
      if (matchingZone) {
        setSelectedZone(matchingZone);
      }
    }
  };

  // Xác nhận đặt chỗ thành công -> chuyển sang 'Đang xem'
  const handleConfirmBooking = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const updated: Unit = { ...u, status: 'Đang xem' };
          setSelectedUnit(updated);
          return updated;
        }
        return u;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen w-full bg-white text-slate-900 overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans select-none border-0 md:border-2 border-slate-900">
      {/* 1. Header (Logo & Single Horizontal Divider Line - Chuẩn wireframe) */}
      <Header />

      {/* 2. Main Body: Layout chuẩn Wireframe với PROJECT PLAN THU GỌN VÀ CHỒNG LÊN MAP */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 min-h-0 bg-white">
        {/* CỘT TRÁI: MAP & PROJECT PLAN CHỒNG LÊN NHAU ĐÚNG BẢN VẼ WIREFRAME */}
        <section className="lg:col-span-7 xl:col-span-8 relative h-[440px] sm:h-[500px] md:h-[560px] lg:h-full overflow-hidden flex flex-col shrink-0">
          {/* Segmented View Switcher trên Mobile & Tablet (< lg) giúp thao tác chạm dễ dàng */}
          <div className="lg:hidden shrink-0 pb-2 z-30">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs font-black w-full shadow-inner">
              <button
                onClick={() => setMobileView('map')}
                className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
                  mobileView === 'map'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🗺️</span>
                <span>Bản đồ (Map)</span>
              </button>
              <button
                onClick={() => setMobileView('plan')}
                className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
                  mobileView === 'plan'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📐</span>
                <span>Mặt bằng</span>
              </button>
              <button
                onClick={() => setMobileView('split')}
                className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
                  mobileView === 'split'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📑</span>
                <span>Gộp (Chồng)</span>
              </button>
            </div>
          </div>

          {/* Vùng chứa Map & Project Plan */}
          <div className="relative flex-1 h-full w-full min-h-0 flex flex-col overflow-hidden">
            {/* KHỐI MAP (Nằm trên, chiếm 74% chiều cao cột trái ở desktop, toàn màn hình khi chọn tab Map trên mobile) */}
            <div
              className={`w-full border-2 border-slate-900 bg-white overflow-hidden shadow-xs transition-all duration-200 ${
                mobileView === 'map'
                  ? 'h-full flex-1'
                  : mobileView === 'plan'
                  ? 'hidden lg:block lg:h-[74%]'
                  : 'min-h-[240px] h-[68%] sm:h-[72%] lg:h-[74%]'
              }`}
            >
              <InteractiveMap
                selectedZone={selectedZone}
                selectedUnit={selectedUnit}
                units={units}
                onSelectUnit={handleSelectUnit}
                mobileView={mobileView}
              />
            </div>

            {/* KHỐI PROJECT PLAN (Nổi ở dưới chồng lên map chuẩn wireframe, toàn màn hình khi chọn tab Plan trên mobile) */}
            <div
              className={`border-2 border-slate-900 bg-white shadow-2xl z-20 overflow-hidden flex flex-col transition-all duration-200 ${
                mobileView === 'plan'
                  ? 'relative h-full flex-1 w-full'
                  : mobileView === 'map'
                  ? 'hidden lg:flex lg:absolute lg:bottom-0 lg:left-[8%] lg:right-[8%] lg:h-[46%]'
                  : 'absolute bottom-0 left-[2%] right-[2%] sm:left-[5%] sm:right-[5%] lg:left-[8%] lg:right-[8%] h-[52%] sm:h-[48%] lg:h-[46%]'
              }`}
            >
              <ProjectPlan
                zones={zones}
                selectedZone={selectedZone}
                onSelectZone={handleSelectZone}
                selectedUnit={selectedUnit}
                units={units}
                onSelectUnit={handleSelectUnit}
              />
            </div>
          </div>
        </section>

        {/* CỘT PHẢI: VIDEO / IMAGE, INFO, VÀ BUTTONS (Đúng 3 khối riêng biệt của wireframe) */}
        <section className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 sm:gap-4 lg:h-full lg:overflow-hidden">
          {/* KHỐI 1: VIDEO / IMAGE (Khung bo góc tròn lớn rounded-3xl đúng wireframe) */}
          <div className="shrink-0 aspect-video sm:aspect-auto sm:h-[240px] md:h-[260px] lg:h-[30%] min-h-[170px] border-2 border-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs bg-black">
            <MediaShowcase unit={selectedUnit} />
          </div>

          {/* KHỐI 2: INFO (Khung chữ nhật sắc nét đúng wireframe) */}
          <div className="flex-1 min-h-[260px] lg:min-h-0 border-2 border-slate-900 overflow-hidden flex flex-col bg-white shadow-xs">
            <UnitInfo unit={selectedUnit} />
          </div>

          {/* KHỐI 3: BOOKING & CONTACT (2 nút bo góc - Ẩn hoàn toàn nếu căn đã cho thuê) */}
          {selectedUnit.status !== 'Đã cho thuê' && (
            <div className="shrink-0 h-12 pb-2 lg:pb-0">
              <ActionButtons
                unit={selectedUnit}
                onOpenBooking={() => setIsBookingOpen(true)}
                onOpenContact={() => setIsContactOpen(true)}
              />
            </div>
          )}
        </section>
      </main>

      {/* 3. Footer Line chuẩn wireframe */}
      <footer className="h-2 sm:h-3 border-t-2 border-slate-900 shrink-0 bg-white" />

      {/* Modals */}
      <BookingModal
        unit={selectedUnit}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />

      <ContactModal
        unit={selectedUnit}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
