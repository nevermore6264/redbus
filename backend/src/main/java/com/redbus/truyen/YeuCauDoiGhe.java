package com.redbus.truyen;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class YeuCauDoiGhe {

    @NotNull
    private Long maGheMoi;
}
