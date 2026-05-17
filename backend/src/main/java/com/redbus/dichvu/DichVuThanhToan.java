package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaHinhThucThanhToan;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaThanhToan;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.mohinh.HinhThucThanhToan;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.KhuyenMai;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.VeXe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuThanhToan {

    private final AnhXaThanhToan anhXaThanhToan;
    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaKhuyenMai anhXaKhuyenMai;
    private final AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;

    public List<GiaoDichThanhToan> lichSuCuaKhach(String tenDangNhap) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Không phải khách hàng");
        }
        return anhXaThanhToan.danhSachTheoMaKhach(kh.getMa());
    }

    @Transactional
    public GiaoDichThanhToan tienMatTaiQuay(String tenDangNhap, Long maVe, String maKhuyenMai) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Không phải khách hàng");
        }
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null || !ve.getMaKhach().equals(kh.getMa())) {
            throw new IllegalArgumentException("Vé không hợp lệ");
        }
        if ("PAID".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Đã thanh toán");
        }
        HinhThucThanhToan ht = anhXaHinhThucThanhToan.timTheoMaLoai("TIEN_MAT");
        if (ht == null) {
            throw new IllegalStateException("Chưa cấu hình hình thức thanh toán TIEN_MAT");
        }
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
            if (km.getSoLanToiDa() != null && km.getSoLanDaDung() != null
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
        LocalDateTime lucTt = LocalDateTime.now();
        VeXe capNhat = VeXe.builder()
                .ma(maVe)
                .maKhuyenMai(maKm)
                .maHinhThuc(ht.getMa())
                .soTienThanhToan(gia)
                .maDonPayOs(null)
                .thoiGianThanhToan(lucTt)
                .trangThai("PAID")
                .build();
        anhXaVeXe.capNhatThanhToan(capNhat);
        if (maKm != null) {
            anhXaKhuyenMai.tangSoLanDung(maKm);
        }
        return anhXaThanhToan.timTheoMa(maVe);
    }
}
