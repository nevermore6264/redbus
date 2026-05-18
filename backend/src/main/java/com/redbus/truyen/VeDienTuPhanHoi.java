package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class VeDienTuPhanHoi {

    private Long ma;
    private String maVeHienThi;
    private String trangThai;
    private String tenKhach;
    private String soDienThoai;
    private String diemDi;
    private String diemDen;
    private String diemLen;
    private String diemXuong;
    private LocalDateTime thoiDiemKhoiHanh;
    private String maGhe;
    private BigDecimal soTienThanhToan;
    private String noiDungQr;
}
