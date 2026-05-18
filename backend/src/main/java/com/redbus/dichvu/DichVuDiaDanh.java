package com.redbus.dichvu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redbus.truyen.DonViHanhChinh;
import com.redbus.truyen.UocTinhLoTrinhPhanHoi;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DichVuDiaDanh {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.dia-danh.goc:https://provinces.open-api.vn}")
    private String gocApi;

    @Value("${app.dia-danh.nominatim:https://nominatim.openstreetmap.org}")
    private String gocNominatim;

    private static final double TOC_DO_XE_KM_H = 50.0;
    private static final double HE_SO_THOI_GIAN = 1.1;

    public List<DonViHanhChinh> layDanhSachTinh() {
        DonViHanhChinh[] ds = restTemplate.getForObject(gocApi + "/api/v2/", DonViHanhChinh[].class);
        if (ds == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(ds);
    }

    public List<DonViHanhChinh> layXaTheoTinh(int maTinh) {
        return docMangCon("/api/v2/p/" + maTinh + "?depth=2", "wards");
    }

    public UocTinhLoTrinhPhanHoi uocTinhLoTrinh(String diemDi, String diemDen) {
        String di = chuanHoaDiaChi(diemDi);
        String den = chuanHoaDiaChi(diemDen);
        if (di.isEmpty()) {
            throw new IllegalArgumentException("Điểm đi không được để trống");
        }
        if (den.isEmpty()) {
            throw new IllegalArgumentException("Điểm đến không được để trống");
        }
        if (di.equalsIgnoreCase(den)) {
            throw new IllegalArgumentException("Điểm đi và điểm đến phải khác nhau");
        }

        ToaDo toaDoDi = traCuuToaDo(di)
                .orElseThrow(() -> new IllegalArgumentException("Không xác định được tọa độ cho: " + di));
        nghiNominatim();
        ToaDo toaDoDen = traCuuToaDo(den)
                .orElseThrow(() -> new IllegalArgumentException("Không xác định được tọa độ cho: " + den));

        double kmThuc = haversineKm(toaDoDi.lat, toaDoDi.lng, toaDoDen.lat, toaDoDen.lng);
        int km = Math.max(1, (int) Math.round(kmThuc));
        int phut = Math.max(15, (int) Math.round(km / TOC_DO_XE_KM_H * 60.0 * HE_SO_THOI_GIAN));

        return UocTinhLoTrinhPhanHoi.builder()
                .khoangCachKm(km)
                .thoiGianUocTinhPhut(phut)
                .ghiChu(
                        "Ước tính theo khoảng cách đường chim bay (~"
                                + String.format("%.0f", kmThuc)
                                + " km), tốc độ xe khách ~"
                                + (int) TOC_DO_XE_KM_H
                                + " km/h. Có thể chỉnh tay nếu lộ trình thực tế khác.")
                .build();
    }

    static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double banKinhTraiDatKm = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2)
                        + Math.cos(Math.toRadians(lat1))
                                * Math.cos(Math.toRadians(lat2))
                                * Math.sin(dLon / 2)
                                * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return banKinhTraiDatKm * c;
    }

    private String chuanHoaDiaChi(String diaChi) {
        if (diaChi == null) {
            return "";
        }
        return diaChi.trim().replaceAll("\\s+", " ");
    }

    private Optional<ToaDo> traCuuToaDo(String diaChi) {
        URI uri =
                UriComponentsBuilder.fromHttpUrl(gocNominatim + "/search")
                        .queryParam("format", "json")
                        .queryParam("limit", 1)
                        .queryParam("countrycodes", "vn")
                        .queryParam("q", diaChi + ", Việt Nam")
                        .build()
                        .encode()
                        .toUri();
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.USER_AGENT, "RedBus-VN/1.0 (admin route estimator)");
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<JsonNode> resp =
                    restTemplate.exchange(uri, HttpMethod.GET, entity, JsonNode.class);
            JsonNode body = resp.getBody();
            if (body == null || !body.isArray() || body.isEmpty()) {
                return Optional.empty();
            }
            JsonNode ketQua = body.get(0);
            if (!ketQua.has("lat") || !ketQua.has("lon")) {
                return Optional.empty();
            }
            return Optional.of(new ToaDo(Double.parseDouble(ketQua.get("lat").asText()), Double.parseDouble(ketQua.get("lon").asText())));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private void nghiNominatim() {
        try {
            Thread.sleep(1100L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private record ToaDo(double lat, double lng) {}

    private List<DonViHanhChinh> docMangCon(String path, String truong) {
        try {
            JsonNode node = restTemplate.getForObject(gocApi + path, JsonNode.class);
            if (node == null || !node.has(truong)) {
                return Collections.emptyList();
            }
            DonViHanhChinh[] ds =
                    objectMapper.readerForArrayOf(DonViHanhChinh.class).readValue(node.get(truong));
            return ds == null ? Collections.emptyList() : Arrays.asList(ds);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
