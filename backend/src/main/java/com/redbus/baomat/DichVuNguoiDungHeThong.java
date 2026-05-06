package com.redbus.baomat;

import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.TaiKhoan;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuNguoiDungHeThong implements UserDetailsService {

    private final AnhXaTaiKhoan anhXaTaiKhoan;

    @Override
    public UserDetails loadUserByUsername(String tenDangNhap) throws UsernameNotFoundException {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null || Boolean.FALSE.equals(tk.getHoatDong())) {
            throw new UsernameNotFoundException("Không tìm thấy người dùng");
        }
        String vaiTro = tk.getVaiTro() != null ? tk.getVaiTro() : "CUSTOMER";
        return new User(
                tk.getTenDangNhap(),
                tk.getMatKhauMaHoa(),
                List.of(new SimpleGrantedAuthority("ROLE_" + vaiTro))
        );
    }
}
