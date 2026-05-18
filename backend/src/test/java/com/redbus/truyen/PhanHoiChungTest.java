package com.redbus.truyen;

import com.redbus.hotro.NguonCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PhanHoiChung — factory ok/loi và dữ liệu phản hồi API")
class PhanHoiChungTest {

    @Test
    @DisplayName("ok(T) trả về thanhCong=true, thongDiep=OK và duLieu đúng")
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
    @DisplayName("loi(thongDiep) trả về thanhCong=false và duLieu null")
    void loi_traVeThatBai() {
        PhanHoiChung<Void> p = PhanHoiChung.loi("Lỗi xác thực");
        assertFalse(p.isThanhCong());
        assertEquals("Lỗi xác thực", p.getThongDiep());
        assertNull(p.getDuLieu());
    }

    @ParameterizedTest(name = "case {0}: ok với chuỗi dữ liệu độ dài theo chỉ số {0}")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: ok(String) với payload khác nhau")
    void ok1000BienTheChuoi(int chiSo) {
        String dl = NguonCase.chuoiTheoChiSo(chiSo);
        PhanHoiChung<String> p = PhanHoiChung.ok(dl);
        assertEquals(dl, p.getDuLieu());
        assertTrue(p.isThanhCong());
    }

    @ParameterizedTest(name = "case {0}: loi với thông điệp «{1}»")
    @MethodSource("com.redbus.hotro.NguonCase#chiSoVaChuoiMau")
    @DisplayName("1000 case: loi với thông điệp khác nhau")
    void loi1000BienThe(int chiSo, String thongDiep) {
        PhanHoiChung<Object> p = PhanHoiChung.loi(thongDiep + "-" + chiSo);
        assertFalse(p.isThanhCong());
        assertTrue(p.getThongDiep().contains(String.valueOf(chiSo)));
    }

    @ParameterizedTest(name = "case {0}: builder Lombok gán đủ trường")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: builder/setter round-trip")
    void builderRoundTrip(int chiSo) {
        PhanHoiChung<Long> p = PhanHoiChung.<Long>builder()
                .thanhCong(chiSo % 2 == 0)
                .thongDiep("msg-" + chiSo)
                .duLieu((long) chiSo)
                .build();
        assertEquals(chiSo % 2 == 0, p.isThanhCong());
        assertEquals((long) chiSo, p.getDuLieu());
    }
}
