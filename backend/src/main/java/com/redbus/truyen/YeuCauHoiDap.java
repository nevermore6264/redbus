package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauHoiDap {

    @NotBlank
    private String tieuDe;

    @NotBlank
    private String noiDungHoi;
}
