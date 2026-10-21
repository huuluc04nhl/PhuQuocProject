# PhuQuocProject - Interactive Sales Gallery Showroom Kiosk

Ứng dụng tương tác bán hàng và giới thiệu bất động sản phục vụ màn hình cảm ứng 86" kết hợp màn LED 7x5m tại Sales Gallery Showroom.

## 🚀 Tính năng nổi bật

- **Kiến trúc Bố cục chuẩn Wireframe**:
  - Khối **MAP** và **PROJECT PLAN** tương tác trực quan (Project Plan chồng lên phần đáy của Map theo đúng bản vẽ thiết kế).
  - Khối **VIDEO / IMAGE** hiển thị media độ nét cao với bo góc tròn lớn (`rounded-3xl`).
  - Khối **INFO** hiển thị đầy đủ 6 thông số cốt lõi: Mã căn, Giá thuê, Hướng, Diện tích, Trạng thái, Nội thất.
  - Khối **BOOKING & CONTACT**: Tự động hiển thị khi căn còn trống/đang xem và ẩn hoàn toàn khi căn đã cho thuê.
- **Hệ thống Chọn Phân Khu & Khung Căn Hộ Đối Xứng**:
  - Bấm chọn phân khu trên Master Plan -> Phân khu được đóng khung bao quát kèm 4 góc viewfinder sắc nét.
  - Bản đồ thực tế **OpenStreetMap** tự động `flyTo` đến đúng tọa độ địa lý công trình.
  - Hiển thị trực tiếp các khung chữ nhật căn hộ trên nền bản đồ thực tế với mã màu trạng thái trực quan:
    - 🟢 **Xanh lá**: Căn Trống (Available)
    - 🟡 **Vàng cam**: Căn Đang xem (Viewing)
    - 🔴 **Đỏ**: Căn Đã cho thuê (Rented)
- **Tọa độ GPS chuẩn xác từ OpenStreetMap**:
  - Dữ liệu địa lý được đối soát thực tế với cơ sở dữ liệu OpenStreetMap (Lumière Boulevard Tòa A, D, dãy nhà liền kề, đại lộ The Manhattan, bán đảo The Rivus).
- **Hệ thống AI Skills**:
  - Tích hợp 5 bộ skill trong `.agents/`: `ponytail`, `graphify`, `taste-skill`, `ui-ux-pro-max`, `caveman`.

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Styling**: React 19, TypeScript, Tailwind CSS
- **Bản đồ**: Leaflet & OpenStreetMap (100% mã nguồn mở)
- **Icons**: Lucide React

## 📦 Cài đặt & Chạy dự án

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev

# Mở trình duyệt tại: http://localhost:3000
```

## 🏗️ Build Production

```bash
npm run build
npm run start
```
