package com.redbus.anhxa;

import com.redbus.mohinh.AnhLoaiXe;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface AnhXaLoaiXeAnh {

    List<AnhLoaiXe> timTheoMaLoaiXe(@Param("maLoaiXe") Long maLoaiXe);

    List<AnhLoaiXe> timTheoDanhSachMaLoaiXe(@Param("dsMa") List<Long> dsMa);

    AnhLoaiXe timTheoMa(@Param("ma") Long ma);

    int timThuTuLonNhat(@Param("maLoaiXe") Long maLoaiXe);

    int them(AnhLoaiXe x);

    int xoa(@Param("ma") Long ma);

    int xoaTheoMaLoaiXe(@Param("maLoaiXe") Long maLoaiXe);
}
