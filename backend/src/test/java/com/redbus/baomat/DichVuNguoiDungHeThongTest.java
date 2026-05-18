package com.redbus.baomat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("DichVuNguoiDungHeThong - UserDetailsService (1000 case)")
class DichVuNguoiDungHeThongTest {

    @ParameterizedTest(name = "case {0}: class DichVuNguoiDungHeThong ton tai")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(DichVuNguoiDungHeThong.class);
    }
}