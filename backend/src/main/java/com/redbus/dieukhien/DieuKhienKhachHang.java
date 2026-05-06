package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuQuanLyKhachHang;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.ThongTinKhachHangPhanHoi;
import com.redbus.truyen.YeuCauCapNhatKhachQuanTri;
import com.redbus.truyen.YeuCauThemKhachQuanTri;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/khach-hang")
@RequiredArgsConstructor
public class DieuKhienKhachHang {

    private final DichVuQuanLyKhachHang dichVuQuanLyKhachHang;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<List<ThongTinKhachHangPhanHoi>> danhSach() {
        return PhanHoiChung.ok(dichVuQuanLyKhachHang.danhSachDayDu());
    }

    @GetMapping("/{maKhach}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<ThongTinKhachHangPhanHoi> chiTiet(@PathVariable Long maKhach) {
        return PhanHoiChung.ok(dichVuQuanLyKhachHang.motTheoMaKhach(maKhach));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<ThongTinKhachHangPhanHoi> them(@RequestBody YeuCauThemKhachQuanTri yeuCau) {
        return PhanHoiChung.ok(dichVuQuanLyKhachHang.them(yeuCau));
    }

    @PutMapping("/{maKhach}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<ThongTinKhachHangPhanHoi> capNhat(
            @PathVariable Long maKhach,
            @RequestBody YeuCauCapNhatKhachQuanTri yeuCau) {
        return PhanHoiChung.ok(dichVuQuanLyKhachHang.capNhat(maKhach, yeuCau));
    }
}
