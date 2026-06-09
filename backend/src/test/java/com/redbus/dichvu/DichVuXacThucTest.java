package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.baomat.TienIchJwt;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauDangKy;
import com.redbus.truyen.YeuCauDangNhap;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuXacThuc")
class DichVuXacThucTest {

    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private PasswordEncoder boMaHoaMatKhau;
    @Mock private TienIchJwt tienIchJwt;
    @Mock private AuthenticationManager quanLyXacThuc;
    @InjectMocks private DichVuXacThuc dichVu;

    @Test
    @DisplayName("dangKy từ chối tên đăng nhập trùng")
    void dangKy_tenTrung_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.dangKy(yeuCauDangKy("u", "a@b.com", "123456", "A")));
    }

    @Test
    @DisplayName("dangKy tạo tài khoản và trả token")
    void dangKy_thanhCong() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("new")).thenReturn(null);
        when(anhXaTaiKhoan.timTheoEmail("a@b.com")).thenReturn(null);
        when(boMaHoaMatKhau.encode("123456")).thenReturn("hash");
        when(tienIchJwt.taoToken("new", "CUSTOMER")).thenReturn("jwt-token");
        var kq = dichVu.dangKy(yeuCauDangKy("new", "a@b.com", "123456", "A"));
        verify(anhXaTaiKhoan).them(any(TaiKhoan.class));
        verify(anhXaKhachHang).them(any());
        assertEquals("jwt-token", kq.getToken());
    }

    @Test
    @DisplayName("dangKy từ chối email trùng")
    void dangKy_emailTrung_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("new")).thenReturn(null);
        when(anhXaTaiKhoan.timTheoEmail("a@b.com")).thenReturn(TaiKhoan.builder().ma(2L).build());
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.dangKy(yeuCauDangKy("new", "a@b.com", "123456", "A")));
    }

    @Test
    @DisplayName("dangNhap ném lỗi khi tài khoản biến mất sau authenticate")
    void dangNhap_khongTimTaiKhoan_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(null);
        assertThrows(IllegalStateException.class, () -> dichVu.dangNhap(yeuCauDangNhap("u", "pw")));
    }

    @Test
    @DisplayName("dangNhap xác thực và trả token")
    void dangNhap_thanhCong() {
        YeuCauDangNhap yc = yeuCauDangNhap("u", "pw");
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(
                TaiKhoan.builder().tenDangNhap("u").email("a@b.com").vaiTro("CUSTOMER").build());
        when(tienIchJwt.taoToken("u", "CUSTOMER")).thenReturn("tok");
        assertEquals("tok", dichVu.dangNhap(yc).getToken());
        verify(quanLyXacThuc).authenticate(any());
    }

    private static YeuCauDangKy yeuCauDangKy(String user, String email, String mk, String hoTen) {
        YeuCauDangKy y = new YeuCauDangKy();
        y.setTenDangNhap(user);
        y.setEmail(email);
        y.setMatKhau(mk);
        y.setHoTen(hoTen);
        return y;
    }

    private static YeuCauDangNhap yeuCauDangNhap(String user, String mk) {
        YeuCauDangNhap y = new YeuCauDangNhap();
        y.setTenDangNhap(user);
        y.setMatKhau(mk);
        return y;
    }
}
