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

import com.redbus.mohinh.HinhThucThanhToan;
import com.redbus.truyen.YeuCauThanhToanGop;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
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
    @Mock private DichVuKhuyenMai dichVuKhuyenMai;
    @InjectMocks private DichVuThanhToan dichVu;

    private void stubGiaKhongKm() {
        when(dichVuKhuyenMai.apDungMaCode(any(), any(BigDecimal.class)))
                .thenAnswer(inv -> {
                    BigDecimal goc = inv.getArgument(1);
                    return com.redbus.truyen.KetQuaApDungKhuyenMai.builder()
                            .giaGoc(goc)
                            .soTienGiam(BigDecimal.ZERO)
                            .giaSauGiam(goc)
                            .build();
                });
    }

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
        when(anhXaVeXe.danhSachTheoMaDonPayOs("123")).thenReturn(List.of());
        when(anhXaVeXe.timTheoMaDonPayOs("123")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.traCuuKetQua("u", 123L));
    }

    @Test
    @DisplayName("traCuuKetQua trả PAID khi vé đã thanh toán")
    void traCuu_daThanhToan() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaVeXe.danhSachTheoMaDonPayOs("123")).thenReturn(
                List.of(VeXe.builder().ma(5L).maKhach(2L).trangThai("PAID").build()));
        var kq = dichVu.traCuuKetQua("u", 123L);
        assertTrue(kq.isDaThanhToan());
        assertEquals("PAID", kq.getTrangThaiVe());
        assertEquals(5L, kq.getMaVe());
        assertEquals(1, kq.getSoVe());
    }

    @Test
    @DisplayName("tienMatGop thanh toán nhiều vé")
    void tienMatGop_nhieuVe() {
        TaiKhoan tk = TaiKhoan.builder().ma(1L).email("a@b.com").tenDangNhap("u").build();
        KhachHang kh = KhachHang.builder().ma(2L).build();
        VeXe v1 = VeXe.builder().ma(5L).maKhach(2L).maChuyen(10L).maGhe(30L).trangThai("PENDING").thoiGianDat(LocalDateTime.now()).build();
        VeXe v2 = VeXe.builder().ma(6L).maKhach(2L).maChuyen(10L).maGhe(31L).trangThai("PENDING").thoiGianDat(LocalDateTime.now()).build();
        ChuyenXe cx = ChuyenXe.builder().ma(10L).maTuyen(3L).giaVe(BigDecimal.valueOf(200000)).thoiDiemKhoiHanh(LocalDateTime.now().plusDays(1)).build();
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(tk);
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(kh);
        when(anhXaVeXe.huyPendingQuaHanTheoKhach(2L, 5)).thenReturn(0);
        when(anhXaVeXe.timTheoMa(5L)).thenReturn(v1);
        when(anhXaVeXe.timTheoMa(6L)).thenReturn(v2);
        when(anhXaChuyenXe.timTheoMa(10L)).thenReturn(cx);
        when(anhXaHinhThucThanhToan.timTheoMaLoai("TIEN_MAT")).thenReturn(HinhThucThanhToan.builder().ma(1L).maLoai("TIEN_MAT").build());
        when(anhXaTuyenDuong.timTheoMa(3L)).thenReturn(TuyenDuong.builder().diemDi("A").diemDen("B").build());
        when(anhXaGheNgoi.timTheoMa(30L)).thenReturn(GheNgoi.builder().maGhe("A1").build());
        when(anhXaGheNgoi.timTheoMa(31L)).thenReturn(GheNgoi.builder().maGhe("A2").build());
        stubGiaKhongKm();

        YeuCauThanhToanGop yc = new YeuCauThanhToanGop();
        yc.setDsMaVe(List.of(5L, 6L));
        var kq = dichVu.tienMatGop("u", yc);

        assertEquals(2, kq.getDsMaVe().size());
        assertEquals(BigDecimal.valueOf(400000), kq.getTongTien());
        verify(anhXaVeXe, times(2)).capNhatThanhToan(any(VeXe.class));
        verify(dichVuThongBao).guiNhanh(eq(1L), eq("Thanh toán gộp thành công"), anyString());
    }

    @Test
    @DisplayName("layKhach ném lỗi khi không tìm thấy tài khoản")
    void layKhach_khongCoTaiKhoan_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("ghost")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.lichSuCuaKhach("ghost"));
    }

    @Test
    @DisplayName("tienMatTaiQuay từ chối vé đã thanh toán")
    void tienMat_daThanhToan_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaVeXe.huyPendingQuaHanTheoKhach(eq(2L), anyInt())).thenReturn(0);
        when(anhXaVeXe.timTheoMa(5L)).thenReturn(VeXe.builder().ma(5L).maKhach(2L).maChuyen(10L).trangThai("PAID").build());
        assertThrows(IllegalStateException.class, () -> dichVu.tienMatTaiQuay("u", 5L, null));
    }

    @Test
    @DisplayName("tienMatTaiQuay từ chối vé không thuộc khách")
    void tienMat_veKhongHopLe_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaVeXe.huyPendingQuaHanTheoKhach(eq(2L), anyInt())).thenReturn(0);
        when(anhXaVeXe.timTheoMa(5L)).thenReturn(VeXe.builder().ma(5L).maKhach(99L).trangThai("PENDING").thoiGianDat(LocalDateTime.now()).build());
        assertThrows(IllegalArgumentException.class, () -> dichVu.tienMatTaiQuay("u", 5L, null));
    }

    @Test
    @DisplayName("tienMatTaiQuay thành công cập nhật PAID và gửi thông báo")
    void tienMat_thanhCong() {
        TaiKhoan tk = TaiKhoan.builder().ma(1L).email("a@b.com").tenDangNhap("u").build();
        KhachHang kh = KhachHang.builder().ma(2L).build();
        VeXe ve = VeXe.builder().ma(5L).maKhach(2L).maChuyen(10L).maGhe(30L).trangThai("PENDING").thoiGianDat(LocalDateTime.now()).build();
        ChuyenXe cx = ChuyenXe.builder().ma(10L).maTuyen(3L).giaVe(BigDecimal.valueOf(200000)).thoiDiemKhoiHanh(LocalDateTime.now().plusDays(1)).build();
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(tk);
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(kh);
        when(anhXaVeXe.huyPendingQuaHanTheoKhach(2L, 5)).thenReturn(0);
        when(anhXaVeXe.timTheoMa(5L)).thenReturn(ve).thenReturn(ve);
        when(anhXaChuyenXe.timTheoMa(10L)).thenReturn(cx);
        when(anhXaHinhThucThanhToan.timTheoMaLoai("TIEN_MAT")).thenReturn(HinhThucThanhToan.builder().ma(1L).maLoai("TIEN_MAT").build());
        when(anhXaTuyenDuong.timTheoMa(3L)).thenReturn(TuyenDuong.builder().diemDi("A").diemDen("B").build());
        when(anhXaGheNgoi.timTheoMa(30L)).thenReturn(GheNgoi.builder().maGhe("A1").build());
        when(anhXaThanhToan.timTheoMa(5L)).thenReturn(GiaoDichThanhToan.builder().ma(5L).build());
        stubGiaKhongKm();
        dichVu.tienMatTaiQuay("u", 5L, null);
        verify(anhXaVeXe).capNhatThanhToan(any(VeXe.class));
        verify(dichVuThongBao).guiNhanh(eq(1L), anyString(), anyString());
    }

    @Test
    @DisplayName("xuLyWebhookPayOs ném lỗi khi chưa cấu hình PayOS")
    void webhook_chuaCauHinhPayOs_nemLoi() {
        assertThrows(IllegalStateException.class, () -> dichVu.xuLyWebhookPayOs("{}"));
    }
}
