package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuTinTuc;
import com.redbus.mohinh.TinTuc;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tin-tuc")
@RequiredArgsConstructor
public class DieuKhienTinTuc {

    private final DichVuTinTuc dichVuTinTuc;

    @GetMapping
    public PhanHoiChung<List<TinTuc>> congKhai(@RequestParam(defaultValue = "10") int gioiHan) {
        return PhanHoiChung.ok(dichVuTinTuc.congKhai(gioiHan));
    }

    @GetMapping("/{ma:\\d+}")
    public PhanHoiChung<TinTuc> chiTiet(@PathVariable Long ma) {
        TinTuc t = dichVuTinTuc.layTheoMa(ma);
        if (!Boolean.TRUE.equals(t.getHoatDong())) {
            throw new IllegalArgumentException("Tin không tồn tại");
        }
        return PhanHoiChung.ok(t);
    }

    @GetMapping("/quan-tri/tat-ca")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<List<TinTuc>> tatCaQuanTri() {
        return PhanHoiChung.ok(dichVuTinTuc.tatCa());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<TinTuc> them(@RequestBody TinTuc t) {
        return PhanHoiChung.ok(dichVuTinTuc.them(t));
    }

    @PutMapping("/{ma:\\d+}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<TinTuc> capNhat(@PathVariable Long ma, @RequestBody TinTuc t) {
        t.setMa(ma);
        return PhanHoiChung.ok(dichVuTinTuc.capNhat(t));
    }

    @DeleteMapping("/{ma:\\d+}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuTinTuc.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }
}
