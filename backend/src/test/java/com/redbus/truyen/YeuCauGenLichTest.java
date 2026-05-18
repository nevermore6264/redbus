package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauGenLich")
class YeuCauGenLichTest {
    @Test
    @DisplayName("setter cập nhật trường tuNgay")
    void setter_tuNgay() {
        YeuCauGenLich o = new YeuCauGenLich();
        o.setTuNgay(java.time.LocalDate.now());
        assertEquals(java.time.LocalDate.now(), o.getTuNgay());
    }
}
