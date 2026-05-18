package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuQuenMatKhau;
import com.redbus.dichvu.DichVuXacThuc;
import com.redbus.hotro.HoTroTestMvc;
import com.redbus.truyen.PhanHoiDangNhap;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DieuKhienXacThuc.class)
@Import(DieuKhienXacThuc.class)
@HoTroTestMvc
@DisplayName("DieuKhienXacThuc")
class DieuKhienXacThucTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private DichVuXacThuc dichVuXacThuc;
    @MockBean private DichVuQuenMatKhau dichVuQuenMatKhau;

    @Test
    @DisplayName("POST /xac-thuc/dang-nhap công khai")
    void dangNhap_tra200() throws Exception {
        when(dichVuXacThuc.dangNhap(any())).thenReturn(PhanHoiDangNhap.builder().token("t").build());
        mockMvc.perform(post("/xac-thuc/dang-nhap")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"tenDangNhap\":\"u\",\"matKhau\":\"p\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.thanhCong").value(true));
    }

    @Test
    @DisplayName("POST /xac-thuc/quen-mat-khau/gui-otp công khai")
    void guiOtp_tra200() throws Exception {
        mockMvc.perform(post("/xac-thuc/quen-mat-khau/gui-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@b.com\"}"))
                .andExpect(status().isOk());
    }
}
