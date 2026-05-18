package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauCapNhatKhachQuanTri")
class YeuCauCapNhatKhachQuanTriTest {
    @Test
    @DisplayName("setter cập nhật trường hoTen")
    void setter_hoTen() {
        YeuCauCapNhatKhachQuanTri o = new YeuCauCapNhatKhachQuanTri();
        o.setHoTen("x");
        assertEquals("x", o.getHoTen());
    }
}
