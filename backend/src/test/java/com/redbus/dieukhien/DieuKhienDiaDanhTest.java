package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDiaDanh;
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

@WebMvcTest(controllers = DieuKhienDiaDanh.class)
@Import(DieuKhienDiaDanh.class)
@HoTroTestMvc
@DisplayName("DieuKhienDiaDanh")
class DieuKhienDiaDanhTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuDiaDanh dichVuDiaDanh;

    @Test
    @DisplayName("GET /dia-danh/tinh công khai")
    void danhSachTinh_tra200() throws Exception {
        when(dichVuDiaDanh.layDanhSachTinh()).thenReturn(List.of());
        mockMvc.perform(get("/dia-danh/tinh"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @DisplayName("GET /dia-danh/tinh/{ma}/xa công khai")
    void xaTheoTinh_tra200() throws Exception {
        when(dichVuDiaDanh.layXaTheoTinh(1)).thenReturn(List.of());
        mockMvc.perform(get("/dia-danh/tinh/1/xa")).andExpect(status().isOk());
    }
}
