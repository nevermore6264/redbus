package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDangNhap")
class YeuCauDangNhapTest {
    @Test
    @DisplayName("setter cập nhật trường tenDangNhap")
    void setter_tenDangNhap() {
        YeuCauDangNhap o = new YeuCauDangNhap();
        o.setTenDangNhap("x");
        assertEquals("x", o.getTenDangNhap());
    }
}
