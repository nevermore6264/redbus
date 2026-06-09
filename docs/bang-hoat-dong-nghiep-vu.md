# Mô tả hoạt động nghiệp vụ hệ thống RedBus

Mỗi hoạt động được mô tả bằng một bảng riêng (Bảng 2.1 – 2.11), tương ứng với Activity Diagram Hình 2.1 – 2.11.

---

## Bảng 2.1 – Quản lý danh mục vận hành

| | |
|:---|:---|
| **Hoạt động** | Quản lý danh mục vận hành (tuyến, xe, loại xe, điểm dừng, ghế) |
| **Input Data** | Thông tin tuyến đường, xe khách, loại xe, điểm dừng chân; cấu hình ghế; trạng thái chuyến |
| **Output Data** | Danh sách tuyến/chuyến/ghế; trạng thái chuyến (SCHEDULED / CANCELLED) |
| **End User** | Quản trị viên, Nhân viên |

---

## Bảng 2.2 – Sinh lịch chuyến xe

| | |
|:---|:---|
| **Hoạt động** | Sinh lịch chuyến xe (theo khoảng ngày) |
| **Input Data** | Tuyến hoạt động; xe khách; ngày bắt đầu–kết thúc; giờ khởi hành; giá vé |
| **Output Data** | Danh sách chuyến xe theo ngày; ghế sẵn sàng bán |
| **End User** | Quản trị viên, Nhân viên |

---

## Bảng 2.3 – Tìm kiếm chuyến và kiểm tra ghế trống

| | |
|:---|:---|
| **Hoạt động** | Tìm kiếm chuyến và kiểm tra ghế trống |
| **Input Data** | Tuyến; ngày khởi hành; bộ lọc (giá, loại xe, khung giờ) |
| **Output Data** | Danh sách chuyến phù hợp; số ghế còn trống; sơ đồ ghế |
| **End User** | Khách hàng, Nhân viên |

---

## Bảng 2.4 – Đặt vé (giữ ghế có thời hạn)

| | |
|:---|:---|
| **Hoạt động** | Đặt vé (giữ ghế có thời hạn) |
| **Input Data** | Mã chuyến; danh sách ghế; thông tin khách hàng / tài khoản |
| **Output Data** | Vé PENDING; mã vé hiển thị; ghế được giữ (15 phút) |
| **End User** | Khách hàng, Nhân viên |

---

## Bảng 2.5 – Thông báo / gửi thông tin vé cho khách

| | |
|:---|:---|
| **Hoạt động** | Thông báo / gửi thông tin vé cho khách |
| **Input Data** | Sự kiện đặt vé, thanh toán; thông tin liên hệ khách; nội dung thông báo |
| **Output Data** | Thông báo SSE trong app; email xác nhận vé (nếu cấu hình mail) |
| **End User** | Hệ thống, Khách hàng |

---

## Bảng 2.6 – Tự động hủy vé quá hạn thanh toán

| | |
|:---|:---|
| **Hoạt động** | Tự động hủy vé quá hạn thanh toán |
| **Input Data** | Vé PENDING; thời gian đặt; cấu hình phút chờ thanh toán |
| **Output Data** | Vé EXPIRED; ghế được giải phóng cho khách khác |
| **End User** | Hệ thống (Scheduled task) |

---

## Bảng 2.7 – Ghi nhận thanh toán (tiền mặt / PayOS)

| | |
|:---|:---|
| **Hoạt động** | Ghi nhận thanh toán (tiền mặt / PayOS) |
| **Input Data** | Vé PENDING; số tiền; mã khuyến mãi; phương thức thanh toán |
| **Output Data** | Giao dịch SUCCESS; vé PAID; cập nhật lịch sử thanh toán |
| **End User** | Nhân viên, Khách hàng |

---

## Bảng 2.8 – Tra cứu vé và xuất vé điện tử (QR)

| | |
|:---|:---|
| **Hoạt động** | Tra cứu vé và xuất vé điện tử (QR) |
| **Input Data** | Mã vé + số điện thoại (công khai) hoặc tài khoản đăng nhập |
| **Output Data** | Thông tin vé; lộ trình; ghế; mã QR tra cứu |
| **End User** | Khách hàng, Nhân viên |

---

## Bảng 2.9 – Đổi ghế / đổi chuyến / hủy vé

| | |
|:---|:---|
| **Hoạt động** | Đổi ghế / đổi chuyến / hủy vé |
| **Input Data** | Vé PAID hoặc PENDING; ghế/chuyến mới; quy tắc cùng tuyến |
| **Output Data** | Vé cập nhật; ghế cũ giải phóng; thông báo đổi vé |
| **End User** | Khách hàng |

---

## Bảng 2.10 – Đánh giá chuyến đi và hỗ trợ khách

| | |
|:---|:---|
| **Hoạt động** | Đánh giá chuyến đi và hỗ trợ khách |
| **Input Data** | Vé đã sử dụng; điểm đánh giá; tin nhắn; câu hỏi hỗ trợ |
| **Output Data** | Bản ghi đánh giá; hội thoại chat; phản hồi FAQ |
| **End User** | Khách hàng, Nhân viên |

---

## Bảng 2.11 – Tổng hợp báo cáo (doanh thu – vé – tuyến)

| | |
|:---|:---|
| **Hoạt động** | Tổng hợp báo cáo (doanh thu – vé – tuyến) |
| **Input Data** | Dữ liệu vé, giao dịch thanh toán, chuyến xe, đánh giá |
| **Output Data** | Dashboard; biểu đồ; báo cáo mở rộng; file CSV xuất ra |
| **End User** | Quản trị viên, Nhân viên |
