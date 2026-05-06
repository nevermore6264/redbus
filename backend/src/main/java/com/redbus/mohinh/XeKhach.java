package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XeKhach {

    private Long ma;
    private Long maLoaiXe;
    private String bienSo;
    private String hangXe;
    private Integer soCho;
    private Boolean hoatDong;
}
