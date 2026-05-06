package com.redbus.truyen;

import lombok.Data;

@Data
public class YeuCauCapNhatKhachQuanTri {

    private String hoTen;
    private String soDienThoai;
    private String diaChi;
    private String email;
    /** Đặt lại mật khẩu — chỉ khi có giá trị */
    private String matKhauMoi;
    /** Khóa / mở đăng nhập */
    private Boolean hoatDong;
}
