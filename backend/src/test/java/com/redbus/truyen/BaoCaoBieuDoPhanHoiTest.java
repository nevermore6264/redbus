package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("BaoCaoBieuDoPhanHoi")
class BaoCaoBieuDoPhanHoiTest {
    @Test
    @DisplayName("builder gán trường doanhThuTheoNgay")
    void builder_doanhThuTheoNgay() {
        BaoCaoBieuDoPhanHoi o = BaoCaoBieuDoPhanHoi.builder().doanhThuTheoNgay(java.util.List.of()).build();
        assertEquals(java.util.List.of(), o.getDoanhThuTheoNgay());
    }
    @Test
    @DisplayName("setter cập nhật trường doanhThuTheoNgay")
    void setter_doanhThuTheoNgay() {
        BaoCaoBieuDoPhanHoi o = new BaoCaoBieuDoPhanHoi();
        o.setDoanhThuTheoNgay(java.util.List.of());
        assertEquals(java.util.List.of(), o.getDoanhThuTheoNgay());
    }
}
