package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuLoaiXe;
import com.redbus.mohinh.LoaiXe;
import com.redbus.truyen.AnhLoaiXePhanHoi;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/loai-xe")
@RequiredArgsConstructor
public class DieuKhienLoaiXe {

    private final DichVuLoaiXe dichVuLoaiXe;

    @GetMapping
    public PhanHoiChung<List<LoaiXe>> danhSach() {
        return PhanHoiChung.ok(dichVuLoaiXe.tatCa());
    }

    @GetMapping("/{ma}")
    public PhanHoiChung<LoaiXe> chiTiet(@PathVariable Long ma) {
        return PhanHoiChung.ok(dichVuLoaiXe.layTheoMa(ma));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<LoaiXe> them(@RequestBody LoaiXe x) {
        return PhanHoiChung.ok(dichVuLoaiXe.them(x));
    }

    @PutMapping("/{ma}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<LoaiXe> capNhat(@PathVariable Long ma, @RequestBody LoaiXe x) {
        x.setMa(ma);
        return PhanHoiChung.ok(dichVuLoaiXe.capNhat(x));
    }

    @DeleteMapping("/{ma}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuLoaiXe.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }

    @PostMapping(value = "/{ma}/anh", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<AnhLoaiXePhanHoi> taiAnh(@PathVariable Long ma, @RequestParam("tep") MultipartFile tep) {
        return PhanHoiChung.ok(dichVuLoaiXe.taiAnh(ma, tep));
    }

    @DeleteMapping("/{ma}/anh/{maAnh}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<Void> xoaAnh(@PathVariable Long ma, @PathVariable Long maAnh) {
        dichVuLoaiXe.xoaMotAnh(ma, maAnh);
        return PhanHoiChung.ok("Đã xóa ảnh", null);
    }
}
