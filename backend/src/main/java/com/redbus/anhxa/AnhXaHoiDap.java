package com.redbus.anhxa;

import com.redbus.mohinh.HoiDap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaHoiDap {

    HoiDap timTheoMa(@Param("ma") Long ma);

    List<HoiDap> congKhaiDaTraLoi();

    List<HoiDap> tatCaChoQuanTri();

    int them(HoiDap hd);

    int capNhatTraLoi(HoiDap hd);
}
