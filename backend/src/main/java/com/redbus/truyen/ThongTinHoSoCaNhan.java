package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThongTinHoSoCaNhan {

    private Long maTaiKhoan;
    private String tenDangNhap;
    private String email;
    private Long maKhach;
    private String hoTen;
    private String soDienThoai;
    private String diaChi;
}
