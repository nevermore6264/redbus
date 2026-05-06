package com.redbus.anhxa;

import com.redbus.mohinh.ThongBao;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaThongBao {

    List<ThongBao> danhSachTheoMaNguoiDung(@Param("maNguoiDung") Long maNguoiDung);

    int them(ThongBao thongBao);

    int danhDauDaDoc(@Param("ma") Long ma, @Param("maNguoiDung") Long maNguoiDung);
}
