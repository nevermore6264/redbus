package com.redbus.cauhinh;

import com.redbus.hotro.NguonCase;
import com.redbus.truyen.PhanHoiChung;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("XuLyLoiChung — xử lý exception trả PhanHoiChung HTTP")
class XuLyLoiChungTest {

    private XuLyLoiChung xuLy;

    @BeforeEach
    void setUp() {
        xuLy = new XuLyLoiChung();
    }

    @Test
    @DisplayName("IllegalArgumentException → 400 BAD_REQUEST và thông điệp lỗi")
    void loiThamSo_tra400() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.loiThamSo(new IllegalArgumentException("Tham số sai"));
        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
        assertNotNull(res.getBody());
        assertFalse(res.getBody().isThanhCong());
        assertEquals("Tham số sai", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("IllegalStateException → 409 CONFLICT")
    void loiTrangThai_tra409() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.loiTrangThai(new IllegalStateException("Trùng trạng thái"));
        assertEquals(HttpStatus.CONFLICT, res.getStatusCode());
        assertEquals("Trùng trạng thái", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("BadCredentialsException → 401 và thông báo đăng nhập cố định")
    void saiDangNhap_tra401() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.saiDangNhap(new BadCredentialsException("x"));
        assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
        assertEquals("Tài khoản hoặc mật khẩu không chính xác", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("MethodArgumentNotValidException → 400 và nối thông báo field")
    void khongHopLe_tra400VaGhepLoi() {
        var target = new Object();
        var binding = new BeanPropertyBindingResult(target, "target");
        binding.addError(new FieldError("target", "email", "Email không hợp lệ"));
        binding.addError(new FieldError("target", "matKhau", "Mật khẩu quá ngắn"));
        var ex = new MethodArgumentNotValidException(null, binding);
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.khongHopLe(ex);
        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
        assertTrue(res.getBody().getThongDiep().contains("Email không hợp lệ"));
        assertTrue(res.getBody().getThongDiep().contains("Mật khẩu quá ngắn"));
    }

    @Test
    @DisplayName("Exception message null/blank → 500 và dùng tên class")
    void chung_messageTrong_traTenClass() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.chung(new RuntimeException());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, res.getStatusCode());
        assertEquals("RuntimeException", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("Exception có message → 500 và trả message")
    void chung_coMessage_traMessage() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.chung(new RuntimeException("Lỗi DB"));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, res.getStatusCode());
        assertEquals("Lỗi DB", res.getBody().getThongDiep());
    }

    @ParameterizedTest(name = "case {0}: IllegalArgumentException với thông điệp #{0}")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: loiThamSo với thông điệp khác nhau")
    void loiThamSo1000Case(int chiSo) {
        String msg = "loi-tham-so-" + chiSo;
        var res = xuLy.loiThamSo(new IllegalArgumentException(msg));
        assertEquals(msg, res.getBody().getThongDiep());
        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
    }

    @ParameterizedTest(name = "case {0}: chung() với message hoặc blank")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: chung() nhánh message / blank / có nội dung")
    void chung1000Case(int chiSo) {
        Exception ex = chiSo % 3 == 0
                ? new Exception()
                : chiSo % 3 == 1
                ? new Exception("   ")
                : new Exception("he-thong-" + chiSo);
        var res = xuLy.chung(ex);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, res.getStatusCode());
        assertNotNull(res.getBody().getThongDiep());
    }
}
