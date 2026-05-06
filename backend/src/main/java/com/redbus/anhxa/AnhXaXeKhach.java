package com.redbus.anhxa;

import com.redbus.mohinh.XeKhach;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaXeKhach {

    XeKhach timTheoMa(@Param("ma") Long ma);

    List<XeKhach> tatCa();

    int them(XeKhach xeKhach);

    int capNhat(XeKhach xeKhach);

    int xoa(@Param("ma") Long ma);
}
