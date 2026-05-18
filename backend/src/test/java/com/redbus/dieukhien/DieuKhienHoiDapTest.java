package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuHoiDap;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienHoiDap.class)
@Import(DieuKhienHoiDap.class)
@HoTroTestMvc
@DisplayName("DieuKhienHoiDap")
class DieuKhienHoiDapTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuHoiDap dichVuHoiDap;

    @Test
    @DisplayName("GET /hoi-dap/cong-khai công khai")
    void congKhai_tra200() throws Exception {
        when(dichVuHoiDap.congKhai()).thenReturn(List.of());
        mockMvc.perform(get("/hoi-dap/cong-khai")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /hoi-dap/quan-tri/tat-ca yêu cầu ADMIN")
    void quanTri_tra200() throws Exception {
        when(dichVuHoiDap.tatCaChoQuanTri()).thenReturn(List.of());
        mockMvc.perform(get("/hoi-dap/quan-tri/tat-ca")).andExpect(status().isOk());
    }
}
