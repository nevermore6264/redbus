package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("DanhGiaCongKhaiPhanHoi")
class DanhGiaCongKhaiPhanHoiTest {
    @Test
    @DisplayName("builder gán trường ma")
    void builder_ma() {
        DanhGiaCongKhaiPhanHoi o = DanhGiaCongKhaiPhanHoi.builder().ma(1L).build();
        assertEquals(1L, o.getMa());
    }
    @Test
    @DisplayName("setter cập nhật trường ma")
    void setter_ma() {
        DanhGiaCongKhaiPhanHoi o = new DanhGiaCongKhaiPhanHoi();
        o.setMa(1L);
        assertEquals(1L, o.getMa());
    }
}
