package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PhanHoiDangNhap")
class PhanHoiDangNhapTest {
    @Test
    @DisplayName("builder gán trường token")
    void builder_token() {
        PhanHoiDangNhap o = PhanHoiDangNhap.builder().token("x").build();
        assertEquals("x", o.getToken());
    }
    @Test
    @DisplayName("setter cập nhật trường token")
    void setter_token() {
        PhanHoiDangNhap o = new PhanHoiDangNhap();
        o.setToken("x");
        assertEquals("x", o.getToken());
    }
}
