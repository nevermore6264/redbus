package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauThemKhachQuanTri")
class YeuCauThemKhachQuanTriTest {
    @Test
    @DisplayName("setter cập nhật trường tenDangNhap")
    void setter_tenDangNhap() {
        YeuCauThemKhachQuanTri o = new YeuCauThemKhachQuanTri();
        o.setTenDangNhap("x");
        assertEquals("x", o.getTenDangNhap());
    }
}
