package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuTinTuc;
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

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienTinTuc.class)
@Import(DieuKhienTinTuc.class)
@HoTroTestMvc
@DisplayName("DieuKhienTinTuc")
class DieuKhienTinTucTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuTinTuc dichVuTinTuc;

    @Test
    @DisplayName("GET /tin-tuc công khai")
    void congKhai_tra200() throws Exception {
        when(dichVuTinTuc.congKhai(anyInt())).thenReturn(List.of());
        mockMvc.perform(get("/tin-tuc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /tin-tuc/quan-tri/tat-ca yêu cầu ADMIN")
    void quanTri_tra200() throws Exception {
        when(dichVuTinTuc.tatCa()).thenReturn(List.of());
        mockMvc.perform(get("/tin-tuc/quan-tri/tat-ca")).andExpect(status().isOk());
    }
}
