package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.ThongTinHoSoCaNhan;
import com.redbus.truyen.YeuCauCapNhatHoSo;
import com.redbus.truyen.YeuCauDoiMatKhau;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DichVuHoSo {

    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final PasswordEncoder boMaHoaMatKhau;

    public ThongTinHoSoCaNhan xemHoSo(String tenDangNhap) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Không phải tài khoản khách hàng");
        }
        return ThongTinHoSoCaNhan.builder()
                .maTaiKhoan(tk.getMa())
                .tenDangNhap(tk.getTenDangNhap())
                .email(tk.getEmail())
                .maKhach(kh.getMa())
                .hoTen(kh.getHoTen())
                .soDienThoai(kh.getSoDienThoai())
                .diaChi(kh.getDiaChi())
                .build();
    }

    @Transactional
    public ThongTinHoSoCaNhan capNhat(String tenDangNhap, YeuCauCapNhatHoSo yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null) {
            throw new IllegalStateException("Không phải khách hàng");
        }
        kh.setHoTen(yeuCau.getHoTen());
        kh.setSoDienThoai(yeuCau.getSoDienThoai());
        kh.setDiaChi(yeuCau.getDiaChi());
        anhXaKhachHang.capNhat(kh);
        return xemHoSo(tenDangNhap);
    }

    @Transactional
    public void doiMatKhau(String tenDangNhap, YeuCauDoiMatKhau yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (!boMaHoaMatKhau.matches(yeuCau.getMatKhauCu(), tk.getMatKhauMaHoa())) {
            throw new IllegalArgumentException("Mật khẩu cũ không đúng");
        }
        String maMoi = boMaHoaMatKhau.encode(yeuCau.getMatKhauMoi());
        anhXaTaiKhoan.capNhatMatKhau(tk.getMa(), maMoi);
    }
}
