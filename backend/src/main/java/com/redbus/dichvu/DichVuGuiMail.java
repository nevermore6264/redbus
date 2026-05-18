package com.redbus.dichvu;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class DichVuGuiMail {

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:true}")
    private boolean bat;

    @Value("${app.mail.from:}")
    private String tuDiaChi;

    @Value("${app.mail.ten-hien-thi:RedBus}")
    private String tenHienThi;

    public void guiDatNhieuVeThanhCong(
            String email, String dsMaVe, String tuyen, String gioKhoiHanh, String dsMaGhe, int soVe) {
        String noiDung = """
                Xin chào,

                Bạn đã đặt %d vé thành công trên RedBus.

                Mã vé: %s
                Tuyến: %s
                Khởi hành: %s
                Ghế: %s

                Vui lòng thanh toán từng vé (hoặc từng nhóm) trong mục "Vé của tôi".

                Trân trọng,
                %s
                """.formatted(soVe, dsMaVe, tuyen, gioKhoiHanh, dsMaGhe, tenHienThi);
        gui(email, "RedBus — Đặt " + soVe + " vé thành công", noiDung);
    }

    public void guiDatVeThanhCong(String email, Long maVe, String tuyen, String gioKhoiHanh, String maGhe) {
        String noiDung = """
                Xin chào,

                Bạn đã đặt vé thành công trên RedBus.

                Mã vé: #%d
                Tuyến: %s
                Khởi hành: %s
                Ghế: %s

                Vui lòng thanh toán trong mục "Vé của tôi" để giữ chỗ.

                Trân trọng,
                %s
                """.formatted(maVe, tuyen, gioKhoiHanh, maGhe, tenHienThi);
        gui(email, "RedBus — Đặt vé thành công #" + maVe, noiDung);
    }

    public void guiThanhToanThanhCong(
            String email, Long maVe, String tuyen, String gioKhoiHanh, String maGhe, BigDecimal soTien, String phuongThuc) {
        String noiDung = """
                Xin chào,

                Thanh toán vé #%d đã được xác nhận.

                Tuyến: %s
                Khởi hành: %s
                Ghế: %s
                Số tiền: %s VNĐ
                Phương thức: %s

                Cảm ơn bạn đã sử dụng RedBus!

                Trân trọng,
                %s
                """.formatted(
                maVe,
                tuyen,
                gioKhoiHanh,
                maGhe,
                soTien != null ? soTien.toPlainString() : "—",
                phuongThuc,
                tenHienThi);
        gui(email, "RedBus — Thanh toán thành công vé #" + maVe, noiDung);
    }

    public void guiOtpDatLaiMatKhau(String email, String maOtp) {
        String noiDung =
                """
                Xin chào,

                Mã OTP đặt lại mật khẩu RedBus: %s
                Mã có hiệu lực 10 phút.

                Nếu bạn không yêu cầu, hãy bỏ qua email này.

                Trân trọng,
                %s
                """
                        .formatted(maOtp, tenHienThi);
        gui(email, "RedBus — Mã OTP đặt lại mật khẩu", noiDung);
    }

    private void gui(String den, String tieuDe, String noiDung) {
        if (!bat || den == null || den.isBlank()) {
            return;
        }
        if (tuDiaChi == null || tuDiaChi.isBlank()) {
            log.warn("Chưa cấu hình app.mail.from — bỏ qua gửi mail tới {}", den);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(tuDiaChi);
            msg.setTo(den.trim());
            msg.setSubject(tieuDe);
            msg.setText(noiDung);
            mailSender.send(msg);
            log.info("Đã gửi email tới {}", den);
        } catch (Exception e) {
            log.error("Gửi email thất bại tới {}: {}", den, e.getMessage());
        }
    }
}
