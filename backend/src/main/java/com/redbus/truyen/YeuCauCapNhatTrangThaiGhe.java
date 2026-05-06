package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauCapNhatTrangThaiGhe {

    @NotBlank
    private String trangThai;
}
