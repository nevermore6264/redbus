package com.redbus.baomat;

import com.redbus.hotro.NguonCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("TienIchJwt — tạo và xác minh JWT")
class TienIchJwtTest {

    private TienIchJwt jwt;

    @BeforeEach
    void setUp() {
        jwt = new TienIchJwt("RedBusTestSecretKeyMustBe256BitsLongForHS256Algorithm!!Test", 3_600_000L);
    }

    @Test
    @DisplayName("taoToken tạo token hợp lệ cho user và vai trò")
    void taoToken_hopLe() {
        String token = jwt.taoToken("admin", "ROLE_ADMIN");
        assertNotNull(token);
        assertTrue(jwt.hopLe(token));
        assertEquals("admin", jwt.layTenDangNhap(token));
    }

    @Test
    @DisplayName("hopLe trả false với token rác")
    void hopLe_tokenSai_traFalse() {
        assertFalse(jwt.hopLe("token.khong.hop-le"));
    }

    @ParameterizedTest(name = "case {0}: tạo token cho user user{0} và vai trò ROLE_USER")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: tạo và parse subject token")
    void taoVaDoc1000User(int chiSo) {
        String user = "user" + chiSo;
        String token = jwt.taoToken(user, "ROLE_USER");
        assertTrue(jwt.hopLe(token));
        assertEquals(user, jwt.layTenDangNhap(token));
    }

    @ParameterizedTest(name = "case {0}: token bị cắt/sai ở vị trí {0}")
    @MethodSource("com.redbus.hotro.NguonCase#chiSo")
    @DisplayName("1000 case: token không hợp lệ sau khi sửa")
    void tokenBiSua_khongHopLe(int chiSo) {
        String token = jwt.taoToken("u" + chiSo, "ROLE_USER");
        String hong = token.substring(0, Math.max(10, token.length() - (chiSo % 20 + 1)));
        assertFalse(jwt.hopLe(hong));
    }
}
