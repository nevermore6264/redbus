package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDanhGiaChuyen")
class YeuCauDanhGiaChuyenTest {
    @Test
    @DisplayName("setter cập nhật trường maChuyen")
    void setter_maChuyen() {
        YeuCauDanhGiaChuyen o = new YeuCauDanhGiaChuyen();
        o.setMaChuyen(1L);
        assertEquals(1L, o.getMaChuyen());
    }
}
