package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuTuyenDuong;
import com.redbus.mohinh.TuyenDuong;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tuyen-duong")
@RequiredArgsConstructor
public class DieuKhienTuyenDuong {

    private final DichVuTuyenDuong dichVuTuyenDuong;

    @GetMapping
    public PhanHoiChung<List<TuyenDuong>> danhSach(
            @RequestParam(required = false) String diemDi,
            @RequestParam(required = false) String diemDen) {
        return PhanHoiChung.ok(dichVuTuyenDuong.danhSach(diemDi, diemDen));
    }

    @GetMapping("/{ma}")
    public PhanHoiChung<TuyenDuong> chiTiet(@PathVariable Long ma) {
        return PhanHoiChung.ok(dichVuTuyenDuong.layTheoMa(ma));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<TuyenDuong> them(@RequestBody TuyenDuong tuyen) {
        return PhanHoiChung.ok(dichVuTuyenDuong.them(tuyen));
    }

    @PutMapping("/{ma}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<TuyenDuong> capNhat(@PathVariable Long ma, @RequestBody TuyenDuong tuyen) {
        tuyen.setMa(ma);
        return PhanHoiChung.ok(dichVuTuyenDuong.capNhat(tuyen));
    }

    @DeleteMapping("/{ma}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuTuyenDuong.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }
}
