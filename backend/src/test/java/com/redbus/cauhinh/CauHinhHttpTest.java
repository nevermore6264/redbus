package com.redbus.cauhinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CauHinhHttp")
class CauHinhHttpTest {

    @Test
    @DisplayName("restTemplate bean khởi tạo được")
    void restTemplate_khoiTao() {
        CauHinhHttp cauHinh = new CauHinhHttp();
        RestTemplate rt = cauHinh.restTemplate();
        assertNotNull(rt);
    }
}
