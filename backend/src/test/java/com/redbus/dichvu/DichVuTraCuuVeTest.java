package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuTraCuuVe")
class DichVuTraCuuVeTest {

    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaTuyenDuong anhXaTuyenDuong;
    @Mock private AnhXaGheNgoi anhXaGheNgoi;
    @Mock private AnhXaDiemDungChan anhXaDiemDungChan;
    @InjectMocks private DichVuTraCuuVe dichVu;

    @Test
    @DisplayName("traCuuCongKhai từ chối mã vé trống")
    void traCuu_maTrong_nemLoi() {
        assertThrows(IllegalArgumentException.class, () -> dichVu.traCuuCongKhai(" ", "090"));
    }

    @Test
    @DisplayName("traCuuCongKhai từ chối số điện thoại không khớp")
    void traCuu_sdtKhongKhop_nemLoi() {
        when(anhXaVeXe.timTheoMaVeHienThi("RB1")).thenReturn(VeXe.builder().ma(1L).maKhach(2L).build());
        when(anhXaKhachHang.timTheoMa(2L)).thenReturn(KhachHang.builder().soDienThoai("0901111111").build());
        assertThrows(IllegalArgumentException.class, () -> dichVu.traCuuCongKhai("RB1", "0999999999"));
    }

    @Test
    @DisplayName("veDienTuCuaToi từ chối vé chưa thanh toán")
    void veDienTu_chuaThanhToan_nemLoi() {
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(VeXe.builder().ma(1L).maKhach(2L).trangThai("PENDING").build());
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        assertThrows(IllegalStateException.class, () -> dichVu.veDienTuCuaToi("u", 1L));
    }
}
