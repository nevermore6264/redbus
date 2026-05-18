package com.redbus.baomat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TienIchJwt")
class TienIchJwtTest {

    private TienIchJwt jwt;

    @BeforeEach
    void setUp() {
        jwt = new TienIchJwt("RedBusTestSecretKeyMustBe256BitsLongForHS256Algorithm!!Test", 3_600_000L);
    }

    @Test
    @DisplayName("taoToken tạo JWT hợp lệ và đọc được subject")
    void taoToken_hopLe() {
        String token = jwt.taoToken("admin", "ROLE_ADMIN");
        assertNotNull(token);
        assertTrue(jwt.hopLe(token));
        assertEquals("admin", jwt.layTenDangNhap(token));
    }

    @Test
    @DisplayName("hopLe trả false khi token bị sửa")
    void hopLe_tokenSai_traFalse() {
        String token = jwt.taoToken("user1", "ROLE_USER");
        assertFalse(jwt.hopLe(token.substring(0, token.length() - 5)));
    }

    @Test
    @DisplayName("hopLe trả false với chuỗi rác")
    void hopLe_chuoiRac_traFalse() {
        assertFalse(jwt.hopLe("khong-phai-jwt"));
    }
}
