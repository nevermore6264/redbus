package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaXeKhach;
import com.redbus.mohinh.XeKhach;
import org.junit.jupiter.api.BeforeEach;
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
@DisplayName("DichVuXeKhach")
class DichVuXeKhachTest {

    @Mock
    private AnhXaXeKhach anhXaXeKhach;

    @InjectMocks
    private DichVuXeKhach dichVu;

    private XeKhach hopLe;

    @BeforeEach
    void setUp() {
        hopLe = XeKhach.builder()
                .ma(1L)
                .bienSo("51A-12345")
                .hangXe("Hoàng Long")
                .maLoaiXe(2L)
                .soCho(40)
                .hoatDong(true)
                .build();
    }

    @Test
    @DisplayName("them chuẩn hóa biển số uppercase và hãng xe")
    void them_chuanHoaBienSoVaHangXe() {
        XeKhach x = XeKhach.builder()
                .bienSo(" 51a - 99999 ")
                .hangXe("  phuong  trang  ")
                .maLoaiXe(1L)
                .soCho(45)
                .build();
        when(anhXaXeKhach.timTheoBienSo(anyString(), isNull())).thenReturn(null);
        dichVu.them(x);
        assertEquals("51A-99999", x.getBienSo());
        assertEquals("phuong trang", x.getHangXe());
        assertTrue(x.getHoatDong());
        verify(anhXaXeKhach).them(x);
    }

    @Test
    @DisplayName("them từ chối thiếu loại xe")
    void them_thieuLoaiXe_nemLoi() {
        XeKhach x = XeKhach.builder().bienSo("29B-11111").soCho(30).build();
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(x));
    }

    @Test
    @DisplayName("them từ chối biển số trùng")
    void them_bienSoTrung_nemLoi() {
        when(anhXaXeKhach.timTheoBienSo(eq("51A-12345"), isNull())).thenReturn(hopLe);
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(banSao(hopLe)));
    }

    @Test
    @DisplayName("them từ chối số chỗ không hợp lệ")
    void them_soChoKhongHopLe_nemLoi() {
        XeKhach x = banSao(hopLe);
        x.setBienSo("99Z-88888");
        x.setSoCho(0);
        assertThrows(IllegalArgumentException.class, () -> dichVu.them(x));
    }

    @Test
    @DisplayName("layTheoMa ném lỗi khi xe không tồn tại")
    void layTheoMa_khongCo_nemLoi() {
        when(anhXaXeKhach.timTheoMa(7L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.layTheoMa(7L));
    }

    private static XeKhach banSao(XeKhach goc) {
        XeKhach x = new XeKhach();
        x.setMa(goc.getMa());
        x.setBienSo(goc.getBienSo());
        x.setHangXe(goc.getHangXe());
        x.setMaLoaiXe(goc.getMaLoaiXe());
        x.setSoCho(goc.getSoCho());
        x.setHoatDong(goc.getHoatDong());
        return x;
    }
}
