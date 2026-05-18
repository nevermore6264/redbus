package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuBaoCao;
import com.redbus.truyen.BaoCaoBieuDoPhanHoi;
import com.redbus.truyen.BaoCaoMoRong;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/bieu-do")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<BaoCaoBieuDoPhanHoi> bieuDo() {
        return PhanHoiChung.ok(dichVuBaoCao.bieuDo());
    }

    @GetMapping("/xuat-csv")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public ResponseEntity<byte[]> xuatCsv() {
        byte[] data = dichVuBaoCao.xuatCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bao-cao-redbus.csv")
                .contentType(new MediaType("text", "csv", java.nio.charset.StandardCharsets.UTF_8))
                .body(data);
    }
}
