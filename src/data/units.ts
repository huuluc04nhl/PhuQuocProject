import { Unit, Zone } from '@/types/unit';

export const DEMO_ZONES: Zone[] = [
  {
    id: 'zone-lumiere',
    code: 'LUMIERE',
    name: 'Tổ Hợp Lumière Boulevard & Cụm Liền Kề',
    description: 'Khu căn hộ sinh thái cao cấp và dãy nhà phố liền kề view công viên 36ha',
    // Khung bao quát chuẩn xác trên Master Plan (Bao gồm tòa tháp Lumière và dãy căn trắng nhỏ liền kề)
    box: {
      x: 350,
      y: 375,
      width: 175,
      height: 140,
      centerX: 437,
      centerY: 445,
    },
    mapCoords: {
      lat: 10.8395,
      lng: 106.8400,
    },
    zoom: 17,
  },
  {
    id: 'zone-manhattan',
    code: 'MANHATTAN',
    name: 'Phân Khu The Manhattan & Đại Lộ Mua Sắm',
    description: 'Trung tâm thương mại tài chính sầm uất với chuỗi shophouse và biệt thự ven hồ',
    box: {
      x: 360,
      y: 520,
      width: 250,
      height: 210,
      centerX: 485,
      centerY: 625,
    },
    mapCoords: {
      lat: 10.8370,
      lng: 106.8440,
    },
    zoom: 17,
  },
  {
    id: 'zone-rivus',
    code: 'RIVUS',
    name: 'Bán Đảo Dinh Thự The Rivus Elie Saab',
    description: 'Khu dinh thự siêu sang phiên bản giới hạn ven sông Đồng Nai khoáng đạt',
    box: {
      x: 750,
      y: 430,
      width: 200,
      height: 180,
      centerX: 850,
      centerY: 520,
    },
    mapCoords: {
      lat: 10.8415,
      lng: 106.8525,
    },
    zoom: 17,
  },
];

export const DEMO_UNITS: Unit[] = [
  // ==========================================
  // KHU 1: LUMIÈRE BOULEVARD & DÃY NHÀ LIỀN KỀ
  // ==========================================

  // 1. CĂN TRỐNG (1/2) - Căn Hộ Panorama Lumière
  {
    id: 'unit-lb-1204',
    zoneId: 'zone-lumiere',
    code: 'LB-1204',
    name: 'Căn Hộ Panorama Lumière Boulevard',
    subdivision: 'Tổ hợp Lumière Boulevard (Tầng 12)',
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
    // Khung căn hộ trên khối tòa nhà Lumière
    shape: {
      type: 'rect',
      x: 375,
      y: 405,
      width: 50,
      height: 40,
      centerX: 400,
      centerY: 425,
    },
    mapCoords: {
      lat: 10.8403,
      lng: 106.8396,
    },
    mapBounds: [
      [10.84015, 106.83935],
      [10.84050, 106.83995],
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
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
    // Khung căn hộ trên khối phía nam tòa Lumière
    shape: {
      type: 'rect',
      x: 410,
      y: 440,
      width: 48,
      height: 38,
      centerX: 434,
      centerY: 459,
    },
    mapCoords: {
      lat: 10.8385,
      lng: 106.8392,
    },
    mapBounds: [
      [10.83827, 106.83865],
      [10.83880, 106.83955],
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // 3. CĂN ĐANG XEM (1/2) - Dãy Nhà Trắng Nhỏ Li Ti Cạnh Lumière (theo ảnh user khoanh)
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
    // Căn nhà màu trắng nhỏ li ti trong dãy bên cạnh Lumière Boulevard
    shape: {
      type: 'rect',
      x: 472,
      y: 404,
      width: 16,
      height: 14,
      centerX: 480,
      centerY: 411,
    },
    mapCoords: {
      lat: 10.8404,
      lng: 106.8412,
    },
    mapBounds: [
      [10.84025, 106.84095],
      [10.84055, 106.84145],
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    ],
  },

  // ==========================================
  // KHU 2: THE MANHATTAN
  // ==========================================

  // 4. CĂN TRỐNG (2/2) - Biệt Thự The Manhattan
  {
    id: 'unit-mh-18',
    zoneId: 'zone-manhattan',
    code: 'MH-18',
    name: 'Biệt Thự Đơn Lập The Manhattan',
    subdivision: 'Phân khu The Manhattan (Ven Bến Du Thuyền)',
    floor: 'Nhà 3.5 Tầng',
    price: '90.000.000 ₫/tháng',
    priceNumeric: 90000000,
    orientation: 'Đông Nam (Mặt tiền Đại lộ mua sắm The Manhattan)',
    area: '312 m²',
    status: 'Trống', // 2. TRỐNG -> HIỆN 2 BUTTON
    furnished: 'Có',
    furnishedDetail: 'Full nội thất hoàng gia cao cấp, thang máy riêng, hồ bơi sân vườn',
    bedrooms: 4,
    bathrooms: 5,
    highlights: ['Mặt tiền kinh doanh cực lớn', 'Sân vườn riêng 150m²', 'Garage 2 ô tô', 'An ninh 3 lớp 24/7'],
    // Căn biệt thự The Manhattan ven hồ
    shape: {
      type: 'rect',
      x: 410,
      y: 622,
      width: 34,
      height: 24,
      centerX: 427,
      centerY: 634,
    },
    mapCoords: {
      lat: 10.8375,
      lng: 106.8445,
    },
    mapBounds: [
      [10.83725, 106.84415],
      [10.83775, 106.84485],
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
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
    subdivision: 'Phân khu The Manhattan',
    floor: 'Nhà 5 Tầng',
    price: '55.000.000 ₫/tháng',
    priceNumeric: 55000000,
    orientation: 'Chính Nam (Mặt phố sầm uất)',
    area: '140 m²',
    status: 'Đang xem', // 2. ĐANG XEM -> HIỆN 2 BUTTON
    furnished: 'Không',
    furnishedDetail: 'Hoàn thiện mặt ngoài, thô bên trong, phù hợp mở phòng khám / cafe / spa',
    bedrooms: 4,
    bathrooms: 4,
    highlights: ['Vỉa hè rộng 8m', 'Đỗ xe ô tô thoải mái', 'Kế cận công viên trung tâm', 'Hợp đồng dài hạn'],
    // Căn Shophouse mặt tiền Đại Lộ Mua Sắm The Manhattan
    shape: {
      type: 'rect',
      x: 494,
      y: 610,
      width: 26,
      height: 20,
      centerX: 507,
      centerY: 620,
    },
    mapCoords: {
      lat: 10.8365,
      lng: 106.8435,
    },
    mapBounds: [
      [10.83630, 106.84320],
      [10.83670, 106.84380],
    ],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
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
      type: 'rect',
      x: 810,
      y: 470,
      width: 46,
      height: 36,
      centerX: 833,
      centerY: 488,
    },
    mapCoords: {
      lat: 10.8415,
      lng: 106.8525,
    },
    mapBounds: [
      [10.84110, 106.85190],
      [10.84190, 106.85310],
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];
