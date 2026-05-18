package com.redbus.truyen;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class YeuCauDatVe {

    @NotNull
    private Long maChuyen;

    /** Một ghế (tương thích cũ). */
    private Long maGhe;

    /** Nhiều ghế cùng chuyến. */
    private List<Long> dsMaGhe;
}
