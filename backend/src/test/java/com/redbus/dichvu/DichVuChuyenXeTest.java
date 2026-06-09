package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import com.redbus.truyen.ChuyenXeLocPhanHoi;
import com.redbus.truyen.YeuCauGenLich;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuChuyenXe")
class DichVuChuyenXeTest {

    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaTuyenDuong anhXaTuyenDuong;
    @Mock private AnhXaXeKhach anhXaXeKhach;
    @Mock private AnhXaGheNgoi anhXaGheNgoi;
    @Mock private AnhXaLoaiXe anhXaLoaiXe;
    @InjectMocks private DichVuChuyenXe dichVu;

    @Test
    @DisplayName("layTheoMa ném lỗi khi không có chuyến")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaChuyenXe.timTheoMa(1L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(1L));
    }

    @Test
    @DisplayName("them từ chối giá vé <= 0")
    void them_giaKhongHopLe_nemLoi() {
        ChuyenXe cx = ChuyenXe.builder()
                .maTuyen(1L).maXe(1L)
                .thoiDiemKhoiHanh(LocalDateTime.now().plusDays(1))
                .giaVe(BigDecimal.ZERO)
                .build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(cx));
    }

    @Test
    @DisplayName("capNhat yêu cầu có mã chuyến")
    void capNhat_thieuMa_nemLoi() {
        assertThrows(IllegalArgumentException.class, () -> dichVu.capNhat(new ChuyenXe()));
    }

    @Test
    @DisplayName("genLich từ chối quá 31 ngày")
    void genLich_qua31Ngay_nemLoi() {
        assertThrows(IllegalArgumentException.class,
                () -> {
                    YeuCauGenLich y = new YeuCauGenLich();
                    y.setSoNgay(32);
                    dichVu.genLich(y);
                });
    }

    @Test
    @DisplayName("timKiemNangCao lọc theo giá và loại xe")
    void timKiem_locGiaVaLoaiXe() {
        LocalDateTime kh = LocalDateTime.of(2026, 6, 1, 9, 0);
        ChuyenXe cx = ChuyenXe.builder().ma(1L).maTuyen(1L).maXe(10L).giaVe(BigDecimal.valueOf(200_000)).thoiDiemKhoiHanh(kh).build();
        when(anhXaChuyenXe.timTheoTuyenVaSauThoiDiem(1L, kh)).thenReturn(List.of(cx));
        when(anhXaXeKhach.timTheoMa(10L)).thenReturn(XeKhach.builder().ma(10L).maLoaiXe(2L).build());
        when(anhXaGheNgoi.timTheoMaXe(10L)).thenReturn(List.of(GheNgoi.builder().build(), GheNgoi.builder().build()));
        when(anhXaChuyenXe.danhSachMaGheDaGiu(1L)).thenReturn(List.of(1L));
        when(anhXaLoaiXe.timTheoMa(2L)).thenReturn(LoaiXe.builder().ten("Giường nằm").build());
        List<ChuyenXeLocPhanHoi> kq = dichVu.timKiemNangCao(1L, kh, BigDecimal.valueOf(150_000), BigDecimal.valueOf(300_000), 2L, 8, 12, null);
        assertEquals(1, kq.size());
        assertEquals(1, kq.get(0).getSoGheTrong());
        assertEquals("Giường nằm", kq.get(0).getTenLoaiXe());
    }

    @Test
    @DisplayName("timKiemNangCao bỏ qua chuyến không có xe")
    void timKiem_khongCoXe_boQua() {
        LocalDateTime kh = LocalDateTime.now().plusDays(1);
        ChuyenXe cx = ChuyenXe.builder().ma(1L).maTuyen(1L).maXe(99L).giaVe(BigDecimal.TEN).thoiDiemKhoiHanh(kh).build();
        when(anhXaChuyenXe.timTheoTuyenVaSauThoiDiem(eq(1L), any())).thenReturn(List.of(cx));
        when(anhXaXeKhach.timTheoMa(99L)).thenReturn(null);
        assertTrue(dichVu.timKiemNangCao(1L, kh, null, null, null, null, null, null).isEmpty());
    }

    @Test
    @DisplayName("them từ chối giờ đến trước giờ khởi hành")
    void them_gioDenTruocKhoiHanh_nemLoi() {
        LocalDateTime khoi = LocalDateTime.now().plusDays(1);
        ChuyenXe cx = ChuyenXe.builder()
                .maTuyen(1L).maXe(1L).giaVe(BigDecimal.valueOf(100_000))
                .thoiDiemKhoiHanh(khoi)
                .thoiDiemDen(khoi.minusHours(1))
                .build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(cx));
    }

    @Test
    @DisplayName("genLich từ chối khi không có tuyến hoạt động")
    void genLich_khongCoTuyen_nemLoi() {
        when(anhXaTuyenDuong.tatCa()).thenReturn(List.of());
        when(anhXaXeKhach.tatCa()).thenReturn(List.of(XeKhach.builder().ma(1L).hoatDong(true).build()));
        YeuCauGenLich y = new YeuCauGenLich();
        y.setSoNgay(1);
        assertThrows(IllegalArgumentException.class, () -> dichVu.genLich(y));
    }
}
