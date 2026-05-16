package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaDanhGiaChuyen;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.DanhGiaChuyen;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.DanhGiaCongKhaiPhanHoi;
import com.redbus.truyen.YeuCauDanhGiaChuyen;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuDanhGiaChuyen {

    private final AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaVeXe anhXaVeXe;

    public List<DanhGiaChuyen> theoMaChuyen(Long maChuyen) {
        return anhXaDanhGiaChuyen.theoMaChuyen(maChuyen);
    }

    public List<DanhGiaCongKhaiPhanHoi> congKhai(int gioiHan) {
        int gioiHanAnToan = Math.min(Math.max(gioiHan, 1), 30);
        return anhXaDanhGiaChuyen.congKhai(gioiHanAnToan);
    }

    @Transactional
    public DanhGiaChuyen vietDanhGia(String tenDangNhap, YeuCauDanhGiaChuyen yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Chưa có hồ sơ khách hàng");
        }
        if (anhXaDanhGiaChuyen.timTheoMaChuyenVaMaKhach(yeuCau.getMaChuyen(), kh.getMa()) != null) {
            throw new IllegalStateException("Bạn đã đánh giá chuyến này");
        }
        boolean coVeDaTra = false;
        for (VeXe v : anhXaVeXe.timTheoMaKhach(kh.getMa())) {
            if (v.getMaChuyen().equals(yeuCau.getMaChuyen()) && "PAID".equals(v.getTrangThai())) {
                coVeDaTra = true;
                break;
            }
        }
        if (!coVeDaTra) {
            throw new IllegalStateException("Chỉ đánh giá sau khi có vé đã thanh toán cho chuyến này");
        }
        DanhGiaChuyen d = DanhGiaChuyen.builder()
                .maChuyen(yeuCau.getMaChuyen())
                .maKhach(kh.getMa())
                .diemSo(yeuCau.getDiemSo())
                .nhanXet(yeuCau.getNhanXet())
                .build();
        anhXaDanhGiaChuyen.them(d);
        return anhXaDanhGiaChuyen.timTheoMaChuyenVaMaKhach(yeuCau.getMaChuyen(), kh.getMa());
    }
}
