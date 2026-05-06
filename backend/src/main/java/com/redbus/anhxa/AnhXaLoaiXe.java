package com.redbus.anhxa;

import com.redbus.mohinh.LoaiXe;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaLoaiXe {

    LoaiXe timTheoMa(@Param("ma") Long ma);

    List<LoaiXe> tatCa();

    int them(LoaiXe x);

    int capNhat(LoaiXe x);

    int xoa(@Param("ma") Long ma);

    long demTatCa();
}
