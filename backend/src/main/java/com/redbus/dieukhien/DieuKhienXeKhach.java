package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuXeKhach;
import com.redbus.mohinh.XeKhach;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/xe-khach")
@RequiredArgsConstructor
public class DieuKhienXeKhach {

    private final DichVuXeKhach dichVuXeKhach;

    @GetMapping
    public PhanHoiChung<List<XeKhach>> tatCa() {
        return PhanHoiChung.ok(dichVuXeKhach.tatCa());
    }

    @GetMapping("/{ma}")
    public PhanHoiChung<XeKhach> chiTiet(@PathVariable Long ma) {
        return PhanHoiChung.ok(dichVuXeKhach.layTheoMa(ma));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<XeKhach> them(@RequestBody XeKhach xe) {
        return PhanHoiChung.ok(dichVuXeKhach.them(xe));
    }

    @PutMapping("/{ma}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<XeKhach> capNhat(@PathVariable Long ma, @RequestBody XeKhach xe) {
        xe.setMa(ma);
        return PhanHoiChung.ok(dichVuXeKhach.capNhat(xe));
    }

    @DeleteMapping("/{ma}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuXeKhach.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }
}
