-- Ảnh minh họa theo loại xe (nhiều ảnh / loại). Chạy trên DB đã có sẵn.
CREATE TABLE IF NOT EXISTS loai_xe_anh (
    ma BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_loai_xe BIGINT NOT NULL,
    tep VARCHAR(512) NOT NULL COMMENT 'Đường dẫn tương đối trong thư mục upload, ví dụ loai-xe/3/uuid.jpg',
    thu_tu INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_lxa_loai FOREIGN KEY (ma_loai_xe) REFERENCES loai_xe (ma) ON DELETE CASCADE,
    INDEX idx_lxa_ma_loai (ma_loai_xe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
