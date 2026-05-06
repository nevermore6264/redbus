package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GheNgoi {

    private Long ma;
    private Long maXe;
    private String maGhe;
    private Integer hang;
    private Integer cot;
    /** 1 = tầng dưới, 2 = tầng trên (xe giường nằm hai tầng) */
    private Integer tang;
    private String trangThai;
}
