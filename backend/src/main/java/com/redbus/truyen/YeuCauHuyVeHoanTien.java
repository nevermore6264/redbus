package com.redbus.truyen;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class YeuCauHuyVeHoanTien {

    @NotBlank(message = "Nhập số tài khoản")
    private String stk;

    @NotBlank(message = "Nhập tên ngân hàng")
    private String tenNganHang;

    @NotBlank(message = "Nhập tên người nhận")
    private String tenNguoiNhan;
}
