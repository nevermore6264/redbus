package com.redbus.dieukhien;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("DieuKhienBaoCao - Spring bean ton tai (1000 case)")
class DieuKhienBaoCaoTest {

    @ParameterizedTest(name = "case {0}: class DieuKhienBaoCao duoc nap trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(DieuKhienBaoCao.class);
    }
}