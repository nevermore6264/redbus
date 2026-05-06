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
public class KhuyenMai {

    private Long ma;
    private String maCode;
    private String tieuDe;
    private BigDecimal phanTramGiam;
    private BigDecimal soTienGiamToiDa;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Integer soLanToiDa;
    private Integer soLanDaDung;
    private Boolean hoatDong;
}
