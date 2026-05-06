package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuGheNgoi;
import com.redbus.mohinh.GheNgoi;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.YeuCauCapNhatTrangThaiGhe;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ghe-ngoi")
@RequiredArgsConstructor
public class DieuKhienGheNgoi {

    private final DichVuGheNgoi dichVuGheNgoi;

    @GetMapping("/xe/{maXe}")
    public PhanHoiChung<List<GheNgoi>> theoXe(@PathVariable Long maXe) {
        return PhanHoiChung.ok(dichVuGheNgoi.danhSachTheoXe(maXe));
    }

    @PutMapping("/{ma}/trang-thai")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<Void> doiTrangThai(
            @PathVariable Long ma,
            @Valid @RequestBody YeuCauCapNhatTrangThaiGhe yeuCau) {
        dichVuGheNgoi.doiTrangThai(ma, yeuCau.getTrangThai());
        return PhanHoiChung.ok("Đã cập nhật", null);
    }
}
