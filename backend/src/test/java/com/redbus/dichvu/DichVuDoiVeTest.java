package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import com.redbus.truyen.YeuCauDoiGhe;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuDoiVe")
class DichVuDoiVeTest {

    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaGheNgoi anhXaGheNgoi;
    @Mock private DichVuThongBao dichVuThongBao;
    @InjectMocks private DichVuDoiVe dichVu;

    @Test
    @DisplayName("doiGhe ném lỗi khi không có vé")
    void doiGhe_khongCoVe_nemLoi() {
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.doiGhe("u", 1L, yeuCauDoiGhe(2L)));
    }

    @Test
    @DisplayName("doiGhe từ chối khi chuyến sắp khởi hành dưới 2 giờ")
    void doiGhe_quaGio_nemLoi() {
        VeXe ve = VeXe.builder().ma(1L).maKhach(2L).maChuyen(3L).trangThai("PAID").build();
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(ve);
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaChuyenXe.timTheoMa(3L)).thenReturn(ChuyenXe.builder()
                .ma(3L).maXe(5L).thoiDiemKhoiHanh(LocalDateTime.now().plusHours(1)).build());
        assertThrows(IllegalStateException.class,
                () -> dichVu.doiGhe("u", 1L, yeuCauDoiGhe(9L)));
    }

    @Test
    @DisplayName("doiGhe thành công cập nhật ghế và thông báo")
    void doiGhe_thanhCong() {
        VeXe ve = VeXe.builder().ma(1L).maKhach(2L).maChuyen(3L).trangThai("PAID").build();
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(ve);
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaChuyenXe.timTheoMa(3L)).thenReturn(ChuyenXe.builder()
                .ma(3L).maXe(5L).thoiDiemKhoiHanh(LocalDateTime.now().plusDays(1)).build());
        when(anhXaGheNgoi.timTheoMa(9L)).thenReturn(GheNgoi.builder().ma(9L).maXe(5L).build());
        when(anhXaVeXe.timTheoMaChuyen(3L)).thenReturn(List.of());
        dichVu.doiGhe("u", 1L, yeuCauDoiGhe(9L));
        verify(anhXaVeXe).capNhatGhe(1L, 9L);
        verify(dichVuThongBao).guiNhanh(eq(1L), contains("Đổi ghế"), anyString());
    }

    private static YeuCauDoiGhe yeuCauDoiGhe(Long maGheMoi) {
        YeuCauDoiGhe y = new YeuCauDoiGhe();
        y.setMaGheMoi(maGheMoi);
        return y;
    }
}
