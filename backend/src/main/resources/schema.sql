-- RedBus — bang & cot tieng Viet khong dau (MySQL 8+, InnoDB utf8mb4)
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS tai_khoan (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_dang_nhap VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(128) NOT NULL UNIQUE,
    mat_khau_bam VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(32) NOT NULL,
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1,
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS khach_hang (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_khoan BIGINT NOT NULL UNIQUE,
    ho_ten VARCHAR(128) NOT NULL,
    so_dien_thoai VARCHAR(32),
    dia_chi VARCHAR(255),
    CONSTRAINT fk_khach_tai_khoan FOREIGN KEY (ma_tai_khoan) REFERENCES tai_khoan (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tuyen_duong (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    diem_di VARCHAR(128) NOT NULL,
    diem_den VARCHAR(128) NOT NULL,
    khoang_cach_km INT,
    thoi_gian_uoc_tinh_phut INT,
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS loai_xe (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten VARCHAR(128) NOT NULL,
    mo_ta VARCHAR(512),
    tien_ich VARCHAR(255),
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS loai_xe_anh (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_loai_xe BIGINT NOT NULL,
    tep VARCHAR(512) NOT NULL,
    thu_tu INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_lxa_loai FOREIGN KEY (ma_loai_xe) REFERENCES loai_xe (ma) ON DELETE CASCADE,
    INDEX idx_lxa_ma_loai (ma_loai_xe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS xe_khach (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_loai_xe BIGINT NULL,
    bien_so VARCHAR(32) NOT NULL UNIQUE,
    hang_xe VARCHAR(64),
    so_cho INT NOT NULL,
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT fk_xe_loai_xe FOREIGN KEY (ma_loai_xe) REFERENCES loai_xe (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ghe_ngoi (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_xe BIGINT NOT NULL,
    ky_hieu_ghe VARCHAR(16) NOT NULL,
    hang INT,
    cot INT,
    tang INT NOT NULL DEFAULT 1,
    trang_thai VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
    UNIQUE KEY uk_xe_ky_hieu (ma_xe, ky_hieu_ghe),
    CONSTRAINT fk_ghe_xe FOREIGN KEY (ma_xe) REFERENCES xe_khach (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chuyen_xe (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tuyen BIGINT NOT NULL,
    ma_xe BIGINT NOT NULL,
    thoi_diem_khoi_hanh DATETIME NOT NULL,
    thoi_diem_den DATETIME,
    gia_ve DECIMAL(12,2) NOT NULL,
    trang_thai VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT fk_chuyen_tuyen FOREIGN KEY (ma_tuyen) REFERENCES tuyen_duong (ma),
    CONSTRAINT fk_chuyen_xe_khach FOREIGN KEY (ma_xe) REFERENCES xe_khach (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS khuyen_mai (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_code VARCHAR(64) NOT NULL UNIQUE,
    tieu_de VARCHAR(255),
    phan_tram_giam DECIMAL(5,2) NOT NULL,
    so_tien_giam_toi_da DECIMAL(12,2),
    ngay_bat_dau DATETIME NOT NULL,
    ngay_ket_thuc DATETIME NOT NULL,
    gioi_han_so_lan INT,
    so_lan_da_dung INT NOT NULL DEFAULT 0,
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hinh_thuc_thanh_toan (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_loai VARCHAR(32) NOT NULL UNIQUE,
    ten VARCHAR(128) NOT NULL,
    mo_ta VARCHAR(512),
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thanh toan gop vao ve: khuyen mai + hinh thuc + so tien + thoi gian
CREATE TABLE IF NOT EXISTS ve_xe (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_chuyen BIGINT NOT NULL,
    ma_khach BIGINT NOT NULL,
    ma_ghe_ngoi BIGINT NOT NULL,
    trang_thai VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    ma_ve_hien_thi VARCHAR(16) NULL UNIQUE,
    thoi_gian_dat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ma_diem_len BIGINT NULL,
    ma_diem_xuong BIGINT NULL,
    ma_khuyen_mai BIGINT NULL,
    ma_hinh_thuc BIGINT NULL,
    so_tien_thanh_toan DECIMAL(12,2) NULL,
    ma_don_payos VARCHAR(128) NULL,
    thoi_gian_thanh_toan DATETIME NULL,
    CONSTRAINT fk_ve_chuyen FOREIGN KEY (ma_chuyen) REFERENCES chuyen_xe (ma),
    CONSTRAINT fk_ve_khach FOREIGN KEY (ma_khach) REFERENCES khach_hang (ma),
    CONSTRAINT fk_ve_ghe FOREIGN KEY (ma_ghe_ngoi) REFERENCES ghe_ngoi (ma),
    CONSTRAINT fk_ve_khuyen_mai FOREIGN KEY (ma_khuyen_mai) REFERENCES khuyen_mai (ma),
    CONSTRAINT fk_ve_hinh_thuc FOREIGN KEY (ma_hinh_thuc) REFERENCES hinh_thuc_thanh_toan (ma),
    UNIQUE KEY uk_chuyen_ghe (ma_chuyen, ma_ghe_ngoi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS thong_bao (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_dung BIGINT NOT NULL,
    tieu_de VARCHAR(255),
    noi_dung TEXT NOT NULL,
    da_doc TINYINT(1) NOT NULL DEFAULT 0,
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tb_tai_khoan FOREIGN KEY (ma_nguoi_dung) REFERENCES tai_khoan (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS diem_dung_chan (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_tuyen BIGINT NOT NULL,
    ten_diem VARCHAR(128) NOT NULL,
    thu_tu INT NOT NULL DEFAULT 0,
    thoi_gian_dung_phut INT DEFAULT 5,
    vi_do DOUBLE NULL,
    kinh_do DOUBLE NULL,
    CONSTRAINT fk_ddc_tuyen FOREIGN KEY (ma_tuyen) REFERENCES tuyen_duong (ma) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS danh_gia_chuyen (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_chuyen BIGINT NOT NULL,
    ma_khach BIGINT NOT NULL,
    diem_so TINYINT NOT NULL,
    nhan_xet TEXT,
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dg_chuyen FOREIGN KEY (ma_chuyen) REFERENCES chuyen_xe (ma) ON DELETE CASCADE,
    CONSTRAINT fk_dg_khach FOREIGN KEY (ma_khach) REFERENCES khach_hang (ma) ON DELETE CASCADE,
    UNIQUE KEY uk_chuyen_khach_dg (ma_chuyen, ma_khach)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tin_tuc (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    tom_tat VARCHAR(512),
    noi_dung TEXT NOT NULL,
    duong_anh VARCHAR(512),
    ngay_xuat_ban DATETIME,
    hoat_dong TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tin_nhan_chat (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_nguoi_gui BIGINT NOT NULL,
    ma_nguoi_nhan BIGINT NOT NULL,
    noi_dung TEXT NOT NULL,
    thoi_gian_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    da_doc_nhan TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_chat_gui FOREIGN KEY (ma_nguoi_gui) REFERENCES tai_khoan (ma),
    CONSTRAINT fk_chat_nhan FOREIGN KEY (ma_nguoi_nhan) REFERENCES tai_khoan (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hoi_dap (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_khach BIGINT NOT NULL,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung_hoi TEXT NOT NULL,
    noi_dung_tra_loi TEXT NULL,
    ma_nguoi_tra_loi BIGINT NULL,
    thoi_gian_hoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thoi_gian_tra_loi DATETIME NULL,
    trang_thai VARCHAR(32) NOT NULL DEFAULT 'CHO_TRA_LOI',
    CONSTRAINT fk_hd_khach FOREIGN KEY (ma_khach) REFERENCES khach_hang (ma),
    CONSTRAINT fk_hd_tra_loi FOREIGN KEY (ma_nguoi_tra_loi) REFERENCES tai_khoan (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
