package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class YeuCauGuiChat {

    @NotNull
    private Long maNguoiNhan;

    @NotBlank
    private String noiDung;
}
