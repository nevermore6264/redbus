package com.redbus.anhxa;

import com.redbus.mohinh.GheNgoi;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaGheNgoi {

    GheNgoi timTheoMa(@Param("ma") Long ma);

    List<GheNgoi> timTheoMaXe(@Param("maXe") Long maXe);

    int them(GheNgoi gheNgoi);

    int capNhatTrangThai(@Param("ma") Long ma, @Param("trangThai") String trangThai);

    int xoaTheoMaXe(@Param("maXe") Long maXe);
}
