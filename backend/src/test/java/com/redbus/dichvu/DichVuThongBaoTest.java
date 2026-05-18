package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaThongBao;
import com.redbus.mohinh.ThongBao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuThongBao")
class DichVuThongBaoTest {

    @Mock private AnhXaThongBao anhXaThongBao;
    @Mock private DichVuThongBaoPhat dichVuThongBaoPhat;
    @InjectMocks private DichVuThongBao dichVu;

    @Test
    @DisplayName("danhSachCuaNguoiDung gọi mapper")
    void danhSach_goiMapper() {
        when(anhXaThongBao.danhSachTheoMaNguoiDung(1L)).thenReturn(List.of());
        dichVu.danhSachCuaNguoiDung(1L);
        verify(anhXaThongBao).danhSachTheoMaNguoiDung(1L);
    }

    @Test
    @DisplayName("guiNhanh lưu DB và phát SSE")
    void guiNhanh_luuVaPhat() {
        dichVu.guiNhanh(1L, "Tiêu đề", "Nội dung");
        verify(anhXaThongBao).them(any(ThongBao.class));
        verify(dichVuThongBaoPhat).phat(1L, "Tiêu đề", "Nội dung");
    }

    @Test
    @DisplayName("danhDauDaDoc gọi mapper")
    void danhDauDaDoc_goiMapper() {
        dichVu.danhDauDaDoc(5L, 1L);
        verify(anhXaThongBao).danhDauDaDoc(5L, 1L);
    }
}
