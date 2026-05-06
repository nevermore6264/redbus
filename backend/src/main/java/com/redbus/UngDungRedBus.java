package com.redbus;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.redbus.anhxa")
public class UngDungRedBus {

    public static void main(String[] args) {
        SpringApplication.run(UngDungRedBus.class, args);
    }
}
