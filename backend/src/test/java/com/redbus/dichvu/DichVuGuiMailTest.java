package com.redbus.dichvu;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuGuiMail")
class DichVuGuiMailTest {

    @Mock private JavaMailSender mailSender;
    @InjectMocks private DichVuGuiMail dichVu;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dichVu, "bat", true);
        ReflectionTestUtils.setField(dichVu, "tuDiaChi", "noreply@redbus.test");
        ReflectionTestUtils.setField(dichVu, "tenHienThi", "RedBus");
    }

    @Test
    @DisplayName("guiDatVeThanhCong bỏ qua khi email trống")
    void guiDatVe_emailTrong_khongGui() {
        dichVu.guiDatVeThanhCong("  ", 1L, "HN-SG", "10:00", "A1");
        verifyNoInteractions(mailSender);
    }

    @Test
    @DisplayName("guiDatVeThanhCong gọi mailSender khi cấu hình hợp lệ")
    void guiDatVe_hopLe_guiMail() {
        dichVu.guiDatVeThanhCong("a@b.com", 1L, "HN-SG", "10:00", "A1");
        verify(mailSender).send(any(org.springframework.mail.SimpleMailMessage.class));
    }

    @Test
    @DisplayName("guiThanhToanThanhCong không gửi khi tắt mail")
    void guiThanhToan_tatMail_khongGui() {
        ReflectionTestUtils.setField(dichVu, "bat", false);
        dichVu.guiThanhToanThanhCong("a@b.com", 1L, "t", "g", "A1", BigDecimal.TEN, "TM");
        verifyNoInteractions(mailSender);
    }
}
