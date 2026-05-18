package com.redbus.dichvu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.redbus.truyen.DonViHanhChinh;
import com.redbus.truyen.UocTinhLoTrinhPhanHoi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
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
        ReflectionTestUtils.setField(dichVu, "gocNominatim", "https://nominatim.test");
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

    @Test
    @DisplayName("haversineKm tính khoảng cách giữa hai điểm")
    void haversineKm_haiThanhPho() {
        double km = DichVuDiaDanh.haversineKm(21.0285, 105.8542, 10.8231, 106.6297);
        assertTrue(km > 1100 && km < 1200);
    }

    @Test
    @DisplayName("uocTinhLoTrinh trả km và phút khi geocode thành công")
    void uocTinhLoTrinh_thanhCong() {
        ArrayNode hn = JsonNodeFactory.instance.arrayNode();
        hn.addObject().put("lat", "21.0285").put("lon", "105.8542");
        ArrayNode hcm = JsonNodeFactory.instance.arrayNode();
        hcm.addObject().put("lat", "10.8231").put("lon", "106.6297");
        when(restTemplate.exchange(any(), eq(HttpMethod.GET), any(HttpEntity.class), eq(JsonNode.class)))
                .thenReturn(ResponseEntity.ok(hn))
                .thenReturn(ResponseEntity.ok(hcm));

        UocTinhLoTrinhPhanHoi kq = dichVu.uocTinhLoTrinh("Phường A, Hà Nội", "Phường B, TP HCM");
        assertTrue(kq.getKhoangCachKm() > 1000);
        assertTrue(kq.getThoiGianUocTinhPhut() > 1000);
        assertNotNull(kq.getGhiChu());
    }

    @Test
    @DisplayName("uocTinhLoTrinh báo lỗi khi điểm trùng")
    void uocTinhLoTrinh_trungDiem() {
        assertThrows(IllegalArgumentException.class, () -> dichVu.uocTinhLoTrinh("A", "a"));
    }
}
