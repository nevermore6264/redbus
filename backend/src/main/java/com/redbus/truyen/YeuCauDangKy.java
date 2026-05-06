package com.redbus.truyen;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class YeuCauDangKy {

    @NotBlank
    @Size(min = 3, max = 64)
    private String tenDangNhap;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 128)
    private String matKhau;

    @NotBlank
    private String hoTen;

    private String soDienThoai;
}
