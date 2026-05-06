package com.redbus.anhxa;

import com.redbus.mohinh.DiemDungChan;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaDiemDungChan {

    DiemDungChan timTheoMa(@Param("ma") Long ma);

    List<DiemDungChan> theoMaTuyen(@Param("maTuyen") Long maTuyen);

    int them(DiemDungChan d);

    int capNhat(DiemDungChan d);

    int xoa(@Param("ma") Long ma);

    long demTatCa();
}
