package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AnhLoaiXePhanHoi")
class AnhLoaiXePhanHoiTest {
    @Test
    @DisplayName("builder gán trường ma")
    void builder_ma() {
        AnhLoaiXePhanHoi o = AnhLoaiXePhanHoi.builder().ma(1L).build();
        assertEquals(1L, o.getMa());
    }
    @Test
    @DisplayName("setter cập nhật trường ma")
    void setter_ma() {
        AnhLoaiXePhanHoi o = new AnhLoaiXePhanHoi();
        o.setMa(1L);
        assertEquals(1L, o.getMa());
    }
}
