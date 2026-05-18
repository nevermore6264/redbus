package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VeChoDanhGiaPhanHoi {

    private Long maVe;
    private Long maChuyen;
    private String tuyen;
    private LocalDateTime thoiDiemKhoiHanh;
    private String maGhe;
    private boolean daDanhGia;
}
