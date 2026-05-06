package com.redbus.cauhinh;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class CauHinhTaiNguyen implements WebMvcConfigurer {

    @Value("${app.upload.thu-muc:uploads}")
    private String thuMucUpload;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path root = Path.of(thuMucUpload).toAbsolutePath().normalize();
        String uri = root.toUri().toString();
        if (!uri.endsWith("/")) {
            uri = uri + "/";
        }
        registry.addResourceHandler("/tai-nguyen/**").addResourceLocations(uri);
    }
}
