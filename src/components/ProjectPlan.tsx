'use client';

import React, { useState } from 'react';
import { Unit, Zone } from '@/types/unit';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Focus } from 'lucide-react';

interface ProjectPlanProps {
  zones: Zone[];
  selectedZone: Zone;
  onSelectZone: (zone: Zone) => void;
  selectedUnit: Unit;
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
}

export const ProjectPlan: React.FC<ProjectPlanProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  selectedUnit,
  units,
  onSelectUnit,
}) => {
  // Khởi tạo mức zoom mặc định 1.2x để ảnh hiển thị to, rõ nét, choán đầy không gian
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 2.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.9));
  const handleResetZoom = () => setZoomLevel(1.2);

  return (
    <div
      className={`relative bg-white overflow-hidden flex flex-col transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-4 z-50 shadow-2xl border-2 border-slate-900 bg-white'
          : 'w-full h-full'
      }`}
    >
      {/* Header bar: Minimal wireframe style + Zoom presets */}
      <div className="h-8 px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 z-10 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black tracking-widest text-slate-800 uppercase">
            PROJECT PLAN
          </span>
          <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
            (Bấm chọn khu vực &bull; Cuộn chuột / Zoom để phóng to)
          </span>
        </div>

        {/* Nút điều khiển Zoom và Preset tỷ lệ kích thước ảnh */}
        <div className="flex items-center gap-1.5">
          {/* Preset nhanh mức phóng to */}
          <div className="hidden md:flex items-center bg-slate-200/70 p-0.5 rounded text-[10px] font-bold text-slate-700">
            <button
              onClick={() => setZoomLevel(1.0)}
              className={`px-1.5 py-0.5 rounded transition ${
                zoomLevel === 1.0 ? 'bg-white text-black shadow-xs' : 'hover:text-black'
              }`}
            >
              100%
            </button>
            <button
              onClick={() => setZoomLevel(1.25)}
              className={`px-1.5 py-0.5 rounded transition ${
                zoomLevel === 1.25 ? 'bg-white text-black shadow-xs' : 'hover:text-black'
              }`}
            >
              125%
            </button>
            <button
              onClick={() => setZoomLevel(1.5)}
              className={`px-1.5 py-0.5 rounded transition ${
                zoomLevel === 1.5 ? 'bg-white text-black shadow-xs' : 'hover:text-black'
              }`}
            >
              150%
            </button>
          </div>

          <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-600 hover:text-black hover:bg-slate-200 transition"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-600 hover:text-black hover:bg-slate-200 transition"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-slate-600 hover:text-black hover:bg-slate-200 transition"
              title="Mặc định (1.2x)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-slate-600 hover:text-black hover:bg-slate-200 transition ml-0.5"
              title={isExpanded ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Plan SVG Viewport: Tối ưu diện tích hiển thị tối đa, không lãng phí padding */}
      <div className="relative flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-0.5 select-none">
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1024 778"
            className="w-full h-full drop-shadow-sm select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* 1. Master Plan Bitmap Image (1024x778) */}
            <image
              href="/project-plan.jpg"
              x="0"
              y="0"
              width="1024"
              height="778"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* 2. CÁC PHÂN KHU (ZONES) ĐƯỢC ĐÓNG KHUNG TRÊN PROJECT PLAN (MÀU SẮC NỔI BẬT RÕ NÉT) */}
            {zones.map((zone) => {
              const isSelected = zone.id === selectedZone.id;
              const isHovered = hoveredZoneId === zone.id;
              const box = zone.box;

              // Màu sắc viền nổi bật: Khi chưa click dùng Xanh Royal (#2563eb) sắc nét, hover dùng Sky (#0284c7), khi click dùng Đen tuyền (#0f172a)
              const strokeColor = isSelected
                ? '#0f172a'
                : isHovered
                ? '#0284c7'
                : '#2563eb';
              const strokeWidth = isSelected ? 4 : isHovered ? 3.5 : 2.8;
              const strokeDasharray = isSelected ? undefined : '8 4';
              const fillColor = isSelected
                ? 'rgba(15, 23, 42, 0.16)'
                : isHovered
                ? 'rgba(2, 132, 199, 0.14)'
                : 'rgba(37, 99, 235, 0.08)';

              return (
                <g
                  key={zone.id}
                  onClick={() => onSelectZone(zone)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                  className="cursor-pointer"
                  style={{ pointerEvents: 'all' }}
                >
                  {/* Khung bao quát phân khu viền màu nổi bật */}
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    rx={3}
                    filter={isSelected ? 'url(#zoneGlow)' : undefined}
                    className="transition-colors duration-150"
                  />

                  {/* 4 Góc Viewfinder định vị kiến trúc (Luôn hiển thị để khung nổi bật, đậm hơn khi chọn) */}
                  <g stroke={strokeColor} strokeWidth={isSelected ? 3.5 : 2.5} fill="none" strokeLinecap="square">
                    {/* Top-Left */}
                    <path d={`M ${box.x - 3} ${box.y + 10} L ${box.x - 3} ${box.y - 3} L ${box.x + 10} ${box.y - 3}`} />
                    {/* Top-Right */}
                    <path d={`M ${box.x + box.width - 10} ${box.y - 3} L ${box.x + box.width + 3} ${box.y - 3} L ${box.x + box.width + 3} ${box.y + 10}`} />
                    {/* Bottom-Left */}
                    <path d={`M ${box.x - 3} ${box.y + box.height - 10} L ${box.x - 3} ${box.y + box.height + 3} L ${box.x + 10} ${box.y + box.height + 3}`} />
                    {/* Bottom-Right */}
                    <path d={`M ${box.x + box.width - 10} ${box.y + box.height + 3} L ${box.x + box.width + 3} ${box.y + box.height + 3} L ${box.x + box.width + 3} ${box.y + box.height - 10}`} />
                  </g>

                  {/* Tag tên phân khu nổi bật gắn ở góc trên mỗi khung */}
                  <g className="pointer-events-none">
                    <rect
                      x={box.x + 4}
                      y={box.y + 4}
                      width={zone.code.length * 8 + 18}
                      height={18}
                      rx={3}
                      fill={isSelected ? '#0f172a' : '#2563eb'}
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.25))"
                    />
                    <text
                      x={box.x + 4 + (zone.code.length * 8 + 18) / 2}
                      y={box.y + 16.5}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="900"
                      textAnchor="middle"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont"
                      letterSpacing="0.5"
                    >
                      {zone.code}
                    </text>
                  </g>

                  {/* Tooltip khi hover phân khu */}
                  {isHovered && !isSelected && (
                    <g pointerEvents="none">
                      <rect
                        x={box.centerX - 75}
                        y={box.y - 28}
                        width="150"
                        height="24"
                        rx="4"
                        fill="#0f172a"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                      />
                      <text
                        x={box.centerX}
                        y={box.y - 12}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont"
                      >
                        Bấm chọn {zone.name.split(' ')[0]}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Các căn hộ bên trong khu vực đang chọn với màu trạng thái nổi bật (Xanh = Trống, Vàng = Đang xem, Đỏ = Đã thuê) */}
            {units.map((unit) => {
              const isInSelectedZone = unit.zoneId === selectedZone.id;
              const isSelectedUnit = unit.id === selectedUnit.id;
              if (!isInSelectedZone) return null;

              const statusColor = unit.status === 'Trống'
                ? '#10b981'
                : unit.status === 'Đang xem'
                ? '#f59e0b'
                : '#ef4444';

              return (
                <g key={`plan-unit-${unit.id}`} className="pointer-events-none">
                  <rect
                    x={unit.shape.x}
                    y={unit.shape.y}
                    width={unit.shape.width}
                    height={unit.shape.height}
                    fill={isSelectedUnit ? `${statusColor}80` : `${statusColor}50`}
                    stroke={isSelectedUnit ? '#0f172a' : statusColor}
                    strokeWidth={isSelectedUnit ? 3.5 : 2.5}
                    rx={1}
                  />
                  {isSelectedUnit && (
                    <circle
                      cx={unit.shape.centerX}
                      cy={unit.shape.centerY}
                      r={3}
                      fill="#0f172a"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
