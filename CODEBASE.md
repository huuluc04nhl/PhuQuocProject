# CODEBASE - PhuQuocRental

> **Tài liệu tổng quan về kiến trúc, cấu trúc thư mục, quy ước và hệ thống của dự án PhuQuocRental.**

---

## 1. Tổng quan dự án (Project Overview)
- **Tên dự án**: PhuQuocRental
- **Mục tiêu**: Xây dựng nền tảng dịch vụ cho thuê trực tuyến tại Phú Quốc (cho thuê phương tiện: xe máy, ô tô, hoặc lưu trú: villa, homestay, tour trải nghiệm).
- **Trạng thái**: Khởi tạo và thiết lập hạ tầng dự án.

---

## 2. Cấu trúc thư mục (Directory Structure)

```text
PhuQuocRental/
├── .agents/                    # Hệ thống Skills & Rules tích hợp cho AI Agent
│   ├── rules/                  # Quy tắc lập trình & style guides
│   │   └── ponytail.md         # Quy tắc viết code tối giản, thực dụng
│   └── skills/                 # Các bộ kỹ năng chuyên biệt
│       ├── ponytail/           # Lean dev, YAGNI, tối ưu tokens & diffs
│       ├── graphify/           # Knowledge graph mapping & querying
│       ├── taste-skill/        # Anti-slop frontend & art direction
│       ├── ui-ux-pro-max/      # Cẩm nang UI/UX design intelligence
│       ├── caveman/            # Chế độ trả lời cô đọng, tiết kiệm token
│       └── ...                 # Các sub-skills phụ trợ
├── CODEBASE.md                 # Tài liệu cấu trúc & kiến trúc codebase
├── CURRENT_STATE.md            # Bảng theo dõi tiến độ & trạng thái hiện tại
└── [source code...]            # Thư mục mã nguồn ứng dụng (sẽ triển khai)
```

---

## 3. Công nghệ & Hạ tầng (Tech Stack & Environment)
*(Sẽ được cập nhật chi tiết khi thống nhất lựa chọn công nghệ)*

- **Hệ điều hành môi trường**: Windows
- **Runtime sẵn có**:
  - Node.js: `v24.16.0`
  - Git: `2.54.0`
- **Frontend dự kiến**: Tối ưu UI/UX với chuẩn Anti-slop từ [taste-skill](file:///.agents/skills/taste-skill/SKILL.md) và [ui-ux-pro-max](file:///.agents/skills/ui-ux-pro-max/SKILL.md).
- **Backend & Database dự kiến**: RESTful API / GraphQL kết hợp hệ quản trị CSDL phù hợp với nghiệp vụ đặt chỗ & quản lý tồn kho (availability calendar).

---

## 4. Quy ước & Nguyên tắc phát triển (Conventions & Guidelines)

### 4.1. Nguyên tắc lập trình (Ponytail Spirit)
1. **YAGNI & Tối giản (Minimalist)**: Không viết code dư thừa, không tạo wrapper/abstraction khi chưa có nhu cầu thực tế.
2. **Ngắn gọn & Chính xác**: Ưu tiên giải pháp đơn giản nhất nhưng xử lý triệt để bài toán.
3. **Bảo toàn tính đúng đắn**: Giữ nguyên logic xử lý lỗi, bảo mật, xác thực dữ liệu tại ranh giới (trust boundaries).

### 4.2. Thẩm mỹ & Trải nghiệm (UI/UX Excellence)
1. **No Slop**: Không dùng giao diện mẫu nhạt nhòa, generic mặc định của AI.
2. **Typography & Màu sắc**: Áp dụng hệ thống phân cấp rõ ràng, tương phản đạt chuẩn WCAG (4.5:1 tối thiểu).
3. **Responsive & Mobile First**: Tối ưu hiển thị cho khách du lịch sử dụng điện thoại khi đến Phú Quốc.

---

## 5. Tài nguyên & Skills hỗ trợ trong dự án
- [Hệ thống Skills (.agents/skills)](file:///.agents/skills)
- [Cẩm nang UI/UX Pro Max](file:///.agents/skills/ui-ux-pro-max/SKILL.md)
- [Bộ quy tắc Ponytail](file:///.agents/rules/ponytail.md)
- [Taste Skill](file:///.agents/skills/taste-skill/SKILL.md)
- [Graphify](file:///.agents/skills/graphify/SKILL.md)
