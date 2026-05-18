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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
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
    @DisplayName("huyVe từ chối vé đã thanh toán")
    void huyVe_daThanhToan_nemLoi() {
        when(anhXaVeXe.timTheoMa(1L)).thenReturn(VeXe.builder().ma(1L).maKhach(2L).trangThai("PAID").build());
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        assertThrows(IllegalStateException.class, () -> dichVu.huyVe("u", 1L));
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
