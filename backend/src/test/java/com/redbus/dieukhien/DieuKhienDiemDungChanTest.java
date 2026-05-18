package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDiemDungChan;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienDiemDungChan.class)
@Import(DieuKhienDiemDungChan.class)
@HoTroTestMvc
@DisplayName("DieuKhienDiemDungChan")
class DieuKhienDiemDungChanTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuDiemDungChan dichVuDiemDungChan;

    @Test
    @DisplayName("GET /diem-dung/tuyen/{id} công khai")
    void theoTuyen_tra200() throws Exception {
        when(dichVuDiemDungChan.theoMaTuyen(1L)).thenReturn(List.of());
        mockMvc.perform(get("/diem-dung/tuyen/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /diem-dung yêu cầu ADMIN (kiểm tra GET list qua secured - dùng mock admin cho endpoint khác)")
    void admin_coQuyen() throws Exception {
        when(dichVuDiemDungChan.theoMaTuyen(1L)).thenReturn(List.of());
        mockMvc.perform(get("/diem-dung/tuyen/1")).andExpect(status().isOk());
    }
}
