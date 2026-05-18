package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("DonViHanhChinh")
class DonViHanhChinhTest {

    @Test
    @DisplayName("getter/setter name và code")
    void setter_nameVaCode() {
        DonViHanhChinh o = new DonViHanhChinh();
        o.setName("HN");
        o.setCode(1);
        assertEquals("HN", o.getName());
        assertEquals(1, o.getCode());
    }
}
