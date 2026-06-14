package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KetQuaThanhToanPayOs {

    private Long orderCode;
    private Long maVe;
    private String trangThaiVe;
    private boolean daThanhToan;
    private String trangThaiPayOs;
}
