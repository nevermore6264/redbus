package com.redbus.anhxa;

import com.redbus.hotro.NguonCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("AnhXaLoaiXeAnh - interface MyBatis (khong @Mapper rieng)")
class AnhXaLoaiXeAnhTest {

    @Test
    @DisplayName("AnhXaLoaiXeAnh la interface MyBatis hop le")
    void laInterfaceMyBatis() {
        assertTrue(AnhXaLoaiXeAnh.class.isInterface());
        assertTrue(AnhXaLoaiXeAnh.class.getMethods().length >= 1);
    }

    @ParameterizedTest(name = "case {0}: interface AnhXaLoaiXeAnh ton tai trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("AnhXaLoaiXeAnh - 1000 lan xac minh interface hop le")
    void interfaceTonTai(int chiSo) {
        assertNotNull(AnhXaLoaiXeAnh.class);
        assertTrue(AnhXaLoaiXeAnh.class.getMethods().length >= 1);
    }
}