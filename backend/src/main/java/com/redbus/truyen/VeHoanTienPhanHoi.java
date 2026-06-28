package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class VeHoanTienPhanHoi {

    private Long maVe;
    private String maVeHienThi;
    private String trangThai;
    private BigDecimal soTienHoan;
    private LocalDateTime thoiGianYeuCauHoan;
    private String stkHoan;
    private String tenNganHangHoan;
    private String tenNguoiNhanHoan;
    private String tenKhach;
    private String soDienThoaiKhach;
    private Long maChuyen;
    private LocalDateTime thoiDiemKhoiHanh;
    private String phuongThucThanhToan;
}
