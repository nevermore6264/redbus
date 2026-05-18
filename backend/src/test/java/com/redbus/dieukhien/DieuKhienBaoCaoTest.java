package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuBaoCao;
import com.redbus.hotro.HoTroTestMvc;
import com.redbus.truyen.BaoCaoMoRong;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienBaoCao.class)
@Import(DieuKhienBaoCao.class)
@HoTroTestMvc
@DisplayName("DieuKhienBaoCao")
class DieuKhienBaoCaoTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuBaoCao dichVuBaoCao;

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /bao-cao/mo-rong yêu cầu STAFF")
    void moRong_staff_tra200() throws Exception {
        when(dichVuBaoCao.baoCaoMoRong()).thenReturn(BaoCaoMoRong.builder().build());
        mockMvc.perform(get("/bao-cao/mo-rong")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /bao-cao/bieu-do trả 200")
    void bieuDo_tra200() throws Exception {
        when(dichVuBaoCao.bieuDo()).thenReturn(com.redbus.truyen.BaoCaoBieuDoPhanHoi.builder().build());
        mockMvc.perform(get("/bao-cao/bieu-do")).andExpect(status().isOk());
    }
}
