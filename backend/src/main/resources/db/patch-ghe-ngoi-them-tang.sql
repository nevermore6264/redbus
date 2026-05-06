-- Thêm cột `tang` khi bảng `ghe_ngoi` đã tạo từ phiên bản schema cũ (không có cột này).
-- Được nạp tự động sau schema.sql (xem application.yml). Trên DB mới, cột đã có → MySQL báo trùng → bỏ qua.

ALTER TABLE ghe_ngoi
    ADD COLUMN tang INT NOT NULL DEFAULT 1 AFTER cot;
