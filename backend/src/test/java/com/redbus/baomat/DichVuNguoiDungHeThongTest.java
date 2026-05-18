package com.redbus.baomat;

import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.TaiKhoan;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuNguoiDungHeThong")
class DichVuNguoiDungHeThongTest {

    @Mock
    private AnhXaTaiKhoan anhXaTaiKhoan;
    @InjectMocks
    private DichVuNguoiDungHeThong dichVu;

    @Test
    @DisplayName("loadUserByUsername ném lỗi khi tài khoản không tồn tại")
    void loadUser_khongTonTai_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("user")).thenReturn(null);
        assertThrows(UsernameNotFoundException.class, () -> dichVu.loadUserByUsername("user"));
    }

    @Test
    @DisplayName("loadUserByUsername trả UserDetails với ROLE_ADMIN")
    void loadUser_hopLe_traRole() {
        TaiKhoan tk = TaiKhoan.builder()
                .tenDangNhap("admin")
                .matKhauMaHoa("hash")
                .vaiTro("ADMIN")
                .hoatDong(true)
                .build();
        when(anhXaTaiKhoan.timTheoTenDangNhap("admin")).thenReturn(tk);
        var user = dichVu.loadUserByUsername("admin");
        assertEquals("admin", user.getUsername());
        assertTrue(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }
}
