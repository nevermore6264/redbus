package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DanhGiaChuyen {

    private Long ma;
    private Long maChuyen;
    private Long maKhach;
    private Integer diemSo;
    private String nhanXet;
    private LocalDateTime thoiGianTao;
}
