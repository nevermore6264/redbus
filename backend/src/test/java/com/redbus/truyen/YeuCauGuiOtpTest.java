package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauGuiOtp")
class YeuCauGuiOtpTest {
    @Test
    @DisplayName("setter cập nhật trường email")
    void setter_email() {
        YeuCauGuiOtp o = new YeuCauGuiOtp();
        o.setEmail("x");
        assertEquals("x", o.getEmail());
    }
}
