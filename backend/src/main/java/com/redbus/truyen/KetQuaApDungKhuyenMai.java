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
public class KetQuaApDungKhuyenMai {

    private String maCode;
    private Long maKhuyenMai;
    private String tieuDe;
    private BigDecimal phanTramGiam;
    private BigDecimal giaGoc;
    private BigDecimal soTienGiam;
    private BigDecimal giaSauGiam;
}
