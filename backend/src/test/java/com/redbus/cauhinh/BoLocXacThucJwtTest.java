package com.redbus.cauhinh;

import com.redbus.baomat.DichVuNguoiDungHeThong;
import com.redbus.baomat.TienIchJwt;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BoLocXacThucJwt")
class BoLocXacThucJwtTest {

    @Mock private TienIchJwt tienIchJwt;
    @Mock private DichVuNguoiDungHeThong dichVuNguoiDungHeThong;
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private FilterChain chain;
    @InjectMocks private BoLocXacThucJwt boLoc;

    @Test
    @DisplayName("không có token thì bỏ qua xác thực")
    void khongCoToken_boQua() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);
        when(request.getParameter("token")).thenReturn(null);
        boLoc.doFilterInternal(request, response, chain);
        verify(chain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("token không hợp lệ thì không set SecurityContext")
    void tokenKhongHopLe_khongSetAuth() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer bad");
        when(tienIchJwt.hopLe("bad")).thenReturn(false);
        boLoc.doFilterInternal(request, response, chain);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("token hợp lệ thì nạp UserDetails vào SecurityContext")
    void tokenHopLe_setAuth() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer good");
        when(tienIchJwt.hopLe("good")).thenReturn(true);
        when(tienIchJwt.layTenDangNhap("good")).thenReturn("admin");
        UserDetails user = User.withUsername("admin").password("x").roles("ADMIN").build();
        when(dichVuNguoiDungHeThong.loadUserByUsername("admin")).thenReturn(user);
        boLoc.doFilterInternal(request, response, chain);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("admin", SecurityContextHolder.getContext().getAuthentication().getName());
        SecurityContextHolder.clearContext();
    }
}
