package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuTuyenDuong;
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

@WebMvcTest(controllers = DieuKhienTuyenDuong.class)
@Import(DieuKhienTuyenDuong.class)
@HoTroTestMvc
@DisplayName("DieuKhienTuyenDuong")
class DieuKhienTuyenDuongTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuTuyenDuong dichVuTuyenDuong;

    @Test
    @DisplayName("GET /tuyen-duong công khai")
    void tatCa_tra200() throws Exception {
        when(dichVuTuyenDuong.danhSach(null, null)).thenReturn(List.of());
        mockMvc.perform(get("/tuyen-duong"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @DisplayName("GET /tuyen-duong/{ma} công khai")
    void layTheoMa_tra200() throws Exception {
        when(dichVuTuyenDuong.layTheoMa(1L))
                .thenReturn(com.redbus.mohinh.TuyenDuong.builder().ma(1L).diemDi("HN").diemDen("HCM").build());
        mockMvc.perform(get("/tuyen-duong/1")).andExpect(status().isOk());
    }
}
