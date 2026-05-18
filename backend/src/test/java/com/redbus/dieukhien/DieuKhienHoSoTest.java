package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuHoSo;
import com.redbus.hotro.HoTroTestMvc;
import com.redbus.truyen.ThongTinHoSoCaNhan;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienHoSo.class)
@Import(DieuKhienHoSo.class)
@HoTroTestMvc
@DisplayName("DieuKhienHoSo")
class DieuKhienHoSoTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuHoSo dichVuHoSo;

    @Test
    @WithMockUser(roles = "CUSTOMER", username = "khach")
    @DisplayName("GET /ho-so/cua-toi yêu cầu CUSTOMER")
    void xemHoSo_tra200() throws Exception {
        when(dichVuHoSo.xemHoSo("khach")).thenReturn(ThongTinHoSoCaNhan.builder().tenDangNhap("khach").build());
        mockMvc.perform(get("/ho-so/cua-toi")).andExpect(status().isOk());
    }
}
