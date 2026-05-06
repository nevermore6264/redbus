package com.redbus.dieukhien;

import com.redbus.anhxa.AnhXaHinhThucThanhToan;
import com.redbus.mohinh.HinhThucThanhToan;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hinh-thuc-thanh-toan")
@RequiredArgsConstructor
public class DieuKhienHinhThucThanhToan {

    private final AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;

    @GetMapping
    public PhanHoiChung<List<HinhThucThanhToan>> danhSach() {
        return PhanHoiChung.ok(anhXaHinhThucThanhToan.tatCaHoatDong());
    }
}
