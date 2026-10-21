export type UnitStatus = 'Trống' | 'Đang xem' | 'Đã cho thuê';

export interface Zone {
  id: string;
  code: string;            // LUMIERE, MANHATTAN, RIVUS, ORIGAMI
  name: string;            // Tên phân khu
  description?: string;
  // Khung bao quát trên Master Project Plan (SVG 1024x778)
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };
  // Tọa độ trung tâm trên OpenStreetMap
  mapCoords: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface Unit {
  id: string;
  zoneId: string;          // Thuộc phân khu nào
  code: string;            // Mã căn: LB-1204, LK-08, MH-18...
  name: string;            // Tên căn hộ / Biệt thự / Shophouse
  subdivision: string;     // Phân khu
  floor?: string;          // Tầng
  price: string;           // Giá thuê
  priceNumeric: number;
  orientation: string;     // Hướng
  area: string;            // Diện tích
  status: UnitStatus;      // 'Trống' | 'Đang xem' | 'Đã cho thuê'
  furnished: 'Có' | 'Không';
  furnishedDetail?: string;
  bedrooms: number;
  bathrooms: number;
  highlights: string[];
  
  // Khung hình học chuẩn xác theo hệ tọa độ SVG 1024x778 của bản đồ
  shape: {
    type: 'rect' | 'polygon';
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    points?: string;
    centerX: number;
    centerY: number;
  };

  // Tọa độ trên OpenStreetMap
  mapCoords: {
    lat: number;
    lng: number;
  };

  // Khung chữ nhật của căn hộ trực tiếp trên bản đồ thực tế [[latMin, lngMin], [latMax, lngMax]]
  mapBounds: [[number, number], [number, number]];

  // Đa giác polygon bám sát hình khối kiến trúc thực tế của căn nhà [[lat, lng], ...]
  mapPolygon: [number, number][];

  images: string[];
  videoUrl?: string;
}

