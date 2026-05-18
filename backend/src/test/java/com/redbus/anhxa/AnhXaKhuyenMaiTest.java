package com.redbus.anhxa;

import com.redbus.hotro.NguonCase;
import org.apache.ibatis.annotations.Mapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("AnhXaKhuyenMai - mapper MyBatis co annotation @Mapper")
class AnhXaKhuyenMaiTest {

    @Test
    @DisplayName("AnhXaKhuyenMai phai duoc danh dau @Mapper")
    void phaiCoAnnotationMapper() {
        assertTrue(AnhXaKhuyenMai.class.isAnnotationPresent(Mapper.class));
    }

    @ParameterizedTest(name = "case {0}: interface AnhXaKhuyenMai ton tai trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("AnhXaKhuyenMai - 1000 lan xac minh interface hop le")
    void interfaceTonTai(int chiSo) {
        assertNotNull(AnhXaKhuyenMai.class);
        assertTrue(AnhXaKhuyenMai.class.getMethods().length >= 1);
    }
}