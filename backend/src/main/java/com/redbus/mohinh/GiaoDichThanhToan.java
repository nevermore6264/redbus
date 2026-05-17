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
public class GiaoDichThanhToan {

    private Long ma;
    private Long maVe;
    
    private Long maKhuyenMai;
    private BigDecimal soTien;
    private String phuongThuc;
    private String trangThai;
    private String maDonPayOs;
    private LocalDateTime thoiGianTao;
}
