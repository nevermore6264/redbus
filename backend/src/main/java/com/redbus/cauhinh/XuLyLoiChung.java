package com.redbus.cauhinh;

import com.redbus.truyen.PhanHoiChung;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class XuLyLoiChung {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<PhanHoiChung<Void>> loiThamSo(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(PhanHoiChung.loi(ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<PhanHoiChung<Void>> loiTrangThai(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(PhanHoiChung.loi(ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<PhanHoiChung<Void>> saiDangNhap(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(PhanHoiChung.loi("Thong tin dang nhap sai"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<PhanHoiChung<Void>> khongHopLe(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(PhanHoiChung.loi(msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<PhanHoiChung<Void>> chung(Exception ex) {
        String td = ex.getMessage() != null ? ex.getMessage() : "Loi he thong";
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(PhanHoiChung.loi(td));
    }
}
