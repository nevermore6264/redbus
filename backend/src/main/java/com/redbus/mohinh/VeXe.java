package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VeXe {

    private Long ma;
    private Long maChuyen;
    private Long maKhach;
    private Long maGhe;
    private String trangThai;
    private String maVeHienThi;
    private LocalDateTime thoiGianDat;
    private Long maDiemLen;
    private Long maDiemXuong;

    private Long maKhuyenMai;
    private Long maHinhThuc;
    private BigDecimal soTienThanhToan;
    private String maDonPayOs;
    private LocalDateTime thoiGianThanhToan;
}
