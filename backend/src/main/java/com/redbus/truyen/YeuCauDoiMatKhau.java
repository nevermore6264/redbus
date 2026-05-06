package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class YeuCauDoiMatKhau {

    @NotBlank
    private String matKhauCu;

    @NotBlank
    @Size(min = 6)
    private String matKhauMoi;
}
