package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaTinNhanChat;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.TinNhanChat;
import com.redbus.truyen.YeuCauGuiChat;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuChat")
class DichVuChatTest {

    @Mock private AnhXaTinNhanChat anhXaTinNhanChat;
    @Mock private AnhXaTaiKhoan anhXaTaiKhoan;
    @InjectMocks private DichVuChat dichVu;

    @Test
    @DisplayName("hoiThoai ném lỗi khi không tìm thấy tài khoản")
    void hoiThoai_khongCoTk_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () -> dichVu.hoiThoai("u", 2L));
    }

    @Test
    @DisplayName("hoiThoai từ chối đối phương trùng mã tài khoản")
    void hoiThoai_doiPhuongTrungMa_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        assertThrows(IllegalArgumentException.class, () -> dichVu.hoiThoai("u", 1L));
    }

    @Test
    @DisplayName("gui lưu tin nhắn và gọi mapper")
    void gui_thanhCong() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaTaiKhoan.timTheoMa(2L)).thenReturn(TaiKhoan.builder().ma(2L).build());
        YeuCauGuiChat yc = new YeuCauGuiChat();
        yc.setMaNguoiNhan(2L);
        yc.setNoiDung("  hello  ");
        TinNhanChat kq = dichVu.gui("u", yc);
        assertEquals("hello", kq.getNoiDung());
        verify(anhXaTinNhanChat).them(any(TinNhanChat.class));
    }

    @Test
    @DisplayName("gui ném lỗi khi người nhận không tồn tại")
    void gui_nguoiNhanKhongTonTai_nemLoi() {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(anhXaTaiKhoan.timTheoMa(99L)).thenReturn(null);
        assertThrows(IllegalArgumentException.class,
                () -> {
                    YeuCauGuiChat y = new YeuCauGuiChat();
                    y.setMaNguoiNhan(99L);
                    y.setNoiDung("x");
                    dichVu.gui("u", y);
                });
    }
}
