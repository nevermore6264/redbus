package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuBaoCao;
import com.redbus.truyen.BaoCaoMoRong;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bao-cao")
@RequiredArgsConstructor
public class DieuKhienBaoCao {

    private final DichVuBaoCao dichVuBaoCao;

    @GetMapping("/mo-rong")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<BaoCaoMoRong> moRong() {
        return PhanHoiChung.ok(dichVuBaoCao.baoCaoMoRong());
    }
}
