package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import com.redbus.truyen.YeuCauHuyVeHoanTien;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuHuyVeHoanTien")
class DichVuHuyVeHoanTienTest {

    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;
    @Mock private AnhXaKhuyenMai anhXaKhuyenMai;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private DichVuThongBao dichVuThongBao;
    @InjectMocks private DichVuHuyVeHoanTien dichVu;

    @Test
    @DisplayName("huyVeDaThanhToan tạo yêu cầu REFUND_PENDING")
    void huyVe_tienMat_choXuLy() {
        LocalDateTime kh = LocalDateTime.now().plusDays(1);
        VeXe ve = VeXe.builder()
                .ma(1L).maKhach(2L).maChuyen(10L).trangThai("PAID")
                .maHinhThuc(5L).soTienThanhToan(BigDecimal.valueOf(150_000))
                .build();
        YeuCauHuyVeHoanTien yc = new YeuCauHuyVeHoanTien();
        yc.setStk("1234567890");
        yc.setTenNganHang("Vietcombank");
        yc.setTenNguoiNhan("Nguyễn Văn A");
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaChuyenXe.timTheoMa(10L)).thenReturn(
                ChuyenXe.builder().ma(10L).thoiDiemKhoiHanh(kh).build());
        when(anhXaHinhThucThanhToan.timTheoMa(5L)).thenReturn(
                HinhThucThanhToan.builder().maLoai("TIEN_MAT").build());

        var kq = dichVu.huyVeDaThanhToan("u", ve, yc);

        assertEquals("REFUND_PENDING", kq.getTrangThai());
        verify(anhXaVeXe).capNhatYeuCauHoanTien(
                eq(1L), eq("REFUND_PENDING"), eq(BigDecimal.valueOf(150_000)), any(),
                eq("1234567890"), eq("Vietcombank"), eq("NGUYEN VAN A"));
    }

    @Test
    @DisplayName("xacNhanHoanTien chuyển sang REFUNDED")
    void xacNhanHoanTien_thanhCong() {
        VeXe ve = VeXe.builder()
                .ma(1L).maKhach(2L).maChuyen(10L).trangThai("REFUND_PENDING")
                .soTienHoan(BigDecimal.valueOf(150_000))
                .stkHoan("1234567890").tenNganHangHoan("VCB")
                .build();
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(ve).thenReturn(
                VeXe.builder()
                        .ma(1L).maKhach(2L).maChuyen(10L).trangThai("REFUNDED")
                        .soTienHoan(BigDecimal.valueOf(150_000))
                        .stkHoan("1234567890").tenNganHangHoan("VCB")
                        .build());
        when(anhXaVeXe.capNhatXacNhanHoanTien(eq(1L), any())).thenReturn(1);
        when(anhXaKhachHang.timTheoMa(2L)).thenReturn(
                KhachHang.builder().ma(2L).maTaiKhoan(9L).hoTen("A").build());
        when(anhXaChuyenXe.timTheoMa(10L)).thenReturn(ChuyenXe.builder().ma(10L).build());

        var kq = dichVu.xacNhanHoanTien(1L);
        assertEquals("REFUNDED", kq.getTrangThai());
        verify(dichVuThongBao).guiNhanh(eq(9L), eq("Đã hoàn tiền"), anyString());
    }
}
