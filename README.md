# RedBus — Hệ thống quản lý bán vé xe khách

- **Backend:** Java 17, Spring Boot 3, MyBatis, Spring Security (JWT), MySQL.
- **Frontend:** Vite, React 19, TypeScript, React Router, Axios.

## Chuẩn bị cơ sở dữ liệu

Tạo database MySQL (ví dụ `redbus`) và cấu hình biến môi trường hoặc chỉnh `backend/src/main/resources/application.yml`:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (chuỗi đủ dài, khuyến nghị 32+ ký tự)

Schema được tạo tự động khi khởi động (`schema.sql`).

## Chạy backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080/api`

Tài khoản seed: `admin` / `Admin@123`, `staff` / `Staff@123`.

## Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Mặc định gọi API tại `http://localhost:8080/api` (file `.env`).

## Ghi chú đề cương

Đề cương có nhắc Next.js; mã nguồn giao diện dùng **Vite + React** (đúng với tiêu đề “ReactJS”). Có thể mô tả Next.js ở phần lý thuyết hoặc thay template sau nếu giảng viên yêu cầu.
