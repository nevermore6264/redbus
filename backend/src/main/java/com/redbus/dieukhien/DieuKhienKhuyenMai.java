package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuKhuyenMai;
import com.redbus.mohinh.KhuyenMai;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/khuyen-mai")
@RequiredArgsConstructor
public class DieuKhienKhuyenMai {

    private final DichVuKhuyenMai dichVuKhuyenMai;

    @GetMapping("/hien-thi")
    public PhanHoiChung<List<KhuyenMai>> hienThi() {
        return PhanHoiChung.ok(dichVuKhuyenMai.dangHieuLuc());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<List<KhuyenMai>> tatCa() {
        return PhanHoiChung.ok(dichVuKhuyenMai.tatCa());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<KhuyenMai> them(@RequestBody KhuyenMai k) {
        return PhanHoiChung.ok(dichVuKhuyenMai.them(k));
    }

    @PutMapping("/{ma}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<KhuyenMai> capNhat(@PathVariable Long ma, @RequestBody KhuyenMai k) {
        k.setMa(ma);
        return PhanHoiChung.ok(dichVuKhuyenMai.capNhat(k));
    }

    @DeleteMapping("/{ma}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuKhuyenMai.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }
}
