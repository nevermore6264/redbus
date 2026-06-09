# 2.2.3. Kịch bản và sơ đồ hoạt động

Mỗi use case được mô tả bằng **bảng đặc tả** (tên, mô tả, actor, input/output, luồng cơ bản, luồng thay thế, luồng ngoại lệ) và **sơ đồ hoạt động** (ký hiệu: ● bắt đầu, ◉ kết thúc, hình thoi = điều kiện). Nội dung bám theo triển khai thực tế của hệ thống RedBus.

**Ma trận Use case – Actor:** xem Bảng 2.21 (mục 2.2.1).

---

## 2.2.3.1. Actor Quản trị viên

Quản trị viên (ADMIN) có toàn quyền vận hành: cấu hình danh mục, sinh lịch chuyến, xóa dữ liệu, quản lý khách hàng và xem báo cáo.

#### 2.2.3.1.1. UC01 – Đăng nhập / đăng xuất

**Bảng 2.22 – Đặc tả use case UC01: Đăng nhập / đăng xuất**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đăng nhập / đăng xuất |
| **Description** | Người dùng xác thực tên đăng nhập và mật khẩu để truy cập chức năng theo vai trò; đăng xuất xóa phiên cục bộ. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng, Khách vãng lai |
| **Input** | Tên đăng nhập, mật khẩu hợp lệ. |
| **Output** | JWT và thông tin người dùng; chuyển hướng theo vai trò (CUSTOMER → đặt vé; ADMIN/STAFF → quản trị). |
| **Basic flow** | 1. Actor mở form Đăng nhập — Bắt đầu<br>2. Nhập tên đăng nhập, mật khẩu<br>3. Gửi POST /xac-thuc/dang-nhap<br>4. Hệ thống xác thực, trả JWT<br>5. Lưu phiên, chuyển trang — Kết thúc |
| **Alternative flow** | 1a. Đăng xuất: xóa token trong localStorage, về trang chủ — Kết thúc |
| **Exception flow** | 3a. Sai thông tin → báo lỗi đăng nhập<br>3b. Tài khoản bị khóa (hoatDong=false) → từ chối đăng nhập |

**Hình 2.16 – Activity Diagram: UC01 – Đăng nhập / đăng xuất**

Luồng hoạt động: `● → Mở form → Nhập TK/MK → Xác thực? → [Đúng] Lưu JWT → Chuyển hướng → ◉ | [Sai] Báo lỗi → ◉`

#### 2.2.3.1.2. UC03 – Xem tổng quan (Dashboard)

**Bảng 2.24 – Đặc tả use case UC03: Xem tổng quan (Dashboard)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xem tổng quan (Dashboard) |
| **Description** | Xem KPI vận hành: doanh thu, số vé, chuyến xe, đánh giá, khuyến mãi, tin tức. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Đã đăng nhập ADMIN/STAFF. |
| **Output** | Bảng chỉ số tổng hợp; liên kết nhanh tới module quản trị. |
| **Basic flow** | 1. Vào /quan-tri/tong-quan — Bắt đầu 2. GET /bao-cao/mo-rong 3. Hiển thị KPI 4. (Tùy chọn) Cập nhật số liệu — Kết thúc |
| **Alternative flow** | 4a. Nhấn liên kết nhanh → chuyển module tương ứng |
| **Exception flow** | 2a. Lỗi API → thông báo không tải được dữ liệu |

**Hình 2.18 – Activity Diagram: UC03 – Xem tổng quan (Dashboard)**

Luồng hoạt động: `● → Tải KPI → Hiển thị dashboard → ◉`

#### 2.2.3.1.3. UC04 – Quản lý tuyến đường

**Bảng 2.25 – Đặc tả use case UC04: Quản lý tuyến đường**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý tuyến đường |
| **Description** | Thêm, sửa tuyến (điểm đi/đến, km, thời gian); Quản trị viên được xóa. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Điểm đi, điểm đến, khoảng cách km, thời gian ước tính (phút). |
| **Output** | Danh sách tuyến cập nhật; có thể cấu hình điểm dừng trên cùng trang. |
| **Basic flow** | 1. Chọn Tuyến đường — Bắt đầu 2. + Thêm/Sửa 3. Chọn địa danh, nhập km/phút 4. Lưu → POST/PUT /tuyen-duong — Kết thúc |
| **Alternative flow** | 2a. Quản trị viên nhấn Xóa → DELETE (chỉ ADMIN) |
| **Exception flow** | 3a. Điểm đi=điểm đến 3b. km/phút ≤0 3c. Trùng cặp tuyến 4a. Hủy → dừng |

**Hình 2.19 – Activity Diagram: UC04 – Quản lý tuyến đường**

Luồng hoạt động: `● → Chọn thao tác → Nhập tuyến → Kiểm tra → Lưu CSDL → ◉`

#### 2.2.3.1.4. UC05 – Quản lý loại xe

**Bảng 2.26 – Đặc tả use case UC05: Quản lý loại xe**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý loại xe |
| **Description** | Quản lý loại xe (tên, mô tả, tiện ích, ảnh); ADMIN xóa loại xe. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tên loại xe (bắt buộc); ảnh jpg/png/webp/gif ≤8MB. |
| **Output** | Danh sách loại xe và ảnh minh họa. |
| **Basic flow** | 1. Mở Loại xe — Bắt đầu 2. Thêm/Sửa thông tin 3. Upload ảnh 4. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa loại xe 3a. Xóa ảnh (ADMIN/STAFF) |
| **Exception flow** | 2b. Trùng tên 3b. File ảnh không hợp lệ |

**Hình 2.20 – Activity Diagram: UC05 – Quản lý loại xe**

Luồng hoạt động: `● → Form loại xe → Upload ảnh? → Lưu → ◉`

#### 2.2.3.1.5. UC06 – Quản lý xe khách

**Bảng 2.27 – Đặc tả use case UC06: Quản lý xe khách**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý xe khách |
| **Description** | Gán xe vật lý với loại xe, biển số, hãng, số chỗ. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Mã loại xe, biển số, số chỗ (>0). |
| **Output** | Danh sách xe khách. |
| **Basic flow** | 1. Mở Xe khách — Bắt đầu 2. Thêm/Sửa 3. Lưu POST/PUT /xe-khach — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa xe |
| **Exception flow** | 3a. Trùng biển số 3b. Thiếu loại xe/số chỗ |

**Hình 2.21 – Activity Diagram: UC06 – Quản lý xe khách**

Luồng hoạt động: `● → Nhập xe → Kiểm tra → Lưu → ◉`

#### 2.2.3.1.6. UC07 – Quản lý ghế ngồi

**Bảng 2.28 – Đặc tả use case UC07: Quản lý ghế ngồi**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý ghế ngồi |
| **Description** | Xem sơ đồ ghế theo xe; chuyển ghế AVAILABLE ↔ BLOCKED. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Chọn xe; trạng thái ghế hợp lệ. |
| **Output** | Sơ đồ ghế cập nhật. |
| **Basic flow** | 1. Chọn xe — Bắt đầu 2. GET /ghe-ngoi/xe/{ma} 3. Click ghế trống/khóa 4. PUT trang-thai — Kết thúc |
| **Alternative flow** | — |
| **Exception flow** | 3a. Ghế đang giữ/đã bán → không đổi được |

**Hình 2.22 – Activity Diagram: UC07 – Quản lý ghế ngồi**

Luồng hoạt động: `● → Chọn xe → Hiển thị sơ đồ → Đổi trạng thái? → Cập nhật → ◉`

#### 2.2.3.1.7. UC08 – Quản lý điểm dừng chân

**Bảng 2.29 – Đặc tả use case UC08: Quản lý điểm dừng chân**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý điểm dừng chân |
| **Description** | Cấu hình điểm dừng theo tuyến: tên, thứ tự, thời gian dừng. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Mã tuyến, tên điểm, thứ tự ≥0, phút dừng ≥0. |
| **Output** | Timeline điểm dừng trên tuyến. |
| **Basic flow** | 1. Chọn tuyến — Bắt đầu 2. Thêm/Sửa điểm dừng 3. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa điểm dừng |
| **Exception flow** | 3a. Trùng thứ tự/tên trên cùng tuyến |

**Hình 2.23 – Activity Diagram: UC08 – Quản lý điểm dừng chân**

Luồng hoạt động: `● → Chọn tuyến → Nhập điểm dừng → Lưu → ◉`

#### 2.2.3.1.8. UC09 – Quản lý chuyến xe, sinh lịch

**Bảng 2.30 – Đặc tả use case UC09: Quản lý chuyến xe, sinh lịch**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý chuyến xe, sinh lịch |
| **Description** | Tạo/sửa chuyến; ADMIN sinh lịch hàng loạt (tối đa 31 ngày). |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tuyến, xe, giờ khởi hành, giá vé; gen: từ ngày, số ngày. |
| **Output** | Danh sách chuyến theo bộ lọc. |
| **Basic flow** | 1. Mở Chuyến xe — Bắt đầu 2. Thêm/Sửa chuyến 3. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN: Gen lịch POST /chuyen-xe/gen-lich 2b. ADMIN xóa chuyến |
| **Exception flow** | 3a. Giá ≤0 3b. Giờ đến ≤ khởi hành 3c. Trùng tuyến+xe+giờ 3d. Gen >31 ngày |

**Hình 2.24 – Activity Diagram: UC09 – Quản lý chuyến xe, sinh lịch**

Luồng hoạt động: `● → {Thêm|Sửa|Gen lịch} → Kiểm tra → Lưu → ◉`

#### 2.2.3.1.9. UC10 – Quản lý tài khoản khách hàng

**Bảng 2.31 – Đặc tả use case UC10: Quản lý tài khoản khách hàng**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý tài khoản khách hàng |
| **Description** | Thêm/sửa/khóa tài khoản CUSTOMER; tự liên kết TaiKhoan+KhachHang. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tên đăng nhập, email, mật khẩu, họ tên (thêm); hồ sơ+hoatDong (sửa). |
| **Output** | Danh sách khách với trạng thái Hoạt động/Đã khóa. |
| **Basic flow** | 1. Mở Khách hàng — Bắt đầu 2. + Thêm hoặc Sửa 3. Nhập thông tin 4. Lưu — Kết thúc |
| **Alternative flow** | 2a. Bỏ chọn Tài khoản hoạt động → khóa đăng nhập |
| **Exception flow** | 4a. Trùng TK/email 4b. MK <6 ký tự 4c. Hủy |

**Hình 2.25 – Activity Diagram: UC10 – Quản lý tài khoản khách hàng**

Luồng hoạt động: `● → Form KH → Kiểm tra → Tạo/cập nhật → ◉`

#### 2.2.3.1.10. UC11 – Quản lý khuyến mãi

**Bảng 2.32 – Đặc tả use case UC11: Quản lý khuyến mãi**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý khuyến mãi |
| **Description** | Tạo mã giảm giá (%), thời hạn, giới hạn sử dụng. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Mã, % giảm 1–100, ngày bắt đầu/kết thúc. |
| **Output** | Danh sách mã khuyến mãi. |
| **Basic flow** | 1. Mở Khuyến mãi — Bắt đầu 2. Thêm/Sửa 3. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa mã |
| **Exception flow** | 3a. Trùng mã 3b. Ngày kết thúc ≤ bắt đầu |

**Hình 2.26 – Activity Diagram: UC11 – Quản lý khuyến mãi**

Luồng hoạt động: `● → Nhập mã KM → Kiểm tra → Lưu → ◉`

#### 2.2.3.1.11. UC12 – Quản lý tin tức

**Bảng 2.33 – Đặc tả use case UC12: Quản lý tin tức**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý tin tức |
| **Description** | Đăng/sửa bài tin (tiêu đề, nội dung HTML, ảnh, hiển thị). |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tiêu đề, nội dung bài viết. |
| **Output** | Danh sách tin tức quản trị. |
| **Basic flow** | 1. Mở Tin tức (QT) — Bắt đầu 2. Thêm/Sửa 3. Upload ảnh (tùy chọn) 4. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa tin |
| **Exception flow** | 3a. Thiếu tiêu đề/nội dung |

**Hình 2.27 – Activity Diagram: UC12 – Quản lý tin tức**

Luồng hoạt động: `● → Soạn tin → Upload ảnh? → Lưu → ◉`

#### 2.2.3.1.12. UC13 – Quản lý hỏi đáp (FAQ)

**Bảng 2.34 – Đặc tả use case UC13: Quản lý hỏi đáp (FAQ)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý hỏi đáp (FAQ) |
| **Description** | Xem câu hỏi khách gửi và trả lời; câu đã trả lời hiển thị công khai qua API. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Nội dung trả lời. |
| **Output** | Trạng thái câu hỏi → DA_TRA_LOI. |
| **Basic flow** | 1. GET /hoi-dap/quan-tri/tat-ca — Bắt đầu 2. Chọn câu hỏi 3. Nhập trả lời 4. PUT /hoi-dap/{ma}/tra-loi — Kết thúc |
| **Alternative flow** | — |
| **Exception flow** | 3a. Nội dung trả lời trống<br>*Ghi chú: chưa có giao diện quản trị; thao tác qua API. |

**Hình 2.28 – Activity Diagram: UC13 – Quản lý hỏi đáp (FAQ)**

Luồng hoạt động: `● → Danh sách Hỏi → Nhập trả lời → Lưu → ◉`

#### 2.2.3.1.13. UC14 – Báo cáo thống kê, xuất CSV

**Bảng 2.35 – Đặc tả use case UC14: Báo cáo thống kê, xuất CSV**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Báo cáo thống kê, xuất CSV |
| **Description** | Xem biểu đồ doanh thu, vé, tuyến; xuất file CSV. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Đã đăng nhập quản trị. |
| **Output** | Biểu đồ và file CSV tải về. |
| **Basic flow** | 1. Mở Báo cáo — Bắt đầu 2. Tải KPI+biểu đồ 3. Nhấn Xuất CSV — Kết thúc |
| **Alternative flow** | 2a. Làm mới số liệu |
| **Exception flow** | 3a. Lỗi tải file |

**Hình 2.29 – Activity Diagram: UC14 – Báo cáo thống kê, xuất CSV**

Luồng hoạt động: `● → Tải biểu đồ → Xuất CSV? → Tải file → ◉`

#### 2.2.3.1.14. UC22 – Xử lý hỗ trợ / trả lời chat

**Bảng 2.43 – Đặc tả use case UC22: Xử lý hỗ trợ / trả lời chat**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xử lý hỗ trợ / trả lời chat |
| **Description** | Nhân viên/Quản trị mở /quan-tri/ho-tro, chọn khách hàng, đọc và trả lời tin nhắn qua API chat. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Khách được chọn (maTaiKhoan), nội dung tin nhắn. |
| **Output** | Tin nhắn lưu CSDL; hội thoại cập nhật (làm mới mỗi 5 giây). |
| **Basic flow** | 1. Chọn Hỗ trợ / Chat — Bắt đầu<br>2. Tải danh sách khách GET /khach-hang<br>3. Chọn khách → GET /chat/hoi-thoai?doiPhuong=<br>4. Nhập và POST /chat/gui — Kết thúc |
| **Alternative flow** | 3a. Tìm khách theo tên/SĐT/tài khoản |
| **Exception flow** | 4a. Nội dung trống 4b. Đối phương không hợp lệ |

**Hình 2.37 – Activity Diagram: UC22 – Xử lý hỗ trợ / trả lời chat**

Luồng hoạt động: `● → Chọn khách → Tải hội thoại → Gửi trả lời → ◉`

#### 2.2.3.1.15. UC23 – Nhận thông báo thời gian thực (SSE)

**Bảng 2.44 – Đặc tả use case UC23: Nhận thông báo thời gian thực (SSE)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Nhận thông báo thời gian thực (SSE) |
| **Description** | Nhận thông báo qua Server-Sent Events khi có sự kiện (đặt vé, thanh toán…). |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng |
| **Input** | JWT hợp lệ. |
| **Output** | Toast thông báo; danh sách trong /thong-bao. |
| **Basic flow** | 1. Đăng nhập — Bắt đầu 2. Mở SSE /thong-bao/stream 3. Nhận sự kiện 4. Đánh dấu đã đọc — Kết thúc |
| **Alternative flow** | 4a. Xem danh sách GET /thong-bao |
| **Exception flow** | 2a. Mất kết nối SSE → ngắt kết nối |

**Hình 2.38 – Activity Diagram: UC23 – Nhận thông báo thời gian thực (SSE)**

Luồng hoạt động: `● → Kết nối SSE → Nhận TB → Hiển thị → ◉`

#### 2.2.3.1.16. UC24 – Gửi / nhận tin nhắn hỗ trợ (chat)

**Bảng 2.45 – Đặc tả use case UC24: Gửi / nhận tin nhắn hỗ trợ (chat)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Gửi / nhận tin nhắn hỗ trợ (chat) |
| **Description** | Trao đổi tin nhắn 1-1: khách tại /ho-tro; quản trị tại /quan-tri/ho-tro. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng |
| **Input** | Mã người nhận, nội dung tin. |
| **Output** | Lịch sử hội thoại hiển thị trong khung chat. |
| **Basic flow** | 1. Mở trang Hỗ trợ — Bắt đầu<br>2. GET /chat/ho-tro (khách) hoặc chọn khách (QT)<br>3. GET /chat/hoi-thoai 4. POST /chat/gui — Kết thúc |
| **Alternative flow** | 2a. Khách chọn nhân viên hỗ trợ (nếu nhiều STAFF/ADMIN) |
| **Exception flow** | 4a. Nội dung trống 4b. Gửi cho chính mình 4c. Người nhận không tồn tại |

**Hình 2.39 – Activity Diagram: UC24 – Gửi / nhận tin nhắn hỗ trợ (chat)**

Luồng hoạt động: `● → Mở chat → Tải hội thoại → Gửi/nhận → ◉`

#### 2.2.3.1.17. UC25 – Xem tin tức, FAQ, đánh giá công khai

**Bảng 2.46 – Đặc tả use case UC25: Xem tin tức, FAQ, đánh giá công khai**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xem tin tức, FAQ, đánh giá công khai |
| **Description** | Đọc tin tức, FAQ (trang chủ tĩnh + API động), đánh giá công khai. |
| **Actors** | Tất cả actor (kể cả Khách vãng lai) |
| **Input** | Không cần đăng nhập. |
| **Output** | Danh sách tin, chi tiết bài, đánh giá mẫu. |
| **Basic flow** | 1. GET /tin-tuc — Bắt đầu 2. Xem chi tiết /tin-tuc/{ma} 3. Xem đánh giá /danh-gia/cong-khai — Kết thúc |
| **Alternative flow** | 1a. FAQ trên trang chủ (nội dung tĩnh) |
| **Exception flow** | 2a. Tin không tồn tại/không hiển thị |

**Hình 2.40 – Activity Diagram: UC25 – Xem tin tức, FAQ, đánh giá công khai**

Luồng hoạt động: `● → Duyệt tin/FAQ/ĐG → Hiển thị → ◉`

---

## 2.2.3.2. Actor Nhân viên

Nhân viên (STAFF) thực hiện vận hành hàng ngày tương tự Quản trị viên nhưng không xóa danh mục và không sinh lịch chuyến hàng loạt.

> **Phân quyền so với Quản trị viên:** Nhân viên không thấy nút **Xóa** trên Tuyến, Xe, Loại xe, Điểm dừng, Chuyến xe, Khuyến mãi, Tin tức; không dùng **Gen lịch** chuyến xe. Các kịch bản dưới đây giống Quản trị viên, trừ các bước 2a (xóa/gen) trong Alternative flow.

#### 2.2.3.2.1. UC01 – Đăng nhập / đăng xuất

**Bảng 2.22 – Đặc tả use case UC01: Đăng nhập / đăng xuất**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đăng nhập / đăng xuất |
| **Description** | Người dùng xác thực tên đăng nhập và mật khẩu để truy cập chức năng theo vai trò; đăng xuất xóa phiên cục bộ. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng, Khách vãng lai |
| **Input** | Tên đăng nhập, mật khẩu hợp lệ. |
| **Output** | JWT và thông tin người dùng; chuyển hướng theo vai trò (CUSTOMER → đặt vé; ADMIN/STAFF → quản trị). |
| **Basic flow** | 1. Actor mở form Đăng nhập — Bắt đầu<br>2. Nhập tên đăng nhập, mật khẩu<br>3. Gửi POST /xac-thuc/dang-nhap<br>4. Hệ thống xác thực, trả JWT<br>5. Lưu phiên, chuyển trang — Kết thúc |
| **Alternative flow** | 1a. Đăng xuất: xóa token trong localStorage, về trang chủ — Kết thúc |
| **Exception flow** | 3a. Sai thông tin → báo lỗi đăng nhập<br>3b. Tài khoản bị khóa (hoatDong=false) → từ chối đăng nhập |

**Hình 2.16 – Activity Diagram: UC01 – Đăng nhập / đăng xuất**

Luồng hoạt động: `● → Mở form → Nhập TK/MK → Xác thực? → [Đúng] Lưu JWT → Chuyển hướng → ◉ | [Sai] Báo lỗi → ◉`

#### 2.2.3.2.2. UC03 – Xem tổng quan (Dashboard)

**Bảng 2.24 – Đặc tả use case UC03: Xem tổng quan (Dashboard)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xem tổng quan (Dashboard) |
| **Description** | Xem KPI vận hành: doanh thu, số vé, chuyến xe, đánh giá, khuyến mãi, tin tức. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Đã đăng nhập ADMIN/STAFF. |
| **Output** | Bảng chỉ số tổng hợp; liên kết nhanh tới module quản trị. |
| **Basic flow** | 1. Vào /quan-tri/tong-quan — Bắt đầu 2. GET /bao-cao/mo-rong 3. Hiển thị KPI 4. (Tùy chọn) Cập nhật số liệu — Kết thúc |
| **Alternative flow** | 4a. Nhấn liên kết nhanh → chuyển module tương ứng |
| **Exception flow** | 2a. Lỗi API → thông báo không tải được dữ liệu |

**Hình 2.18 – Activity Diagram: UC03 – Xem tổng quan (Dashboard)**

Luồng hoạt động: `● → Tải KPI → Hiển thị dashboard → ◉`

#### 2.2.3.2.3. UC04 – Quản lý tuyến đường

**Bảng 2.25 – Đặc tả use case UC04: Quản lý tuyến đường**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý tuyến đường |
| **Description** | Thêm, sửa tuyến (điểm đi/đến, km, thời gian); Quản trị viên được xóa. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Điểm đi, điểm đến, khoảng cách km, thời gian ước tính (phút). |
| **Output** | Danh sách tuyến cập nhật; có thể cấu hình điểm dừng trên cùng trang. |
| **Basic flow** | 1. Chọn Tuyến đường — Bắt đầu 2. + Thêm/Sửa 3. Chọn địa danh, nhập km/phút 4. Lưu → POST/PUT /tuyen-duong — Kết thúc |
| **Alternative flow** | 2a. Quản trị viên nhấn Xóa → DELETE (chỉ ADMIN) |
| **Exception flow** | 3a. Điểm đi=điểm đến 3b. km/phút ≤0 3c. Trùng cặp tuyến 4a. Hủy → dừng |

**Hình 2.19 – Activity Diagram: UC04 – Quản lý tuyến đường**

Luồng hoạt động: `● → Chọn thao tác → Nhập tuyến → Kiểm tra → Lưu CSDL → ◉`

#### 2.2.3.2.4. UC05 – Quản lý loại xe

**Bảng 2.26 – Đặc tả use case UC05: Quản lý loại xe**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý loại xe |
| **Description** | Quản lý loại xe (tên, mô tả, tiện ích, ảnh); ADMIN xóa loại xe. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tên loại xe (bắt buộc); ảnh jpg/png/webp/gif ≤8MB. |
| **Output** | Danh sách loại xe và ảnh minh họa. |
| **Basic flow** | 1. Mở Loại xe — Bắt đầu 2. Thêm/Sửa thông tin 3. Upload ảnh 4. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa loại xe 3a. Xóa ảnh (ADMIN/STAFF) |
| **Exception flow** | 2b. Trùng tên 3b. File ảnh không hợp lệ |

**Hình 2.20 – Activity Diagram: UC05 – Quản lý loại xe**

Luồng hoạt động: `● → Form loại xe → Upload ảnh? → Lưu → ◉`

#### 2.2.3.2.5. UC06 – Quản lý xe khách

**Bảng 2.27 – Đặc tả use case UC06: Quản lý xe khách**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý xe khách |
| **Description** | Gán xe vật lý với loại xe, biển số, hãng, số chỗ. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Mã loại xe, biển số, số chỗ (>0). |
| **Output** | Danh sách xe khách. |
| **Basic flow** | 1. Mở Xe khách — Bắt đầu 2. Thêm/Sửa 3. Lưu POST/PUT /xe-khach — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa xe |
| **Exception flow** | 3a. Trùng biển số 3b. Thiếu loại xe/số chỗ |

**Hình 2.21 – Activity Diagram: UC06 – Quản lý xe khách**

Luồng hoạt động: `● → Nhập xe → Kiểm tra → Lưu → ◉`

#### 2.2.3.2.6. UC07 – Quản lý ghế ngồi

**Bảng 2.28 – Đặc tả use case UC07: Quản lý ghế ngồi**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý ghế ngồi |
| **Description** | Xem sơ đồ ghế theo xe; chuyển ghế AVAILABLE ↔ BLOCKED. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Chọn xe; trạng thái ghế hợp lệ. |
| **Output** | Sơ đồ ghế cập nhật. |
| **Basic flow** | 1. Chọn xe — Bắt đầu 2. GET /ghe-ngoi/xe/{ma} 3. Click ghế trống/khóa 4. PUT trang-thai — Kết thúc |
| **Alternative flow** | — |
| **Exception flow** | 3a. Ghế đang giữ/đã bán → không đổi được |

**Hình 2.22 – Activity Diagram: UC07 – Quản lý ghế ngồi**

Luồng hoạt động: `● → Chọn xe → Hiển thị sơ đồ → Đổi trạng thái? → Cập nhật → ◉`

#### 2.2.3.2.7. UC08 – Quản lý điểm dừng chân

**Bảng 2.29 – Đặc tả use case UC08: Quản lý điểm dừng chân**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý điểm dừng chân |
| **Description** | Cấu hình điểm dừng theo tuyến: tên, thứ tự, thời gian dừng. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Mã tuyến, tên điểm, thứ tự ≥0, phút dừng ≥0. |
| **Output** | Timeline điểm dừng trên tuyến. |
| **Basic flow** | 1. Chọn tuyến — Bắt đầu 2. Thêm/Sửa điểm dừng 3. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa điểm dừng |
| **Exception flow** | 3a. Trùng thứ tự/tên trên cùng tuyến |

**Hình 2.23 – Activity Diagram: UC08 – Quản lý điểm dừng chân**

Luồng hoạt động: `● → Chọn tuyến → Nhập điểm dừng → Lưu → ◉`

#### 2.2.3.2.8. UC09 – Quản lý chuyến xe, sinh lịch

**Bảng 2.30 – Đặc tả use case UC09: Quản lý chuyến xe, sinh lịch**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý chuyến xe, sinh lịch |
| **Description** | Tạo/sửa chuyến; ADMIN sinh lịch hàng loạt (tối đa 31 ngày). |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tuyến, xe, giờ khởi hành, giá vé; gen: từ ngày, số ngày. |
| **Output** | Danh sách chuyến theo bộ lọc. |
| **Basic flow** | 1. Mở Chuyến xe — Bắt đầu 2. Thêm/Sửa chuyến 3. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN: Gen lịch POST /chuyen-xe/gen-lich 2b. ADMIN xóa chuyến |
| **Exception flow** | 3a. Giá ≤0 3b. Giờ đến ≤ khởi hành 3c. Trùng tuyến+xe+giờ 3d. Gen >31 ngày |

**Hình 2.24 – Activity Diagram: UC09 – Quản lý chuyến xe, sinh lịch**

Luồng hoạt động: `● → {Thêm|Sửa|Gen lịch} → Kiểm tra → Lưu → ◉`

#### 2.2.3.2.9. UC10 – Quản lý tài khoản khách hàng

**Bảng 2.31 – Đặc tả use case UC10: Quản lý tài khoản khách hàng**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý tài khoản khách hàng |
| **Description** | Thêm/sửa/khóa tài khoản CUSTOMER; tự liên kết TaiKhoan+KhachHang. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tên đăng nhập, email, mật khẩu, họ tên (thêm); hồ sơ+hoatDong (sửa). |
| **Output** | Danh sách khách với trạng thái Hoạt động/Đã khóa. |
| **Basic flow** | 1. Mở Khách hàng — Bắt đầu 2. + Thêm hoặc Sửa 3. Nhập thông tin 4. Lưu — Kết thúc |
| **Alternative flow** | 2a. Bỏ chọn Tài khoản hoạt động → khóa đăng nhập |
| **Exception flow** | 4a. Trùng TK/email 4b. MK <6 ký tự 4c. Hủy |

**Hình 2.25 – Activity Diagram: UC10 – Quản lý tài khoản khách hàng**

Luồng hoạt động: `● → Form KH → Kiểm tra → Tạo/cập nhật → ◉`

#### 2.2.3.2.10. UC11 – Quản lý khuyến mãi

**Bảng 2.32 – Đặc tả use case UC11: Quản lý khuyến mãi**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý khuyến mãi |
| **Description** | Tạo mã giảm giá (%), thời hạn, giới hạn sử dụng. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Mã, % giảm 1–100, ngày bắt đầu/kết thúc. |
| **Output** | Danh sách mã khuyến mãi. |
| **Basic flow** | 1. Mở Khuyến mãi — Bắt đầu 2. Thêm/Sửa 3. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa mã |
| **Exception flow** | 3a. Trùng mã 3b. Ngày kết thúc ≤ bắt đầu |

**Hình 2.26 – Activity Diagram: UC11 – Quản lý khuyến mãi**

Luồng hoạt động: `● → Nhập mã KM → Kiểm tra → Lưu → ◉`

#### 2.2.3.2.11. UC12 – Quản lý tin tức

**Bảng 2.33 – Đặc tả use case UC12: Quản lý tin tức**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý tin tức |
| **Description** | Đăng/sửa bài tin (tiêu đề, nội dung HTML, ảnh, hiển thị). |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Tiêu đề, nội dung bài viết. |
| **Output** | Danh sách tin tức quản trị. |
| **Basic flow** | 1. Mở Tin tức (QT) — Bắt đầu 2. Thêm/Sửa 3. Upload ảnh (tùy chọn) 4. Lưu — Kết thúc |
| **Alternative flow** | 2a. ADMIN xóa tin |
| **Exception flow** | 3a. Thiếu tiêu đề/nội dung |

**Hình 2.27 – Activity Diagram: UC12 – Quản lý tin tức**

Luồng hoạt động: `● → Soạn tin → Upload ảnh? → Lưu → ◉`

#### 2.2.3.2.12. UC13 – Quản lý hỏi đáp (FAQ)

**Bảng 2.34 – Đặc tả use case UC13: Quản lý hỏi đáp (FAQ)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý hỏi đáp (FAQ) |
| **Description** | Xem câu hỏi khách gửi và trả lời; câu đã trả lời hiển thị công khai qua API. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Nội dung trả lời. |
| **Output** | Trạng thái câu hỏi → DA_TRA_LOI. |
| **Basic flow** | 1. GET /hoi-dap/quan-tri/tat-ca — Bắt đầu 2. Chọn câu hỏi 3. Nhập trả lời 4. PUT /hoi-dap/{ma}/tra-loi — Kết thúc |
| **Alternative flow** | — |
| **Exception flow** | 3a. Nội dung trả lời trống<br>*Ghi chú: chưa có giao diện quản trị; thao tác qua API. |

**Hình 2.28 – Activity Diagram: UC13 – Quản lý hỏi đáp (FAQ)**

Luồng hoạt động: `● → Danh sách Hỏi → Nhập trả lời → Lưu → ◉`

#### 2.2.3.2.13. UC14 – Báo cáo thống kê, xuất CSV

**Bảng 2.35 – Đặc tả use case UC14: Báo cáo thống kê, xuất CSV**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Báo cáo thống kê, xuất CSV |
| **Description** | Xem biểu đồ doanh thu, vé, tuyến; xuất file CSV. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Đã đăng nhập quản trị. |
| **Output** | Biểu đồ và file CSV tải về. |
| **Basic flow** | 1. Mở Báo cáo — Bắt đầu 2. Tải KPI+biểu đồ 3. Nhấn Xuất CSV — Kết thúc |
| **Alternative flow** | 2a. Làm mới số liệu |
| **Exception flow** | 3a. Lỗi tải file |

**Hình 2.29 – Activity Diagram: UC14 – Báo cáo thống kê, xuất CSV**

Luồng hoạt động: `● → Tải biểu đồ → Xuất CSV? → Tải file → ◉`

#### 2.2.3.2.14. UC22 – Xử lý hỗ trợ / trả lời chat

**Bảng 2.43 – Đặc tả use case UC22: Xử lý hỗ trợ / trả lời chat**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xử lý hỗ trợ / trả lời chat |
| **Description** | Nhân viên/Quản trị mở /quan-tri/ho-tro, chọn khách hàng, đọc và trả lời tin nhắn qua API chat. |
| **Actors** | Quản trị viên, Nhân viên |
| **Input** | Khách được chọn (maTaiKhoan), nội dung tin nhắn. |
| **Output** | Tin nhắn lưu CSDL; hội thoại cập nhật (làm mới mỗi 5 giây). |
| **Basic flow** | 1. Chọn Hỗ trợ / Chat — Bắt đầu<br>2. Tải danh sách khách GET /khach-hang<br>3. Chọn khách → GET /chat/hoi-thoai?doiPhuong=<br>4. Nhập và POST /chat/gui — Kết thúc |
| **Alternative flow** | 3a. Tìm khách theo tên/SĐT/tài khoản |
| **Exception flow** | 4a. Nội dung trống 4b. Đối phương không hợp lệ |

**Hình 2.37 – Activity Diagram: UC22 – Xử lý hỗ trợ / trả lời chat**

Luồng hoạt động: `● → Chọn khách → Tải hội thoại → Gửi trả lời → ◉`

#### 2.2.3.2.15. UC23 – Nhận thông báo thời gian thực (SSE)

**Bảng 2.44 – Đặc tả use case UC23: Nhận thông báo thời gian thực (SSE)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Nhận thông báo thời gian thực (SSE) |
| **Description** | Nhận thông báo qua Server-Sent Events khi có sự kiện (đặt vé, thanh toán…). |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng |
| **Input** | JWT hợp lệ. |
| **Output** | Toast thông báo; danh sách trong /thong-bao. |
| **Basic flow** | 1. Đăng nhập — Bắt đầu 2. Mở SSE /thong-bao/stream 3. Nhận sự kiện 4. Đánh dấu đã đọc — Kết thúc |
| **Alternative flow** | 4a. Xem danh sách GET /thong-bao |
| **Exception flow** | 2a. Mất kết nối SSE → ngắt kết nối |

**Hình 2.38 – Activity Diagram: UC23 – Nhận thông báo thời gian thực (SSE)**

Luồng hoạt động: `● → Kết nối SSE → Nhận TB → Hiển thị → ◉`

#### 2.2.3.2.16. UC24 – Gửi / nhận tin nhắn hỗ trợ (chat)

**Bảng 2.45 – Đặc tả use case UC24: Gửi / nhận tin nhắn hỗ trợ (chat)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Gửi / nhận tin nhắn hỗ trợ (chat) |
| **Description** | Trao đổi tin nhắn 1-1: khách tại /ho-tro; quản trị tại /quan-tri/ho-tro. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng |
| **Input** | Mã người nhận, nội dung tin. |
| **Output** | Lịch sử hội thoại hiển thị trong khung chat. |
| **Basic flow** | 1. Mở trang Hỗ trợ — Bắt đầu<br>2. GET /chat/ho-tro (khách) hoặc chọn khách (QT)<br>3. GET /chat/hoi-thoai 4. POST /chat/gui — Kết thúc |
| **Alternative flow** | 2a. Khách chọn nhân viên hỗ trợ (nếu nhiều STAFF/ADMIN) |
| **Exception flow** | 4a. Nội dung trống 4b. Gửi cho chính mình 4c. Người nhận không tồn tại |

**Hình 2.39 – Activity Diagram: UC24 – Gửi / nhận tin nhắn hỗ trợ (chat)**

Luồng hoạt động: `● → Mở chat → Tải hội thoại → Gửi/nhận → ◉`

#### 2.2.3.2.17. UC25 – Xem tin tức, FAQ, đánh giá công khai

**Bảng 2.46 – Đặc tả use case UC25: Xem tin tức, FAQ, đánh giá công khai**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xem tin tức, FAQ, đánh giá công khai |
| **Description** | Đọc tin tức, FAQ (trang chủ tĩnh + API động), đánh giá công khai. |
| **Actors** | Tất cả actor (kể cả Khách vãng lai) |
| **Input** | Không cần đăng nhập. |
| **Output** | Danh sách tin, chi tiết bài, đánh giá mẫu. |
| **Basic flow** | 1. GET /tin-tuc — Bắt đầu 2. Xem chi tiết /tin-tuc/{ma} 3. Xem đánh giá /danh-gia/cong-khai — Kết thúc |
| **Alternative flow** | 1a. FAQ trên trang chủ (nội dung tĩnh) |
| **Exception flow** | 2a. Tin không tồn tại/không hiển thị |

**Hình 2.40 – Activity Diagram: UC25 – Xem tin tức, FAQ, đánh giá công khai**

Luồng hoạt động: `● → Duyệt tin/FAQ/ĐG → Hiển thị → ◉`

---

## 2.2.3.3. Actor Khách hàng

Khách hàng (CUSTOMER) đăng ký/đăng nhập để đặt vé, thanh toán, quản lý vé cá nhân và tương tác hỗ trợ.

#### 2.2.3.3.1. UC01 – Đăng nhập / đăng xuất

**Bảng 2.22 – Đặc tả use case UC01: Đăng nhập / đăng xuất**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đăng nhập / đăng xuất |
| **Description** | Người dùng xác thực tên đăng nhập và mật khẩu để truy cập chức năng theo vai trò; đăng xuất xóa phiên cục bộ. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng, Khách vãng lai |
| **Input** | Tên đăng nhập, mật khẩu hợp lệ. |
| **Output** | JWT và thông tin người dùng; chuyển hướng theo vai trò (CUSTOMER → đặt vé; ADMIN/STAFF → quản trị). |
| **Basic flow** | 1. Actor mở form Đăng nhập — Bắt đầu<br>2. Nhập tên đăng nhập, mật khẩu<br>3. Gửi POST /xac-thuc/dang-nhap<br>4. Hệ thống xác thực, trả JWT<br>5. Lưu phiên, chuyển trang — Kết thúc |
| **Alternative flow** | 1a. Đăng xuất: xóa token trong localStorage, về trang chủ — Kết thúc |
| **Exception flow** | 3a. Sai thông tin → báo lỗi đăng nhập<br>3b. Tài khoản bị khóa (hoatDong=false) → từ chối đăng nhập |

**Hình 2.16 – Activity Diagram: UC01 – Đăng nhập / đăng xuất**

Luồng hoạt động: `● → Mở form → Nhập TK/MK → Xác thực? → [Đúng] Lưu JWT → Chuyển hướng → ◉ | [Sai] Báo lỗi → ◉`

#### 2.2.3.3.2. UC02 – Đăng ký / quên mật khẩu

**Bảng 2.23 – Đặc tả use case UC02: Đăng ký / quên mật khẩu**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đăng ký / quên mật khẩu |
| **Description** | Khách vãng lai đăng ký tài khoản CUSTOMER hoặc đặt lại mật khẩu qua OTP email. |
| **Actors** | Khách hàng, Khách vãng lai |
| **Input** | Họ tên, tên đăng nhập, email, mật khẩu; hoặc email + OTP + mật khẩu mới. |
| **Output** | Tài khoản CUSTOMER mới (tự đăng nhập) hoặc mật khẩu được đặt lại. |
| **Basic flow** | Đăng ký: 1. Chọn Đăng ký — Bắt đầu 2. Nhập hồ sơ 3. POST /xac-thuc/dang-ky 4. Tạo TaiKhoan+KhachHang 5. Trả JWT — Kết thúc |
| **Alternative flow** | Quên MK: 1. Nhập email → gửi OTP 2. Nhập OTP+mật khẩu mới → POST dat-lai — Kết thúc |
| **Exception flow** | 3a. Trùng tên đăng nhập/email 3b. Mật khẩu <6 ký tự 3c. OTP sai/hết hạn (10 phút) |

**Hình 2.17 – Activity Diagram: UC02 – Đăng ký / quên mật khẩu**

Luồng hoạt động: `● → {Đăng ký|Quên MK} → Kiểm tra → [OK] Lưu/đổi MK → ◉`

#### 2.2.3.3.3. UC15 – Tìm kiếm chuyến xe

**Bảng 2.36 – Đặc tả use case UC15: Tìm kiếm chuyến xe**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Tìm kiếm chuyến xe |
| **Description** | Tìm chuyến theo tuyến, ngày, bộ lọc giá/loại xe/giờ; xem ghế trống. |
| **Actors** | Khách hàng, Khách vãng lai |
| **Input** | Mã tuyến, thời điểm khởi hành; bộ lọc tùy chọn. |
| **Output** | Danh sách chuyến và sơ đồ ghế. |
| **Basic flow** | 1. Chọn tuyến+ngày — Bắt đầu 2. GET /chuyen-xe/tim-kiem 3. Hiển thị kết quả 4. Chọn chuyến → tải ghế — Kết thúc |
| **Alternative flow** | 1a. Từ trang chủ → chuyển /dat-ve kèm query |
| **Exception flow** | 2a. Không có chuyến → thông báo trống |

**Hình 2.30 – Activity Diagram: UC15 – Tìm kiếm chuyến xe**

Luồng hoạt động: `● → Nhập điều kiện → Tìm kiếm → Có chuyến? → Hiển thị → ◉`

#### 2.2.3.3.4. UC16 – Đặt vé, chọn ghế

**Bảng 2.37 – Đặc tả use case UC16: Đặt vé, chọn ghế**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đặt vé, chọn ghế |
| **Description** | Chọn 1–10 ghế, điểm lên/xuống; giữ vé PENDING 15 phút. |
| **Actors** | Khách hàng |
| **Input** | Mã chuyến, danh sách ghế; điểm dừng (tùy chọn). |
| **Output** | Vé PENDING, mã vé hiển thị; email+thông báo. |
| **Basic flow** | 1. Chọn ghế (1–10) — Bắt đầu 2. Xác nhận đặt 3. POST /ve-xe/dat 4. Tạo vé PENDING — Kết thúc |
| **Alternative flow** | 1a. Chưa đăng nhập → mở form đăng ký/đăng nhập |
| **Exception flow** | 2a. Ghế đã giữ/khóa 2b. >10 ghế 2c. Điểm lên/xuống sai tuyến |

**Hình 2.31 – Activity Diagram: UC16 – Đặt vé, chọn ghế**

Luồng hoạt động: `● → Chọn ghế → Đăng nhập? → Đặt vé → Giữ 15p → ◉`

#### 2.2.3.3.5. UC17 – Thanh toán (PayOS / tiền mặt)

**Bảng 2.38 – Đặc tả use case UC17: Thanh toán (PayOS / tiền mặt)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Thanh toán (PayOS / tiền mặt) |
| **Description** | Thanh toán vé PENDING bằng tiền mặt hoặc PayOS; áp mã khuyến mãi. |
| **Actors** | Khách hàng |
| **Input** | Mã vé PENDING; mã KM (tùy chọn). |
| **Output** | Vé PAID; giao dịch và email xác nhận. |
| **Basic flow** | Tiền mặt: POST /thanh-toan/ve/{ma}/tien-mat — Kết thúc | PayOS: tạo link → thanh toán → webhook/kiểm tra kết quả |
| **Alternative flow** | 1a. Nhập mã khuyến mãi trước khi thanh toán |
| **Exception flow** | 2a. Vé hết hạn/không phải của mình 2b. Mã KM không hợp lệ 2c. PayOS chưa cấu hình |

**Hình 2.32 – Activity Diagram: UC17 – Thanh toán (PayOS / tiền mặt)**

Luồng hoạt động: `● → Chọn PTTT → {Tiền mặt|PayOS} → Xác nhận → Vé PAID → ◉`

#### 2.2.3.3.6. UC18 – Tra cứu vé, vé điện tử (QR)

**Bảng 2.39 – Đặc tả use case UC18: Tra cứu vé, vé điện tử (QR)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Tra cứu vé, vé điện tử (QR) |
| **Description** | Tra cứu công khai bằng mã vé+SĐT; khách đăng nhập xem vé điện tử PAID. |
| **Actors** | Khách hàng, Khách vãng lai |
| **Input** | Mã vé hiển thị + số điện thoại; hoặc JWT (vé của tôi). |
| **Output** | Thông tin vé; mã QR tra cứu. |
| **Basic flow** | Công khai: GET /ve-xe/tra-cuu — Kết thúc | Đăng nhập: GET /ve-xe/{ma}/dien-tu |
| **Alternative flow** | 1a. Quét QR điền sẵn mã vé |
| **Exception flow** | 2a. Không tìm thấy 2b. SĐT không khớp 2c. Vé chưa PAID (vé điện tử) |

**Hình 2.33 – Activity Diagram: UC18 – Tra cứu vé, vé điện tử (QR)**

Luồng hoạt động: `● → Nhập mã+SĐT → Tra cứu → Hiển thị/QR → ◉`

#### 2.2.3.3.7. UC19 – Đổi ghế / đổi chuyến / hủy vé

**Bảng 2.40 – Đặc tả use case UC19: Đổi ghế / đổi chuyến / hủy vé**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đổi ghế / đổi chuyến / hủy vé |
| **Description** | Hủy vé PENDING; API đổi ghế/chuyến cho vé PENDING/PAID (trước giờ đi ≥2h). |
| **Actors** | Khách hàng |
| **Input** | Mã vé; ghế/chuyến mới (đổi). |
| **Output** | Vé CANCELLED hoặc cập nhật ghế/chuyến. |
| **Basic flow** | Hủy (UI): POST /ve-xe/{ma}/huy — Kết thúc |
| **Alternative flow** | Đổi ghế: POST /ve-xe/{ma}/doi-ghe | Đổi chuyến: POST /ve-xe/{ma}/doi-chuyen<br>*Ghi chú: đổi ghế/chuyến có API, chưa có giao diện khách. |
| **Exception flow** | 2a. Vé PAID → không hủy online 2b. <2h trước giờ đi → không đổi 2c. Ghế mới đã có người |

**Hình 2.34 – Activity Diagram: UC19 – Đổi ghế / đổi chuyến / hủy vé**

Luồng hoạt động: `● → Chọn vé → {Hủy|Đổi}? → Kiểm tra → Cập nhật → ◉`

#### 2.2.3.3.8. UC20 – Quản lý hồ sơ, lịch sử thanh toán

**Bảng 2.41 – Đặc tả use case UC20: Quản lý hồ sơ, lịch sử thanh toán**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Quản lý hồ sơ, lịch sử thanh toán |
| **Description** | Xem/sửa hồ sơ; đổi mật khẩu; xem lịch sử giao dịch. |
| **Actors** | Khách hàng |
| **Input** | Họ tên, SĐT, địa chỉ, email; mật khẩu cũ/mới. |
| **Output** | Hồ sơ cập nhật; bảng lịch sử thanh toán. |
| **Basic flow** | Hồ sơ: GET/PUT /ho-so/cua-toi — Kết thúc | Lịch sử: GET /thanh-toan/lich-su |
| **Alternative flow** | 1a. Đổi mật khẩu PUT /ho-so/mat-khau |
| **Exception flow** | 2a. Mật khẩu cũ sai 2b. Mật khẩu mới <6 ký tự |

**Hình 2.35 – Activity Diagram: UC20 – Quản lý hồ sơ, lịch sử thanh toán**

Luồng hoạt động: `● → Xem hồ sơ → Sửa/Lịch sử? → Lưu → ◉`

#### 2.2.3.3.9. UC21 – Đánh giá chuyến đi

**Bảng 2.42 – Đặc tả use case UC21: Đánh giá chuyến đi**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đánh giá chuyến đi |
| **Description** | Đánh giá 1–5 sao chuyến đã đi, vé PAID, chưa đánh giá. |
| **Actors** | Khách hàng |
| **Input** | Mã chuyến, điểm (1–5), nhận xét. |
| **Output** | Đánh giá lưu CSDL; hiển thị công khai. |
| **Basic flow** | 1. GET /danh-gia/ve-cho-danh-gia — Bắt đầu 2. Chọn chuyến 3. POST /danh-gia — Kết thúc |
| **Alternative flow** | — |
| **Exception flow** | 3a. Đã đánh giá chuyến này 3b. Chuyến chưa khởi hành |

**Hình 2.36 – Activity Diagram: UC21 – Đánh giá chuyến đi**

Luồng hoạt động: `● → Danh sách chuyến → Chấm điểm → Gửi → ◉`

#### 2.2.3.3.10. UC23 – Nhận thông báo thời gian thực (SSE)

**Bảng 2.44 – Đặc tả use case UC23: Nhận thông báo thời gian thực (SSE)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Nhận thông báo thời gian thực (SSE) |
| **Description** | Nhận thông báo qua Server-Sent Events khi có sự kiện (đặt vé, thanh toán…). |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng |
| **Input** | JWT hợp lệ. |
| **Output** | Toast thông báo; danh sách trong /thong-bao. |
| **Basic flow** | 1. Đăng nhập — Bắt đầu 2. Mở SSE /thong-bao/stream 3. Nhận sự kiện 4. Đánh dấu đã đọc — Kết thúc |
| **Alternative flow** | 4a. Xem danh sách GET /thong-bao |
| **Exception flow** | 2a. Mất kết nối SSE → ngắt kết nối |

**Hình 2.38 – Activity Diagram: UC23 – Nhận thông báo thời gian thực (SSE)**

Luồng hoạt động: `● → Kết nối SSE → Nhận TB → Hiển thị → ◉`

#### 2.2.3.3.11. UC24 – Gửi / nhận tin nhắn hỗ trợ (chat)

**Bảng 2.45 – Đặc tả use case UC24: Gửi / nhận tin nhắn hỗ trợ (chat)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Gửi / nhận tin nhắn hỗ trợ (chat) |
| **Description** | Trao đổi tin nhắn 1-1: khách tại /ho-tro; quản trị tại /quan-tri/ho-tro. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng |
| **Input** | Mã người nhận, nội dung tin. |
| **Output** | Lịch sử hội thoại hiển thị trong khung chat. |
| **Basic flow** | 1. Mở trang Hỗ trợ — Bắt đầu<br>2. GET /chat/ho-tro (khách) hoặc chọn khách (QT)<br>3. GET /chat/hoi-thoai 4. POST /chat/gui — Kết thúc |
| **Alternative flow** | 2a. Khách chọn nhân viên hỗ trợ (nếu nhiều STAFF/ADMIN) |
| **Exception flow** | 4a. Nội dung trống 4b. Gửi cho chính mình 4c. Người nhận không tồn tại |

**Hình 2.39 – Activity Diagram: UC24 – Gửi / nhận tin nhắn hỗ trợ (chat)**

Luồng hoạt động: `● → Mở chat → Tải hội thoại → Gửi/nhận → ◉`

#### 2.2.3.3.12. UC25 – Xem tin tức, FAQ, đánh giá công khai

**Bảng 2.46 – Đặc tả use case UC25: Xem tin tức, FAQ, đánh giá công khai**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xem tin tức, FAQ, đánh giá công khai |
| **Description** | Đọc tin tức, FAQ (trang chủ tĩnh + API động), đánh giá công khai. |
| **Actors** | Tất cả actor (kể cả Khách vãng lai) |
| **Input** | Không cần đăng nhập. |
| **Output** | Danh sách tin, chi tiết bài, đánh giá mẫu. |
| **Basic flow** | 1. GET /tin-tuc — Bắt đầu 2. Xem chi tiết /tin-tuc/{ma} 3. Xem đánh giá /danh-gia/cong-khai — Kết thúc |
| **Alternative flow** | 1a. FAQ trên trang chủ (nội dung tĩnh) |
| **Exception flow** | 2a. Tin không tồn tại/không hiển thị |

**Hình 2.40 – Activity Diagram: UC25 – Xem tin tức, FAQ, đánh giá công khai**

Luồng hoạt động: `● → Duyệt tin/FAQ/ĐG → Hiển thị → ◉`

---

## 2.2.3.4. Actor Khách vãng lai

Khách vãng lai truy cập không đăng nhập: tìm chuyến, tra cứu vé, xem tin tức/FAQ/đánh giá; có thể đăng ký hoặc đăng nhập.

#### 2.2.3.4.1. UC01 – Đăng nhập / đăng xuất

**Bảng 2.22 – Đặc tả use case UC01: Đăng nhập / đăng xuất**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đăng nhập / đăng xuất |
| **Description** | Người dùng xác thực tên đăng nhập và mật khẩu để truy cập chức năng theo vai trò; đăng xuất xóa phiên cục bộ. |
| **Actors** | Quản trị viên, Nhân viên, Khách hàng, Khách vãng lai |
| **Input** | Tên đăng nhập, mật khẩu hợp lệ. |
| **Output** | JWT và thông tin người dùng; chuyển hướng theo vai trò (CUSTOMER → đặt vé; ADMIN/STAFF → quản trị). |
| **Basic flow** | 1. Actor mở form Đăng nhập — Bắt đầu<br>2. Nhập tên đăng nhập, mật khẩu<br>3. Gửi POST /xac-thuc/dang-nhap<br>4. Hệ thống xác thực, trả JWT<br>5. Lưu phiên, chuyển trang — Kết thúc |
| **Alternative flow** | 1a. Đăng xuất: xóa token trong localStorage, về trang chủ — Kết thúc |
| **Exception flow** | 3a. Sai thông tin → báo lỗi đăng nhập<br>3b. Tài khoản bị khóa (hoatDong=false) → từ chối đăng nhập |

**Hình 2.16 – Activity Diagram: UC01 – Đăng nhập / đăng xuất**

Luồng hoạt động: `● → Mở form → Nhập TK/MK → Xác thực? → [Đúng] Lưu JWT → Chuyển hướng → ◉ | [Sai] Báo lỗi → ◉`

#### 2.2.3.4.2. UC02 – Đăng ký / quên mật khẩu

**Bảng 2.23 – Đặc tả use case UC02: Đăng ký / quên mật khẩu**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Đăng ký / quên mật khẩu |
| **Description** | Khách vãng lai đăng ký tài khoản CUSTOMER hoặc đặt lại mật khẩu qua OTP email. |
| **Actors** | Khách hàng, Khách vãng lai |
| **Input** | Họ tên, tên đăng nhập, email, mật khẩu; hoặc email + OTP + mật khẩu mới. |
| **Output** | Tài khoản CUSTOMER mới (tự đăng nhập) hoặc mật khẩu được đặt lại. |
| **Basic flow** | Đăng ký: 1. Chọn Đăng ký — Bắt đầu 2. Nhập hồ sơ 3. POST /xac-thuc/dang-ky 4. Tạo TaiKhoan+KhachHang 5. Trả JWT — Kết thúc |
| **Alternative flow** | Quên MK: 1. Nhập email → gửi OTP 2. Nhập OTP+mật khẩu mới → POST dat-lai — Kết thúc |
| **Exception flow** | 3a. Trùng tên đăng nhập/email 3b. Mật khẩu <6 ký tự 3c. OTP sai/hết hạn (10 phút) |

**Hình 2.17 – Activity Diagram: UC02 – Đăng ký / quên mật khẩu**

Luồng hoạt động: `● → {Đăng ký|Quên MK} → Kiểm tra → [OK] Lưu/đổi MK → ◉`

#### 2.2.3.4.3. UC15 – Tìm kiếm chuyến xe

**Bảng 2.36 – Đặc tả use case UC15: Tìm kiếm chuyến xe**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Tìm kiếm chuyến xe |
| **Description** | Tìm chuyến theo tuyến, ngày, bộ lọc giá/loại xe/giờ; xem ghế trống. |
| **Actors** | Khách hàng, Khách vãng lai |
| **Input** | Mã tuyến, thời điểm khởi hành; bộ lọc tùy chọn. |
| **Output** | Danh sách chuyến và sơ đồ ghế. |
| **Basic flow** | 1. Chọn tuyến+ngày — Bắt đầu 2. GET /chuyen-xe/tim-kiem 3. Hiển thị kết quả 4. Chọn chuyến → tải ghế — Kết thúc |
| **Alternative flow** | 1a. Từ trang chủ → chuyển /dat-ve kèm query |
| **Exception flow** | 2a. Không có chuyến → thông báo trống |

**Hình 2.30 – Activity Diagram: UC15 – Tìm kiếm chuyến xe**

Luồng hoạt động: `● → Nhập điều kiện → Tìm kiếm → Có chuyến? → Hiển thị → ◉`

#### 2.2.3.4.4. UC18 – Tra cứu vé, vé điện tử (QR)

**Bảng 2.39 – Đặc tả use case UC18: Tra cứu vé, vé điện tử (QR)**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Tra cứu vé, vé điện tử (QR) |
| **Description** | Tra cứu công khai bằng mã vé+SĐT; khách đăng nhập xem vé điện tử PAID. |
| **Actors** | Khách hàng, Khách vãng lai |
| **Input** | Mã vé hiển thị + số điện thoại; hoặc JWT (vé của tôi). |
| **Output** | Thông tin vé; mã QR tra cứu. |
| **Basic flow** | Công khai: GET /ve-xe/tra-cuu — Kết thúc | Đăng nhập: GET /ve-xe/{ma}/dien-tu |
| **Alternative flow** | 1a. Quét QR điền sẵn mã vé |
| **Exception flow** | 2a. Không tìm thấy 2b. SĐT không khớp 2c. Vé chưa PAID (vé điện tử) |

**Hình 2.33 – Activity Diagram: UC18 – Tra cứu vé, vé điện tử (QR)**

Luồng hoạt động: `● → Nhập mã+SĐT → Tra cứu → Hiển thị/QR → ◉`

#### 2.2.3.4.5. UC25 – Xem tin tức, FAQ, đánh giá công khai

**Bảng 2.46 – Đặc tả use case UC25: Xem tin tức, FAQ, đánh giá công khai**

| Hạng mục | Nội dung |
|----------|----------|
| **Use case name** | Xem tin tức, FAQ, đánh giá công khai |
| **Description** | Đọc tin tức, FAQ (trang chủ tĩnh + API động), đánh giá công khai. |
| **Actors** | Tất cả actor (kể cả Khách vãng lai) |
| **Input** | Không cần đăng nhập. |
| **Output** | Danh sách tin, chi tiết bài, đánh giá mẫu. |
| **Basic flow** | 1. GET /tin-tuc — Bắt đầu 2. Xem chi tiết /tin-tuc/{ma} 3. Xem đánh giá /danh-gia/cong-khai — Kết thúc |
| **Alternative flow** | 1a. FAQ trên trang chủ (nội dung tĩnh) |
| **Exception flow** | 2a. Tin không tồn tại/không hiển thị |

**Hình 2.40 – Activity Diagram: UC25 – Xem tin tức, FAQ, đánh giá công khai**

Luồng hoạt động: `● → Duyệt tin/FAQ/ĐG → Hiển thị → ◉`

---

## Phụ lục – Bảng tra cứu nhanh 25 Use case

| Mã | Tên | Actor chính | Route / API chính |
|:---:|-----|-------------|-------------------|
| UC01 | Đăng nhập / đăng xuất | Quản trị viên, Nhân viên, Khách hàng, Khách vãng lai | /dang-nhap · POST /xac-thuc/dang-nhap |
| UC02 | Đăng ký / quên mật khẩu | Khách hàng, Khách vãng lai | /dang-ky · POST /xac-thuc/dang-ky, /quen-mat-khau/* |
| UC03 | Xem tổng quan (Dashboard) | Quản trị viên, Nhân viên | /quan-tri/tong-quan · GET /bao-cao/mo-rong |
| UC04 | Quản lý tuyến đường | Quản trị viên, Nhân viên | /quan-tri/tuyen-duong · /tuyen-duong |
| UC05 | Quản lý loại xe | Quản trị viên, Nhân viên | /quan-tri/loai-xe · /loai-xe |
| UC06 | Quản lý xe khách | Quản trị viên, Nhân viên | /quan-tri/xe-khach · /xe-khach |
| UC07 | Quản lý ghế ngồi | Quản trị viên, Nhân viên | /quan-tri/ghe-ngoi · /ghe-ngoi |
| UC08 | Quản lý điểm dừng chân | Quản trị viên, Nhân viên | /quan-tri/diem-dung · /diem-dung |
| UC09 | Quản lý chuyến xe, sinh lịch | Quản trị viên, Nhân viên | /quan-tri/chuyen-xe · /chuyen-xe |
| UC10 | Quản lý tài khoản khách hàng | Quản trị viên, Nhân viên | /quan-tri/khach-hang · /khach-hang |
| UC11 | Quản lý khuyến mãi | Quản trị viên, Nhân viên | /quan-tri/khuyen-mai · /khuyen-mai |
| UC12 | Quản lý tin tức | Quản trị viên, Nhân viên | /quan-tri/tin-tuc · /tin-tuc |
| UC13 | Quản lý hỏi đáp (FAQ) | Quản trị viên, Nhân viên | API · /hoi-dap/quan-tri/* |
| UC14 | Báo cáo thống kê, xuất CSV | Quản trị viên, Nhân viên | /quan-tri/bao-cao · /bao-cao/* |
| UC15 | Tìm kiếm chuyến xe | Khách hàng, Khách vãng lai | /dat-ve · GET /chuyen-xe/tim-kiem |
| UC16 | Đặt vé, chọn ghế | Khách hàng | /dat-ve · POST /ve-xe/dat |
| UC17 | Thanh toán (PayOS / tiền mặt) | Khách hàng | /ve-cua-toi · /thanh-toan/* |
| UC18 | Tra cứu vé, vé điện tử (QR) | Khách hàng, Khách vãng lai | /tra-cuu-ve · GET /ve-xe/tra-cuu |
| UC19 | Đổi ghế / đổi chuyến / hủy vé | Khách hàng | /ve-cua-toi · POST /ve-xe/{ma}/huy |
| UC20 | Quản lý hồ sơ, lịch sử thanh toán | Khách hàng | /ho-so · /lich-su-thanh-toan |
| UC21 | Đánh giá chuyến đi | Khách hàng | /danh-gia · POST /danh-gia |
| UC22 | Xử lý hỗ trợ / trả lời chat | Quản trị viên, Nhân viên | /quan-tri/ho-tro · /chat/* |
| UC23 | Nhận thông báo thời gian thực (SSE) | Quản trị viên, Nhân viên, Khách hàng | /thong-bao · GET /thong-bao/stream |
| UC24 | Gửi / nhận tin nhắn hỗ trợ (chat) | Quản trị viên, Nhân viên, Khách hàng | /ho-tro · /quan-tri/ho-tro · /chat/* |
| UC25 | Xem tin tức, FAQ, đánh giá công khai | Tất cả actor (kể cả Khách vãng lai) | /tin-tuc · GET /tin-tuc, /danh-gia/cong-khai |

---

*Tài liệu sinh tự động: `python docs/gen_kich_ban_uc.py`*