package com.redbus.anhxa;

import com.redbus.mohinh.KhachHang;
import com.redbus.truyen.ThongTinKhachHangPhanHoi;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaKhachHang {

    KhachHang timTheoMa(@Param("ma") Long ma);

    KhachHang timTheoMaTaiKhoan(@Param("maTaiKhoan") Long maTaiKhoan);

    List<KhachHang> tatCa();

    List<ThongTinKhachHangPhanHoi> danhSachLienKetTaiKhoan();

    ThongTinKhachHangPhanHoi timMotLienKetTaiKhoan(@Param("maKhach") Long maKhach);

    int them(KhachHang khachHang);

    int capNhat(KhachHang khachHang);
}
