package com.redbus.anhxa;

import com.redbus.mohinh.TuyenDuong;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaTuyenDuong {

    TuyenDuong timTheoMa(@Param("ma") Long ma);

    List<TuyenDuong> tatCa();

    List<TuyenDuong> timKiem(@Param("diemDi") String diemDi, @Param("diemDen") String diemDen);

    int them(TuyenDuong tuyenDuong);

    int capNhat(TuyenDuong tuyenDuong);

    int xoa(@Param("ma") Long ma);

    TuyenDuong timTheoCapDiem(
            @Param("diemDi") String diemDi,
            @Param("diemDen") String diemDen,
            @Param("maLoaiTru") Long maLoaiTru);
}
