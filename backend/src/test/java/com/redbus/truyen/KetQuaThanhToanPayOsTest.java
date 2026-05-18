package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("KetQuaThanhToanPayOs")
class KetQuaThanhToanPayOsTest {
    @Test
    @DisplayName("builder gán trường orderCode")
    void builder_orderCode() {
        KetQuaThanhToanPayOs o = KetQuaThanhToanPayOs.builder().orderCode(1L).build();
        assertEquals(1L, o.getOrderCode());
    }
}
