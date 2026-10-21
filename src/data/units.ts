import { Unit, Zone } from '@/types/unit';

export const DEMO_ZONES: Zone[] = [
  {
    id: 'zone-lumiere',
    code: 'LUMIERE',
    name: 'Tổ Hợp Lumière Boulevard & Cụm Liền Kề',
    description: 'Khu căn hộ sinh thái cao cấp và dãy nhà phố liền kề view công viên 36ha',
    // Khung bao quát chuẩn xác trên Master Plan (Bao gồm tòa tháp Lumière và dãy căn trắng nhỏ liền kề)
    box: {
      x: 295,
      y: 360,
      width: 235,
      height: 165,
      centerX: 412,
      centerY: 442,
    },
    mapCoords: {
      lat: 10.8394,
      lng: 106.8405,
    },
    zoom: 17,
  },
  {
    id: 'zone-manhattan',
    code: 'MANHATTAN',
    name: 'Phân Khu The Manhattan & Đại Lộ Mua Sắm',
    description: 'Trung tâm thương mại tài chính sầm uất với chuỗi shophouse và biệt thự ven hồ',
    box: {
      x: 370,
      y: 520,
      width: 260,
      height: 220,
      centerX: 500,
      centerY: 630,
    },
    mapCoords: {
      lat: 10.8355,
      lng: 106.8425,
    },
    zoom: 17,
  },
  {
    id: 'zone-rivus',
    code: 'RIVUS',
    name: 'Bán Đảo Dinh Thự The Rivus Elie Saab',
    description: 'Khu dinh thự siêu sang phiên bản giới hạn ven sông Đồng Nai khoáng đạt',
    box: {
      x: 770,
      y: 410,
      width: 220,
      height: 230,
      centerX: 880,
      centerY: 525,
    },
    mapCoords: {
      lat: 10.8410,
      lng: 106.8516,
    },
    zoom: 17,
  },
];

export const DEMO_UNITS: Unit[] = [
  // ==========================================
  // KHU 1: LUMIÈRE BOULEVARD & DÃY NHÀ LIỀN KỀ
  // ==========================================

  // 1. CĂN TRỐNG (1/2) - Căn Hộ Panorama Lumière Boulevard (Tòa A)
  {
    id: 'unit-lb-1204',
    zoneId: 'zone-lumiere',
    code: 'LB-1204',
    name: 'Căn Hộ Panorama Lumière Boulevard',
    subdivision: 'Tổ hợp Lumière Boulevard (Tầng 12 - Tòa A)',
    floor: 'Tầng 12',
    price: '28.000.000 ₫/tháng',
    priceNumeric: 28000000,
    orientation: 'Đông Bắc (View sông Đồng Nai & Biển hồ)',
    area: '95 m²',
    status: 'Trống', // 1. TRỐNG -> HIỆN 2 BUTTON
    furnished: 'Có',
    furnishedDetail: 'Nội thất nhập khẩu Châu Âu, ban công kính tràn viền view sông mát mẻ',
    bedrooms: 3,
    bathrooms: 2,
    highlights: ['Căn góc 2 mặt thoáng', 'Phòng khách view panorama', 'Trang bị bếp đảo hiện đại', 'Sẵn sàng dọn vào ở ngay'],
    // Vị trí tròn chọn căn đúng ngay Tòa A trên mặt bằng Project Plan
    shape: {
      type: 'circle',
      x: 355,
      y: 395,
      width: 30,
      height: 30,
      centerX: 370,
      centerY: 410,
    },
    mapCoords: {
      lat: 10.8403331,
      lng: 106.8396425,
    },
    mapBounds: [
      [10.8401789, 106.8393160],
      [10.8404904, 106.8399717],
    ],
    // Tọa độ Đa giác Polygon chuẩn GPS 100% theo footprint Tòa A (OSM Way 1308941544)
    mapPolygon: [
      [10.8403169, 106.8399717],
      [10.8401789, 106.8399121],
      [10.8402740, 106.8396907],
      [10.8401967, 106.8396587],
      [10.8403357, 106.8393160],
      [10.8404904, 106.8393905],
      [10.8404016, 106.8395842],
      [10.8404706, 106.8396161],
      [10.8403169, 106.8399717],
    ],
    videoUrl: 'https://www.youtube.com/watch?v=jYk7ZBb1hA4',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // 2. CĂN ĐÃ CHO THUÊ (1/2) - Khối Tòa D Lumière Boulevard
  {
    id: 'unit-lb-0806',
    zoneId: 'zone-lumiere',
    code: 'LB-0806',
    name: 'Căn Hộ Nghỉ Dưỡng Lumière Boulevard',
    subdivision: 'Tổ hợp Lumière Boulevard (Tầng 8 - Tòa D)',
    floor: 'Tầng 08',
    price: '22.000.000 ₫/tháng',
    priceNumeric: 22000000,
    orientation: 'Đông Nam (View trọn Đại công viên 36ha)',
    area: '77 m²',
    status: 'Đã cho thuê', // 1. ĐÃ CHO THUÊ -> ẨN 2 BUTTON
    furnished: 'Có',
    furnishedDetail: 'Tiêu chuẩn Masterise Homes, kính Low-E full trần sàn, thiết bị Bosch & Kohler',
    bedrooms: 2,
    bathrooms: 2,
    highlights: ['Vườn treo trên không thẳng đứng', 'Hồ bơi phi thuyền 65m', 'Rạp chiếu phim ngoài trời', 'Ngay cạnh Vincom Mega Mall'],
    // Vị trí tròn chọn căn đúng ngay Tòa D trên mặt bằng Project Plan
    shape: {
      type: 'circle',
      x: 400,
      y: 460,
      width: 30,
      height: 30,
      centerX: 415,
      centerY: 475,
    },
    mapCoords: {
      lat: 10.8385689,
      lng: 106.8391103,
    },
    mapBounds: [
      [10.8382701, 106.8386150],
      [10.8388147, 106.8395834],
    ],
    // Tọa độ Đa giác Polygon chuẩn GPS 100% theo footprint Tòa D (OSM Way 1223353340)
    mapPolygon: [
      [10.8382701, 106.8395068],
      [10.8384213, 106.8391713],
      [10.8384987, 106.8392057],
      [10.8385931, 106.8389946],
      [10.8385149, 106.8389560],
      [10.8386583, 106.8386150],
      [10.8388147, 106.8386858],
      [10.8387230, 106.8388957],
      [10.8388094, 106.8389443],
      [10.8385972, 106.8394048],
      [10.8385086, 106.8393600],
      [10.8384171, 106.8395834],
      [10.8382701, 106.8395068],
    ],
    videoUrl: 'https://www.youtube.com/watch?v=M8nzM4p9xF4',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // 3. CĂN ĐANG XEM (1/2) - Dãy Nhà Trắng Nhỏ Liền Kề Cạnh Lumière (theo ảnh user khoanh)
  {
    id: 'unit-lk-08',
    zoneId: 'zone-lumiere',
    code: 'LK-08',
    name: 'Nhà Phố Liền Kề Dãy Trắng Công Viên',
    subdivision: 'Dãy Liền Kề Ven Công Viên (Kế cận Lumière)',
    floor: 'Nhà 4 Tầng',
    price: '48.000.000 ₫/tháng',
    priceNumeric: 48000000,
    orientation: 'Chính Đông (Mặt hướng công viên & hồ sinh thái)',
    area: '120 m²',
    status: 'Đang xem', // 1. ĐANG XEM -> HIỆN 2 BUTTON
    furnished: 'Có',
    furnishedDetail: 'Đầy đủ nội thất cao cấp, sân trước đỗ ô tô, sân thượng BBQ ngắm cảnh hồ',
    bedrooms: 4,
    bathrooms: 4,
    highlights: ['Vị trí dãy trắng đắt giá cạnh Lumière', 'Đường nội khu rợp bóng cây 12m', 'Sát bên trường học quốc tế', 'Không gian yên tĩnh an ninh tuyệt đối'],
    // Căn nhà màu trắng nhỏ li ti đúng trong dãy bên cạnh Lumière Boulevard
    shape: {
      type: 'circle',
      x: 483,
      y: 383,
      width: 24,
      height: 24,
      centerX: 495,
      centerY: 395,
    },
    mapCoords: {
      lat: 10.840277,
      lng: 106.842265,
    },
    mapBounds: [
      [10.84018, 106.84214],
      [10.84043, 106.84239],
    ],
    // Tọa độ Đa giác Polygon chuẩn GPS 100% bám chân lô nhà phố trên trục Đường T2/T3
    mapPolygon: [
      [10.84036, 106.84214],
      [10.84043, 106.84232],
      [10.84025, 106.84239],
      [10.84018, 106.84221],
      [10.84036, 106.84214],
    ],
    videoUrl: 'https://www.youtube.com/watch?v=1IAsjVODFFU',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // ==========================================
  // KHU 2: THE MANHATTAN
  // ==========================================

  // 4. CĂN TRỐNG (2/2) - Biệt Thự The Manhattan Ven Bến Du Thuyền
  {
    id: 'unit-mh-18',
    zoneId: 'zone-manhattan',
    code: 'MH-18',
    name: 'Biệt Thự Đơn Lập The Manhattan',
    subdivision: 'Phân khu The Manhattan (Ven Bến Du Thuyền & Sông Tắc)',
    floor: 'Nhà 3.5 Tầng',
    price: '90.000.000 ₫/tháng',
    priceNumeric: 90000000,
    orientation: 'Đông Nam (View trực diện bến du thuyền Manhattan Island & Sông Tắc)',
    area: '312 m²',
    status: 'Trống', // 2. TRỐNG -> HIỆN 2 BUTTON
    furnished: 'Có',
    furnishedDetail: 'Full nội thất hoàng gia cao cấp, thang máy riêng, hồ bơi sân vườn',
    bedrooms: 4,
    bathrooms: 5,
    highlights: ['Mặt tiền kinh doanh cực lớn', 'Sân vườn riêng 150m²', 'Garage 2 ô tô', 'An ninh 3 lớp 24/7'],
    // Căn biệt thự The Manhattan ven hồ bến du thuyền trên mặt bằng
    shape: {
      type: 'circle',
      x: 441,
      y: 661,
      width: 28,
      height: 28,
      centerX: 455,
      centerY: 675,
    },
    mapCoords: {
      lat: 10.834305,
      lng: 106.841855,
    },
    mapBounds: [
      [10.83416, 106.84165],
      [10.83445, 106.84204],
    ],
    // Tọa độ Đa giác Polygon chuẩn GPS 100% theo lô biệt thự đơn lập ven bến du thuyền Sông Tắc (Đường M5)
    mapPolygon: [
      [10.83445, 106.84172],
      [10.83438, 106.84204],
      [10.83416, 106.84197],
      [10.83423, 106.84165],
      [10.83445, 106.84172],
    ],
    videoUrl: 'https://www.youtube.com/watch?v=-ngXMfgjQuM',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // 5. CĂN ĐANG XEM (2/2) - Shophouse The Manhattan
  {
    id: 'unit-mh-05',
    zoneId: 'zone-manhattan',
    code: 'MH-05',
    name: 'Shophouse Thương Mại The Manhattan',
    subdivision: 'Phân khu The Manhattan (Mặt tiền Đại lộ mua sắm)',
    floor: 'Nhà 5 Tầng',
    price: '55.000.000 ₫/tháng',
    priceNumeric: 55000000,
    orientation: 'Chính Nam (Mặt tiền trục đường thương mại sầm uất)',
    area: '140 m²',
    status: 'Đang xem', // 2. ĐANG XEM -> HIỆN 2 BUTTON
    furnished: 'Không',
    furnishedDetail: 'Hoàn thiện mặt ngoài, thô bên trong, phù hợp mở phòng khám / cafe / spa',
    bedrooms: 4,
    bathrooms: 4,
    highlights: ['Vỉa hè rộng 8m', 'Đỗ xe ô tô thoải mái', 'Kế cận công viên trung tâm', 'Hợp đồng dài hạn'],
    // Căn Shophouse mặt tiền Đại Lộ Mua Sắm The Manhattan (trục D2A màu vàng cam)
    shape: {
      type: 'circle',
      x: 502,
      y: 602,
      width: 26,
      height: 26,
      centerX: 515,
      centerY: 615,
    },
    mapCoords: {
      lat: 10.836845,
      lng: 106.843125,
    },
    mapBounds: [
      [10.83673, 106.84301],
      [10.83696, 106.84324],
    ],
    // Tọa độ Đa giác Polygon chuẩn GPS 100% bám mặt tiền Đại lộ D2A
    mapPolygon: [
      [10.83696, 106.84307],
      [10.83691, 106.84324],
      [10.83673, 106.84318],
      [10.83678, 106.84301],
      [10.83696, 106.84307],
    ],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=2wxzxN0Fthw',
  },

  // ==========================================
  // KHU 3: THE RIVUS (DINH THỰ)
  // ==========================================

  // 6. CĂN ĐÃ CHO THUÊ (2/2) - The Rivus Dinh Thự
  {
    id: 'unit-dt-06',
    zoneId: 'zone-rivus',
    code: 'DT-06',
    name: 'Dinh Thự Độc Bản The Rivus',
    subdivision: 'Khu Dinh Thự Nổi Ven Sông Đồng Nai',
    floor: 'Dinh Thự 3 Tầng',
    price: '250.000.000 ₫/tháng',
    priceNumeric: 250000000,
    orientation: 'Đông Bắc (View trực diện Sông Đồng Nai khoáng đạt)',
    area: '560 m²',
    status: 'Đã cho thuê', // 2. ĐÃ CHO THUÊ -> ẨN 2 BUTTON
    furnished: 'Có',
    furnishedDetail: 'Thiết kế thời trang cao cấp Elie Saab, vật liệu nhập khẩu Italy, hầm rượu, rạp chiếu phim',
    bedrooms: 5,
    bathrooms: 6,
    highlights: ['Bến du thuyền riêng tại gia', 'View sông Đồng Nai rộng 1km', 'Hồ bơi vô cực tràn bờ', 'Dịch vụ quản gia 5 sao'],
    // Lô Dinh Thự The Rivus ven sông trên bán đảo
    shape: {
      type: 'circle',
      x: 890,
      y: 495,
      width: 30,
      height: 30,
      centerX: 905,
      centerY: 510,
    },
    mapCoords: {
      lat: 10.840977,
      lng: 106.851875,
    },
    mapBounds: [
      [10.84083, 106.85172],
      [10.84113, 106.85203],
    ],
    // Tọa độ Đa giác Polygon chuẩn GPS 100% bám dải biệt thự ven sông Đồng Nai (OSM Way 853095479)
    mapPolygon: [
      [10.84103, 106.85172],
      [10.84113, 106.85196],
      [10.84093, 106.85203],
      [10.84083, 106.85179],
      [10.84103, 106.85172],
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Q8bweRzaLBk',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

