package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("DichVuThanhToan")
class DichVuThanhToanTest {

    @Mock private AnhXaThanhToan anhXaThanhToan;
    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private AnhXaKhuyenMai anhXaKhuyenMai;
    @Mock private AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;
    @Mock private AnhXaTuyenDuong anhXaTuyenDuong;
    @Mock private AnhXaGheNgoi anhXaGheNgoi;
    @Mock private DichVuGuiMail dichVuGuiMail;
    @Mock private DichVuThongBao dichVuThongBao;
    @Mock private DichVuHetHanVe dichVuHetHanVe;
    @InjectMocks private DichVuThanhToan dichVu;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dichVu, "payOS", null);
    }

    @Test
    @DisplayName("taoLinkPayOs ném lỗi khi chưa cấu hình PayOS")
    void taoLinkPayOs_chuaCauHinh_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        assertThrows(IllegalStateException.class, () -> dichVu.taoLinkPayOs("u", 1L, null));
    }

    @Test
    @DisplayName("lichSuCuaKhach ném lỗi khi không phải khách hàng")
    void lichSu_khongPhaiKhach_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(null);
        assertThrows(IllegalStateException.class, () -> dichVu.lichSuCuaKhach("u"));
    }

    @Test
    @DisplayName("traCuuKetQua ném lỗi khi không tìm thấy giao dịch")
    void traCuu_khongCoGiaoDich_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaVeXe.timTheoMaDonPayOs("123")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.traCuuKetQua("u", 123L));
    }
}
