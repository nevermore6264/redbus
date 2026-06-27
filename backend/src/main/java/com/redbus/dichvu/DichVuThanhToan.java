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
import com.redbus.truyen.PhanHoiThanhToanGop;
import com.redbus.truyen.YeuCauThanhToanGop;
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
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DichVuThanhToan {

    private static final DateTimeFormatter FMT_GIO = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final int TOI_DA_VE_GOP = 10;

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
        PhanHoiThanhToanGop kq = tienMatGop(tenDangNhap, yeuCauGop(List.of(maVe), maKhuyenMai));
        return anhXaThanhToan.timTheoMa(kq.getDsMaVe().get(0));
    }

    @Transactional
    public PhanHoiThanhToanGop tienMatGop(String tenDangNhap, YeuCauThanhToanGop yeuCau) {
        KhachHang kh = layKhach(tenDangNhap);
        List<VeXe> ds = kiemTraDsVeChoThanhToan(yeuCau.getDsMaVe(), kh.getMa());
        HinhThucThanhToan ht = layHinhThuc("TIEN_MAT");
        BigDecimal tong = BigDecimal.ZERO;
        List<Long> maVeDaTt = new ArrayList<>();
        for (VeXe ve : ds) {
            KetQuaGia gia = tinhGia(ve, yeuCau.getMaKhuyenMai());
            hoanTatThanhToan(ve, ht, gia, null);
            tong = tong.add(gia.gia());
            maVeDaTt.add(ve.getMa());
            guiMailVaThongBao(tenDangNhap, ve.getMa(), "Tiền mặt");
        }
        if (ds.size() > 1) {
            TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
            if (tk != null) {
                dichVuThongBao.guiNhanh(
                        tk.getMa(),
                        "Thanh toán gộp thành công",
                        ds.size() + " vé đã thanh toán tiền mặt.");
            }
        }
        return PhanHoiThanhToanGop.builder().dsMaVe(maVeDaTt).tongTien(tong).build();
    }

    @Transactional
    public PhanHoiLinkPayOs taoLinkPayOs(String tenDangNhap, Long maVe, String maKhuyenMai) {
        return taoLinkPayOsGop(tenDangNhap, yeuCauGop(List.of(maVe), maKhuyenMai));
    }

    @Transactional
    public PhanHoiLinkPayOs taoLinkPayOsGop(String tenDangNhap, YeuCauThanhToanGop yeuCau) {
        if (payOS == null) {
            throw new IllegalStateException("Chưa cấu hình PayOS (app.payos.client-id)");
        }
        KhachHang kh = layKhach(tenDangNhap);
        List<VeXe> ds = kiemTraDsVeChoThanhToan(yeuCau.getDsMaVe(), kh.getMa());
        long orderCode = taoMaDonPayOsGop();
        String maDon = String.valueOf(orderCode);
        BigDecimal tong = BigDecimal.ZERO;
        List<Long> maVeList = new ArrayList<>();

        for (VeXe ve : ds) {
            KetQuaGia gia = tinhGia(ve, yeuCau.getMaKhuyenMai());
            tong = tong.add(gia.gia());
            maVeList.add(ve.getMa());
            anhXaVeXe.capNhatTamPayOs(ve.getMa(), maDon, gia.maKhuyenMai(), gia.gia());
        }

        String moTa = moTaDonPayOs(ds.size());
        CreatePaymentLinkRequest yeuCauPay =
                CreatePaymentLinkRequest.builder()
                        .orderCode(orderCode)
                        .amount(tong.longValue())
                        .description(moTa)
                        .returnUrl(returnUrl + "?orderCode=" + orderCode)
                        .cancelUrl(cancelUrl)
                        .build();

        try {
            CreatePaymentLinkResponse phanHoi = payOS.paymentRequests().create(yeuCauPay);
            return PhanHoiLinkPayOs.builder()
                    .checkoutUrl(phanHoi.getCheckoutUrl())
                    .orderCode(orderCode)
                    .maVe(maVeList.get(0))
                    .dsMaVe(maVeList)
                    .soTien(tong)
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
            List<VeXe> ds = anhXaVeXe.danhSachTheoMaDonPayOs(maDon);
            if (ds.isEmpty()) {
                VeXe don = anhXaVeXe.timTheoMaDonPayOs(maDon);
                if (don != null) {
                    ds = List.of(don);
                }
            }
            if (ds.isEmpty()) {
                return;
            }
            hoanTatDonPayOs(maDon, null);
        } catch (PayOSException e) {
            log.error("Webhook PayOS không hợp lệ: {}", e.getMessage());
            throw new IllegalArgumentException("Webhook PayOS không hợp lệ");
        }
    }

    @Transactional
    public KetQuaThanhToanPayOs traCuuKetQua(String tenDangNhap, Long orderCode) {
        KhachHang kh = layKhach(tenDangNhap);
        String maDon = String.valueOf(orderCode);
        List<VeXe> ds = layVeTheoDonPayOs(maDon, kh.getMa());
        String trangThaiPayOs = null;
        if (ds.stream().anyMatch(v -> !"PAID".equals(v.getTrangThai()))) {
            trangThaiPayOs = dongBoDonPayOs(orderCode, tenDangNhap);
            ds = layVeTheoDonPayOs(maDon, kh.getMa());
        }
        long soDaTt = ds.stream().filter(v -> "PAID".equals(v.getTrangThai())).count();
        boolean tatCaPaid = soDaTt == ds.size() && !ds.isEmpty();
        List<Long> maVeList = ds.stream().map(VeXe::getMa).collect(Collectors.toList());
        VeXe veDau = ds.get(0);
        return KetQuaThanhToanPayOs.builder()
                .orderCode(orderCode)
                .maVe(veDau.getMa())
                .dsMaVe(maVeList)
                .soVe(ds.size())
                .soVeDaThanhToan((int) soDaTt)
                .trangThaiVe(veDau.getTrangThai())
                .daThanhToan(tatCaPaid)
                .trangThaiPayOs(trangThaiPayOs)
                .build();
    }

    private List<VeXe> layVeTheoDonPayOs(String maDon, Long maKhach) {
        List<VeXe> ds = anhXaVeXe.danhSachTheoMaDonPayOs(maDon);
        if (ds.isEmpty()) {
            VeXe don = anhXaVeXe.timTheoMaDonPayOs(maDon);
            if (don != null) {
                ds = List.of(don);
            }
        }
        if (ds.isEmpty() || ds.stream().anyMatch(v -> !v.getMaKhach().equals(maKhach))) {
            throw new IllegalArgumentException("Không tìm thấy giao dịch");
        }
        return ds;
    }

    private String dongBoDonPayOs(Long orderCode, String tenDangNhap) {
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
                hoanTatDonPayOs(String.valueOf(orderCode), tenDangNhap);
            }
            return status.getValue();
        } catch (PayOSException e) {
            log.warn("Không đồng bộ được PayOS orderCode={}: {}", orderCode, e.getMessage());
            return null;
        }
    }
    private void hoanTatDonPayOs(String maDon, String tenDangNhap) {
        List<VeXe> ds = anhXaVeXe.danhSachTheoMaDonPayOs(maDon);
        if (ds.isEmpty()) {
            VeXe don = anhXaVeXe.timTheoMaDonPayOs(maDon);
            if (don != null) {
                ds = List.of(don);
            }
        }
        HinhThucThanhToan ht = layHinhThuc("CHUYEN_KHOAN");
        int dem = 0;
        for (VeXe ve : ds) {
            if ("PAID".equals(ve.getTrangThai())) {
                continue;
            }
            KetQuaGia gia = giaTuVeTam(ve);
            hoanTatThanhToan(ve, ht, gia, maDon);
            dem++;
            if (tenDangNhap != null) {
                guiMailVaThongBao(tenDangNhap, ve.getMa(), "PayOS / Chuyển khoản");
                continue;
            }
            KhachHang kh = anhXaKhachHang.timTheoMa(ve.getMaKhach());
            if (kh != null) {
                TaiKhoan tk = anhXaTaiKhoan.timTheoMa(kh.getMaTaiKhoan());
                if (tk != null) {
                    guiMailVaThongBao(tk.getTenDangNhap(), ve.getMa(), "PayOS / Chuyển khoản");
                }
            }
        }
        if (dem > 1 && tenDangNhap != null) {
            TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
            if (tk != null) {
                dichVuThongBao.guiNhanh(
                        tk.getMa(),
                        "Thanh toán gộp thành công",
                        dem + " vé đã thanh toán qua PayOS.");
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

    private List<VeXe> kiemTraDsVeChoThanhToan(List<Long> dsMaVe, Long maKhach) {
        if (dsMaVe == null || dsMaVe.isEmpty()) {
            throw new IllegalArgumentException("Chọn ít nhất một vé");
        }
        LinkedHashSet<Long> unique = new LinkedHashSet<>(dsMaVe);
        if (unique.size() > TOI_DA_VE_GOP) {
            throw new IllegalArgumentException("Tối đa " + TOI_DA_VE_GOP + " vé mỗi lần thanh toán gộp");
        }
        dichVuHetHanVe.xuLyHetHanChoKhach(maKhach);
        List<VeXe> ketQua = new ArrayList<>();
        for (Long maVe : unique) {
            VeXe ve = anhXaVeXe.timTheoMa(maVe);
            if (ve == null || !ve.getMaKhach().equals(maKhach)) {
                throw new IllegalArgumentException("Vé #" + maVe + " không hợp lệ");
            }
            if ("PAID".equals(ve.getTrangThai())) {
                throw new IllegalStateException("Vé #" + maVe + " đã thanh toán");
            }
            dichVuHetHanVe.damBaoChuaHetHan(ve);
            ketQua.add(anhXaVeXe.timTheoMa(maVe));
        }
        return ketQua;
    }

    private static YeuCauThanhToanGop yeuCauGop(List<Long> dsMaVe, String maKhuyenMai) {
        YeuCauThanhToanGop yc = new YeuCauThanhToanGop();
        yc.setDsMaVe(dsMaVe);
        yc.setMaKhuyenMai(maKhuyenMai);
        return yc;
    }

    private static String moTaDonPayOs(int soVe) {
        String moTa = soVe > 1 ? "Gop " + soVe + " ve RedBus" : "Ve RedBus";
        return moTa.length() > 25 ? moTa.substring(0, 25) : moTa;
    }

    private long taoMaDonPayOsGop() {
        return System.currentTimeMillis() % 900_000_000_000L + 1_000_000L;
    }

    private record KetQuaGia(BigDecimal gia, Long maKhuyenMai) {}
}
