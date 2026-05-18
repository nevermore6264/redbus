package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuQuanLyKhachHang;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienKhachHang.class)
@Import(DieuKhienKhachHang.class)
@HoTroTestMvc
@DisplayName("DieuKhienKhachHang")
class DieuKhienKhachHangTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuQuanLyKhachHang dichVuQuanLyKhachHang;

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /khach-hang yêu cầu ADMIN")
    void danhSach_admin_tra200() throws Exception {
        when(dichVuQuanLyKhachHang.danhSachDayDu()).thenReturn(List.of());
        mockMvc.perform(get("/khach-hang")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /khach-hang/{ma} chi tiết")
    void motKhach_tra200() throws Exception {
        when(dichVuQuanLyKhachHang.motTheoMaKhach(1L))
                .thenReturn(com.redbus.truyen.ThongTinKhachHangPhanHoi.builder().maKhach(1L).build());
        mockMvc.perform(get("/khach-hang/1")).andExpect(status().isOk());
    }
}
