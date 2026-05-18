package com.redbus.cauhinh;

import com.redbus.truyen.PhanHoiChung;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("XuLyLoiChung")
class XuLyLoiChungTest {

    private XuLyLoiChung xuLy;

    @BeforeEach
    void setUp() {
        xuLy = new XuLyLoiChung();
    }

    @Test
    @DisplayName("IllegalArgumentException trả HTTP 400 và thông điệp lỗi")
    void loiThamSo_tra400() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.loiThamSo(new IllegalArgumentException("Tham số sai"));
        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
        assertNotNull(res.getBody());
        assertFalse(res.getBody().isThanhCong());
        assertEquals("Tham số sai", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("IllegalStateException trả HTTP 409")
    void loiTrangThai_tra409() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.loiTrangThai(new IllegalStateException("Trùng trạng thái"));
        assertEquals(HttpStatus.CONFLICT, res.getStatusCode());
        assertEquals("Trùng trạng thái", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("BadCredentialsException trả HTTP 401 với thông báo đăng nhập cố định")
    void saiDangNhap_tra401() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.saiDangNhap(new BadCredentialsException("x"));
        assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
        assertEquals("Tài khoản hoặc mật khẩu không chính xác", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("MethodArgumentNotValidException ghép thông báo từng field")
    void khongHopLe_tra400VaGhepLoi() {
        var binding = new BeanPropertyBindingResult(new Object(), "target");
        binding.addError(new FieldError("target", "email", "Email không hợp lệ"));
        binding.addError(new FieldError("target", "matKhau", "Mật khẩu quá ngắn"));
        var ex = new MethodArgumentNotValidException(null, binding);
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.khongHopLe(ex);
        assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
        assertTrue(res.getBody().getThongDiep().contains("Email không hợp lệ"));
        assertTrue(res.getBody().getThongDiep().contains("Mật khẩu quá ngắn"));
    }

    @Test
    @DisplayName("Exception không có message trả tên class và HTTP 500")
    void chung_messageTrong_traTenClass() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.chung(new RuntimeException());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, res.getStatusCode());
        assertEquals("RuntimeException", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("Exception có message trả message và HTTP 500")
    void chung_coMessage_traMessage() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.chung(new RuntimeException("Lỗi DB"));
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, res.getStatusCode());
        assertEquals("Lỗi DB", res.getBody().getThongDiep());
    }

    @Test
    @DisplayName("Exception message chỉ khoảng trắng trả tên class")
    void chung_messageChiKhoangTrang_traTenClass() {
        ResponseEntity<PhanHoiChung<Void>> res = xuLy.chung(new RuntimeException("   "));
        assertEquals("RuntimeException", res.getBody().getThongDiep());
    }
}
