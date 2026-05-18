package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("VeDienTuPhanHoi")
class VeDienTuPhanHoiTest {
    @Test
    @DisplayName("builder gán trường ma")
    void builder_ma() {
        VeDienTuPhanHoi o = VeDienTuPhanHoi.builder().ma(1L).build();
        assertEquals(1L, o.getMa());
    }
}
