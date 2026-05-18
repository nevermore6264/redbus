package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("KetQuaGenLich")
class KetQuaGenLichTest {
    @Test
    @DisplayName("builder gán trường soChuyenDaTao")
    void builder_soChuyenDaTao() {
        KetQuaGenLich o = KetQuaGenLich.builder().soChuyenDaTao(1).build();
        assertEquals(1, o.getSoChuyenDaTao());
    }
}
