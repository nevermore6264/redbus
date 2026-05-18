package com.redbus.anhxa;

import com.redbus.mohinh.MaOtp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AnhXaMaOtp {

    int them(MaOtp otp);

    MaOtp timHopLe(@Param("email") String email, @Param("loai") String loai, @Param("maOtp") String maOtp);

    int danhDauDaDung(@Param("ma") Long ma);

    int voHieuHoaCu(@Param("email") String email, @Param("loai") String loai);
}
