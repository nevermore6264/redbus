package com.redbus.anhxa;

import com.redbus.mohinh.ChuyenXe;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface AnhXaChuyenXe {

    ChuyenXe timTheoMa(@Param("ma") Long ma);

    ChuyenXe timTrungChuyen(
            @Param("maTuyen") Long maTuyen,
            @Param("maXe") Long maXe,
            @Param("thoiDiemKhoiHanh") LocalDateTime thoiDiemKhoiHanh,
            @Param("maLoaiTru") Long maLoaiTru);

    List<ChuyenXe> timTheoTuyenVaSauThoiDiem(@Param("maTuyen") Long maTuyen, @Param("tuLuc") LocalDateTime tuLuc);

    List<ChuyenXe> tatCa();

    int them(ChuyenXe chuyenXe);

    int capNhat(ChuyenXe chuyenXe);

    int xoa(@Param("ma") Long ma);

    List<Long> danhSachMaGheDaGiu(@Param("maChuyen") Long maChuyen);

    int demTheoTrangThai(@Param("trangThai") String trangThai);

    int demTrongNgay(@Param("ngay") LocalDate ngay, @Param("maTuyen") Long maTuyen);
}
