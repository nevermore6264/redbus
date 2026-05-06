package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhanHoiDangNhap {

    private String token;
    private String loai;
    private String tenDangNhap;
    private String email;
    private String vaiTro;
}
