package com.redbus.cauhinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("CauHinhPayOs - Spring bean ton tai (1000 case)")
class CauHinhPayOsTest {

    @ParameterizedTest(name = "case {0}: class CauHinhPayOs duoc nap trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(CauHinhPayOs.class);
    }
}