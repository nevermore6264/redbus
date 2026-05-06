package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaDanhGiaChuyen;
import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.anhxa.AnhXaLoaiXe;
import com.redbus.anhxa.AnhXaThanhToan;
import com.redbus.anhxa.AnhXaTinTuc;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.truyen.BaoCaoMoRong;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuBaoCao {

    private final AnhXaThanhToan anhXaThanhToan;
    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;
    private final AnhXaTinTuc anhXaTinTuc;
    private final AnhXaKhuyenMai anhXaKhuyenMai;
    private final AnhXaDiemDungChan anhXaDiemDungChan;
    private final AnhXaLoaiXe anhXaLoaiXe;

    public BaoCaoMoRong baoCaoMoRong() {
        List<GiaoDichThanhToan> tatCa = anhXaThanhToan.tatCa();
        BigDecimal doanhThu = tatCa.stream()
                .filter(p -> "SUCCESS".equals(p.getTrangThai()))
                .map(p -> p.getSoTien() != null ? p.getSoTien() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal diemTb = anhXaDanhGiaChuyen.diemTrungBinh();
        if (diemTb == null) {
            diemTb = BigDecimal.ZERO;
        }
        return BaoCaoMoRong.builder()
                .soGiaoDichThanhToan(tatCa.size())
                .tongDoanhThu(doanhThu)
                .soVeDaThanhToan(anhXaVeXe.demTheoTrangThai("PAID"))
                .soVeChoXuLy(anhXaVeXe.demTheoTrangThai("PENDING"))
                .soChuyenLichDinh(anhXaChuyenXe.demTheoTrangThai("SCHEDULED"))
                .soDanhGia(anhXaDanhGiaChuyen.demTatCa())
                .diemTrungBinhDanhGia(diemTb)
                .soTinTucHoatDong(anhXaTinTuc.demHoatDong())
                .soKhuyenMaiDangHieuLuc(anhXaKhuyenMai.demDangHoatDong(LocalDateTime.now()))
                .soDiemDungChan(anhXaDiemDungChan.demTatCa())
                .soLoaiXe(anhXaLoaiXe.demTatCa())
                .build();
    }
}
