package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuGheNgoi;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienGheNgoi.class)
@Import(DieuKhienGheNgoi.class)
@HoTroTestMvc
@DisplayName("DieuKhienGheNgoi")
class DieuKhienGheNgoiTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuGheNgoi dichVuGheNgoi;

    @Test
    @DisplayName("GET /ghe-ngoi/xe/{id} công khai")
    void theoXe_tra200() throws Exception {
        when(dichVuGheNgoi.danhSachTheoXe(1L)).thenReturn(List.of());
        mockMvc.perform(get("/ghe-ngoi/xe/1")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /ghe-ngoi/{ma}/trang-thai yêu cầu ADMIN")
    void capNhatTrangThai_admin() throws Exception {
        mockMvc.perform(put("/ghe-ngoi/1/trang-thai")
                        .contentType("application/json")
                        .content("{\"trangThai\":\"AVAILABLE\"}"))
                .andExpect(status().isOk());
    }
}
