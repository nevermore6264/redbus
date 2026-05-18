package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaMaOtp;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.MaOtp;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauDatLaiMatKhau;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuQuenMatKhau")
class DichVuQuenMatKhauTest {

    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaMaOtp anhXaMaOtp;
    @Mock private DichVuGuiMail dichVuGuiMail;
    @Mock private PasswordEncoder boMaHoaMatKhau;
    @InjectMocks private DichVuQuenMatKhau dichVu;

    @Test
    @DisplayName("guiOtp ném lỗi khi email chưa đăng ký")
    void guiOtp_emailKhongTonTai_nemLoi() {
        when(anhXaTaiKhoan.timTheoEmail("a@b.com")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.guiOtp("a@b.com"));
    }

    @Test
    @DisplayName("guiOtp tạo OTP và gửi mail")
    void guiOtp_thanhCong() {
        when(anhXaTaiKhoan.timTheoEmail("a@b.com")).thenReturn(TaiKhoan.builder().ma(1L).build());
        dichVu.guiOtp("  A@B.COM  ");
        verify(anhXaMaOtp).voHieuHoaCu(eq("a@b.com"), eq("RESET_PASSWORD"));
        verify(anhXaMaOtp).them(any(MaOtp.class));
        verify(dichVuGuiMail).guiOtpDatLaiMatKhau(eq("a@b.com"), anyString());
    }

    @Test
    @DisplayName("datLaiMatKhau từ chối OTP không hợp lệ")
    void datLaiMatKhau_otpSai_nemLoi() {
        when(anhXaMaOtp.timHopLe(eq("a@b.com"), eq("RESET_PASSWORD"), eq("000000"))).thenReturn(null);
        YeuCauDatLaiMatKhau yc = new YeuCauDatLaiMatKhau();
        yc.setEmail("a@b.com");
        yc.setMaOtp("000000");
        yc.setMatKhauMoi("newpass");
        assertThrows(IllegalArgumentException.class, () -> dichVu.datLaiMatKhau(yc));
    }
}
