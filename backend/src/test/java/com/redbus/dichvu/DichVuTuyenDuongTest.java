package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.mohinh.TuyenDuong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuTuyenDuong")
class DichVuTuyenDuongTest {

    @Mock
    private AnhXaTuyenDuong anhXaTuyenDuong;

    @InjectMocks
    private DichVuTuyenDuong dichVu;

    private TuyenDuong hopLe;

    @BeforeEach
    void setUp() {
        hopLe = TuyenDuong.builder()
                .ma(1L)
                .diemDi("Hà Nội")
                .diemDen("Hải Phòng")
                .khoangCachKm(120)
                .thoiGianUocTinhPhut(150)
                .hoatDong(true)
                .build();
    }

    @Test
    @DisplayName("danhSach không filter trả toàn bộ tuyến")
    void danhSach_khongFilter_traTatCa() {
        when(anhXaTuyenDuong.tatCa()).thenReturn(List.of(hopLe));
        assertEquals(1, dichVu.danhSach(null, null).size());
        verify(anhXaTuyenDuong).tatCa();
        verify(anhXaTuyenDuong, never()).timKiem(anyString(), anyString());
    }

    @Test
    @DisplayName("danhSach có filter gọi timKiem")
    void danhSach_coFilter_goiTimKiem() {
        when(anhXaTuyenDuong.timKiem("Hà Nội", "")).thenReturn(List.of(hopLe));
        assertEquals(1, dichVu.danhSach("Hà Nội", null).size());
        verify(anhXaTuyenDuong).timKiem("Hà Nội", "");
    }

    @Test
    @DisplayName("them chuẩn hóa điểm đi/đến và gán hoatDong mặc định")
    void them_chuanHoaDiemVaHoatDongMacDinh() {
        TuyenDuong t = TuyenDuong.builder()
                .diemDi("  ha  noi ")
                .diemDen("  hai  phong ")
                .khoangCachKm(100)
                .thoiGianUocTinhPhut(120)
                .build();
        when(anhXaTuyenDuong.timTheoCapDiem(anyString(), anyString(), isNull())).thenReturn(null);
        dichVu.them(t);
        assertEquals("ha noi", t.getDiemDi());
        assertEquals("hai phong", t.getDiemDen());
        assertTrue(t.getHoatDong());
        verify(anhXaTuyenDuong).them(t);
    }

    @Test
    @DisplayName("them từ chối điểm đi trùng điểm đến")
    void them_diemDiTrungDen_nemLoi() {
        TuyenDuong t = TuyenDuong.builder()
                .diemDi("Huế")
                .diemDen("huế")
                .khoangCachKm(10)
                .thoiGianUocTinhPhut(20)
                .build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(t));
    }

    @Test
    @DisplayName("them từ chối khoảng cách không hợp lệ")
    void them_khoangCachKhongHopLe_nemLoi() {
        TuyenDuong t = TuyenDuong.builder()
                .diemDi("A")
                .diemDen("B")
                .khoangCachKm(0)
                .thoiGianUocTinhPhut(60)
                .build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(t));
    }

    @Test
    @DisplayName("capNhat thiếu mã tuyến ném lỗi")
    void capNhat_thieuMa_nemLoi() {
        TuyenDuong t = banSao(hopLe);
        t.setMa(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.capNhat(t));
    }

    @Test
    @DisplayName("layTheoMa ném lỗi khi không có tuyến")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaTuyenDuong.timTheoMa(99L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(99L));
    }

    private static TuyenDuong banSao(TuyenDuong goc) {
        TuyenDuong t = new TuyenDuong();
        t.setMa(goc.getMa());
        t.setDiemDi(goc.getDiemDi());
        t.setDiemDen(goc.getDiemDen());
        t.setKhoangCachKm(goc.getKhoangCachKm());
        t.setThoiGianUocTinhPhut(goc.getThoiGianUocTinhPhut());
        t.setHoatDong(goc.getHoatDong());
        return t;
    }
}
