# BetterUS — Next.js Frontend

Giao diện web quản trị của hệ thống **BetterUS** — nền tảng kết nối tình nguyện viên với người có hoàn cảnh khó khăn tại TP. Hồ Chí Minh.

Được xây dựng bằng **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS** + **shadcn/ui**.

---

## Tính năng chính

### Xác thực
- Đăng nhập / Đăng ký tài khoản
- Quản lý phiên đăng nhập với JWT

### Trang chủ (Public)
- Giới thiệu nền tảng BetterUS
- Danh sách bài viết / chiến dịch nổi bật

### Admin apis (`/admin`)
Dành cho quản trị viên hệ thống:
- **Dashboard**: Thống kê tổng quan (người dùng, yêu cầu, hoạt động)
- **Quản lý người dùng**: Xem, tìm kiếm, duyệt / khóa tài khoản
  - `/admin/volunteers` — Tình nguyện viên
  - `/admin/beneficiaries` — Người thụ hưởng
  - `/admin/organizations` — Tổ chức xã hội
- **Quản lý yêu cầu hỗ trợ**: Duyệt và theo dõi `/admin/requests`
- **Chiến dịch**: Quản lý chiến dịch tình nguyện `/admin/campaigns`
- **Bài đăng**: Kiểm duyệt bài viết `/admin/posts`
- **Chat**: Theo dõi hội thoại `/admin/chat`

### Cổng Tổ chức Xã hội apis (`/socialorg`)
Dành cho các tổ chức đã được duyệt:
- **Dashboard**: Tổng quan hoạt động của tổ chức
- **Tình nguyện viên**: Xem và quản lý TNV thuộc tổ chức `/socialorg/volunteers`
- **Người thụ hưởng**: Quản lý hồ sơ NTH `/socialorg/bficiary`
- **Chiến dịch / Sự kiện**: Tạo và quản lý `/socialorg/manage-events`
- **Bài viết / Blog**: Đăng bài truyền thông `/socialorg/blogs`
- **Phần thưởng**: Cấp điểm và chứng chỉ `/socialorg/rewards`
- **Thư cảm ơn**: Quản lý lời cảm ơn `/socialorg/appreciation`
- **Phân tích**: Biểu đồ thống kê hoạt động `/socialorg/analysis`
- **Chat**: Nhắn tin với TNV/NTH `/socialorg/chat`
- **Tài khoản**: Cài đặt hồ sơ tổ chức `/socialorg/accounts`

---

## Hướng dẫn cài đặt & chạy

### 1. Clone repository và vào thư mục

```bash
cd Next_Frontend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Chỉnh sửa file `.env.local`:

```env
# URL của Nest Backend (bao gồm prefix /api/v1)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1 (sử dụng ngrok để public port)

# Tên ứng dụng
NEXT_PUBLIC_APP_NAME=BetterUS
```

### 4. Khởi động server development

```bash
npm run dev
```

Truy cập: [http://localhost:3000](http://localhost:3000) (sử dụng ngrok để public port)

### 5. Build production

```bash
npm run build
npm run start
```

---

## Cấu trúc dự án

```
Next_Frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Layout gốc (font, metadata)
│   │   ├── globals.css             # CSS toàn cục
│   │   ├── not-found.tsx           # Trang 404
│   │   ├── (homepage)/             # Route group: Trang công khai
│   │   │   ├── page.tsx            # Trang chủ (Landing page)
│   │   │   ├── login/              # Đăng nhập
│   │   │   └── register/           # Đăng ký
│   │   ├── (admin)/                # Route group: Admin dashboard
│   │   │   └── admin/
│   │   │       ├── dashboard/      # Tổng quan hệ thống
│   │   │       ├── volunteers/     # Quản lý tình nguyện viên
│   │   │       ├── beneficiaries/  # Quản lý người thụ hưởng
│   │   │       ├── organizations/  # Quản lý tổ chức
│   │   │       ├── requests/       # Yêu cầu hỗ trợ
│   │   │       ├── campaigns/      # Chiến dịch
│   │   │       ├── posts/          # Bài đăng
│   │   │       └── chat/           # Chat
│   │   ├── (socialorg)/            # Route group: Tổ chức Xã hội
│   │   │   └── socialorg/
│   │   │       ├── dashboard/      # Tổng quan tổ chức
│   │   │       ├── volunteers/     # TNV của tổ chức
│   │   │       ├── bficiary/       # Người thụ hưởng
│   │   │       ├── manage-events/  # Quản lý sự kiện
│   │   │       ├── blogs/          # Bài viết truyền thông
│   │   │       ├── rewards/        # Điểm thưởng & chứng chỉ
│   │   │       ├── appreciation/   # Thư cảm ơn
│   │   │       ├── analysis/       # Phân tích & biểu đồ
│   │   │       ├── chat/           # Nhắn tin
│   │   │       ├── accounts/       # Cài đặt tài khoản
│   │   │       └── profile/        # Hồ sơ tổ chức
│   │   ├── posts/                  # Trang bài viết công khai
│   │   └── download/               # Trang tải tài liệu
│   ├── components/                 # React components dùng chung
│   ├── services/                   # Giao tiếp với API backend
│   ├── lib/                        # Utilities (cn, axios instance...)
│   ├── types/                      # TypeScript type definitions
│   ├── data/                       # Dữ liệu tĩnh / mock data
│   └── index.css                   # CSS variables và base styles
├── public/                         # File tĩnh (logo, ảnh...)
├── .env.local                      # Biến môi trường local (không commit)
├── .env.example                    # Mẫu biến môi trường
├── next.config.ts                  # Cấu hình Next.js
├── tailwind.config.ts              # Cấu hình Tailwind CSS
├── components.json                 # Cấu hình shadcn/ui
└── package.json
```

---

## Kết nối với Backend

Frontend kết nối với **Nest_Backend** qua:
- **REST API**: `NEXT_PUBLIC_API_BASE_URL` (mặc định `http://localhost:8080/api/v1`)
- **WebSocket**: Socket.IO cho tính năng chat real-time

Đảm bảo backend đang chạy trước khi khởi động frontend.

---

## UI Component Library

Dự án sử dụng **shadcn/ui** (dựa trên Radix UI) cho các component:
- `Dialog`, `Dropdown Menu`, `Select`, `Tabs`, `Popover`
- `Avatar`, `Progress`, `Tooltip`, `Collapsible`
- `Label`, `Separator`, `Slot`

Thêm component mới từ shadcn:

```bash
npx shadcn@latest add <component-name>
```

---