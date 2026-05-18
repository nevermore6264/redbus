package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTinTuc;
import com.redbus.mohinh.TinTuc;
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
@DisplayName("DichVuTinTuc")
class DichVuTinTucTest {

    @Mock
    private AnhXaTinTuc anhXaTinTuc;
    @InjectMocks
    private DichVuTinTuc dichVu;

    @Test
    @DisplayName("congKhai giới hạn trong khoảng 1..50")
    void congKhai_gioiHanDuocClamp() {
        dichVu.congKhai(999);
        verify(anhXaTinTuc).congKhai(50);
        dichVu.congKhai(0);
        verify(anhXaTinTuc).congKhai(1);
    }

    @Test
    @DisplayName("them chuẩn hóa tiêu đề và gán hoatDong mặc định")
    void them_chuanHoaTieuDe() {
        TinTuc t = TinTuc.builder().tieuDe("  tieu  de  ").noiDung("noi dung").build();
        when(anhXaTinTuc.timTheoMa(any())).thenReturn(t);
        dichVu.them(t);
        assertEquals("tieu de", t.getTieuDe());
        assertTrue(t.getHoatDong());
    }

    @Test
    @DisplayName("them từ chối nội dung trống")
    void them_noiDungTrong_nemLoi() {
        TinTuc t = TinTuc.builder().tieuDe("Tin").noiDung("  ").build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(t));
    }
}
