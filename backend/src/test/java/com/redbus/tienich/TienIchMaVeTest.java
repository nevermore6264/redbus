package com.redbus.tienich;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TienIchMaVe")
class TienIchMaVeTest {

    @Test
    @DisplayName("taoMaHienThi bắt đầu bằng RB và có độ dài 10")
    void taoMaHienThi_dungDinhDang() {
        String ma = TienIchMaVe.taoMaHienThi();
        assertTrue(ma.startsWith("RB"));
        assertEquals(10, ma.length());
        assertTrue(ma.chars().allMatch(c -> Character.isUpperCase(c) || Character.isDigit(c)));
    }
}
