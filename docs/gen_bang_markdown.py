# -*- coding: utf-8 -*-
"""Sinh bang-hoat-dong-nghiep-vu.md: moi activity = 1 bang rieng."""
from pathlib import Path

ACTIVITIES = [
    ("Quản lý danh mục vận hành",
     "Quản lý danh mục vận hành (tuyến, xe, loại xe, điểm dừng, ghế)",
     "Thông tin tuyến đường, xe khách, loại xe, điểm dừng chân; cấu hình ghế; trạng thái chuyến",
     "Danh sách tuyến/chuyến/ghế; trạng thái chuyến (SCHEDULED / CANCELLED)",
     "Quản trị viên, Nhân viên"),
    ("Sinh lịch chuyến xe",
     "Sinh lịch chuyến xe (theo khoảng ngày)",
     "Tuyến hoạt động; xe khách; ngày bắt đầu–kết thúc; giờ khởi hành; giá vé",
     "Danh sách chuyến xe theo ngày; ghế sẵn sàng bán",
     "Quản trị viên, Nhân viên"),
    ("Tìm kiếm chuyến và kiểm tra ghế trống",
     "Tìm kiếm chuyến và kiểm tra ghế trống",
     "Tuyến; ngày khởi hành; bộ lọc (giá, loại xe, khung giờ)",
     "Danh sách chuyến phù hợp; số ghế còn trống; sơ đồ ghế",
     "Khách hàng, Nhân viên"),
    ("Đặt vé (giữ ghế có thời hạn)",
     "Đặt vé (giữ ghế có thời hạn)",
     "Mã chuyến; danh sách ghế; thông tin khách hàng / tài khoản",
     "Vé PENDING; mã vé hiển thị; ghế được giữ (15 phút)",
     "Khách hàng, Nhân viên"),
    ("Thông báo / gửi thông tin vé cho khách",
     "Thông báo / gửi thông tin vé cho khách",
     "Sự kiện đặt vé, thanh toán; thông tin liên hệ khách; nội dung thông báo",
     "Thông báo SSE trong app; email xác nhận vé (nếu cấu hình mail)",
     "Hệ thống, Khách hàng"),
    ("Tự động hủy vé quá hạn thanh toán",
     "Tự động hủy vé quá hạn thanh toán",
     "Vé PENDING; thời gian đặt; cấu hình phút chờ thanh toán",
     "Vé EXPIRED; ghế được giải phóng cho khách khác",
     "Hệ thống (Scheduled task)"),
    ("Ghi nhận thanh toán (tiền mặt / PayOS)",
     "Ghi nhận thanh toán (tiền mặt / PayOS)",
     "Vé PENDING; số tiền; mã khuyến mãi; phương thức thanh toán",
     "Giao dịch SUCCESS; vé PAID; cập nhật lịch sử thanh toán",
     "Nhân viên, Khách hàng"),
    ("Tra cứu vé và xuất vé điện tử (QR)",
     "Tra cứu vé và xuất vé điện tử (QR)",
     "Mã vé + số điện thoại (công khai) hoặc tài khoản đăng nhập",
     "Thông tin vé; lộ trình; ghế; mã QR tra cứu",
     "Khách hàng, Nhân viên"),
    ("Đổi ghế / đổi chuyến / hủy vé",
     "Đổi ghế / đổi chuyến / hủy vé",
     "Vé PAID hoặc PENDING; ghế/chuyến mới; quy tắc cùng tuyến",
     "Vé cập nhật; ghế cũ giải phóng; thông báo đổi vé",
     "Khách hàng"),
    ("Đánh giá chuyến đi và hỗ trợ khách",
     "Đánh giá chuyến đi và hỗ trợ khách",
     "Vé đã sử dụng; điểm đánh giá; tin nhắn; câu hỏi hỗ trợ",
     "Bản ghi đánh giá; hội thoại chat; phản hồi FAQ",
     "Khách hàng, Nhân viên"),
    ("Tổng hợp báo cáo (doanh thu – vé – tuyến)",
     "Tổng hợp báo cáo (doanh thu – vé – tuyến)",
     "Dữ liệu vé, giao dịch thanh toán, chuyến xe, đánh giá",
     "Dashboard; biểu đồ; báo cáo mở rộng; file CSV xuất ra",
     "Quản trị viên, Nhân viên"),
]

ROWS = [
    ("Hoạt động", 1),
    ("Input Data", 2),
    ("Output Data", 3),
    ("End User", 4),
]

out_md = Path(__file__).parent / "bang-hoat-dong-nghiep-vu.md"
lines = [
    "# Mô tả hoạt động nghiệp vụ hệ thống RedBus",
    "",
    "Mỗi hoạt động được mô tả bằng một bảng riêng (Bảng 2.1 – 2.11), "
    "tương ứng với Activity Diagram Hình 2.1 – 2.11.",
    "",
]

for i, (title, act, inp, outp, user) in enumerate(ACTIVITIES, 1):
    vals = [act, inp, outp, user]
    lines += ["---", "", f"## Bảng 2.{i} – {title}", "", "| | |", "|:---|:---|"]
    for label, idx in ROWS:
        lines.append(f"| **{label}** | {vals[idx - 1]} |")
    lines.append("")

out_md.write_text("\n".join(lines), encoding="utf-8")
print(f"OK: {len(ACTIVITIES)} bang -> {out_md}")
