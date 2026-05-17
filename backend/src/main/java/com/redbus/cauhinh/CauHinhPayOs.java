package com.redbus.cauhinh;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;
import vn.payos.core.ClientOptions;

@Configuration
public class CauHinhPayOs {

    @Bean
    @ConditionalOnProperty(prefix = "app.payos", name = "client-id")
    public PayOS payOS(
            @Value("${app.payos.client-id}") String clientId,
            @Value("${app.payos.api-key}") String apiKey,
            @Value("${app.payos.checksum-key}") String checksumKey) {
        return new PayOS(
                ClientOptions.builder()
                        .clientId(clientId)
                        .apiKey(apiKey)
                        .checksumKey(checksumKey)
                        .build());
    }
}
