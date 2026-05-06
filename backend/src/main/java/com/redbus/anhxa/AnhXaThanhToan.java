package com.redbus.anhxa;

import com.redbus.mohinh.GiaoDichThanhToan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaThanhToan {

    /** ma = ma ve da thanh toan (PAID) */
    GiaoDichThanhToan timTheoMa(@Param("ma") Long ma);

    List<GiaoDichThanhToan> tatCa();

    List<GiaoDichThanhToan> danhSachTheoMaKhach(@Param("maKhach") Long maKhach);
}
