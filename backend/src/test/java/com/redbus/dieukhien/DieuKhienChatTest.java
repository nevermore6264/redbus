package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuChat;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienChat.class)
@Import(DieuKhienChat.class)
@HoTroTestMvc
@DisplayName("DieuKhienChat")
class DieuKhienChatTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuChat dichVuChat;

    @Test
    @WithMockUser(username = "khach")
    @DisplayName("GET /chat/hoi-thoai yêu cầu đăng nhập")
    void hoiThoai_daDangNhap_tra200() throws Exception {
        when(dichVuChat.hoiThoai(eq("khach"), eq(2L))).thenReturn(List.of());
        mockMvc.perform(get("/chat/hoi-thoai").param("doiPhuong", "2")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "staff")
    @DisplayName("GET /chat/toi trả mã tài khoản hiện tại")
    void toi_traMaTaiKhoan() throws Exception {
        when(dichVuChat.maTaiKhoanHienTai("staff")).thenReturn(9L);
        mockMvc.perform(get("/chat/toi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.duLieu.maTaiKhoan").value(9));
    }
}
