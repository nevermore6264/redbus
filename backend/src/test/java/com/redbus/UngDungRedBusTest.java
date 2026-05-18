package com.redbus;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("UngDungRedBus - lop khoi dong Spring Boot")
class UngDungRedBusTest {

    @Test
    @DisplayName("UngDungRedBus co phuong thuc main")
    void coPhuongThucMain() throws Exception {
        assertNotNull(UngDungRedBus.class.getDeclaredMethod("main", String[].class));
    }

    @ParameterizedTest(name = "case {0}: class UngDungRedBus load duoc")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    void classTonTai(int chiSo) {
        assertNotNull(UngDungRedBus.class);
    }
}
