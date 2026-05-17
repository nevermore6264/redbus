package com.redbus.dichvu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redbus.truyen.DonViHanhChinh;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuDiaDanh {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.dia-danh.goc:https://provinces.open-api.vn}")
    private String gocApi;

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
