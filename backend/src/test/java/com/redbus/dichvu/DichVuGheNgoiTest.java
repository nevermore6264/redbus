package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.mohinh.GheNgoi;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuGheNgoi")
class DichVuGheNgoiTest {

    @Mock
    private AnhXaGheNgoi anhXaGheNgoi;
    @InjectMocks
    private DichVuGheNgoi dichVu;

    @Test
    @DisplayName("doiTrangThai ném lỗi khi ghế không tồn tại")
    void doiTrangThai_khongCoGhe_nemLoi() {
        when(anhXaGheNgoi.timTheoMa(1L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.doiTrangThai(1L, "AVAILABLE"));
    }

    @Test
    @DisplayName("doiTrangThai từ chối trạng thái không hợp lệ")
    void doiTrangThai_trangThaiSai_nemLoi() {
        when(anhXaGheNgoi.timTheoMa(1L)).thenReturn(new GheNgoi());
        assertThrows(IllegalArgumentException.class, () -> dichVu.doiTrangThai(1L, "OCCUPIED"));
    }

    @Test
    @DisplayName("doiTrangThai cập nhật AVAILABLE uppercase")
    void doiTrangThai_hopLe_goiCapNhat() {
        when(anhXaGheNgoi.timTheoMa(2L)).thenReturn(GheNgoi.builder().ma(2L).build());
        dichVu.doiTrangThai(2L, "blocked");
        verify(anhXaGheNgoi).capNhatTrangThai(2L, "BLOCKED");
    }
}
