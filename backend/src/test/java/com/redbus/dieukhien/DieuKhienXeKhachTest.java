package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuXeKhach;
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

@WebMvcTest(controllers = DieuKhienXeKhach.class)
@Import(DieuKhienXeKhach.class)
@HoTroTestMvc
@DisplayName("DieuKhienXeKhach")
class DieuKhienXeKhachTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuXeKhach dichVuXeKhach;

    @Test
    @DisplayName("GET /xe-khach công khai")
    void tatCa_tra200() throws Exception {
        when(dichVuXeKhach.tatCa()).thenReturn(List.of());
        mockMvc.perform(get("/xe-khach"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @DisplayName("GET /xe-khach/{ma} công khai")
    void layTheoMa_tra200() throws Exception {
        when(dichVuXeKhach.layTheoMa(1L))
                .thenReturn(com.redbus.mohinh.XeKhach.builder().ma(1L).bienSo("51A").build());
        mockMvc.perform(get("/xe-khach/1")).andExpect(status().isOk());
    }
}
