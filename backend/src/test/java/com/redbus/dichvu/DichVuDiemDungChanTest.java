package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.mohinh.DiemDungChan;
import com.redbus.mohinh.TuyenDuong;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuDiemDungChan")
class DichVuDiemDungChanTest {

    @Mock
    private AnhXaDiemDungChan anhXaDiemDungChan;
    @Mock
    private AnhXaTuyenDuong anhXaTuyenDuong;
    @InjectMocks
    private DichVuDiemDungChan dichVu;

    @Test
    @DisplayName("theoMaTuyen ném lỗi khi tuyến không tồn tại")
    void theoMaTuyen_khongCoTuyen_nemLoi() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.theoMaTuyen(10L));
    }

    @Test
    @DisplayName("them chuẩn hóa tên và gán mặc định thuTu, thoiGianDungPhut")
    void them_chuanHoaTenVaGanMacDinh() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        DiemDungChan d = DiemDungChan.builder().maTuyen(10L).tenDiem("  ben   dung  ").build();
        when(anhXaDiemDungChan.timTheoTuyenVaThuTu(any(), any(), any())).thenReturn(null);
        when(anhXaDiemDungChan.timTheoTuyenVaTenDiem(any(), any(), any())).thenReturn(null);
        when(anhXaDiemDungChan.timTheoMa(any())).thenReturn(d);
        dichVu.them(d);
        assertEquals("ben dung", d.getTenDiem());
        assertEquals(0, d.getThuTu());
        assertEquals(5, d.getThoiGianDungPhut());
    }

    @Test
    @DisplayName("them từ chối tên điểm trống")
    void them_tenTrong_nemLoi() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        DiemDungChan d = DiemDungChan.builder().maTuyen(10L).tenDiem("   ").build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(d));
    }

    @Test
    @DisplayName("them từ chối thuTu âm")
    void them_thuTuAm_nemLoi() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        DiemDungChan d = DiemDungChan.builder().maTuyen(10L).tenDiem("A").thuTu(-1).build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(d));
    }

    @Test
    @DisplayName("them từ chối trùng thứ tự trên cùng tuyến")
    void them_trungThuTu_nemLoi() {
        when(anhXaTuyenDuong.timTheoMa(10L)).thenReturn(new TuyenDuong());
        DiemDungChan d = DiemDungChan.builder().maTuyen(10L).tenDiem("Mới").thuTu(1).build();
        when(anhXaDiemDungChan.timTheoTuyenVaThuTu(10L, 1, null))
                .thenReturn(DiemDungChan.builder().ma(9L).tenDiem("Cũ").build());
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(d));
    }

    @Test
    @DisplayName("layTheoMa ném lỗi khi điểm dừng không tồn tại")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaDiemDungChan.timTheoMa(5L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(5L));
    }
}
