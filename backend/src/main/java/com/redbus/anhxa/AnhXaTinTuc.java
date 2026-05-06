package com.redbus.anhxa;

import com.redbus.mohinh.TinTuc;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaTinTuc {

    TinTuc timTheoMa(@Param("ma") Long ma);

    List<TinTuc> tatCa();

    List<TinTuc> congKhai(@Param("gioiHan") int gioiHan);

    long demHoatDong();

    int them(TinTuc t);

    int capNhat(TinTuc t);

    int xoa(@Param("ma") Long ma);
}
