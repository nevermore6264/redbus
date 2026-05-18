package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.DiemDungChan;
import com.redbus.tienich.TienIchMaVe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.GheNgoi;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.TuyenDuong;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.YeuCauDatVe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuDatVe {

    private static final int TOI_DA_GHE_MOI_LAN = 10;

    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaTuyenDuong anhXaTuyenDuong;
    private final DichVuThongBao dichVuThongBao;
    private final DichVuGuiMail dichVuGuiMail;
    private final DichVuHetHanVe dichVuHetHanVe;
    private final AnhXaDiemDungChan anhXaDiemDungChan;

    private static final DateTimeFormatter FMT_GIO = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public List<VeXe> veCuaTaiKhoan(String tenDangNhap) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Chưa có hồ sơ khách hàng");
        }
        dichVuHetHanVe.xuLyHetHanChoKhach(kh.getMa());
        return anhXaVeXe.timTheoMaKhach(kh.getMa());
    }

    @Transactional
    public List<VeXe> datVe(String tenDangNhap, YeuCauDatVe yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Chưa có hồ sơ khách hàng");
        }

        List<Long> dsMaGhe = giaiMaDanhSachGhe(yeuCau);
        if (dsMaGhe.isEmpty()) {
            throw new IllegalArgumentException("Chọn ít nhất một ghế");
        }
        if (dsMaGhe.size() > TOI_DA_GHE_MOI_LAN) {
            throw new IllegalArgumentException("Tối đa " + TOI_DA_GHE_MOI_LAN + " ghế mỗi lần đặt");
        }

        ChuyenXe cx = anhXaChuyenXe.timTheoMa(yeuCau.getMaChuyen());
        if (cx == null) {
            throw new IllegalArgumentException("Không có chuyến xe");
        }
        kiemTraDiemDonTra(cx.getMaTuyen(), yeuCau.getMaDiemLen(), yeuCau.getMaDiemXuong());

        List<VeXe> ketQua = new ArrayList<>();
        List<String> maGheHienThi = new ArrayList<>();

        for (Long maGhe : dsMaGhe) {
            VeXe ve = datMotGhe(kh, cx, maGhe, yeuCau.getMaDiemLen(), yeuCau.getMaDiemXuong());
            ketQua.add(ve);
            GheNgoi ghe = anhXaGheNgoi.timTheoMa(maGhe);
            maGheHienThi.add(ghe != null ? ghe.getMaGhe() : String.valueOf(maGhe));
        }

        TuyenDuong tuyen = anhXaTuyenDuong.timTheoMa(cx.getMaTuyen());
        String tenTuyen =
                tuyen != null ? tuyen.getDiemDi() + " → " + tuyen.getDiemDen() : "Chuyến #" + cx.getMa();
        String gio = cx.getThoiDiemKhoiHanh().format(FMT_GIO);
        String dsMaVe =
                ketQua.stream().map(v -> "#" + v.getMa()).collect(Collectors.joining(", "));

        dichVuThongBao.guiNhanh(
                tk.getMa(),
                "Đặt vé thành công",
                "Đã giữ " + ketQua.size() + " vé (" + dsMaVe + ") cho chuyến " + cx.getMa() + ".");

        if (ketQua.size() == 1) {
            dichVuGuiMail.guiDatVeThanhCong(
                    tk.getEmail(), ketQua.get(0).getMa(), tenTuyen, gio, maGheHienThi.get(0));
        } else {
            dichVuGuiMail.guiDatNhieuVeThanhCong(
                    tk.getEmail(), dsMaVe, tenTuyen, gio, String.join(", ", maGheHienThi), ketQua.size());
        }

        return ketQua;
    }

    private void kiemTraDiemDonTra(Long maTuyen, Long maDiemLen, Long maDiemXuong) {
        if (maDiemLen == null || maDiemXuong == null) {
            return;
        }
        DiemDungChan len = anhXaDiemDungChan.timTheoMa(maDiemLen);
        DiemDungChan xuong = anhXaDiemDungChan.timTheoMa(maDiemXuong);
        if (len == null || xuong == null || !maTuyen.equals(len.getMaTuyen()) || !maTuyen.equals(xuong.getMaTuyen())) {
            throw new IllegalArgumentException("Điểm lên/xuống không thuộc tuyến");
        }
        if (len.getThuTu() != null && xuong.getThuTu() != null && len.getThuTu() >= xuong.getThuTu()) {
            throw new IllegalArgumentException("Điểm xuống phải sau điểm lên");
        }
    }

    private VeXe datMotGhe(KhachHang kh, ChuyenXe cx, Long maGhe, Long maDiemLen, Long maDiemXuong) {
        GheNgoi ghe = anhXaGheNgoi.timTheoMa(maGhe);
        if (ghe == null || !ghe.getMaXe().equals(cx.getMaXe())) {
            throw new IllegalArgumentException("Ghế không hợp lệ cho chuyến này");
        }
        if ("BLOCKED".equalsIgnoreCase(ghe.getTrangThai())) {
            throw new IllegalStateException("Ghế " + ghe.getMaGhe() + " đang bị khóa");
        }
        for (VeXe v : anhXaVeXe.timTheoMaChuyen(cx.getMa())) {
            if (v.getMaGhe().equals(ghe.getMa())
                    && !"CANCELLED".equals(v.getTrangThai())
                    && !"EXPIRED".equals(v.getTrangThai())) {
                throw new IllegalStateException("Ghế " + ghe.getMaGhe() + " đã được giữ");
            }
        }
        VeXe ve =
                VeXe.builder()
                        .maChuyen(cx.getMa())
                        .maKhach(kh.getMa())
                        .maGhe(ghe.getMa())
                        .trangThai("PENDING")
                        .maDiemLen(maDiemLen)
                        .maDiemXuong(maDiemXuong)
                        .build();
        anhXaVeXe.them(ve);
        VeXe luu = anhXaVeXe.timTheoMa(ve.getMa());
        ganMaVeHienThi(luu.getMa());
        return anhXaVeXe.timTheoMa(ve.getMa());
    }

    private void ganMaVeHienThi(Long maVe) {
        for (int i = 0; i < 8; i++) {
            String ma = TienIchMaVe.taoMaHienThi();
            if (anhXaVeXe.timTheoMaVeHienThi(ma) == null) {
                anhXaVeXe.capNhatMaVeHienThi(maVe, ma);
                return;
            }
        }
        anhXaVeXe.capNhatMaVeHienThi(maVe, "RB" + maVe);
    }

    private List<Long> giaiMaDanhSachGhe(YeuCauDatVe yeuCau) {
        Set<Long> tap = new LinkedHashSet<>();
        if (yeuCau.getDsMaGhe() != null) {
            for (Long ma : yeuCau.getDsMaGhe()) {
                if (ma != null) {
                    tap.add(ma);
                }
            }
        }
        if (yeuCau.getMaGhe() != null) {
            tap.add(yeuCau.getMaGhe());
        }
        return new ArrayList<>(tap);
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
        if ("EXPIRED".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé đã quá hạn thanh toán");
        }
        dichVuHetHanVe.damBaoChuaHetHan(ve);
        anhXaVeXe.capNhatTrangThai(maVe, "CANCELLED");
    }
}
