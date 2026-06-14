package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.anhxa.AnhXaHinhThucThanhToan;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaThanhToan;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.GheNgoi;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.mohinh.HinhThucThanhToan;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.KhuyenMai;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.TuyenDuong;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.KetQuaThanhToanPayOs;
import com.redbus.truyen.PhanHoiLinkPayOs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.exception.PayOSException;
import vn.payos.model.webhooks.WebhookData;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.v2.paymentRequests.PaymentLinkStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DichVuThanhToan {

    private static final DateTimeFormatter FMT_GIO = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final AnhXaThanhToan anhXaThanhToan;
    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaKhuyenMai anhXaKhuyenMai;
    private final AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;
    private final AnhXaTuyenDuong anhXaTuyenDuong;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final DichVuGuiMail dichVuGuiMail;
    private final DichVuThongBao dichVuThongBao;
    private final DichVuHetHanVe dichVuHetHanVe;

    @Autowired(required = false)
    private PayOS payOS;

    @Value("${app.payos.return-url:http://localhost:5173/thanh-toan/ket-qua}")
    private String returnUrl;

    @Value("${app.payos.cancel-url:http://localhost:5173/ve-cua-toi}")
    private String cancelUrl;

    public List<GiaoDichThanhToan> lichSuCuaKhach(String tenDangNhap) {
        KhachHang kh = layKhach(tenDangNhap);
        return anhXaThanhToan.danhSachTheoMaKhach(kh.getMa());
    }

    @Transactional
    public GiaoDichThanhToan tienMatTaiQuay(String tenDangNhap, Long maVe, String maKhuyenMai) {
        KhachHang kh = layKhach(tenDangNhap);
        VeXe ve = kiemTraVeChoThanhToan(maVe, kh.getMa());
        HinhThucThanhToan ht = layHinhThuc("TIEN_MAT");
        KetQuaGia gia = tinhGia(ve, maKhuyenMai);
        hoanTatThanhToan(ve, ht, gia, null);
        guiMailVaThongBao(tenDangNhap, ve.getMa(), "Tiền mặt");
        return anhXaThanhToan.timTheoMa(maVe);
    }

    @Transactional
    public PhanHoiLinkPayOs taoLinkPayOs(String tenDangNhap, Long maVe, String maKhuyenMai) {
        if (payOS == null) {
            throw new IllegalStateException("Chưa cấu hình PayOS (app.payos.client-id)");
        }
        KhachHang kh = layKhach(tenDangNhap);
        VeXe ve = kiemTraVeChoThanhToan(maVe, kh.getMa());
        KetQuaGia gia = tinhGia(ve, maKhuyenMai);
        long orderCode = taoMaDonPayOs(maVe);
        String moTa = ("Ve " + maVe).length() > 25 ? ("Ve " + maVe).substring(0, 25) : ("Ve " + maVe);

        CreatePaymentLinkRequest yeuCau =
                CreatePaymentLinkRequest.builder()
                        .orderCode(orderCode)
                        .amount(gia.gia.longValue())
                        .description(moTa)
                        .returnUrl(returnUrl + "?orderCode=" + orderCode)
                        .cancelUrl(cancelUrl)
                        .build();

        try {
            CreatePaymentLinkResponse phanHoi = payOS.paymentRequests().create(yeuCau);
            anhXaVeXe.capNhatTamPayOs(maVe, String.valueOf(orderCode), gia.maKhuyenMai(), gia.gia());
            return PhanHoiLinkPayOs.builder()
                    .checkoutUrl(phanHoi.getCheckoutUrl())
                    .orderCode(orderCode)
                    .maVe(maVe)
                    .soTien(gia.gia)
                    .build();
        } catch (PayOSException e) {
            log.error("PayOS tạo link thất bại: {}", e.getMessage());
            throw new IllegalStateException("Không tạo được link PayOS: " + e.getMessage());
        }
    }

    @Transactional
    public void xuLyWebhookPayOs(String body) {
        if (payOS == null) {
            throw new IllegalStateException("Chưa cấu hình PayOS");
        }
        try {
            WebhookData data = payOS.webhooks().verify(body);
            if (data == null || data.getOrderCode() == null) {
                return;
            }
            String maDon = String.valueOf(data.getOrderCode());
            VeXe ve = anhXaVeXe.timTheoMaDonPayOs(maDon);
            if (ve == null) {
                return;
            }
            hoanTatTuPayOs(maDon, ve, null);
        } catch (PayOSException e) {
            log.error("Webhook PayOS không hợp lệ: {}", e.getMessage());
            throw new IllegalArgumentException("Webhook PayOS không hợp lệ");
        }
    }

    @Transactional
    public KetQuaThanhToanPayOs traCuuKetQua(String tenDangNhap, Long orderCode) {
        KhachHang kh = layKhach(tenDangNhap);
        VeXe ve = anhXaVeXe.timTheoMaDonPayOs(String.valueOf(orderCode));
        if (ve == null || !ve.getMaKhach().equals(kh.getMa())) {
            throw new IllegalArgumentException("Không tìm thấy giao dịch");
        }
        String trangThaiPayOs = null;
        if (!"PAID".equals(ve.getTrangThai())) {
            trangThaiPayOs = dongBoTuPayOs(orderCode, ve, tenDangNhap);
            ve = anhXaVeXe.timTheoMa(ve.getMa());
        }
        return KetQuaThanhToanPayOs.builder()
                .orderCode(orderCode)
                .maVe(ve.getMa())
                .trangThaiVe(ve.getTrangThai())
                .daThanhToan("PAID".equals(ve.getTrangThai()))
                .trangThaiPayOs(trangThaiPayOs)
                .build();
    }

    private String dongBoTuPayOs(Long orderCode, VeXe ve, String tenDangNhap) {
        if (payOS == null) {
            log.debug("Bỏ qua đồng bộ PayOS: chưa cấu hình client");
            return null;
        }
        try {
            PaymentLink link = payOS.paymentRequests().get(orderCode);
            if (link == null || link.getStatus() == null) {
                return null;
            }
            PaymentLinkStatus status = link.getStatus();
            if (status == PaymentLinkStatus.PAID) {
                hoanTatTuPayOs(String.valueOf(orderCode), ve, tenDangNhap);
            }
            return status.getValue();
        } catch (PayOSException e) {
            log.warn("Không đồng bộ được PayOS orderCode={}: {}", orderCode, e.getMessage());
            return null;
        }
    }

    private void hoanTatTuPayOs(String maDon, VeXe ve, String tenDangNhap) {
        if (ve == null || "PAID".equals(ve.getTrangThai())) {
            return;
        }
        HinhThucThanhToan ht = layHinhThuc("CHUYEN_KHOAN");
        KetQuaGia gia = giaTuVeTam(ve);
        hoanTatThanhToan(ve, ht, gia, maDon);
        if (tenDangNhap != null) {
            guiMailVaThongBao(tenDangNhap, ve.getMa(), "PayOS / Chuyển khoản");
            return;
        }
        KhachHang kh = anhXaKhachHang.timTheoMa(ve.getMaKhach());
        if (kh != null) {
            TaiKhoan tk = anhXaTaiKhoan.timTheoMa(kh.getMaTaiKhoan());
            if (tk != null) {
                guiMailVaThongBao(tk.getTenDangNhap(), ve.getMa(), "PayOS / Chuyển khoản");
            }
        }
    }

    private void hoanTatThanhToan(VeXe ve, HinhThucThanhToan ht, KetQuaGia gia, String maDonPayOs) {
        LocalDateTime lucTt = LocalDateTime.now();
        VeXe capNhat =
                VeXe.builder()
                        .ma(ve.getMa())
                        .maKhuyenMai(gia.maKhuyenMai)
                        .maHinhThuc(ht.getMa())
                        .soTienThanhToan(gia.gia)
                        .maDonPayOs(maDonPayOs)
                        .thoiGianThanhToan(lucTt)
                        .trangThai("PAID")
                        .build();
        anhXaVeXe.capNhatThanhToan(capNhat);
        if (gia.maKhuyenMai != null) {
            anhXaKhuyenMai.tangSoLanDung(gia.maKhuyenMai);
        }
    }

    private void guiMailVaThongBao(String tenDangNhap, Long maVe, String phuongThuc) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            return;
        }
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null) {
            return;
        }
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        TuyenDuong tuyen = cx != null ? anhXaTuyenDuong.timTheoMa(cx.getMaTuyen()) : null;
        GheNgoi ghe = anhXaGheNgoi.timTheoMa(ve.getMaGhe());
        String tenTuyen =
                tuyen != null ? tuyen.getDiemDi() + " → " + tuyen.getDiemDen() : "Chuyến #" + ve.getMaChuyen();
        String gio = cx != null ? cx.getThoiDiemKhoiHanh().format(FMT_GIO) : "—";
        String maGhe = ghe != null ? ghe.getMaGhe() : String.valueOf(ve.getMaGhe());
        dichVuGuiMail.guiThanhToanThanhCong(
                tk.getEmail(), maVe, tenTuyen, gio, maGhe, ve.getSoTienThanhToan(), phuongThuc);
        dichVuThongBao.guiNhanh(tk.getMa(), "Thanh toán thành công", "Vé #" + maVe + " đã được thanh toán qua " + phuongThuc + ".");
    }

    private KhachHang layKhach(String tenDangNhap) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Không phải khách hàng");
        }
        return kh;
    }

    private VeXe kiemTraVeChoThanhToan(Long maVe, Long maKhach) {
        dichVuHetHanVe.xuLyHetHanChoKhach(maKhach);
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null || !ve.getMaKhach().equals(maKhach)) {
            throw new IllegalArgumentException("Vé không hợp lệ");
        }
        if ("PAID".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Đã thanh toán");
        }
        dichVuHetHanVe.damBaoChuaHetHan(ve);
        return anhXaVeXe.timTheoMa(maVe);
    }

    private HinhThucThanhToan layHinhThuc(String maLoai) {
        HinhThucThanhToan ht = anhXaHinhThucThanhToan.timTheoMaLoai(maLoai);
        if (ht == null) {
            throw new IllegalStateException("Chưa cấu hình hình thức thanh toán " + maLoai);
        }
        return ht;
    }

    private KetQuaGia tinhGia(VeXe ve, String maKhuyenMai) {
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        BigDecimal gia = cx.getGiaVe();
        Long maKm = null;
        if (maKhuyenMai != null && !maKhuyenMai.isBlank()) {
            KhuyenMai km = anhXaKhuyenMai.timTheoMaCode(maKhuyenMai.trim(), null);
            if (km == null || !Boolean.TRUE.equals(km.getHoatDong())) {
                throw new IllegalArgumentException("Mã khuyến mãi không hợp lệ");
            }
            LocalDateTime luc = LocalDateTime.now();
            if (luc.isBefore(km.getNgayBatDau()) || luc.isAfter(km.getNgayKetThuc())) {
                throw new IllegalStateException("Mã khuyến mãi hết hạn hoặc chưa hiệu lực");
            }
            if (km.getSoLanToiDa() != null
                    && km.getSoLanDaDung() != null
                    && km.getSoLanDaDung() >= km.getSoLanToiDa()) {
                throw new IllegalStateException("Mã khuyến mãi đã hết lượt dùng");
            }
            BigDecimal pct = km.getPhanTramGiam() != null ? km.getPhanTramGiam() : BigDecimal.ZERO;
            BigDecimal giam = gia.multiply(pct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (km.getSoTienGiamToiDa() != null && giam.compareTo(km.getSoTienGiamToiDa()) > 0) {
                giam = km.getSoTienGiamToiDa();
            }
            gia = gia.subtract(giam);
            if (gia.compareTo(BigDecimal.ZERO) < 0) {
                gia = BigDecimal.ZERO;
            }
            maKm = km.getMa();
        }
        return new KetQuaGia(gia, maKm);
    }

    private KetQuaGia giaTuVeTam(VeXe ve) {
        if (ve.getSoTienThanhToan() != null && ve.getSoTienThanhToan().compareTo(BigDecimal.ZERO) > 0) {
            return new KetQuaGia(ve.getSoTienThanhToan(), ve.getMaKhuyenMai());
        }
        return tinhGia(ve, null);
    }

    private long taoMaDonPayOs(Long maVe) {
        return maVe * 1_000_000L + (System.currentTimeMillis() % 1_000_000L);
    }

    private record KetQuaGia(BigDecimal gia, Long maKhuyenMai) {}
}
