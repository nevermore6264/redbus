package com.redbus.mohinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("KhuyenMai")
class KhuyenMaiTest {
    @Test
    @DisplayName("builder gán trường ma")
    void builder_ma() {
        KhuyenMai o = KhuyenMai.builder().ma(1L).build();
        assertEquals(1L, o.getMa());
    }
    @Test
    @DisplayName("setter cập nhật trường ma")
    void setter_ma() {
        KhuyenMai o = new KhuyenMai();
        o.setMa(1L);
        assertEquals(1L, o.getMa());
    }
}
