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
public class MaOtp {

    private Long ma;
    private String email;
    private String maOtp;
    private String loai;
    private LocalDateTime hetHanLuc;
    private Boolean daDung;
    private LocalDateTime thoiGianTao;
}
