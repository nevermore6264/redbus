package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDiaDanh;
import com.redbus.truyen.DonViHanhChinh;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.UocTinhLoTrinhPhanHoi;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dia-danh")
@RequiredArgsConstructor
public class DieuKhienDiaDanh {

    private final DichVuDiaDanh dichVuDiaDanh;

    @GetMapping("/tinh")
    public PhanHoiChung<List<DonViHanhChinh>> danhSachTinh() {
        return PhanHoiChung.ok(dichVuDiaDanh.layDanhSachTinh());
    }

    @GetMapping("/tinh/{ma}/xa")
    public PhanHoiChung<List<DonViHanhChinh>> xaTheoTinh(@PathVariable int ma) {
        return PhanHoiChung.ok(dichVuDiaDanh.layXaTheoTinh(ma));
    }

    @GetMapping("/uoc-tinh-lo-trinh")
    public PhanHoiChung<UocTinhLoTrinhPhanHoi> uocTinhLoTrinh(
            @RequestParam String diemDi, @RequestParam String diemDen) {
        return PhanHoiChung.ok(dichVuDiaDanh.uocTinhLoTrinh(diemDi, diemDen));
    }
}
