package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauDanhGiaChuyen;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuDanhGiaChuyen")
class DichVuDanhGiaChuyenTest {

    @Mock private AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaTuyenDuong anhXaTuyenDuong;
    @InjectMocks private DichVuDanhGiaChuyen dichVu;

    @Test
    @DisplayName("congKhai giới hạn trong khoảng 1–30")
    void congKhai_gioiHanAnToan() {
        when(anhXaDanhGiaChuyen.congKhai(30)).thenReturn(java.util.List.of());
        dichVu.congKhai(100);
        verify(anhXaDanhGiaChuyen).congKhai(30);
    }

    private static YeuCauDanhGiaChuyen yeuCauDanhGia(Long maChuyen, int diem) {
        YeuCauDanhGiaChuyen y = new YeuCauDanhGiaChuyen();
        y.setMaChuyen(maChuyen);
        y.setDiemSo(diem);
        return y;
    }

    @Test
    @DisplayName("vietDanhGia ném lỗi khi chưa có hồ sơ khách")
    void vietDanhGia_chuaCoKhach_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(null);
        assertThrows(IllegalStateException.class,
                () -> dichVu.vietDanhGia("u", yeuCauDanhGia(1L, 5)));
    }

    @Test
    @DisplayName("vietDanhGia từ chối đánh giá trùng chuyến")
    void vietDanhGia_daDanhGia_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaDanhGiaChuyen.timTheoMaChuyenVaMaKhach(1L, 2L)).thenReturn(
                com.redbus.mohinh.DanhGiaChuyen.builder().ma(9L).build());
        assertThrows(IllegalStateException.class,
                () -> dichVu.vietDanhGia("u", yeuCauDanhGia(1L, 5)));
    }
}
