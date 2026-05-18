package com.redbus.dichvu;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("DichVuThongBaoPhat")
class DichVuThongBaoPhatTest {

  private final DichVuThongBaoPhat dichVu = new DichVuThongBaoPhat();

  @Test
  @DisplayName("dangKy trả SseEmitter hợp lệ")
  void dangKy_traEmitter() {
    SseEmitter emitter = dichVu.dangKy(1L);
    assertNotNull(emitter);
  }

  @Test
  @DisplayName("phat không lỗi khi chưa có kết nối SSE")
  void phat_khongCoKetNoi_khongLoi() {
    assertDoesNotThrow(() -> dichVu.phat(99L, "t", "n"));
  }

  @Test
  @DisplayName("dangKy thay thế emitter cũ khi đăng ký lại")
  void dangKy_thayTheEmitterCu() {
    SseEmitter dau = dichVu.dangKy(2L);
    SseEmitter sau = dichVu.dangKy(2L);
    assertNotSame(dau, sau);
  }
}
