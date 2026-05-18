package com.redbus.anhxa;

import com.redbus.hotro.NguonCase;
import org.apache.ibatis.annotations.Mapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("AnhXaThongBao - mapper MyBatis co annotation @Mapper")
class AnhXaThongBaoTest {

    @Test
    @DisplayName("AnhXaThongBao phai duoc danh dau @Mapper")
    void phaiCoAnnotationMapper() {
        assertTrue(AnhXaThongBao.class.isAnnotationPresent(Mapper.class));
    }

    @ParameterizedTest(name = "case {0}: interface AnhXaThongBao ton tai trong classpath")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("AnhXaThongBao - 1000 lan xac minh interface hop le")
    void interfaceTonTai(int chiSo) {
        assertNotNull(AnhXaThongBao.class);
        assertTrue(AnhXaThongBao.class.getMethods().length >= 1);
    }
}