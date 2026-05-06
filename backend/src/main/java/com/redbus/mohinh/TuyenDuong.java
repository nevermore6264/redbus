package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuyenDuong {

    private Long ma;
    private String diemDi;
    private String diemDen;
    private Integer khoangCachKm;
    private Integer thoiGianUocTinhPhut;
    private Boolean hoatDong;
}
