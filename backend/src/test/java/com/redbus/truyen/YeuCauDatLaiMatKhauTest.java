package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDatLaiMatKhau")
class YeuCauDatLaiMatKhauTest {
    @Test
    @DisplayName("setter cập nhật trường email")
    void setter_email() {
        YeuCauDatLaiMatKhau o = new YeuCauDatLaiMatKhau();
        o.setEmail("x");
        assertEquals("x", o.getEmail());
    }
}
