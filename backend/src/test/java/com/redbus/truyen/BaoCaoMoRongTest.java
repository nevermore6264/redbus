package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("BaoCaoMoRong")
class BaoCaoMoRongTest {
    @Test
    @DisplayName("builder gán trường soGiaoDichThanhToan")
    void builder_soGiaoDichThanhToan() {
        BaoCaoMoRong o = BaoCaoMoRong.builder().soGiaoDichThanhToan(1L).build();
        assertEquals(1L, o.getSoGiaoDichThanhToan());
    }
    @Test
    @DisplayName("setter cập nhật trường soGiaoDichThanhToan")
    void setter_soGiaoDichThanhToan() {
        BaoCaoMoRong o = new BaoCaoMoRong();
        o.setSoGiaoDichThanhToan(1L);
        assertEquals(1L, o.getSoGiaoDichThanhToan());
    }
}
