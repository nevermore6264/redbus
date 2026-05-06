package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.ThongTinKhachHangPhanHoi;
import com.redbus.truyen.YeuCauCapNhatKhachQuanTri;
import com.redbus.truyen.YeuCauThemKhachQuanTri;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuQuanLyKhachHang {

    private final AnhXaKhachHang anhXaKhachHang;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final PasswordEncoder boMaHoaMatKhau;

    public List<ThongTinKhachHangPhanHoi> danhSachDayDu() {
        return anhXaKhachHang.danhSachLienKetTaiKhoan();
    }

    public ThongTinKhachHangPhanHoi motTheoMaKhach(Long maKhach) {
        ThongTinKhachHangPhanHoi x = anhXaKhachHang.timMotLienKetTaiKhoan(maKhach);
        if (x == null) {
            throw new IllegalArgumentException("Không có khách hàng");
        }
        return x;
    }

    @Transactional
    public ThongTinKhachHangPhanHoi them(YeuCauThemKhachQuanTri y) {
        if (y.getTenDangNhap() == null || y.getTenDangNhap().isBlank()) {
            throw new IllegalArgumentException("Thiếu tên đăng nhập");
        }
        if (y.getEmail() == null || y.getEmail().isBlank()) {
            throw new IllegalArgumentException("Thiếu email");
        }
        if (y.getMatKhau() == null || y.getMatKhau().length() < 6) {
            throw new IllegalArgumentException("Mật khẩu tối thiểu 6 ký tự");
        }
        if (y.getHoTen() == null || y.getHoTen().isBlank()) {
            throw new IllegalArgumentException("Thiếu họ tên");
        }
        if (anhXaTaiKhoan.timTheoTenDangNhap(y.getTenDangNhap().trim()) != null) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }
        if (anhXaTaiKhoan.timTheoEmail(y.getEmail().trim()) != null) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        TaiKhoan tk = TaiKhoan.builder()
                .tenDangNhap(y.getTenDangNhap().trim())
                .email(y.getEmail().trim())
                .matKhauMaHoa(boMaHoaMatKhau.encode(y.getMatKhau()))
                .vaiTro("CUSTOMER")
                .hoatDong(true)
                .build();
        anhXaTaiKhoan.them(tk);
        KhachHang kh = KhachHang.builder()
                .maTaiKhoan(tk.getMa())
                .hoTen(y.getHoTen().trim())
                .soDienThoai(chuoiRongThanhNull(y.getSoDienThoai()))
                .diaChi(chuoiRongThanhNull(y.getDiaChi()))
                .build();
        anhXaKhachHang.them(kh);
        ThongTinKhachHangPhanHoi reload = anhXaKhachHang.timMotLienKetTaiKhoan(kh.getMa());
        if (reload == null) {
            throw new IllegalStateException("Không đọc lại được khách vừa tạo");
        }
        return reload;
    }

    @Transactional
    public ThongTinKhachHangPhanHoi capNhat(Long maKhach, YeuCauCapNhatKhachQuanTri y) {
        KhachHang kh = anhXaKhachHang.timTheoMa(maKhach);
        if (kh == null) {
            throw new IllegalArgumentException("Không có khách hàng");
        }
        TaiKhoan tk = anhXaTaiKhoan.timTheoMa(kh.getMaTaiKhoan());
        if (tk == null) {
            throw new IllegalStateException("Không tìm thấy tài khoản");
        }
        if (y.getHoTen() != null && !y.getHoTen().isBlank()) {
            kh.setHoTen(y.getHoTen().trim());
        }
        kh.setSoDienThoai(chuoiRongThanhNull(y.getSoDienThoai()));
        kh.setDiaChi(chuoiRongThanhNull(y.getDiaChi()));
        anhXaKhachHang.capNhat(kh);

        String emailHienTai = tk.getEmail();
        String emailMoi = y.getEmail() != null ? y.getEmail().trim() : emailHienTai;
        if (y.getEmail() != null && !emailMoi.equalsIgnoreCase(emailHienTai)) {
            TaiKhoan trung = anhXaTaiKhoan.timTheoEmail(emailMoi);
            if (trung != null && !trung.getMa().equals(tk.getMa())) {
                throw new IllegalArgumentException("Email đã được dùng cho tài khoản khác");
            }
        }

        boolean hd = y.getHoatDong() != null ? y.getHoatDong()
                : Boolean.TRUE.equals(tk.getHoatDong());
        anhXaTaiKhoan.capNhatEmailVaHoatDong(tk.getMa(), emailMoi, hd);

        if (y.getMatKhauMoi() != null && !y.getMatKhauMoi().isBlank()) {
            if (y.getMatKhauMoi().length() < 6) {
                throw new IllegalArgumentException("Mật khẩu mới tối thiểu 6 ký tự");
            }
            anhXaTaiKhoan.capNhatMatKhau(tk.getMa(), boMaHoaMatKhau.encode(y.getMatKhauMoi()));
        }

        ThongTinKhachHangPhanHoi reload = anhXaKhachHang.timMotLienKetTaiKhoan(maKhach);
        if (reload == null) {
            throw new IllegalStateException("Không đọc lại được khách sau cập nhật");
        }
        return reload;
    }

    private static String chuoiRongThanhNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
