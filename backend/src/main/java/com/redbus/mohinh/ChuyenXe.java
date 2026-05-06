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
public class ChuyenXe {

    private Long ma;
    private Long maTuyen;
    private Long maXe;
    private LocalDateTime thoiDiemKhoiHanh;
    private LocalDateTime thoiDiemDen;
    private BigDecimal giaVe;
    private String trangThai;
}
