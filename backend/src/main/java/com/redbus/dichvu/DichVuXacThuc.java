package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.baomat.TienIchJwt;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.PhanHoiDangNhap;
import com.redbus.truyen.YeuCauDangKy;
import com.redbus.truyen.YeuCauDangNhap;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DichVuXacThuc {

    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final PasswordEncoder boMaHoaMatKhau;
    private final TienIchJwt tienIchJwt;
    private final AuthenticationManager quanLyXacThuc;

    public PhanHoiDangNhap dangNhap(YeuCauDangNhap yeuCau) {
        quanLyXacThuc.authenticate(
                new UsernamePasswordAuthenticationToken(yeuCau.getTenDangNhap(), yeuCau.getMatKhau()));
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(yeuCau.getTenDangNhap());
        if (tk == null) {
            throw new IllegalStateException("Không tìm thấy tài khoản");
        }
        String token = tienIchJwt.taoToken(tk.getTenDangNhap(), tk.getVaiTro());
        return PhanHoiDangNhap.builder()
                .loai("Bearer")
                .token(token)
                .tenDangNhap(tk.getTenDangNhap())
                .email(tk.getEmail())
                .vaiTro(tk.getVaiTro())
                .build();
    }

    @Transactional
    public PhanHoiDangNhap dangKy(YeuCauDangKy yeuCau) {
        if (anhXaTaiKhoan.timTheoTenDangNhap(yeuCau.getTenDangNhap()) != null) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }
        if (anhXaTaiKhoan.timTheoEmail(yeuCau.getEmail()) != null) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        TaiKhoan tk = TaiKhoan.builder()
                .tenDangNhap(yeuCau.getTenDangNhap())
                .email(yeuCau.getEmail())
                .matKhauMaHoa(boMaHoaMatKhau.encode(yeuCau.getMatKhau()))
                .vaiTro("CUSTOMER")
                .hoatDong(true)
                .build();
        anhXaTaiKhoan.them(tk);
        KhachHang kh = KhachHang.builder()
                .maTaiKhoan(tk.getMa())
                .hoTen(yeuCau.getHoTen())
                .soDienThoai(yeuCau.getSoDienThoai())
                .build();
        anhXaKhachHang.them(kh);
        String token = tienIchJwt.taoToken(tk.getTenDangNhap(), tk.getVaiTro());
        return PhanHoiDangNhap.builder()
                .loai("Bearer")
                .token(token)
                .tenDangNhap(tk.getTenDangNhap())
                .email(tk.getEmail())
                .vaiTro(tk.getVaiTro())
                .build();
    }
}
