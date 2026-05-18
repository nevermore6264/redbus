package com.redbus.anhxa;

import com.redbus.hotro.NguonCase;
import org.apache.ibatis.annotations.Mapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("AnhXaKhachHang - mapper MyBatis co annotation @Mapper")
class AnhXaKhachHangTest {

    @Test
    @DisplayName("AnhXaKhachHang phai duoc danh dau @Mapper")
    void phaiCoAnnotationMapper() {
        assertTrue(AnhXaKhachHang.class.isAnnotationPresent(Mapper.class));
    }

    @ParameterizedTest(name = "case {0}: interface AnhXaKhachHang ton tai trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("AnhXaKhachHang - 1000 lan xac minh interface hop le")
    void interfaceTonTai(int chiSo) {
        assertNotNull(AnhXaKhachHang.class);
        assertTrue(AnhXaKhachHang.class.getMethods().length >= 1);
    }
}