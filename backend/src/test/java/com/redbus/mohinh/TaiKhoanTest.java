package com.redbus.mohinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TaiKhoan")
class TaiKhoanTest {
    @Test
    @DisplayName("builder gán trường ma")
    void builder_ma() {
        TaiKhoan o = TaiKhoan.builder().ma(1L).build();
        assertEquals(1L, o.getMa());
    }
    @Test
    @DisplayName("setter cập nhật trường ma")
    void setter_ma() {
        TaiKhoan o = new TaiKhoan();
        o.setMa(1L);
        assertEquals(1L, o.getMa());
    }
}
