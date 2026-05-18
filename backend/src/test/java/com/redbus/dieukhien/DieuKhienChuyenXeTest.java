package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuChuyenXe;
import com.redbus.hotro.HoTroTestMvc;
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

@WebMvcTest(controllers = DieuKhienChuyenXe.class)
@Import(DieuKhienChuyenXe.class)
@HoTroTestMvc
@DisplayName("DieuKhienChuyenXe")
class DieuKhienChuyenXeTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuChuyenXe dichVuChuyenXe;

    @Test
    @DisplayName("GET /chuyen-xe/tim-kiem công khai")
    void timKiem_tra200() throws Exception {
        when(dichVuChuyenXe.timKiemNangCao(any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of());
        mockMvc.perform(get("/chuyen-xe/tim-kiem").param("maTuyen", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /chuyen-xe/toan-bo yêu cầu ADMIN")
    void toanBo_admin_tra200() throws Exception {
        when(dichVuChuyenXe.tatCa()).thenReturn(List.of());
        mockMvc.perform(get("/chuyen-xe/toan-bo")).andExpect(status().isOk());
    }
}
