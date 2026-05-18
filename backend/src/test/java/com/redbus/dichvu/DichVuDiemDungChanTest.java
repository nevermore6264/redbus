package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.hotro.NguonCase;
import com.redbus.mohinh.DiemDungChan;
import com.redbus.mohinh.TuyenDuong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuDiemDungChan — quản lý điểm dừng trên tuyến")
class DichVuDiemDungChanTest {

    @Mock
    private AnhXaDiemDungChan anhXaDiemDungChan;
    @Mock
    private AnhXaTuyenDuong anhXaTuyenDuong;
    @InjectMocks
    private DichVuDiemDungChan dichVu;

    private DiemDungChan mau;

    @BeforeEach
    void setUp() {
        mau = DiemDungChan.builder()
                .ma(1L)
                .maTuyen(10L)
                .tenDiem("Bến trung gian")
                .thuTu(1)
                .thoiGianDungPhut(5)
                .build();
    }

    @Test
    @DisplayName("theoMaTuyen khi không có tuyến → IllegalArgumentException")
    void theoMaTuyen_khongCoTuyen() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.theoMaTuyen(10L));
    }

    @Test
    @DisplayName("them chuẩn hóa tên và gán mặc định thuTu/thoiGianDungPhut")
    void them_chuanHoaTenVaMacDinh() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        DiemDungChan d = DiemDungChan.builder().maTuyen(10L).tenDiem("  ten   diem  ").build();
        when(anhXaDiemDungChan.timTheoTuyenVaThuTu(any(), any(), any())).thenReturn(null);
        when(anhXaDiemDungChan.timTheoTuyenVaTenDiem(any(), any(), any())).thenReturn(null);
        when(anhXaDiemDungChan.timTheoMa(any())).thenReturn(d);
        dichVu.them(d);
        assertEquals("ten diem", d.getTenDiem());
        assertEquals(0, d.getThuTu());
        assertEquals(5, d.getThoiGianDungPhut());
    }

    @ParameterizedTest(name = "case {0}: thuTu = {0} hợp lệ (>=0)")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: thuTu hợp lệ khi thêm điểm dừng")
    void them1000ThuTuHopLe(int chiSo) {
        int thuTu = chiSo % 200;
        DiemDungChan d = DiemDungChan.builder()
                .maTuyen(10L)
                .tenDiem("Diem " + chiSo)
                .thuTu(thuTu)
                .thoiGianDungPhut(3)
                .build();
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        when(anhXaDiemDungChan.timTheoTuyenVaThuTu(any(), any(), any())).thenReturn(null);
        when(anhXaDiemDungChan.timTheoTuyenVaTenDiem(any(), any(), any())).thenReturn(null);
        when(anhXaDiemDungChan.timTheoMa(any())).thenReturn(d);
        assertDoesNotThrow(() -> dichVu.them(d));
        assertEquals(thuTu, d.getThuTu());
    }

    @ParameterizedTest(name = "case {0}: tên điểm rỗng sau trim → lỗi")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: tên điểm không được trống")
    void them1000TenTrong(int chiSo) {
        String ten = chiSo % 2 == 0 ? "   " : "";
        DiemDungChan d = DiemDungChan.builder().maTuyen(10L).tenDiem(ten).build();
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(d));
    }
}
