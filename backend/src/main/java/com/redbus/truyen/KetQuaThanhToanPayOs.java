package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KetQuaThanhToanPayOs {

    private Long orderCode;
    private Long maVe;
    private List<Long> dsMaVe;
    private Integer soVe;
    private Integer soVeDaThanhToan;
    private String trangThaiVe;
    private boolean daThanhToan;
    private String trangThaiPayOs;
}
