package com.redbus.anhxa;

import com.redbus.mohinh.KhuyenMai;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AnhXaKhuyenMai {

    KhuyenMai timTheoMa(@Param("ma") Long ma);

    KhuyenMai timTheoMaCode(@Param("maCode") String maCode, @Param("maLoaiTru") Long maLoaiTru);

    List<KhuyenMai> tatCa();

    int them(KhuyenMai k);

    int capNhat(KhuyenMai k);

    int xoa(@Param("ma") Long ma);

    int tangSoLanDung(@Param("ma") Long ma);

    long demDangHoatDong(@Param("luc") LocalDateTime luc);
}
