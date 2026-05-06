package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThongTinKhachHangPhanHoi {

    private Long maKhach;
    private Long maTaiKhoan;
    private String hoTen;
    private String soDienThoai;
    private String diaChi;
    private String tenDangNhap;
    private String email;
    private Boolean hoatDong;
}
