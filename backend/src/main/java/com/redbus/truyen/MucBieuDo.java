package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MucBieuDo {

    private String nhan;
    private Long soLuong;
    private BigDecimal giaTri;
}
