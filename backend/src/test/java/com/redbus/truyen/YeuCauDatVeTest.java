package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDatVe")
class YeuCauDatVeTest {
    @Test
    @DisplayName("setter cập nhật trường maChuyen")
    void setter_maChuyen() {
        YeuCauDatVe o = new YeuCauDatVe();
        o.setMaChuyen(1L);
        assertEquals(1L, o.getMaChuyen());
    }
}
