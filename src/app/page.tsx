'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DEMO_UNITS, DEMO_ZONES } from '@/data/units';
import { Unit, Zone } from '@/types/unit';
import { Header } from '@/components/Header';
import { InteractiveMap } from '@/components/InteractiveMap';
import { ProjectPlan } from '@/components/ProjectPlan';
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

  // Tính toán chiều rộng ProjectPlan tự động vừa khít theo tỷ lệ ảnh 1024x778 (không thừa viền 2 bên)
  const planCardRef = useRef<HTMLDivElement>(null);
  const [planCardWidth, setPlanCardWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updatePlanWidth = () => {
      if (!planCardRef.current) return;
      const h = planCardRef.current.clientHeight;
      if (h > 32) {
        // Trừ 32px của header bar, phần viewport còn lại nhân tỷ lệ gốc 1024/778
        const viewportH = h - 32;
        const exactW = Math.round(viewportH * (1024 / 778));
        setPlanCardWidth(exactW);
      }
    };

    updatePlanWidth();
    window.addEventListener('resize', updatePlanWidth);
    return () => window.removeEventListener('resize', updatePlanWidth);
  }, []);

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
    <div className="flex flex-col h-screen w-screen bg-white text-slate-900 overflow-hidden font-sans select-none border border-slate-900">
      {/* 1. Header (Logo & Single Horizontal Divider Line - Chuẩn wireframe) */}
      <Header />

      {/* 2. Main Body: Layout chuẩn Wireframe với PROJECT PLAN CHỒNG LÊN MAP */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden min-h-0 bg-white">
        {/* CỘT TRÁI: MAP & PROJECT PLAN CHỒNG LÊN NHAU ĐÚNG BẢN VẼ WIREFRAME */}
        <section className="lg:col-span-7 xl:col-span-8 relative h-full overflow-hidden">
          {/* KHỐI MAP (Nằm trên, mở rộng xuống thêm h-[72%] theo yêu cầu) */}
          <div className="w-full h-[72%] border border-slate-900 bg-white overflow-hidden shadow-xs">
            <InteractiveMap
              selectedZone={selectedZone}
              selectedUnit={selectedUnit}
              units={units}
              onSelectUnit={handleSelectUnit}
            />
          </div>

          {/* KHỐI PROJECT PLAN (CHỒNG LÊN PHẦN DƯỚI CỦA MAP - THU GỌN VỪA KHÍT THEO KÍCH THƯỚC ẢNH) */}
          <div
            ref={planCardRef}
            style={{
              width: planCardWidth ? `${planCardWidth}px` : undefined,
              aspectRatio: planCardWidth ? undefined : '1024 / 850',
            }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[46%] max-w-[94%] border-2 border-slate-900 bg-white shadow-2xl z-20 overflow-hidden flex flex-col"
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
        </section>

        {/* CỘT PHẢI: VIDEO / IMAGE, INFO, VÀ BUTTONS (Đúng 3 khối riêng biệt của wireframe) */}
        <section className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
          {/* KHỐI 1: VIDEO / IMAGE (Khung bo góc tròn lớn rounded-3xl đúng wireframe) */}
          <div className="shrink-0 h-[29%] min-h-[170px] border border-slate-900 rounded-3xl overflow-hidden shadow-xs bg-black">
            <MediaShowcase unit={selectedUnit} />
          </div>

          {/* KHỐI 2: INFO (Khung chữ nhật sắc nét đúng wireframe) */}
          <div className="flex-1 min-h-0 border border-slate-900 overflow-hidden flex flex-col bg-white shadow-xs">
            <UnitInfo unit={selectedUnit} />
          </div>

          {/* KHỐI 3: BOOKING & CONTACT (2 nút bo góc - Ẩn hoàn toàn nếu căn đã cho thuê) */}
          {selectedUnit.status !== 'Đã cho thuê' && (
            <div className="shrink-0 h-12">
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
      <footer className="h-3 border-t border-slate-900 shrink-0 bg-white" />

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
