package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.VeXe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuHetHanVe")
class DichVuHetHanVeTest {

    @Mock
    private AnhXaVeXe anhXaVeXe;
    @InjectMocks
    private DichVuHetHanVe dichVu;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dichVu, "phutChoThanhToan", 5);
    }

    @Test
    @DisplayName("xuLyHetHanChoKhach trả 0 khi maKhach null")
    void xuLyHetHanChoKhach_maNull_tra0() {
        assertEquals(0, dichVu.xuLyHetHanChoKhach(null));
        verifyNoInteractions(anhXaVeXe);
    }

    @Test
    @DisplayName("daHetHan trả true khi PENDING quá 5 phút")
    void daHetHan_pendingQuaHan_traTrue() {
        VeXe ve = VeXe.builder()
                .trangThai("PENDING")
                .thoiGianDat(LocalDateTime.now().minusMinutes(20))
                .build();
        assertTrue(dichVu.daHetHan(ve));
    }

    @Test
    @DisplayName("damBaoChuaHetHan ném IllegalStateException khi vé EXPIRED")
    void damBaoChuaHetHan_expired_nemLoi() {
        VeXe ve = VeXe.builder().ma(1L).trangThai("EXPIRED").build();
        assertThrows(IllegalStateException.class, () -> dichVu.damBaoChuaHetHan(ve));
    }

    @Test
    @DisplayName("damBaoChuaHetHan tự cập nhật EXPIRED khi quá hạn")
    void damBaoChuaHetHan_quaHan_capNhatExpired() {
        VeXe ve = VeXe.builder()
                .ma(5L)
                .trangThai("PENDING")
                .thoiGianDat(LocalDateTime.now().minusMinutes(30))
                .build();
        assertThrows(IllegalStateException.class, () -> dichVu.damBaoChuaHetHan(ve));
        verify(anhXaVeXe).capNhatTrangThai(5L, "EXPIRED");
    }

    @Test
    @DisplayName("daHetHan trả false với vé PAID")
    void daHetHan_paid_traFalse() {
        VeXe ve = VeXe.builder().trangThai("PAID").thoiGianDat(LocalDateTime.now().minusHours(2)).build();
        assertFalse(dichVu.daHetHan(ve));
    }

    @Test
    @DisplayName("daHetHan trả false khi PENDING còn trong thời hạn")
    void daHetHan_pendingConHan_traFalse() {
        VeXe ve = VeXe.builder().trangThai("PENDING").thoiGianDat(LocalDateTime.now().minusMinutes(3)).build();
        assertFalse(dichVu.daHetHan(ve));
    }

    @Test
    @DisplayName("damBaoChuaHetHan ném lỗi vé đã hủy")
    void damBaoChuaHetHan_cancelled_nemLoi() {
        VeXe ve = VeXe.builder().trangThai("CANCELLED").build();
        assertThrows(IllegalStateException.class, () -> dichVu.damBaoChuaHetHan(ve));
    }

    @Test
    @DisplayName("lucHetHan trả null khi thiếu thời gian đặt")
    void lucHetHan_thieuThoiGian_traNull() {
        assertNull(dichVu.lucHetHan(VeXe.builder().build()));
    }

    @Test
    @DisplayName("lucHetHan = thời gian đặt + phút chờ")
    void lucHetHan_tinhDung() {
        LocalDateTime dat = LocalDateTime.of(2026, 5, 18, 10, 0);
        LocalDateTime het = dichVu.lucHetHan(VeXe.builder().thoiGianDat(dat).build());
        assertEquals(dat.plusMinutes(5), het);
    }

    @Test
    @DisplayName("xuLyHetHanChoKhach gọi mapper với mã khách")
    void xuLyHetHanChoKhach_goMapper() {
        when(anhXaVeXe.huyPendingQuaHanTheoKhach(7L, 5)).thenReturn(2);
        assertEquals(2, dichVu.xuLyHetHanChoKhach(7L));
    }

    @Test
    @DisplayName("xuLyHetHanTatCa trả số vé hủy")
    void xuLyHetHanTatCa_traSoLuong() {
        when(anhXaVeXe.huyPendingQuaHanTatCa(5)).thenReturn(5);
        assertEquals(5, dichVu.xuLyHetHanTatCa());
    }
}
