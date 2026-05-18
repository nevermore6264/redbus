package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuLoaiXe;
import com.redbus.hotro.HoTroTestMvc;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienLoaiXe.class)
@Import(DieuKhienLoaiXe.class)
@HoTroTestMvc
@DisplayName("DieuKhienLoaiXe")
class DieuKhienLoaiXeTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuLoaiXe dichVuLoaiXe;

    @Test
    @DisplayName("GET /loai-xe công khai")
    void tatCa_tra200() throws Exception {
        when(dichVuLoaiXe.tatCa()).thenReturn(List.of());
        mockMvc.perform(get("/loai-xe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @DisplayName("GET /loai-xe/{ma} công khai")
    void layTheoMa_tra200() throws Exception {
        when(dichVuLoaiXe.layTheoMa(1L)).thenReturn(com.redbus.mohinh.LoaiXe.builder().ma(1L).ten("Limousine").build());
        mockMvc.perform(get("/loai-xe/1")).andExpect(status().isOk());
    }
}
