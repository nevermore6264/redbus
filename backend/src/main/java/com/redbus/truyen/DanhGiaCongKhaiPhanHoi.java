package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DanhGiaCongKhaiPhanHoi {

    private Long ma;
    private Integer diemSo;
    private String nhanXet;
    private LocalDateTime thoiGianTao;
    private String tenKhach;
    private String diemDi;
    private String diemDen;
}
