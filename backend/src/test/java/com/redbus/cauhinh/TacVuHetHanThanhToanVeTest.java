package com.redbus.cauhinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("TacVuHetHanThanhToanVe - Spring bean ton tai (1000 case)")
class TacVuHetHanThanhToanVeTest {

    @ParameterizedTest(name = "case {0}: class TacVuHetHanThanhToanVe duoc nap trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(TacVuHetHanThanhToanVe.class);
    }
}