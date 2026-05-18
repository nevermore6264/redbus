package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauThanhToanTienMat")
class YeuCauThanhToanTienMatTest {
    @Test
    @DisplayName("setter cập nhật trường maKhuyenMai")
    void setter_maKhuyenMai() {
        YeuCauThanhToanTienMat o = new YeuCauThanhToanTienMat();
        o.setMaKhuyenMai("x");
        assertEquals("x", o.getMaKhuyenMai());
    }
}
