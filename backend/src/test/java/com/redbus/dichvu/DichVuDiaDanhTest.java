package com.redbus.dichvu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redbus.truyen.DonViHanhChinh;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DichVuDiaDanh")
class DichVuDiaDanhTest {

    @Mock private RestTemplate restTemplate;
    @Mock private ObjectMapper objectMapper;
    @InjectMocks private DichVuDiaDanh dichVu;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dichVu, "gocApi", "https://api.test");
    }

    @Test
    @DisplayName("layDanhSachTinh trả rỗng khi API null")
    void layDanhSachTinh_apiNull_traRong() {
        when(restTemplate.getForObject(anyString(), eq(DonViHanhChinh[].class))).thenReturn(null);
        assertTrue(dichVu.layDanhSachTinh().isEmpty());
    }

    @Test
    @DisplayName("layDanhSachTinh trả danh sách từ API")
    void layDanhSachTinh_coDuLieu() {
        DonViHanhChinh tinh = new DonViHanhChinh();
        tinh.setCode(1);
        tinh.setName("HN");
        DonViHanhChinh[] ds = {tinh};
        when(restTemplate.getForObject(contains("/api/v2/"), eq(DonViHanhChinh[].class))).thenReturn(ds);
        assertEquals(1, dichVu.layDanhSachTinh().size());
    }

    @Test
    @DisplayName("layXaTheoTinh trả rỗng khi JSON lỗi")
    void layXaTheoTinh_loiJson_traRong() throws Exception {
        when(restTemplate.getForObject(anyString(), eq(JsonNode.class))).thenThrow(new RuntimeException("fail"));
        assertTrue(dichVu.layXaTheoTinh(1).isEmpty());
    }
}
