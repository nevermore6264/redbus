package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ThongTinHoSoCaNhan")
class ThongTinHoSoCaNhanTest {
    @Test
    @DisplayName("builder gán trường maTaiKhoan")
    void builder_maTaiKhoan() {
        ThongTinHoSoCaNhan o = ThongTinHoSoCaNhan.builder().maTaiKhoan(1L).build();
        assertEquals(1L, o.getMaTaiKhoan());
    }
    @Test
    @DisplayName("setter cập nhật trường maTaiKhoan")
    void setter_maTaiKhoan() {
        ThongTinHoSoCaNhan o = new ThongTinHoSoCaNhan();
        o.setMaTaiKhoan(1L);
        assertEquals(1L, o.getMaTaiKhoan());
    }
}
