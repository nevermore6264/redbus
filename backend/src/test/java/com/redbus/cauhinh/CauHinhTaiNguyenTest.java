package com.redbus.cauhinh;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("CauHinhTaiNguyen")
class CauHinhTaiNguyenTest {

    private final CauHinhTaiNguyen cauHinh = new CauHinhTaiNguyen();

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(cauHinh, "thuMucUpload", "target/test-uploads");
    }

    @Test
    @DisplayName("addResourceHandlers đăng ký /tai-nguyen/**")
    void addResourceHandlers_dangKy() {
        ResourceHandlerRegistry registry = mock(ResourceHandlerRegistry.class);
        ResourceHandlerRegistration registration = mock(ResourceHandlerRegistration.class);
        when(registry.addResourceHandler("/tai-nguyen/**")).thenReturn(registration);
        when(registration.addResourceLocations(anyString())).thenReturn(registration);
        cauHinh.addResourceHandlers(registry);
        verify(registry).addResourceHandler("/tai-nguyen/**");
        verify(registration).addResourceLocations(anyString());
    }
}
