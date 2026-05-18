package com.redbus.hotro;

import com.redbus.baomat.DichVuNguoiDungHeThong;
import com.redbus.baomat.TienIchJwt;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static org.mockito.Mockito.mock;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@AutoConfigureMockMvc(addFilters = false)
@EnableMethodSecurity
@ActiveProfiles("slice-test")
@Import(HoTroTestMvc.CauHinh.class)
@TestPropertySource(
        properties = {
            "app.jwt.secret=RedBusTestSecretKeyMustBe256BitsLongForHS256Algorithm!!Test",
            "app.jwt.expiration-ms=3600000",
            "app.cors.allowed-origins=http://localhost:5173"
        })
public @interface HoTroTestMvc {

    @TestConfiguration
    static class CauHinh {

        @Bean
        @Primary
        TienIchJwt tienIchJwt() {
            return new TienIchJwt(
                    "RedBusTestSecretKeyMustBe256BitsLongForHS256Algorithm!!Test", 3_600_000L);
        }

        @Bean
        @Primary
        DichVuNguoiDungHeThong dichVuNguoiDungHeThong() {
            return mock(DichVuNguoiDungHeThong.class);
        }

        @Bean
        PasswordEncoder boMaHoaMatKhau() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        @Primary
        SecurityFilterChain securityFilterChainChoTest(HttpSecurity http) throws Exception {
            http.csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }
}
