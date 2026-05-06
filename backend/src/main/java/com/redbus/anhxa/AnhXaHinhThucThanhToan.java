package com.redbus.anhxa;

import com.redbus.mohinh.HinhThucThanhToan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaHinhThucThanhToan {

    HinhThucThanhToan timTheoMa(@Param("ma") Long ma);

    HinhThucThanhToan timTheoMaLoai(@Param("maLoai") String maLoai);

    List<HinhThucThanhToan> tatCaHoatDong();

    int them(HinhThucThanhToan ht);
}
