package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaLoaiXe;
import com.redbus.anhxa.AnhXaLoaiXeAnh;
import com.redbus.mohinh.LoaiXe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuLoaiXe")
class DichVuLoaiXeTest {

    @Mock private AnhXaLoaiXe anhXaLoaiXe;
    @Mock private AnhXaLoaiXeAnh anhXaLoaiXeAnh;
    @InjectMocks private DichVuLoaiXe dichVu;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dichVu, "thuMucUpload", "target/test-uploads");
    }

    @Test
    @DisplayName("layTheoMa ném lỗi khi không có loại xe")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaLoaiXe.timTheoMa(1L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(1L));
    }

    @Test
    @DisplayName("them từ chối tên trống")
    void them_tenTrong_nemLoi() {
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(new LoaiXe()));
    }

    @Test
    @DisplayName("taiAnh từ chối khi chưa chọn tệp")
    void taiAnh_chuaChonTep_nemLoi() {
        when(anhXaLoaiXe.timTheoMa(1L)).thenReturn(LoaiXe.builder().ma(1L).ten("Limousine").build());
        when(anhXaLoaiXeAnh.timTheoMaLoaiXe(1L)).thenReturn(List.of());
        assertThrows(IllegalArgumentException.class, () -> dichVu.taiAnh(1L, null));
    }
}
