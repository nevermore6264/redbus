package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaHoiDap;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.HoiDap;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauHoiDap;
import com.redbus.truyen.YeuCauTraLoiHoiDap;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuHoiDap {

    private final AnhXaHoiDap anhXaHoiDap;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;

    public List<HoiDap> congKhai() {
        return anhXaHoiDap.congKhaiDaTraLoi();
    }

    public List<HoiDap> tatCaChoQuanTri() {
        return anhXaHoiDap.tatCaChoQuanTri();
    }

    @Transactional
    public HoiDap datCauHoi(String tenDangNhap, YeuCauHoiDap yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Chỉ khách hàng được đặt câu hỏi");
        }
        HoiDap hd = HoiDap.builder()
                .maKhach(kh.getMa())
                .tieuDe(yeuCau.getTieuDe().trim())
                .noiDungHoi(yeuCau.getNoiDungHoi().trim())
                .trangThai("CHO_TRA_LOI")
                .build();
        anhXaHoiDap.them(hd);
        return anhXaHoiDap.timTheoMa(hd.getMa());
    }

    @Transactional
    public HoiDap traLoi(Long ma, String tenNguoiTraLoi, YeuCauTraLoiHoiDap yeuCau) {
        HoiDap cu = anhXaHoiDap.timTheoMa(ma);
        if (cu == null) {
            throw new IllegalArgumentException("Không tìm thấy câu hỏi");
        }
        TaiKhoan nguoiTraLoi = anhXaTaiKhoan.timTheoTenDangNhap(tenNguoiTraLoi);
        if (nguoiTraLoi == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        cu.setNoiDungTraLoi(yeuCau.getNoiDungTraLoi().trim());
        cu.setMaNguoiTraLoi(nguoiTraLoi.getMa());
        cu.setThoiGianTraLoi(LocalDateTime.now());
        cu.setTrangThai("DA_TRA_LOI");
        anhXaHoiDap.capNhatTraLoi(cu);
        return anhXaHoiDap.timTheoMa(ma);
    }
}
