package com.redbus.dieukhien;

import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.dichvu.DichVuThongBao;
import com.redbus.dichvu.DichVuThongBaoPhat;
import com.redbus.hotro.HoTroTestMvc;
import com.redbus.mohinh.TaiKhoan;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienThongBao.class)
@Import(DieuKhienThongBao.class)
@HoTroTestMvc
@DisplayName("DieuKhienThongBao")
class DieuKhienThongBaoTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuThongBao dichVuThongBao;
    @MockBean private AnhXaTaiKhoan anhXaTaiKhoan;
    @MockBean private DichVuThongBaoPhat dichVuThongBaoPhat;

    @Test
    @WithMockUser(username = "u")
    @DisplayName("GET /thong-bao yêu cầu đăng nhập")
    void danhSach_tra200() throws Exception {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(dichVuThongBao.danhSachCuaNguoiDung(1L)).thenReturn(List.of());
        mockMvc.perform(get("/thong-bao")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "u")
    @DisplayName("GET /thong-bao/stream trả SSE")
    void stream_tra200() throws Exception {
        when(anhXaTaiKhoan.timTheoTenDangNhap("u")).thenReturn(TaiKhoan.builder().ma(1L).build());
        when(dichVuThongBaoPhat.dangKy(1L)).thenReturn(new SseEmitter());
        mockMvc.perform(get("/thong-bao/stream")).andExpect(status().isOk());
    }
}
