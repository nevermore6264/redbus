package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuKhuyenMai;
import com.redbus.hotro.HoTroTestMvc;
import com.redbus.mohinh.KhuyenMai;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienKhuyenMai.class)
@Import(DieuKhienKhuyenMai.class)
@HoTroTestMvc
@DisplayName("DieuKhienKhuyenMai")
class DieuKhienKhuyenMaiTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DichVuKhuyenMai dichVuKhuyenMai;

    @Test
    @DisplayName("GET /khuyen-mai/hien-thi trả danh sách khuyến mãi công khai")
    void hienThi_tra200() throws Exception {
        when(dichVuKhuyenMai.dangHieuLuc()).thenReturn(List.of(KhuyenMai.builder().ma(1L).maCode("KM").build()));
        mockMvc.perform(get("/khuyen-mai/hien-thi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /khuyen-mai yêu cầu quyền ADMIN")
    void tatCa_admin_tra200() throws Exception {
        when(dichVuKhuyenMai.tatCa()).thenReturn(List.of());
        mockMvc.perform(get("/khuyen-mai"))
                .andExpect(status().isOk());
        verify(dichVuKhuyenMai).tatCa();
    }
}
