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
  mobileView?: 'map' | 'plan' | 'split';
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

// Cấu hình các nguồn bản đồ (Tile Providers) đáng tin cậy cao:
// 1. CartoDB Voyager: CDN toàn cầu (Fastly), siêu nhanh tại VN, không bị chặn hay rate-limit như OSM gốc
// 2. Esri Satellite: Ảnh vệ tinh thực tế sắc nét, quan sát rõ từng mái nhà & công viên
// 3. OpenStreetMap: Lớp bản đồ gốc tiêu chuẩn
const TILE_PROVIDERS = {
  streets: {
    name: 'Bản đồ số',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 20,
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    name: 'Vệ tinh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: '',
    maxZoom: 19,
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  osm: {
    name: 'OSM Gốc',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: 'abc',
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedZone,
  selectedUnit,
  units,
  onSelectUnit,
  mobileView = 'split',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [activeTileType, setActiveTileType] = useState<'streets' | 'satellite' | 'osm'>('streets');

  // Cập nhật lại kích thước bản đồ khi mở / đóng fullscreen hoặc khi mobileView thay đổi
  useEffect(() => {
    const timer1 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 50);
    const timer2 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
    const timer3 = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isExpanded, mobileView]);

  // Cập nhật tile layer khi người dùng đổi chế độ xem bản đồ (Bản đồ số / Vệ tinh / OSM)
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    import('leaflet').then((leafletModule) => {
      const L = (leafletModule as any).default || leafletModule;
      if (!L || !mapInstanceRef.current) return;

      const provider = TILE_PROVIDERS[activeTileType];
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }

      const newTileLayer = L.tileLayer(provider.url, {
        subdomains: provider.subdomains,
        maxZoom: provider.maxZoom,
        attribution: provider.attribution,
        crossOrigin: true,
      }).addTo(mapInstanceRef.current);

      // Đẩy tile layer xuống dưới cùng để không che khuất polygon
      newTileLayer.bringToBack();
      tileLayerRef.current = newTileLayer;
    });
  }, [activeTileType, isMapReady]);

  // 1. Khởi tạo bản đồ thực tế với cơ chế phòng ngừa lỗi trên máy khác
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (isInitializedRef.current) return;

    import('leaflet').then((leafletModule) => {
      const L = (leafletModule as any).default || leafletModule;
      if (!L || typeof L.map !== 'function' || !mapContainerRef.current || mapInstanceRef.current) return;

      // Không tải icon qua unpkg.com từ xa để tránh bị AdBlock hoặc firewall chặn trên máy khác
      try {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
      } catch (err) {
        // bỏ qua nếu đã xóa
      }

      const map = L.map(mapContainerRef.current, {
        center: [selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng],
        zoom: selectedZone.zoom || 17,
        zoomControl: false,
        attributionControl: false, // Tối giản giao diện Kiosk
      });

      // Mặc định nạp CartoDB Voyager qua Fastly CDN toàn cầu
      const provider = TILE_PROVIDERS.streets;
      const tileLayer = L.tileLayer(provider.url, {
        subdomains: provider.subdomains,
        maxZoom: provider.maxZoom,
        crossOrigin: true,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
      isInitializedRef.current = true;
      setIsMapReady(true);

      // Kích hoạt tính toán kích thước bản đồ ngay lập tức qua nhiều nhịp
      const t1 = setTimeout(() => map.invalidateSize(), 100);
      const t2 = setTimeout(() => map.invalidateSize(), 300);
      const t3 = setTimeout(() => map.invalidateSize(), 700);

      // ResizeObserver tự động cập nhật khi khung chứa thay đổi kích thước trên mọi thiết bị
      if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
        const ro = new ResizeObserver(() => {
          map.invalidateSize();
        });
        ro.observe(mapContainerRef.current);
        resizeObserverRef.current = ro;
      }

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }).catch((err) => {
      console.error('Không thể khởi tạo Leaflet:', err);
    });

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        isInitializedRef.current = false;
        setIsMapReady(false);
      }
    };
  }, []);

  // 2. Vẽ trực tiếp các KHUNG CĂN HỘ với BORDER NỔI BẬT & MÀU THEO TRẠNG THÁI
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !layersGroupRef.current) return;

    import('leaflet').then((leafletModule) => {
      const L = (leafletModule as any).default || leafletModule;
      if (!L || !mapInstanceRef.current || !layersGroupRef.current) return;

      const map = mapInstanceRef.current;
      const layersGroup = layersGroupRef.current;

      // Di chuyển bản đồ đến đúng vị trí căn hộ và zoom vào gần (zoom 18) để thấy rõ khối nhà polygon
      map.flyTo([selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng], 18, {
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
  }, [isMapReady, selectedUnit, selectedZone, units, onSelectUnit]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetCenter = () => {
    mapInstanceRef.current?.flyTo(
      [selectedUnit.mapCoords.lat, selectedUnit.mapCoords.lng],
      18
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
      <div className="relative flex-1 w-full min-h-0 bg-slate-100 overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Nút chuyển đổi chế độ xem bản đồ: Bản đồ số / Vệ tinh / OSM Gốc */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex items-center bg-white/95 backdrop-blur-xs shadow-md rounded-lg border border-slate-200 overflow-hidden text-[10px] sm:text-xs font-bold p-0.5">
          <button
            onClick={() => setActiveTileType('streets')}
            className={`px-2 py-1 rounded transition ${
              activeTileType === 'streets'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
            title="Bản đồ số CartoDB tốc độ cao"
          >
            Bản đồ số
          </button>
          <button
            onClick={() => setActiveTileType('satellite')}
            className={`px-2 py-1 rounded transition ${
              activeTileType === 'satellite'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
            title="Ảnh chụp vệ tinh thực tế Esri"
          >
            Vệ tinh
          </button>
          <button
            onClick={() => setActiveTileType('osm')}
            className={`px-2 py-1 rounded transition ${
              activeTileType === 'osm'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
            title="Bản đồ OpenStreetMap tiêu chuẩn"
          >
            OSM
          </button>
        </div>

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
