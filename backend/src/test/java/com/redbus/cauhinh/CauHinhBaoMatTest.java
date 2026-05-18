package com.redbus.cauhinh;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CauHinhBaoMat")
class CauHinhBaoMatTest {

    @Mock private BoLocXacThucJwt boLocXacThucJwt;
    @InjectMocks private CauHinhBaoMat cauHinh;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cauHinh, "nguonChoPhep", "http://localhost:5173");
    }

    @Test
    @DisplayName("boMaHoaMatKhau trả BCryptPasswordEncoder")
    void boMaHoaMatKhau_traBcrypt() {
        PasswordEncoder enc = cauHinh.boMaHoaMatKhau();
        assertNotNull(enc);
        assertTrue(enc.matches("secret", enc.encode("secret")));
    }
}
