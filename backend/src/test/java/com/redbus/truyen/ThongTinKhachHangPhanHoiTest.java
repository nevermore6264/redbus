package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ThongTinKhachHangPhanHoi")
class ThongTinKhachHangPhanHoiTest {
    @Test
    @DisplayName("builder gán trường maKhach")
    void builder_maKhach() {
        ThongTinKhachHangPhanHoi o = ThongTinKhachHangPhanHoi.builder().maKhach(1L).build();
        assertEquals(1L, o.getMaKhach());
    }
    @Test
    @DisplayName("setter cập nhật trường maKhach")
    void setter_maKhach() {
        ThongTinKhachHangPhanHoi o = new ThongTinKhachHangPhanHoi();
        o.setMaKhach(1L);
        assertEquals(1L, o.getMaKhach());
    }
}
