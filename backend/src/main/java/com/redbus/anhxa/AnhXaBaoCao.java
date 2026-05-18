package com.redbus.anhxa;

import com.redbus.truyen.MucBieuDo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnhXaBaoCao {

    List<MucBieuDo> doanhThuTheoNgay(@Param("soNgay") int soNgay);

    List<MucBieuDo> demVeTheoTrangThai();

    List<MucBieuDo> veTheoPhuongThuc();

    List<MucBieuDo> topTuyenTheoVe(@Param("gioiHan") int gioiHan);

    List<MucBieuDo> phanBoDiemDanhGia();
}
