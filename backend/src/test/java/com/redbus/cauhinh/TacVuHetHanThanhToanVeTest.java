package com.redbus.cauhinh;

import com.redbus.dichvu.DichVuHetHanVe;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TacVuHetHanThanhToanVe")
class TacVuHetHanThanhToanVeTest {

    @Mock private DichVuHetHanVe dichVuHetHanVe;
    @InjectMocks private TacVuHetHanThanhToanVe tacVu;

    @Test
    @DisplayName("tuDongHuyVeQuaHan gọi xử lý hết hạn")
    void tuDongHuy_goiDichVu() {
        when(dichVuHetHanVe.xuLyHetHanTatCa()).thenReturn(0);
        tacVu.tuDongHuyVeQuaHan();
        verify(dichVuHetHanVe).xuLyHetHanTatCa();
    }

    @Test
    @DisplayName("tuDongHuyVeQuaHan không lỗi khi có vé hủy")
    void tuDongHuy_coVe_khongLoi() {
        when(dichVuHetHanVe.xuLyHetHanTatCa()).thenReturn(3);
        tacVu.tuDongHuyVeQuaHan();
        verify(dichVuHetHanVe).xuLyHetHanTatCa();
    }
}
