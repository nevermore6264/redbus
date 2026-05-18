-- Chay patch sau schema goc (MySQL 8+)
ALTER TABLE ve_xe ADD COLUMN ma_ve_hien_thi VARCHAR(16) NULL UNIQUE AFTER trang_thai;
ALTER TABLE ve_xe ADD COLUMN ma_diem_len BIGINT NULL;
ALTER TABLE ve_xe ADD COLUMN ma_diem_xuong BIGINT NULL;

ALTER TABLE diem_dung_chan ADD COLUMN vi_do DOUBLE NULL;
ALTER TABLE diem_dung_chan ADD COLUMN kinh_do DOUBLE NULL;

CREATE TABLE IF NOT EXISTS ma_otp (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    ma_otp VARCHAR(8) NOT NULL,
    loai VARCHAR(32) NOT NULL,
    het_han_luc DATETIME NOT NULL,
    da_dung TINYINT(1) NOT NULL DEFAULT 0,
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_email_loai (email, loai, da_dung)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
