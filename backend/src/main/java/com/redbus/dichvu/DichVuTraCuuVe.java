package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.DiemDungChan;
import com.redbus.mohinh.GheNgoi;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.TuyenDuong;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.VeDienTuPhanHoi;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DichVuTraCuuVe {

    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaTuyenDuong anhXaTuyenDuong;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final AnhXaDiemDungChan anhXaDiemDungChan;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public VeDienTuPhanHoi traCuuCongKhai(String maVeHienThi, String soDienThoai) {
        if (maVeHienThi == null || maVeHienThi.isBlank()) {
            throw new IllegalArgumentException("Nhập mã vé");
        }
        if (soDienThoai == null || soDienThoai.isBlank()) {
            throw new IllegalArgumentException("Nhập số điện thoại đặt vé");
        }
        VeXe ve = anhXaVeXe.timTheoMaVeHienThi(maVeHienThi.trim().toUpperCase());
        if (ve == null) {
            throw new IllegalArgumentException("Không tìm thấy vé");
        }
        KhachHang kh = anhXaKhachHang.timTheoMa(ve.getMaKhach());
        if (kh == null || kh.getSoDienThoai() == null) {
            throw new IllegalArgumentException("Không xác thực được thông tin vé");
        }
        String sdtChuan = chuanHoaSdt(soDienThoai);
        String sdtKh = chuanHoaSdt(kh.getSoDienThoai());
        if (!sdtKh.equals(sdtChuan) && !sdtKh.endsWith(sdtChuan) && !sdtChuan.endsWith(sdtKh)) {
            throw new IllegalArgumentException("Số điện thoại không khớp");
        }
        return xayVeDienTu(ve, kh);
    }

    public VeDienTuPhanHoi veDienTuCuaToi(String tenDangNhap, Long maVe) {
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null) {
            throw new IllegalArgumentException("Không có vé");
        }
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null || !ve.getMaKhach().equals(kh.getMa())) {
            throw new IllegalStateException("Không phải vé của bạn");
        }
        if (!"PAID".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé điện tử chỉ áp dụng vé đã thanh toán");
        }
        return xayVeDienTu(ve, kh);
    }

    private VeDienTuPhanHoi xayVeDienTu(VeXe ve, KhachHang kh) {
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        TuyenDuong tuyen = cx != null ? anhXaTuyenDuong.timTheoMa(cx.getMaTuyen()) : null;
        GheNgoi ghe = anhXaGheNgoi.timTheoMa(ve.getMaGhe());
        String maHienThi = ve.getMaVeHienThi() != null ? ve.getMaVeHienThi() : ("RB" + ve.getMa());
        String goc = frontendUrl != null ? frontendUrl.replaceAll("/$", "") : "http://localhost:5173";
        String noiDungQr = goc + "/tra-cuu-ve?ma=" + maHienThi;
        return VeDienTuPhanHoi.builder()
                .ma(ve.getMa())
                .maVeHienThi(maHienThi)
                .trangThai(ve.getTrangThai())
                .tenKhach(kh.getHoTen())
                .soDienThoai(kh.getSoDienThoai())
                .diemDi(tuyen != null ? tuyen.getDiemDi() : null)
                .diemDen(tuyen != null ? tuyen.getDiemDen() : null)
                .diemLen(tenDiem(ve.getMaDiemLen()))
                .diemXuong(tenDiem(ve.getMaDiemXuong()))
                .thoiDiemKhoiHanh(cx != null ? cx.getThoiDiemKhoiHanh() : null)
                .maGhe(ghe != null ? ghe.getMaGhe() : null)
                .soTienThanhToan(ve.getSoTienThanhToan())
                .noiDungQr(noiDungQr)
                .build();
    }

    private String tenDiem(Long ma) {
        if (ma == null) {
            return null;
        }
        DiemDungChan d = anhXaDiemDungChan.timTheoMa(ma);
        return d != null ? d.getTenDiem() : null;
    }

    private String chuanHoaSdt(String sdt) {
        return sdt.replaceAll("[^0-9]", "");
    }
}
