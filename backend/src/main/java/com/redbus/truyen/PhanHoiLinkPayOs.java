package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PhanHoiLinkPayOs {

    private String checkoutUrl;
    private Long orderCode;
    private Long maVe;
    private BigDecimal soTien;
}
