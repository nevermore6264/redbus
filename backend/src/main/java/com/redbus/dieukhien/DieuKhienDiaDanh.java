package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDiaDanh;
import com.redbus.truyen.DonViHanhChinh;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dia-danh")
@RequiredArgsConstructor
public class DieuKhienDiaDanh {

    private final DichVuDiaDanh dichVuDiaDanh;

    /** Danh sách 34 tỉnh/thành (sau sáp nhập 07/2025). */
    @GetMapping("/tinh")
    public PhanHoiChung<List<DonViHanhChinh>> danhSachTinh() {
        return PhanHoiChung.ok(dichVuDiaDanh.layDanhSachTinh());
    }

    /** Phường/xã trực thuộc tỉnh. */
    @GetMapping("/tinh/{ma}/xa")
    public PhanHoiChung<List<DonViHanhChinh>> xaTheoTinh(@PathVariable int ma) {
        return PhanHoiChung.ok(dichVuDiaDanh.layXaTheoTinh(ma));
    }
}
