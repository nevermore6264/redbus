package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("VeChoDanhGiaPhanHoi")
class VeChoDanhGiaPhanHoiTest {
    @Test
    @DisplayName("builder gán trường maVe")
    void builder_maVe() {
        VeChoDanhGiaPhanHoi o = VeChoDanhGiaPhanHoi.builder().maVe(1L).build();
        assertEquals(1L, o.getMaVe());
    }
}
