'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Unit, Zone, UnitStatus } from '@/types/unit';
import { ZoomIn, ZoomOut, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  selectedZone: Zone;
  selectedUnit: Unit;
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
}

// Bảng màu trạng thái nổi bật theo yêu cầu:
// Xanh = Trống, Vàng = Đang xem, Đỏ = Đã thuê
const STATUS_COLORS: Record<UnitStatus, { stroke: string; strokeSelected: string; fill: string; fillSelected: string; dot: string; label: string }> = {
  'Trống': {
    stroke: '#10b981',         // Xanh lá nổi bật (Emerald 500)
    strokeSelected: '#047857', // Xanh đậm khi chọn
    fill: '#10b981',
    fillSelected: '#059669',
    dot: 'bg-emerald-500',
    label: 'Trống',
  },
  'Đang xem': {
    stroke: '#f59e0b',         // Vàng cam nổi bật (Amber 500)
    strokeSelected: '#b45309', // Vàng sậm khi chọn
    fill: '#f59e0b',
    fillSelected: '#d97706',
    dot: 'bg-amber-400',
    label: 'Đang xem',
  },
  'Đã cho thuê': {
    stroke: '#ef4444',         // Đỏ nổi bật (Rose 500)
    strokeSelected: '#991b1b', // Đỏ đậm khi chọn
    fill: '#ef4444',
    fillSelected: '#dc2626',
    dot: 'bg-rose-500',
    label: 'Đã thuê',
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedZone,
  selectedUnit,
  units,
  onSelectUnit,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Cập nhật lại kích thước bản đồ khi mở / đóng fullscreen
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 320);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // 1. Khởi tạo bản đồ OpenStreetMap thực tế
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (isInitializedRef.current) return;

    import('leaflet').then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center: [selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng],
        zoom: selectedZone.zoom || 17,
        zoomControl: false,
        attributionControl: true,
      });

      // Layer OpenStreetMap thực tế
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
      isInitializedRef.current = true;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // 2. Vẽ trực tiếp các KHUNG CĂN HỘ với BORDER NỔI BẬT & MÀU THEO TRẠNG THÁI
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      const layersGroup = layersGroupRef.current;

      // Di chuyển bản đồ đến khu vực được chọn
      map.flyTo([selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng], selectedZone.zoom || 17, {
        duration: 0.8,
      });

      // Xóa các khung cũ trên bản đồ
      layersGroup.clearLayers();
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Luôn hiển thị TẤT CẢ căn hộ trên bản đồ theo yêu cầu
      (units || []).forEach((unit) => {
        const isSelected = unit.id === selectedUnit.id;
        const colorConfig = STATUS_COLORS[unit.status] || STATUS_COLORS['Trống'];

        // Đa giác Polygon bám sát hình khối thực tế của căn nhà theo yêu cầu
        const polygonCoords = unit.mapPolygon || [
          [unit.mapBounds[0][0], unit.mapBounds[0][1]],
          [unit.mapBounds[0][0], unit.mapBounds[1][1]],
          [unit.mapBounds[1][0], unit.mapBounds[1][1]],
          [unit.mapBounds[1][0], unit.mapBounds[0][1]],
        ];

        const polygon = L.polygon(polygonCoords, {
          color: isSelected ? '#0f172a' : colorConfig.stroke,
          weight: isSelected ? 5 : 3.5, // Border dày và nổi bật hơn
          fillColor: isSelected ? colorConfig.stroke : colorConfig.fill,
          fillOpacity: isSelected ? 0.65 : 0.45, // Màu nền rõ nét, nổi rõ trên map
          className: 'cursor-pointer transition-all drop-shadow-md',
        });

        // Hover effect: phóng sáng border
        polygon.on('mouseover', () => {
          if (!isSelected) {
            polygon.setStyle({
              weight: 5,
              fillOpacity: 0.65,
            });
          }
        });

        polygon.on('mouseout', () => {
          if (!isSelected) {
            polygon.setStyle({
              color: colorConfig.stroke,
              weight: 3.5,
              fillOpacity: 0.45,
            });
          }
        });

        // Click trực tiếp vào khung căn hộ để chọn
        polygon.on('click', () => {
          onSelectUnit(unit);
        });

        // Tooltip với màu sắc tương ứng
        const statusDot = unit.status === 'Trống' ? '🟢' : unit.status === 'Đang xem' ? '🟡' : '🔴';
        polygon.bindTooltip(
          `<div style="font-weight: 800; font-size: 11px; padding: 3px 6px; display: flex; align-items: center; gap: 4px;">
            <span>${statusDot}</span>
            <span>${unit.code} &bull; ${unit.status}</span>
          </div>`,
          {
            permanent: false,
            direction: 'top',
            offset: [0, -6],
            className: 'custom-map-tooltip',
          }
        );

        polygon.addTo(layersGroup);
      });

      // Pin định vị căn đang chọn với hiệu ứng viewfinder và vòng sóng đồng màu
      const selectedColor = STATUS_COLORS[selectedUnit.status] || STATUS_COLORS['Trống'];
      const customHtml = `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${selectedColor.stroke}40; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 16px; height: 16px; border-radius: 50%; background: ${selectedColor.stroke}; border: 3px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.5);"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'clean-pin-no-text',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      markerRef.current = L.marker(
        [selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng],
        { icon: customIcon, interactive: false }
      ).addTo(map);
    });
  }, [selectedUnit, selectedZone, units, onSelectUnit]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetCenter = () => {
    mapInstanceRef.current?.flyTo(
      [selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng],
      selectedZone.zoom || 17
    );
  };

  return (
    <div
      className={`bg-slate-100 overflow-hidden select-none flex flex-col transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl border-2 border-slate-900 bg-white'
          : 'relative w-full h-full'
      }`}
    >
      {/* Header bar của MAP: Tối giản + BẢNG CHÚ THÍCH MÀU NỔI BẬT */}
      <div className="h-8 px-2 sm:px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 z-10 select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-800 uppercase">
            MAP
          </span>
          <span className="text-[10px] text-slate-500 font-bold hidden md:inline">
            &bull; {selectedZone.name}
          </span>
        </div>

        {/* Chú thích màu trực quan: Xanh = Trống, Vàng = Đang xem, Đỏ = Đã thuê */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-white px-2 sm:px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs text-[9px] sm:text-[10px] font-bold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 border border-emerald-600 inline-block shadow-xs"></span>
            Trống
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400 border border-amber-500 inline-block shadow-xs"></span>
            Đang xem
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-rose-500 border border-rose-600 inline-block shadow-xs"></span>
            Đã thuê
          </span>
        </div>
      </div>

      {/* Viewport 100% Bản đồ thực tế với các khung căn hộ nổi bật */}
      <div className="relative flex-1 w-full h-full bg-slate-100 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Minimal Zoom, Recenter, & Fullscreen Controls */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex flex-col bg-white shadow-md rounded border border-slate-200 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-700 hover:bg-slate-100 transition"
            title="Phóng to"
          >
            <ZoomIn className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-700 hover:bg-slate-100 transition border-t border-slate-200"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
          <button
            onClick={handleResetCenter}
            className="p-1.5 text-slate-900 hover:bg-slate-100 transition border-t border-slate-200"
            title="Đến vị trí căn"
          >
            <Navigation className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-900 hover:bg-slate-100 transition border-t border-slate-200"
            title={isExpanded ? 'Thu nhỏ bản đồ' : 'Toàn màn hình bản đồ'}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            ) : (
              <Maximize2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
