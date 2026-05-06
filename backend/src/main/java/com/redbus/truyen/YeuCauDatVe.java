package com.redbus.truyen;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class YeuCauDatVe {

    @NotNull
    private Long maChuyen;

    @NotNull
    private Long maGhe;
}
