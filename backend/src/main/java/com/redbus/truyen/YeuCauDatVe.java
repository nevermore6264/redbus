package com.redbus.truyen;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class YeuCauDatVe {

    @NotNull
    private Long maChuyen;

    private Long maGhe;

    private List<Long> dsMaGhe;

    private Long maDiemLen;

    private Long maDiemXuong;
}
