package com.redbus;

import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.context.annotation.Profile;
import org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration;

/**
 * Cấu hình Spring Boot tối giản cho @WebMvcTest (profile slice-test).
 */
@SpringBootConfiguration
@EnableAutoConfiguration(
        exclude = {
            DataSourceAutoConfiguration.class,
            DataSourceTransactionManagerAutoConfiguration.class,
            MybatisAutoConfiguration.class
        })
@Profile("slice-test")
public class WebMvcTestApplication {}
