package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YeuCauTraLoiHoiDap")
class YeuCauTraLoiHoiDapTest {
    @Test
    @DisplayName("setter cập nhật trường noiDungTraLoi")
    void setter_noiDungTraLoi() {
        YeuCauTraLoiHoiDap o = new YeuCauTraLoiHoiDap();
        o.setNoiDungTraLoi("x");
        assertEquals("x", o.getNoiDungTraLoi());
    }
}
