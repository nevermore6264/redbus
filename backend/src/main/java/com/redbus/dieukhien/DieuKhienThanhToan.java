package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuThanhToan;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.truyen.KetQuaThanhToanPayOs;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.PhanHoiLinkPayOs;
import com.redbus.truyen.YeuCauThanhToanTienMat;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/ve/{maVe}/payos")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<PhanHoiLinkPayOs> payos(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @PathVariable Long maVe,
            @RequestBody(required = false) YeuCauThanhToanTienMat yeuCau) {
        String maKm = yeuCau != null ? yeuCau.getMaKhuyenMai() : null;
        return PhanHoiChung.ok(dichVuThanhToan.taoLinkPayOs(nguoiDung.getUsername(), maVe, maKm));
    }

    @GetMapping("/payos/ket-qua")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<KetQuaThanhToanPayOs> ketQuaPayOs(
            @AuthenticationPrincipal UserDetails nguoiDung, @RequestParam Long orderCode) {
        return PhanHoiChung.ok(dichVuThanhToan.traCuuKetQua(nguoiDung.getUsername(), orderCode));
    }

    @PostMapping("/payos/webhook")
    public Map<String, Boolean> webhookPayOs(@RequestBody String body) {
        dichVuThanhToan.xuLyWebhookPayOs(body);
        return Map.of("success", true);
    }
}
