package com.redbus.truyen;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class YeuCauDoiChuyen {

    @NotNull
    private Long maChuyenMoi;

    @NotNull
    private Long maGheMoi;
}
