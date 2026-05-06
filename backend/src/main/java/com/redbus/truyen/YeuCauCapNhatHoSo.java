package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauCapNhatHoSo {

    @NotBlank
    private String hoTen;

    private String soDienThoai;
    private String diaChi;
}
