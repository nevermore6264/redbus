package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KetQuaTinhTongKhuyenMai {

    private String maCode;
    private Long maKhuyenMai;
    private String tieuDe;
    private BigDecimal phanTramGiam;
    private int soVe;
    private BigDecimal tongGiaGoc;
    private BigDecimal tongGiam;
    private BigDecimal tongSauGiam;
    private List<KetQuaApDungKhuyenMai> chiTietTungVe;
}
