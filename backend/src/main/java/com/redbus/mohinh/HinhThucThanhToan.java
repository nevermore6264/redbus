package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HinhThucThanhToan {

    private Long ma;
    private String maLoai;
    private String ten;
    private String moTa;
    private Boolean hoatDong;
}
