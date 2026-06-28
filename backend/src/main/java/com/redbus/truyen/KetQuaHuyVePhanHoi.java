package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class KetQuaHuyVePhanHoi {

    private Long maVe;
    private String trangThai;
    private BigDecimal soTienHoan;
    private String phuongThucHoan;
    private String thongBao;
}
