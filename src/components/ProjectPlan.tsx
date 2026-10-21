'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Unit, Zone } from '@/types/unit';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Move } from 'lucide-react';

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
  // Quản lý Pan (vị trí kéo x, y) và Zoom (độ phóng đại)
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs để lưu trữ state tức thời cho mouse events & touch events
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const zoomRef = useRef<number>(1.2);
  const hasMovedRef = useRef<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  // Giữ ref đồng bộ
  panRef.current = pan;
  zoomRef.current = zoomLevel;

  // Hàm giới hạn di chuyển (pan) để ảnh không bao giờ bị kéo tuột ra ngoài,
  // chỉ cho phép kéo trong giới hạn của bức ảnh (bounding limits)
  const clampPan = (x: number, y: number, zoom: number, container: HTMLElement | null) => {
    if (!container) return { x, y };
    const W = container.clientWidth;
    const H = container.clientHeight;
    if (!W || !H) return { x, y };

    const imageRatio = 1024 / 778;
    const containerRatio = W / H;
    let baseW = W;
    let baseH = H;
    if (containerRatio > imageRatio) {
      baseH = H;
      baseW = H * imageRatio;
    } else {
      baseW = W;
      baseH = W / imageRatio;
    }

    const curW = baseW * zoom;
    const curH = baseH * zoom;

    // Giới hạn trục ngang: Không bao giờ cho phép mép ảnh vượt qua mép container
    const maxPanX = Math.abs(curW - W) / 2;
    const clampedX = Math.max(-maxPanX, Math.min(maxPanX, x));

    // Giới hạn trục dọc: Không bao giờ cho phép mép ảnh vượt qua mép container
    const maxPanY = Math.abs(curH - H) / 2;
    const clampedY = Math.max(-maxPanY, Math.min(maxPanY, y));

    return { x: clampedX, y: clampedY };
  };

  // Lăn chuột phóng to / thu nhỏ tại vị trí con trỏ chuột, luôn kẹp chặt trong giới hạn ảnh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      const zoomFactor = e.deltaY < 0 ? 1.18 : 0.85;
      const currentZoom = zoomRef.current;
      const nextZoom = Math.max(1.0, Math.min(4.5, Number((currentZoom * zoomFactor).toFixed(3))));

      if (nextZoom === currentZoom) return;

      const actualFactor = nextZoom / currentZoom;
      const currentPan = panRef.current;

      const targetX = mouseX - (mouseX - currentPan.x) * actualFactor;
      const targetY = mouseY - (mouseY - currentPan.y) * actualFactor;
      const clampedPan = clampPan(targetX, targetY, nextZoom, container);

      setPan(clampedPan);
      setZoomLevel(nextZoom);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Xử lý kéo thả toàn màn hình (chặn kéo ra ngoài phạm vi bức ảnh)
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (!hasMovedRef.current && Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true;
      }
      const nextPan = clampPan(
        panStartRef.current.x + dx,
        panStartRef.current.y + dy,
        zoomRef.current,
        containerRef.current
      );
      setPan(nextPan);
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Đảm bảo khi resize trình duyệt hoặc mở rộng toàn màn hình thì pan luôn nằm trong giới hạn
  useEffect(() => {
    const handleResize = () => {
      setPan((curPan) => clampPan(curPan.x, curPan.y, zoomRef.current, containerRef.current));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPan((curPan) => clampPan(curPan.x, curPan.y, zoomRef.current, containerRef.current));
    }, 320);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Chỉ nút chuột trái
    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...panRef.current };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setIsDragging(true);
      hasMovedRef.current = false;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...panRef.current };
    } else if (e.touches.length === 2) {
      // 2 ngón tay: Pinch zoom
      isDraggingRef.current = false;
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      if (!hasMovedRef.current && Math.hypot(dx, dy) > 5) {
        hasMovedRef.current = true;
      }
      const nextPan = clampPan(
        panStartRef.current.x + dx,
        panStartRef.current.y + dy,
        zoomRef.current,
        containerRef.current
      );
      setPan(nextPan);
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleChange = newDist / touchStartRef.current.dist;
      touchStartRef.current.dist = newDist;
      const nextZoom = Math.max(1.0, Math.min(4.5, Number((zoomRef.current * scaleChange).toFixed(2))));
      setPan((curPan) => clampPan(curPan.x, curPan.y, nextZoom, containerRef.current));
      setZoomLevel(nextZoom);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => {
      const next = Math.min(Number((prev + 0.3).toFixed(2)), 4.5);
      setPan((curPan) => clampPan(curPan.x, curPan.y, next, containerRef.current));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(Number((prev - 0.3).toFixed(2)), 1.0);
      setPan((curPan) => clampPan(curPan.x, curPan.y, next, containerRef.current));
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1.2);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative bg-white overflow-hidden flex flex-col transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl border-2 border-slate-900 bg-white'
          : 'w-full h-full'
      }`}
    >
      {/* Header bar: Minimal wireframe style (Đã bỏ bộ tỷ lệ % theo yêu cầu) */}
      <div className="h-9 sm:h-8 px-2 sm:px-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 z-10 select-none">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-800 uppercase">
            PROJECT PLAN
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold hidden sm:inline">
            (Kéo chuột &bull; Lăn zoom)
          </span>
          <span className="text-[9px] text-slate-500 font-bold sm:hidden">
            (Chạm &bull; Kéo &bull; Zoom)
          </span>
        </div>

        {/* Nút điều khiển Zoom và Fullscreen - Tối ưu kích thước chạm cho mobile & tablet */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 sm:p-1 rounded text-slate-600 hover:text-black active:bg-slate-200 hover:bg-slate-200 transition"
            title="Phóng to (hoặc lăn chuột lên)"
          >
            <ZoomIn className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 sm:p-1 rounded text-slate-600 hover:text-black active:bg-slate-200 hover:bg-slate-200 transition"
            title="Thu nhỏ (hoặc lăn chuột xuống)"
          >
            <ZoomOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 sm:p-1 rounded text-slate-600 hover:text-black active:bg-slate-200 hover:bg-slate-200 transition"
            title="Đặt lại vị trí & tỷ lệ mặc định"
          >
            <RotateCcw className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </button>
          <div className="h-4 sm:h-3 w-px bg-slate-300 mx-1 sm:mx-0.5" />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:p-1 rounded text-slate-600 hover:text-black active:bg-slate-200 hover:bg-slate-200 transition"
            title={isExpanded ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> : <Maximize2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />}
          </button>
        </div>
      </div>

      {/* Plan Viewport: Không dùng thanh cuộn, hỗ trợ kéo (drag pan) và lăn chuột (wheel zoom) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex-1 overflow-hidden bg-slate-100 flex items-center justify-center select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          className={`relative w-full h-full flex items-center justify-center origin-center ${
            isDragging ? 'transition-none' : 'transition-transform duration-100 ease-out'
          }`}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          }}
        >
          <svg
            viewBox="0 0 1024 778"
            className="w-full h-full drop-shadow-sm select-none pointer-events-auto"
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
                  onClick={(e) => {
                    if (hasMovedRef.current) {
                      e.stopPropagation();
                      return;
                    }
                    onSelectZone(zone);
                  }}
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

                  {/* Tooltip khi hover phân khu: Viết lại chuẩn 'Bấm chọn khu Lumière', 'Bấm chọn khu Manhattan', 'Bấm chọn khu The Rivus' */}
                  {isHovered && !isSelected && (
                    <g pointerEvents="none">
                      <rect
                        x={box.centerX - 85}
                        y={box.y - 28}
                        width="170"
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
                        Bấm chọn khu {zone.code === 'LUMIERE' ? 'Lumière' : zone.code === 'MANHATTAN' ? 'Manhattan' : zone.code === 'RIVUS' ? 'The Rivus' : zone.code}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* CÁC ĐIỂM CHỌN CĂN HỘ HÌNH TRÒN TRỰC TIẾP TRÊN MẶT BẰNG PROJECT PLAN THEO YÊU CẦU */}
            {units.map((unit) => {
              const isSelectedUnit = unit.id === selectedUnit.id;
              const isInSelectedZone = unit.zoneId === selectedZone.id;

              const statusColor = unit.status === 'Trống'
                ? '#10b981'
                : unit.status === 'Đang xem'
                ? '#f59e0b'
                : '#ef4444';

              const cx = unit.shape.centerX;
              const cy = unit.shape.centerY;

              return (
                <g
                  key={`plan-unit-circle-${unit.id}`}
                  onClick={(e) => {
                    if (hasMovedRef.current) {
                      e.stopPropagation();
                      return;
                    }
                    e.stopPropagation(); // Chặn lan truyền click phân khu phía sau
                    onSelectUnit(unit);
                  }}
                  className="cursor-pointer group"
                  style={{ pointerEvents: 'all' }}
                >
                  {/* Khung nền mờ vị trí căn */}
                  <rect
                    x={unit.shape.x}
                    y={unit.shape.y}
                    width={unit.shape.width}
                    height={unit.shape.height}
                    fill={isSelectedUnit ? `${statusColor}40` : `${statusColor}20`}
                    stroke={isSelectedUnit ? '#0f172a' : statusColor}
                    strokeWidth={isSelectedUnit ? 2 : 1}
                    strokeDasharray="2 2"
                    rx={2}
                    className="pointer-events-none"
                  />

                  {/* Hiệu ứng sóng radar ping lan tỏa cho căn đang được chọn */}
                  {isSelectedUnit && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={18}
                      fill={statusColor}
                      fillOpacity={0.35}
                      className="animate-ping"
                    />
                  )}

                  {/* Vòng hào quang bên ngoài của hình tròn */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelectedUnit ? 12 : 9}
                    fill={isSelectedUnit ? '#0f172a' : '#ffffff'}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                    className="transition-all duration-150"
                  />

                  {/* Vòng tròn màu trạng thái cốt lõi (Xanh = Trống, Vàng = Đang xem, Đỏ = Đã thuê) */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelectedUnit ? 8.5 : 6.5}
                    fill={statusColor}
                    stroke="#ffffff"
                    strokeWidth={isSelectedUnit ? 2.5 : 1.5}
                    className="transition-all duration-150"
                  />

                  {/* Tâm tròn trắng nổi bật */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelectedUnit ? 3 : 2}
                    fill="#ffffff"
                  />

                  {/* Tag nhãn mã căn hộ gắn ngay trên hình tròn */}
                  <g className="pointer-events-none">
                    <rect
                      x={cx - 18}
                      y={cy - (isSelectedUnit ? 26 : 22)}
                      width={36}
                      height={13}
                      rx={3}
                      fill={isSelectedUnit ? '#0f172a' : 'rgba(15, 23, 42, 0.85)'}
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.35))"
                    />
                    <text
                      x={cx}
                      y={cy - (isSelectedUnit ? 17 : 13)}
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="900"
                      textAnchor="middle"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont"
                      letterSpacing="0.3"
                    >
                      {unit.code}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
