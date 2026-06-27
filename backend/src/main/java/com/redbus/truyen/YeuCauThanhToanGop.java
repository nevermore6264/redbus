package com.redbus.truyen;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class YeuCauThanhToanGop {

    @NotEmpty(message = "Chọn ít nhất một vé")
    @Size(max = 10, message = "Tối đa 10 vé mỗi lần thanh toán gộp")
    private List<Long> dsMaVe;

    private String maKhuyenMai;
}
