package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDiemDungChan;
import com.redbus.mohinh.DiemDungChan;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/diem-dung")
@RequiredArgsConstructor
public class DieuKhienDiemDungChan {

    private final DichVuDiemDungChan dichVuDiemDungChan;

    @GetMapping("/tuyen/{maTuyen}")
    public PhanHoiChung<List<DiemDungChan>> theoTuyen(@PathVariable Long maTuyen) {
        return PhanHoiChung.ok(dichVuDiemDungChan.theoMaTuyen(maTuyen));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<DiemDungChan> them(@RequestBody DiemDungChan d) {
        return PhanHoiChung.ok(dichVuDiemDungChan.them(d));
    }

    @PutMapping("/{ma}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<DiemDungChan> capNhat(@PathVariable Long ma, @RequestBody DiemDungChan d) {
        d.setMa(ma);
        return PhanHoiChung.ok(dichVuDiemDungChan.capNhat(d));
    }

    @DeleteMapping("/{ma}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuDiemDungChan.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }
}
