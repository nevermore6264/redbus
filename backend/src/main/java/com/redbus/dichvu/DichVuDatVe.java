package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.GheNgoi;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.YeuCauDatVe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuDatVe {

    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final AnhXaVeXe anhXaVeXe;
    private final DichVuThongBao dichVuThongBao;

    public List<VeXe> veCuaTaiKhoan(String tenDangNhap) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Chưa có hồ sơ khách hàng");
        }
        return anhXaVeXe.timTheoMaKhach(kh.getMa());
    }

    @Transactional
    public VeXe datVe(String tenDangNhap, YeuCauDatVe yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Chưa có hồ sơ khách hàng");
        }
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(yeuCau.getMaChuyen());
        if (cx == null) {
            throw new IllegalArgumentException("Không có chuyến xe");
        }
        GheNgoi ghe = anhXaGheNgoi.timTheoMa(yeuCau.getMaGhe());
        if (ghe == null || !ghe.getMaXe().equals(cx.getMaXe())) {
            throw new IllegalArgumentException("Ghế không hợp lệ cho chuyến này");
        }
        if ("BLOCKED".equalsIgnoreCase(ghe.getTrangThai())) {
            throw new IllegalStateException("Ghế đang bị khóa");
        }
        for (VeXe v : anhXaVeXe.timTheoMaChuyen(cx.getMa())) {
            if (v.getMaGhe().equals(ghe.getMa()) && !"CANCELLED".equals(v.getTrangThai())) {
                throw new IllegalStateException("Ghế đã được giữ");
            }
        }
        VeXe ve = VeXe.builder()
                .maChuyen(cx.getMa())
                .maKhach(kh.getMa())
                .maGhe(ghe.getMa())
                .trangThai("PENDING")
                .build();
        anhXaVeXe.them(ve);
        VeXe luu = anhXaVeXe.timTheoMa(ve.getMa());
        dichVuThongBao.guiNhanh(
                tk.getMa(),
                "Đặt vé thành công",
                "Bạn đã giữ vé số " + luu.getMa() + " cho chuyến " + cx.getMa() + ".");
        return luu;
    }

    @Transactional
    public void huyVe(String tenDangNhap, Long maVe) {
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null) {
            throw new IllegalArgumentException("Không có vé");
        }
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null || !ve.getMaKhach().equals(kh.getMa())) {
            throw new IllegalStateException("Không phải vé của bạn");
        }
        if ("PAID".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé đã thanh toán — liên hệ hoàn tiền");
        }
        anhXaVeXe.capNhatTrangThai(maVe, "CANCELLED");
    }
}
