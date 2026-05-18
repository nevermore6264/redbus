package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDatVe;
import com.redbus.dichvu.DichVuDoiVe;
import com.redbus.dichvu.DichVuTraCuuVe;
import com.redbus.hotro.HoTroTestMvc;
import com.redbus.truyen.VeDienTuPhanHoi;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienVeXe.class)
@Import(DieuKhienVeXe.class)
@HoTroTestMvc
@DisplayName("DieuKhienVeXe")
class DieuKhienVeXeTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuDatVe dichVuDatVe;
    @MockBean private DichVuTraCuuVe dichVuTraCuuVe;
    @MockBean private DichVuDoiVe dichVuDoiVe;

    @Test
    @DisplayName("GET /ve-xe/tra-cuu công khai")
    void traCuu_tra200() throws Exception {
        when(dichVuTraCuuVe.traCuuCongKhai(anyString(), anyString()))
                .thenReturn(VeDienTuPhanHoi.builder().ma(1L).build());
        mockMvc.perform(get("/ve-xe/tra-cuu").param("maVe", "RB1").param("soDienThoai", "090"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER", username = "khach")
    @DisplayName("GET /ve-xe/cua-toi yêu cầu CUSTOMER")
    void cuaToi_tra200() throws Exception {
        when(dichVuDatVe.veCuaTaiKhoan("khach")).thenReturn(List.of());
        mockMvc.perform(get("/ve-xe/cua-toi")).andExpect(status().isOk());
    }
}
