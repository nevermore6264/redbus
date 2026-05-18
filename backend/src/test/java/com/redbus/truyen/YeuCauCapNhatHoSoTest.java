package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauCapNhatHoSo")
class YeuCauCapNhatHoSoTest {
    @Test
    @DisplayName("setter cập nhật trường hoTen")
    void setter_hoTen() {
        YeuCauCapNhatHoSo o = new YeuCauCapNhatHoSo();
        o.setHoTen("x");
        assertEquals("x", o.getHoTen());
    }
}
