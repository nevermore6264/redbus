package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("MucBieuDo")
class MucBieuDoTest {
    @Test
    @DisplayName("builder gán trường nhan")
    void builder_nhan() {
        MucBieuDo o = MucBieuDo.builder().nhan("x").build();
        assertEquals("x", o.getNhan());
    }
    @Test
    @DisplayName("setter cập nhật trường nhan")
    void setter_nhan() {
        MucBieuDo o = new MucBieuDo();
        o.setNhan("x");
        assertEquals("x", o.getNhan());
    }
}
