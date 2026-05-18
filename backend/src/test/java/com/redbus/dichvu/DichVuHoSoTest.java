package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauCapNhatHoSo;
import com.redbus.truyen.YeuCauDoiMatKhau;
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
@DisplayName("DichVuHoSo")
class DichVuHoSoTest {

    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private PasswordEncoder boMaHoaMatKhau;
    @InjectMocks private DichVuHoSo dichVu;

    @Test
    @DisplayName("xemHoSo ném lỗi khi không phải khách hàng")
    void xemHoSo_khongPhaiKhach_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(null);
        assertThrows(IllegalStateException.class, () -> dichVu.xemHoSo("u"));
    }

    @Test
    @DisplayName("doiMatKhau từ chối mật khẩu cũ sai")
    void doiMatKhau_saiCu_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(
                TaiKhoan.builder().ma(1L).matKhauMaHoa("hash").build());
        when(boMaHoaMatKhau.matches("sai", "hash")).thenReturn(false);
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.doiMatKhau("u", yeuCauDoiMk("sai", "moi123")));
    }

    @Test
    @DisplayName("capNhat cập nhật khách và trả hồ sơ")
    void capNhat_thanhCong() {
        TaiKhoan tk = TaiKhoan.builder().ma(1L).tenDangNhap("u").email("a@b.com").build();
        KhachHang kh = KhachHang.builder().ma(2L).maTaiKhoan(1L).hoTen("Cu").build();
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(tk);
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(kh);
        YeuCauCapNhatHoSo yc = new YeuCauCapNhatHoSo();
        yc.setHoTen("Moi");
        yc.setSoDienThoai("090");
        var kq = dichVu.capNhat("u", yc);
        verify(anhXaKhachHang).capNhat(kh);
        assertEquals("Moi", kq.getHoTen());
    }

    private static YeuCauDoiMatKhau yeuCauDoiMk(String cu, String moi) {
        YeuCauDoiMatKhau y = new YeuCauDoiMatKhau();
        y.setMatKhauCu(cu);
        y.setMatKhauMoi(moi);
        return y;
    }
}
