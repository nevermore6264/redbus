package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDoiChuyen")
class YeuCauDoiChuyenTest {
    @Test
    @DisplayName("setter cập nhật trường maChuyenMoi")
    void setter_maChuyenMoi() {
        YeuCauDoiChuyen o = new YeuCauDoiChuyen();
        o.setMaChuyenMoi(1L);
        assertEquals(1L, o.getMaChuyenMoi());
    }
}
