package com.redbus.dieukhien;

import com.redbus.anhxa.AnhXaHinhThucThanhToan;
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

@WebMvcTest(controllers = DieuKhienHinhThucThanhToan.class)
@Import(DieuKhienHinhThucThanhToan.class)
@HoTroTestMvc
@DisplayName("DieuKhienHinhThucThanhToan")
class DieuKhienHinhThucThanhToanTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;

    @Test
    @DisplayName("GET /hinh-thuc-thanh-toan công khai")
    void danhSach_tra200() throws Exception {
        when(anhXaHinhThucThanhToan.tatCaHoatDong()).thenReturn(List.of());
        mockMvc.perform(get("/hinh-thuc-thanh-toan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }
}
