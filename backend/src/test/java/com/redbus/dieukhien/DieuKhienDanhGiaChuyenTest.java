package com.redbus.dieukhien;

import com.redbus.anhxa.AnhXaDanhGiaChuyen;
import com.redbus.dichvu.DichVuDanhGiaChuyen;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienDanhGiaChuyen.class)
@Import(DieuKhienDanhGiaChuyen.class)
@HoTroTestMvc
@DisplayName("DieuKhienDanhGiaChuyen")
class DieuKhienDanhGiaChuyenTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuDanhGiaChuyen dichVuDanhGiaChuyen;
    @MockBean private AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;

    @Test
    @DisplayName("GET /danh-gia/cong-khai công khai")
    void congKhai_tra200() throws Exception {
        when(dichVuDanhGiaChuyen.congKhai(anyInt())).thenReturn(List.of());
        mockMvc.perform(get("/danh-gia/cong-khai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    @DisplayName("GET /danh-gia/ve-cho-danh-gia yêu cầu CUSTOMER")
    void veChoDanhGia_tra200() throws Exception {
        when(dichVuDanhGiaChuyen.veChoDanhGia(anyString())).thenReturn(List.of());
        mockMvc.perform(get("/danh-gia/ve-cho-danh-gia")).andExpect(status().isOk());
    }
}
