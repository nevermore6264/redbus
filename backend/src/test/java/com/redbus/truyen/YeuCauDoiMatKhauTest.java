package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDoiMatKhau")
class YeuCauDoiMatKhauTest {
    @Test
    @DisplayName("setter cập nhật trường matKhauCu")
    void setter_matKhauCu() {
        YeuCauDoiMatKhau o = new YeuCauDoiMatKhau();
        o.setMatKhauCu("x");
        assertEquals("x", o.getMatKhauCu());
    }
}
