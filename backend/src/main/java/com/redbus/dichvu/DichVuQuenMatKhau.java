package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaMaOtp;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.MaOtp;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauDatLaiMatKhau;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DichVuQuenMatKhau {

    private static final String LOAI = "RESET_PASSWORD";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaMaOtp anhXaMaOtp;
    private final DichVuGuiMail dichVuGuiMail;
    private final PasswordEncoder boMaHoaMatKhau;

    @Transactional
    public void guiOtp(String email) {
        String e = email.trim().toLowerCase();
        TaiKhoan tk = anhXaTaiKhoan.timTheoEmail(e);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy email đăng ký");
        }
        anhXaMaOtp.voHieuHoaCu(e, LOAI);
        String ma = String.format("%06d", RANDOM.nextInt(1_000_000));
        MaOtp otp =
                MaOtp.builder()
                        .email(e)
                        .maOtp(ma)
                        .loai(LOAI)
                        .hetHanLuc(LocalDateTime.now().plusMinutes(10))
                        .daDung(false)
                        .build();
        anhXaMaOtp.them(otp);
        dichVuGuiMail.guiOtpDatLaiMatKhau(e, ma);
    }

    @Transactional
    public void datLaiMatKhau(YeuCauDatLaiMatKhau yeuCau) {
        String e = yeuCau.getEmail().trim().toLowerCase();
        MaOtp hopLe = anhXaMaOtp.timHopLe(e, LOAI, yeuCau.getMaOtp().trim());
        if (hopLe == null) {
            throw new IllegalArgumentException("Mã OTP không hợp lệ hoặc đã hết hạn");
        }
        TaiKhoan tk = anhXaTaiKhoan.timTheoEmail(e);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        anhXaMaOtp.danhDauDaDung(hopLe.getMa());
        anhXaTaiKhoan.capNhatMatKhau(tk.getMa(), boMaHoaMatKhau.encode(yeuCau.getMatKhauMoi()));
    }
}
