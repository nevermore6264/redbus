package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PhanHoiChung")
class PhanHoiChungTest {

    @Test
    @DisplayName("ok(T) trả về thành công với thông điệp mặc định OK")
    void okVoiDuLieu_traVeThanhCong() {
        PhanHoiChung<String> p = PhanHoiChung.ok("du-lieu");
        assertTrue(p.isThanhCong());
        assertEquals("OK", p.getThongDiep());
        assertEquals("du-lieu", p.getDuLieu());
    }

    @Test
    @DisplayName("ok(thongDiep, T) trả về thông điệp tùy chỉnh")
    void okVoiThongDiepTuyChinh_traVeThongDiep() {
        PhanHoiChung<Integer> p = PhanHoiChung.ok("Đã lưu", 42);
        assertTrue(p.isThanhCong());
        assertEquals("Đã lưu", p.getThongDiep());
        assertEquals(42, p.getDuLieu());
    }

    @Test
    @DisplayName("loi(thongDiep) trả về thất bại và duLieu null")
    void loi_traVeThatBai() {
        PhanHoiChung<Void> p = PhanHoiChung.loi("Lỗi xác thực");
        assertFalse(p.isThanhCong());
        assertEquals("Lỗi xác thực", p.getThongDiep());
        assertNull(p.getDuLieu());
    }

    @Test
    @DisplayName("builder gán đủ các trường")
    void builder_ganDuTruong() {
        PhanHoiChung<Long> p = PhanHoiChung.<Long>builder()
                .thanhCong(true)
                .thongDiep("msg")
                .duLieu(99L)
                .build();
        assertTrue(p.isThanhCong());
        assertEquals("msg", p.getThongDiep());
        assertEquals(99L, p.getDuLieu());
    }
}
