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
        ReflectionTestUtils.setField(dichVu, "phutChoThanhToan", 15);
    }

    @Test
    @DisplayName("xuLyHetHanChoKhach trả 0 khi maKhach null")
    void xuLyHetHanChoKhach_maNull_tra0() {
        assertEquals(0, dichVu.xuLyHetHanChoKhach(null));
        verifyNoInteractions(anhXaVeXe);
    }

    @Test
    @DisplayName("daHetHan trả true khi PENDING quá 15 phút")
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
}
