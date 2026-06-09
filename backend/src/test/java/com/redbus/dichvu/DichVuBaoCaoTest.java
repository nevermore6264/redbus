package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.truyen.BaoCaoBieuDoPhanHoi;
import com.redbus.truyen.MucBieuDo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuBaoCao")
class DichVuBaoCaoTest {

    @Mock private AnhXaThanhToan anhXaThanhToan;
    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;
    @Mock private AnhXaTinTuc anhXaTinTuc;
    @Mock private AnhXaKhuyenMai anhXaKhuyenMai;
    @Mock private AnhXaDiemDungChan anhXaDiemDungChan;
    @Mock private AnhXaLoaiXe anhXaLoaiXe;
    @Mock private AnhXaBaoCao anhXaBaoCao;
    @InjectMocks private DichVuBaoCao dichVu;

    @Test
    @DisplayName("bieuDo đủ 7 ngày kể cả khi DB thiếu dữ liệu")
    void bieuDo_dayDu7Ngay() {
        when(anhXaBaoCao.doanhThuTheoNgay(7)).thenReturn(List.of());
        when(anhXaBaoCao.demVeTheoTrangThai()).thenReturn(List.of());
        when(anhXaBaoCao.veTheoPhuongThuc()).thenReturn(List.of());
        when(anhXaBaoCao.topTuyenTheoVe(5)).thenReturn(List.of());
        when(anhXaBaoCao.phanBoDiemDanhGia()).thenReturn(List.of());
        BaoCaoBieuDoPhanHoi kq = dichVu.bieuDo();
        assertEquals(7, kq.getDoanhThuTheoNgay().size());
    }

    @Test
    @DisplayName("baoCaoMoRong tính doanh thu từ giao dịch SUCCESS")
    void baoCaoMoRong_tinhDoanhThu() {
        GiaoDichThanhToan ok = GiaoDichThanhToan.builder().trangThai("SUCCESS").soTien(BigDecimal.valueOf(100_000)).build();
        GiaoDichThanhToan fail = GiaoDichThanhToan.builder().trangThai("FAILED").soTien(BigDecimal.valueOf(50_000)).build();
        when(anhXaThanhToan.tatCa()).thenReturn(List.of(ok, fail));
        when(anhXaDanhGiaChuyen.diemTrungBinh()).thenReturn(BigDecimal.valueOf(4.5));
        when(anhXaVeXe.demTheoTrangThai("PAID")).thenReturn(3);
        when(anhXaVeXe.demTheoTrangThai("PENDING")).thenReturn(1);
        when(anhXaChuyenXe.demTheoTrangThai("SCHEDULED")).thenReturn(2);
        when(anhXaDanhGiaChuyen.demTatCa()).thenReturn(5L);
        when(anhXaTinTuc.demHoatDong()).thenReturn(2L);
        when(anhXaKhuyenMai.demDangHoatDong(any())).thenReturn(1L);
        when(anhXaDiemDungChan.demTatCa()).thenReturn(4L);
        when(anhXaLoaiXe.demTatCa()).thenReturn(2L);
        assertEquals(BigDecimal.valueOf(100_000), dichVu.baoCaoMoRong().getTongDoanhThu());
    }

    @Test
    @DisplayName("xuatCsv trả byte UTF-8 có header")
    void xuatCsv_coHeader() {
        when(anhXaThanhToan.tatCa()).thenReturn(List.of());
        when(anhXaDanhGiaChuyen.diemTrungBinh()).thenReturn(null);
        when(anhXaVeXe.demTheoTrangThai(anyString())).thenReturn(0);
        when(anhXaChuyenXe.demTheoTrangThai(anyString())).thenReturn(0);
        when(anhXaDanhGiaChuyen.demTatCa()).thenReturn(0L);
        when(anhXaTinTuc.demHoatDong()).thenReturn(0L);
        when(anhXaKhuyenMai.demDangHoatDong(any())).thenReturn(0L);
        when(anhXaDiemDungChan.demTatCa()).thenReturn(0L);
        when(anhXaLoaiXe.demTatCa()).thenReturn(0L);
        String csv = new String(dichVu.xuatCsv());
        assertTrue(csv.contains("Bao cao RedBus"));
        assertTrue(csv.contains("Chi tieu,Gia tri"));
    }

    @Test
    @DisplayName("bieuDo gộp dữ liệu DB vào 7 ngày gần nhất")
    void bieuDo_coDuLieuTuDb() {
        MucBieuDo m = MucBieuDo.builder().nhan("18/05").giaTri(BigDecimal.valueOf(50_000)).build();
        when(anhXaBaoCao.doanhThuTheoNgay(7)).thenReturn(List.of(m));
        when(anhXaBaoCao.demVeTheoTrangThai()).thenReturn(List.of(m));
        when(anhXaBaoCao.veTheoPhuongThuc()).thenReturn(List.of());
        when(anhXaBaoCao.topTuyenTheoVe(5)).thenReturn(List.of());
        when(anhXaBaoCao.phanBoDiemDanhGia()).thenReturn(List.of());
        BaoCaoBieuDoPhanHoi kq = dichVu.bieuDo();
        assertTrue(kq.getDoanhThuTheoNgay().stream().anyMatch(x -> "18/05".equals(x.getNhan())));
    }

    @Test
    @DisplayName("baoCaoMoRong điểm đánh giá null trả 0")
    void baoCaoMoRong_diemNull_tra0() {
        when(anhXaThanhToan.tatCa()).thenReturn(List.of());
        when(anhXaDanhGiaChuyen.diemTrungBinh()).thenReturn(null);
        when(anhXaVeXe.demTheoTrangThai(anyString())).thenReturn(0);
        when(anhXaChuyenXe.demTheoTrangThai(anyString())).thenReturn(0);
        when(anhXaDanhGiaChuyen.demTatCa()).thenReturn(0L);
        when(anhXaTinTuc.demHoatDong()).thenReturn(0L);
        when(anhXaKhuyenMai.demDangHoatDong(any())).thenReturn(0L);
        when(anhXaDiemDungChan.demTatCa()).thenReturn(0L);
        when(anhXaLoaiXe.demTatCa()).thenReturn(0L);
        assertEquals(BigDecimal.ZERO, dichVu.baoCaoMoRong().getDiemTrungBinhDanhGia());
    }
}
