package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaoCaoMoRong {

    private long soGiaoDichThanhToan;
    private BigDecimal tongDoanhThu;
    private long soVeDaThanhToan;
    private long soVeChoXuLy;
    private long soChuyenLichDinh;
    private long soDanhGia;
    private BigDecimal diemTrungBinhDanhGia;
    private long soTinTucHoatDong;
    private long soKhuyenMaiDangHieuLuc;
    private long soDiemDungChan;
    private long soLoaiXe;
}
