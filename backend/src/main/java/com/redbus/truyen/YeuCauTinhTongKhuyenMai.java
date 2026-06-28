package com.redbus.truyen;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class YeuCauTinhTongKhuyenMai {

    private String maCode;

    @NotEmpty(message = "Thiếu danh sách giá vé")
    private List<BigDecimal> dsGiaVe;
}
