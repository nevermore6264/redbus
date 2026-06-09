package com.redbus.anhxa;

import com.redbus.mohinh.TaiKhoan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaTaiKhoan {

    TaiKhoan timTheoMa(@Param("ma") Long ma);

    TaiKhoan timTheoTenDangNhap(@Param("tenDangNhap") String tenDangNhap);

    TaiKhoan timTheoEmail(@Param("email") String email);

    int them(TaiKhoan taiKhoan);

    int capNhatMatKhau(@Param("ma") Long ma, @Param("matKhauMaHoa") String matKhauMaHoa);

    int capNhatEmailVaHoatDong(
            @Param("ma") Long ma,
            @Param("email") String email,
            @Param("hoatDong") Boolean hoatDong);

    List<TaiKhoan> danhSachHoTro();
}
