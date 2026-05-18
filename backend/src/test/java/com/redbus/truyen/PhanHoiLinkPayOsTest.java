package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PhanHoiLinkPayOs")
class PhanHoiLinkPayOsTest {
    @Test
    @DisplayName("builder gán trường checkoutUrl")
    void builder_checkoutUrl() {
        PhanHoiLinkPayOs o = PhanHoiLinkPayOs.builder().checkoutUrl("x").build();
        assertEquals("x", o.getCheckoutUrl());
    }
}
