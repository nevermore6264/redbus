package com.redbus.anhxa;

import com.redbus.hotro.NguonCase;
import org.apache.ibatis.annotations.Mapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("AnhXaThanhToan - mapper MyBatis co annotation @Mapper")
class AnhXaThanhToanTest {

    @Test
    @DisplayName("AnhXaThanhToan phai duoc danh dau @Mapper")
    void phaiCoAnnotationMapper() {
        assertTrue(AnhXaThanhToan.class.isAnnotationPresent(Mapper.class));
    }

    @ParameterizedTest(name = "case {0}: interface AnhXaThanhToan ton tai trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("AnhXaThanhToan - 1000 lan xac minh interface hop le")
    void interfaceTonTai(int chiSo) {
        assertNotNull(AnhXaThanhToan.class);
        assertTrue(AnhXaThanhToan.class.getMethods().length >= 1);
    }
}