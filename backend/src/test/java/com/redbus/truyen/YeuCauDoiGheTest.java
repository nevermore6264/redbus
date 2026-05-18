package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauDoiGhe")
class YeuCauDoiGheTest {
    @Test
    @DisplayName("setter cập nhật trường maGheMoi")
    void setter_maGheMoi() {
        YeuCauDoiGhe o = new YeuCauDoiGhe();
        o.setMaGheMoi(1L);
        assertEquals(1L, o.getMaGheMoi());
    }
}
