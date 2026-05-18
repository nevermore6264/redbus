package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuThanhToan;
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

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienThanhToan.class)
@Import(DieuKhienThanhToan.class)
@HoTroTestMvc
@DisplayName("DieuKhienThanhToan")
class DieuKhienThanhToanTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuThanhToan dichVuThanhToan;

    @Test
    @WithMockUser(roles = "CUSTOMER", username = "khach")
    @DisplayName("GET /thanh-toan/lich-su yêu cầu CUSTOMER")
    void lichSu_tra200() throws Exception {
        when(dichVuThanhToan.lichSuCuaKhach("khach")).thenReturn(List.of());
        mockMvc.perform(get("/thanh-toan/lich-su")).andExpect(status().isOk());
    }
}
