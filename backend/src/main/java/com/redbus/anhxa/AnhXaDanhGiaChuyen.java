package com.redbus.anhxa;

import com.redbus.mohinh.DanhGiaChuyen;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface AnhXaDanhGiaChuyen {

    List<DanhGiaChuyen> theoMaChuyen(@Param("maChuyen") Long maChuyen);

    DanhGiaChuyen timTheoMaChuyenVaMaKhach(@Param("maChuyen") Long maChuyen, @Param("maKhach") Long maKhach);

    int them(DanhGiaChuyen d);

    long demTatCa();

    BigDecimal diemTrungBinh();

    long demTheoMaChuyen(@Param("maChuyen") Long maChuyen);
}
