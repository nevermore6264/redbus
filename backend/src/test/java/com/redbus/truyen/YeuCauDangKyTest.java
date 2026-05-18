package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDangKy")
class YeuCauDangKyTest {
    @Test
    @DisplayName("setter cập nhật trường tenDangNhap")
    void setter_tenDangNhap() {
        YeuCauDangKy o = new YeuCauDangKy();
        o.setTenDangNhap("x");
        assertEquals("x", o.getTenDangNhap());
    }
}
