package com.redbus.cauhinh;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CauHinhPayOs")
class CauHinhPayOsTest {

    @Test
    @DisplayName("payOS bean tạo được với cấu hình hợp lệ")
    void payOS_taoDuoc() {
        CauHinhPayOs cauHinh = new CauHinhPayOs();
        assertNotNull(cauHinh.payOS("client", "api-key", "checksum-key"));
    }
}
