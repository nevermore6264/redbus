package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuThanhToan;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.YeuCauThanhToanTienMat;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/thanh-toan")
@RequiredArgsConstructor
public class DieuKhienThanhToan {

    private final DichVuThanhToan dichVuThanhToan;

    @GetMapping("/lich-su")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<List<GiaoDichThanhToan>> lichSu(@AuthenticationPrincipal UserDetails nguoiDung) {
        return PhanHoiChung.ok(dichVuThanhToan.lichSuCuaKhach(nguoiDung.getUsername()));
    }

    @PostMapping("/ve/{maVe}/tien-mat")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<GiaoDichThanhToan> tienMat(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @PathVariable Long maVe,
            @RequestBody(required = false) YeuCauThanhToanTienMat yeuCau) {
        String maKm = yeuCau != null ? yeuCau.getMaKhuyenMai() : null;
        return PhanHoiChung.ok(dichVuThanhToan.tienMatTaiQuay(nguoiDung.getUsername(), maVe, maKm));
    }
}
