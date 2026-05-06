package com.redbus.anhxa;

import com.redbus.mohinh.VeXe;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaVeXe {

    VeXe timTheoMa(@Param("ma") Long ma);

    List<VeXe> timTheoMaKhach(@Param("maKhach") Long maKhach);

    List<VeXe> timTheoMaChuyen(@Param("maChuyen") Long maChuyen);

    int them(VeXe veXe);

    int capNhatTrangThai(@Param("ma") Long ma, @Param("trangThai") String trangThai);

    int capNhatThanhToan(VeXe veXe);

    int demTheoTrangThai(@Param("trangThai") String trangThai);
}
