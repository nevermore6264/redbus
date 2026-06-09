package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LienHeHoTroPhanHoi {

    private Long ma;
    private String tenDangNhap;
    private String vaiTro;
}
