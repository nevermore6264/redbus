package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.truyen.YeuCauGenLich;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
}
