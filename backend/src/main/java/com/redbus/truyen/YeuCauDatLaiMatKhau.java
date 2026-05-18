package com.redbus.truyen;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class YeuCauDatLaiMatKhau {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 8)
    private String maOtp;

    @NotBlank
    @Size(min = 6, max = 64)
    private String matKhauMoi;
}
