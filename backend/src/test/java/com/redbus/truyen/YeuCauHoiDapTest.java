package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauHoiDap")
class YeuCauHoiDapTest {
    @Test
    @DisplayName("setter cập nhật trường tieuDe")
    void setter_tieuDe() {
        YeuCauHoiDap o = new YeuCauHoiDap();
        o.setTieuDe("x");
        assertEquals("x", o.getTieuDe());
    }
}
