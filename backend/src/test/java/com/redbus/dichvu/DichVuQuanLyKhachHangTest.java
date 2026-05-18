package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.truyen.ThongTinKhachHangPhanHoi;
import com.redbus.truyen.YeuCauThemKhachQuanTri;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuQuanLyKhachHang")
class DichVuQuanLyKhachHangTest {

    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private PasswordEncoder boMaHoaMatKhau;
    @InjectMocks private DichVuQuanLyKhachHang dichVu;

    @Test
    @DisplayName("motTheoMaKhach ném lỗi khi không tồn tại")
    void motTheoMaKhach_khongCo_nemLoi() {
        when(anhXaKhachHang.timMotLienKetTaiKhoan(1L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.motTheoMaKhach(1L));
    }

    @Test
    @DisplayName("them từ chối mật khẩu ngắn")
    void them_matKhauNgan_nemLoi() {
        YeuCauThemKhachQuanTri y = yeuCauThem("u", "a@b.com", "123", "A");
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(y));
    }

    @Test
    @DisplayName("them từ chối tên đăng nhập trùng")
    void them_tenTrung_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(
                com.redbus.mohinh.TaiKhoan.builder().ma(1L).build());
        YeuCauThemKhachQuanTri y = yeuCauThem("u", "a@b.com", "123456", "A");
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(y));
    }

    private static YeuCauThemKhachQuanTri yeuCauThem(String user, String email, String mk, String hoTen) {
        YeuCauThemKhachQuanTri y = new YeuCauThemKhachQuanTri();
        y.setTenDangNhap(user);
        y.setEmail(email);
        y.setMatKhau(mk);
        y.setHoTen(hoTen);
        return y;
    }
}
