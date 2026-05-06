package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauTraLoiHoiDap {

    @NotBlank
    private String noiDungTraLoi;
}
