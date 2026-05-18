package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.GheNgoi;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.YeuCauDoiChuyen;
import com.redbus.truyen.YeuCauDoiGhe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DichVuDoiVe {

    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final DichVuThongBao dichVuThongBao;

    @Transactional
    public VeXe doiGhe(String tenDangNhap, Long maVe, YeuCauDoiGhe yeuCau) {
        VeXe ve = kiemTraVeDoiDuoc(tenDangNhap, maVe);
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        kiemTraGheTrong(cx, yeuCau.getMaGheMoi(), ve.getMa());
        anhXaVeXe.capNhatGhe(maVe, yeuCau.getMaGheMoi());
        thongBaoDoi(tenDangNhap, maVe, "Đổi ghế thành công");
        return anhXaVeXe.timTheoMa(maVe);
    }

    @Transactional
    public VeXe doiChuyen(String tenDangNhap, Long maVe, YeuCauDoiChuyen yeuCau) {
        VeXe ve = kiemTraVeDoiDuoc(tenDangNhap, maVe);
        ChuyenXe cxMoi = anhXaChuyenXe.timTheoMa(yeuCau.getMaChuyenMoi());
        if (cxMoi == null) {
            throw new IllegalArgumentException("Chuyến mới không tồn tại");
        }
        ChuyenXe cxCu = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        if (cxCu != null && !cxCu.getMaTuyen().equals(cxMoi.getMaTuyen())) {
            throw new IllegalStateException("Chỉ đổi sang chuyến cùng tuyến");
        }
        kiemTraGheTrong(cxMoi, yeuCau.getMaGheMoi(), ve.getMa());
        anhXaVeXe.capNhatChuyenVaGhe(maVe, yeuCau.getMaChuyenMoi(), yeuCau.getMaGheMoi());
        thongBaoDoi(tenDangNhap, maVe, "Đổi chuyến thành công");
        return anhXaVeXe.timTheoMa(maVe);
    }

    private VeXe kiemTraVeDoiDuoc(String tenDangNhap, Long maVe) {
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null) {
            throw new IllegalArgumentException("Không có vé");
        }
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null || !ve.getMaKhach().equals(kh.getMa())) {
            throw new IllegalStateException("Không phải vé của bạn");
        }
        if (!"PAID".equals(ve.getTrangThai()) && !"PENDING".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé không thể đổi ở trạng thái hiện tại");
        }
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        if (cx == null || cx.getThoiDiemKhoiHanh().isBefore(LocalDateTime.now().plusHours(2))) {
            throw new IllegalStateException("Chỉ đổi trước giờ khởi hành ít nhất 2 giờ");
        }
        return ve;
    }

    private void kiemTraGheTrong(ChuyenXe cx, Long maGheMoi, Long maVeLoaiTru) {
        GheNgoi ghe = anhXaGheNgoi.timTheoMa(maGheMoi);
        if (ghe == null || !ghe.getMaXe().equals(cx.getMaXe())) {
            throw new IllegalArgumentException("Ghế không hợp lệ");
        }
        for (VeXe v : anhXaVeXe.timTheoMaChuyen(cx.getMa())) {
            if (!v.getMa().equals(maVeLoaiTru)
                    && v.getMaGhe().equals(maGheMoi)
                    && !"CANCELLED".equals(v.getTrangThai())
                    && !"EXPIRED".equals(v.getTrangThai())) {
                throw new IllegalStateException("Ghế đã được giữ");
            }
        }
    }

    private void thongBaoDoi(String tenDangNhap, Long maVe, String tieuDe) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk != null) {
            dichVuThongBao.guiNhanh(tk.getMa(), tieuDe, "Vé #" + maVe + " đã được cập nhật.");
        }
    }
}
