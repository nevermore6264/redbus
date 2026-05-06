package com.redbus.anhxa;

import com.redbus.mohinh.TinNhanChat;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaTinNhanChat {

    int them(TinNhanChat tin);

    List<TinNhanChat> tinTrongHoiThoai(
            @Param("maA") Long maA,
            @Param("maB") Long maB);
}
