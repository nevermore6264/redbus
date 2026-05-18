package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauCapNhatTrangThaiGhe")
class YeuCauCapNhatTrangThaiGheTest {
    @Test
    @DisplayName("setter cập nhật trường trangThai")
    void setter_trangThai() {
        YeuCauCapNhatTrangThaiGhe o = new YeuCauCapNhatTrangThaiGhe();
        o.setTrangThai("x");
        assertEquals("x", o.getTrangThai());
    }
}
