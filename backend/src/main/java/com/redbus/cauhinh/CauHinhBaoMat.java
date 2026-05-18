package com.redbus.cauhinh;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
@Profile("!slice-test")
public class CauHinhBaoMat {

    private final BoLocXacThucJwt boLocXacThucJwt;

    @Value("${app.cors.allowed-origins}")
    private String nguonChoPhep;

    @Bean
    public PasswordEncoder boMaHoaMatKhau() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager quanLyXacThuc(AuthenticationConfiguration cauHinh) throws Exception {
        return cauHinh.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain chuoiLocBaoMat(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(c -> c.configurationSource(nguonCors()))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/xac-thuc/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/tuyen-duong/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/chuyen-xe/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/xe-khach/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ghe-ngoi/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/loai-xe/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/tai-nguyen/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/diem-dung/tuyen/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/dia-danh/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/khuyen-mai/hien-thi").permitAll()
                        .requestMatchers(HttpMethod.GET, "/danh-gia/cong-khai").permitAll()
                        .requestMatchers(HttpMethod.GET, "/danh-gia/chuyen/**").permitAll()
                        .requestMatchers("/tin-tuc/quan-tri/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/tin-tuc/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/hinh-thuc-thanh-toan/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/thanh-toan/payos/webhook").permitAll()
                        .requestMatchers(HttpMethod.GET, "/hoi-dap/cong-khai").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ve-xe/tra-cuu").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(boLocXacThucJwt, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource nguonCors() {
        CorsConfiguration cauHinh = new CorsConfiguration();
        cauHinh.setAllowedOrigins(Arrays.stream(nguonChoPhep.split(",")).map(String::trim).toList());
        cauHinh.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cauHinh.setAllowedHeaders(List.of("*"));
        cauHinh.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource nguon = new UrlBasedCorsConfigurationSource();
        nguon.registerCorsConfiguration("/**", cauHinh);
        return nguon;
    }
}
