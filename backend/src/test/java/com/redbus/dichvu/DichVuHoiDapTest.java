package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaHoiDap;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.mohinh.HoiDap;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.truyen.YeuCauHoiDap;
import com.redbus.truyen.YeuCauTraLoiHoiDap;
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
@DisplayName("DichVuHoiDap")
class DichVuHoiDapTest {

    @Mock private AnhXaHoiDap anhXaHoiDap;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @Mock private AnhXaKhachHang anhXaKhachHang;
    @InjectMocks private DichVuHoiDap dichVu;

    @Test
    @DisplayName("datCauHoi trim tiêu đề và nội dung")
    void datCauHoi_trimNoiDung() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaKhachHang.timTheoMaTaiKhoan(1L)).thenReturn(KhachHang.builder().ma(2L).build());
        when(anhXaHoiDap.timTheoMa(any())).thenAnswer(inv -> inv.getArgument(0));
        YeuCauHoiDap yc = new YeuCauHoiDap();
        yc.setTieuDe("  tieu de  ");
        yc.setNoiDungHoi("  noi dung  ");
        dichVu.datCauHoi("u", yc);
        verify(anhXaHoiDap).them(argThat(h ->
                "tieu de".equals(h.getTieuDe()) && "noi dung".equals(h.getNoiDungHoi())));
    }

    @Test
    @DisplayName("traLoi ném lỗi khi không tìm thấy câu hỏi")
    void traLoi_khongCoCauHoi_nemLoi() {
        when(anhXaHoiDap.timTheoMa(1L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class,
                () -> dichVu.traLoi(1L, "admin", yeuCauTraLoi("ok")));
    }

    @Test
    @DisplayName("traLoi cập nhật trạng thái DA_TRA_LOI")
    void traLoi_thanhCong() {
        HoiDap hd = HoiDap.builder().ma(1L).build();
        when(anhXaHoiDap.timTheoMa(1L)).thenReturn(hd);
        when(anhXaTaiKhoan.timTheoTenDangNhap("admin")).thenReturn(TaiKhoan.builder().ma(9L).build());
        dichVu.traLoi(1L, "admin", yeuCauTraLoi("  tra loi  "));
        verify(anhXaHoiDap).capNhatTraLoi(argThat(h -> "DA_TRA_LOI".equals(h.getTrangThai())));
    }

    private static YeuCauTraLoiHoiDap yeuCauTraLoi(String nd) {
        YeuCauTraLoiHoiDap y = new YeuCauTraLoiHoiDap();
        y.setNoiDungTraLoi(nd);
        return y;
    }
}
