package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauGuiChat")
class YeuCauGuiChatTest {
    @Test
    @DisplayName("setter cập nhật trường maNguoiNhan")
    void setter_maNguoiNhan() {
        YeuCauGuiChat o = new YeuCauGuiChat();
        o.setMaNguoiNhan(1L);
        assertEquals(1L, o.getMaNguoiNhan());
    }
}
