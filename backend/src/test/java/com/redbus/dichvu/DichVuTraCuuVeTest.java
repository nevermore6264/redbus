package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dichVu, "frontendUrl", "https://redbus.vn");
    }

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

    @Test
    @DisplayName("traCuuCongKhai từ chối số điện thoại trống")
    void traCuu_sdtTrong_nemLoi() {
        assertThrows(IllegalArgumentException.class, () -> dichVu.traCuuCongKhai("RB1", " "));
    }

    @Test
    @DisplayName("traCuuCongKhai từ chối vé không tồn tại")
    void traCuu_khongTimThayVe_nemLoi() {
        when(anhXaVeXe.timTheoMaVeHienThi("RB99")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.traCuuCongKhai("RB99", "0901111111"));
    }

    @Test
    @DisplayName("traCuuCongKhai thành công khi SĐT khớp (có dấu cách)")
    void traCuu_sdtKhop_thanhCong() {
        VeXe ve = VeXe.builder().ma(1L).maKhach(2L).maChuyen(3L).maGhe(4L)
                .maVeHienThi("RBABC").trangThai("PAID").soTienThanhToan(BigDecimal.valueOf(200_000)).build();
        when(anhXaVeXe.timTheoMaVeHienThi("RBABC")).thenReturn(ve);
        when(anhXaKhachHang.timTheoMa(2L)).thenReturn(KhachHang.builder().hoTen("Nguyen A").soDienThoai("090-111-1111").build());
        when(anhXaChuyenXe.timTheoMa(3L)).thenReturn(ChuyenXe.builder().ma(3L).maTuyen(5L)
                .thoiDiemKhoiHanh(LocalDateTime.of(2026, 6, 1, 8, 0)).build());
        when(anhXaTuyenDuong.timTheoMa(5L)).thenReturn(TuyenDuong.builder().diemDi("HCM").diemDen("DL").build());
        when(anhXaGheNgoi.timTheoMa(4L)).thenReturn(GheNgoi.builder().maGhe("A12").build());
        var kq = dichVu.traCuuCongKhai(" rbabc ", "0901111111");
        assertEquals("RBABC", kq.getMaVeHienThi());
        assertEquals("Nguyen A", kq.getTenKhach());
        assertTrue(kq.getNoiDungQr().contains("tra-cuu-ve?ma=RBABC"));
    }

    @Test
    @DisplayName("veDienTuCuaToi thành công vé PAID của chủ tài khoản")
    void veDienTu_paid_thanhCong() {
        VeXe ve = VeXe.builder().ma(10L).maKhach(2L).maChuyen(3L).maGhe(4L)
                .trangThai("PAID").soTienThanhToan(BigDecimal.TEN).build();
        when(anhXaVeXe.timTheoMa(10L)).thenReturn(ve);
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).hoTen("B").soDienThoai("09").build());
        when(anhXaChuyenXe.timTheoMa(3L)).thenReturn(null);
        when(anhXaGheNgoi.timTheoMa(4L)).thenReturn(null);
        var kq = dichVu.veDienTuCuaToi("u", 10L);
        assertEquals("PAID", kq.getTrangThai());
        assertEquals("B", kq.getTenKhach());
    }

    @Test
    @DisplayName("veDienTuCuaToi từ chối vé không thuộc tài khoản")
    void veDienTu_khongPhaiCuaToi_nemLoi() {
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(VeXe.builder().ma(1L).maKhach(99L).trangThai("PAID").build());
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        assertThrows(IllegalStateException.class, () -> dichVu.veDienTuCuaToi("u", 1L));
    }
}
