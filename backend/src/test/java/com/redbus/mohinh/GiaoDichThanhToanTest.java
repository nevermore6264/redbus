package com.redbus.mohinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GiaoDichThanhToan")
class GiaoDichThanhToanTest {
    @Test
    @DisplayName("builder gán trường ma")
    void builder_ma() {
        GiaoDichThanhToan o = GiaoDichThanhToan.builder().ma(1L).build();
        assertEquals(1L, o.getMa());
    }
    @Test
    @DisplayName("setter cập nhật trường ma")
    void setter_ma() {
        GiaoDichThanhToan o = new GiaoDichThanhToan();
        o.setMa(1L);
        assertEquals(1L, o.getMa());
    }
}
