package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class PhanHoiThanhToanGop {

    private List<Long> dsMaVe;
    private BigDecimal tongTien;
}
