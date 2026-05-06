package com.redbus.baomat;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Component
public class TienIchJwt {

    private final SecretKey khoa;
    private final long thoiGianHetHanMs;

    public TienIchJwt(
            @Value("${app.jwt.secret}") String biMat,
            @Value("${app.jwt.expiration-ms}") long thoiGianHetHanMs) {
        try {
            MessageDigest bam = MessageDigest.getInstance("SHA-256");
            byte[] tomTat = bam.digest(biMat.getBytes(StandardCharsets.UTF_8));
            this.khoa = Keys.hmacShaKeyFor(tomTat);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
        this.thoiGianHetHanMs = thoiGianHetHanMs;
    }

    public String taoToken(String tenDangNhap, String vaiTro) {
        Date bayGio = new Date();
        Date hetHan = new Date(bayGio.getTime() + thoiGianHetHanMs);
        return Jwts.builder()
                .subject(tenDangNhap)
                .claim("vaiTro", vaiTro)
                .issuedAt(bayGio)
                .expiration(hetHan)
                .signWith(khoa)
                .compact();
    }

    public String layTenDangNhap(String token) {
        return docPayload(token).getSubject();
    }

    public boolean hopLe(String token) {
        try {
            docPayload(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims docPayload(String token) {
        return Jwts.parser()
                .verifyWith(khoa)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
