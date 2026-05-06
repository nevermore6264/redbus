package com.redbus.cauhinh;

import com.redbus.baomat.DichVuNguoiDungHeThong;
import com.redbus.baomat.TienIchJwt;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class BoLocXacThucJwt extends OncePerRequestFilter {

    private final TienIchJwt tienIchJwt;
    private final DichVuNguoiDungHeThong dichVuNguoiDungHeThong;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest yeuCau,
            @NonNull HttpServletResponse phanHoi,
            @NonNull FilterChain chuoiLoc) throws ServletException, IOException {
        String header = yeuCau.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chuoiLoc.doFilter(yeuCau, phanHoi);
            return;
        }
        String token = header.substring(7);
        if (!tienIchJwt.hopLe(token)) {
            chuoiLoc.doFilter(yeuCau, phanHoi);
            return;
        }
        String tenDn = tienIchJwt.layTenDangNhap(token);
        if (tenDn != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails chiTiet = dichVuNguoiDungHeThong.loadUserByUsername(tenDn);
            var xacThuc = new UsernamePasswordAuthenticationToken(chiTiet, null, chiTiet.getAuthorities());
            xacThuc.setDetails(new WebAuthenticationDetailsSource().buildDetails(yeuCau));
            SecurityContextHolder.getContext().setAuthentication(xacThuc);
        }
        chuoiLoc.doFilter(yeuCau, phanHoi);
    }
}
