package com.redbus.dichvu;

import com.redbus.anhxa.*;
import com.redbus.mohinh.*;
import com.redbus.truyen.YeuCauDatVe;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuDatVe")
class DichVuDatVeTest {

    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @Mock private AnhXaChuyenXe anhXaChuyenXe;
    @Mock private AnhXaGheNgoi anhXaGheNgoi;
    @Mock private AnhXaVeXe anhXaVeXe;
    @Mock private AnhXaTuyenDuong anhXaTuyenDuong;
    @Mock private DichVuThongBao dichVuThongBao;
    @Mock private DichVuGuiMail dichVuGuiMail;
    @Mock private DichVuHetHanVe dichVuHetHanVe;
    @Mock private AnhXaDiemDungChan anhXaDiemDungChan;
    @Mock private DichVuHuyVeHoanTien dichVuHuyVeHoanTien;
    @InjectMocks private DichVuDatVe dichVu;

    @Test
    @DisplayName("datVe từ chối khi không chọn ghế")
    void datVe_khongCoGhe_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.datVe("u", yeuCauDatVe(1L)));
    }

    @Test
    @DisplayName("datVe từ chối quá 10 ghế mỗi lần")
    void datVe_qua10Ghe_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        List<Long> nhieuGhe = java.util.stream.LongStream.range(1, 12).boxed().toList();
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.datVe("u", yeuCauDatVeDs(1L, nhieuGhe)));
    }

    @Test
    @DisplayName("huyVe chuyển vé PAID sang hoàn tiền")
    void huyVe_daThanhToan_goiHoanTien() {
        VeXe ve = VeXe.builder().ma(1L).maKhach(2L).trangThai("PAID").build();
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(ve);
        when(dichVuHuyVeHoanTien.huyVeDaThanhToan(eq("u"), eq(ve), any())).thenReturn(
                com.redbus.truyen.KetQuaHuyVePhanHoi.builder().maVe(1L).trangThai("REFUND_PENDING").build());
        var kq = dichVu.huyVe("u", 1L, new com.redbus.truyen.YeuCauHuyVeHoanTien());
        assertEquals("REFUND_PENDING", kq.getTrangThai());
        verify(dichVuHuyVeHoanTien).huyVeDaThanhToan(eq("u"), eq(ve), any());
    }

    @Test
    @DisplayName("veCuaTaiKhoan ném lỗi khi chưa có hồ sơ khách")
    void veCuaTaiKhoan_chuaCoKhach_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(null);
        assertThrows(IllegalStateException.class, () -> dichVu.veCuaTaiKhoan("u"));
    }

    @Test
    @DisplayName("veCuaTaiKhoan gọi xử lý hết hạn trước khi trả danh sách")
    void veCuaTaiKhoan_goiXuLyHetHan() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(9L).build());
        when(anhXaVeXe.timTheoMaKhach(9L)).thenReturn(List.of());
        dichVu.veCuaTaiKhoan("u");
        verify(dichVuHetHanVe).xuLyHetHanChoKhach(9L);
    }

    @Test
    @DisplayName("datVe từ chối khi không có chuyến xe")
    void datVe_khongCoChuyen_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaChuyenXe.timTheoMa(99L)).thenReturn(null);
        YeuCauDatVe y = yeuCauDatVe(99L);
        y.setMaGhe(10L);
        assertThrows(IllegalArgumentException.class, () -> dichVu.datVe("u", y));
    }

    @Test
    @DisplayName("datVe từ chối điểm xuống trước điểm lên")
    void datVe_diemXuongTruocDiemLen_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaChuyenXe.timTheoMa(1L)).thenReturn(ChuyenXe.builder().ma(1L).maTuyen(5L).maXe(3L).giaVe(BigDecimal.valueOf(100)).thoiDiemKhoiHanh(LocalDateTime.now().plusDays(1)).build());
        when(anhXaDiemDungChan.timTheoMa(10L)).thenReturn(DiemDungChan.builder().ma(10L).maTuyen(5L).thuTu(3).build());
        when(anhXaDiemDungChan.timTheoMa(11L)).thenReturn(DiemDungChan.builder().ma(11L).maTuyen(5L).thuTu(1).build());
        YeuCauDatVe y = yeuCauDatVe(1L);
        y.setMaGhe(20L);
        y.setMaDiemLen(10L);
        y.setMaDiemXuong(11L);
        assertThrows(IllegalArgumentException.class, () -> dichVu.datVe("u", y));
    }

    @Test
    @DisplayName("datVe từ chối ghế bị khóa BLOCKED")
    void datVe_gheBiKhoa_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        ChuyenXe cx = ChuyenXe.builder().ma(1L).maTuyen(5L).maXe(3L).giaVe(BigDecimal.TEN).thoiDiemKhoiHanh(LocalDateTime.now().plusDays(1)).build();
        when(anhXaChuyenXe.timTheoMa(1L)).thenReturn(cx);
        when(anhXaGheNgoi.timTheoMa(20L)).thenReturn(GheNgoi.builder().ma(20L).maXe(3L).maGhe("A1").trangThai("BLOCKED").build());
        YeuCauDatVe y = yeuCauDatVe(1L);
        y.setMaGhe(20L);
        assertThrows(IllegalStateException.class, () -> dichVu.datVe("u", y));
    }

    @Test
    @DisplayName("huyVe thành công vé PENDING của chủ tài khoản")
    void huyVe_pending_thanhCong() {
        VeXe ve = VeXe.builder().ma(1L).maKhach(2L).trangThai("PENDING").thoiGianDat(LocalDateTime.now()).build();
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(ve);
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        dichVu.huyVe("u", 1L, null);
        verify(anhXaVeXe).capNhatTrangThai(1L, "CANCELLED");
    }

    @Test
    @DisplayName("huyVe từ chối khi không phải vé của mình")
    void huyVe_khongPhaiChuVe_nemLoi() {
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(VeXe.builder().ma(1L).maKhach(99L).trangThai("PENDING").build());
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        assertThrows(IllegalStateException.class, () -> dichVu.huyVe("u", 1L, null));
    }

    private static YeuCauDatVe yeuCauDatVe(Long maChuyen) {
        YeuCauDatVe y = new YeuCauDatVe();
        y.setMaChuyen(maChuyen);
        return y;
    }

    private static YeuCauDatVe yeuCauDatVeDs(Long maChuyen, java.util.List<Long> ds) {
        YeuCauDatVe y = new YeuCauDatVe();
        y.setMaChuyen(maChuyen);
        y.setDsMaGhe(ds);
        return y;
    }
}
