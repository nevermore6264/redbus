package com.redbus.truyen;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class YeuCauDanhGiaChuyen {

    @NotNull
    private Long maChuyen;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer diemSo;

    private String nhanXet;
}
