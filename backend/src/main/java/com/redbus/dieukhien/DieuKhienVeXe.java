package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDatVe;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.YeuCauDatVe;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ve-xe")
@RequiredArgsConstructor
public class DieuKhienVeXe {

    private final DichVuDatVe dichVuDatVe;

    @GetMapping("/cua-toi")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<List<VeXe>> veCuaToi(@AuthenticationPrincipal UserDetails nguoiDung) {
        return PhanHoiChung.ok(dichVuDatVe.veCuaTaiKhoan(nguoiDung.getUsername()));
    }

    @PostMapping("/dat")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<VeXe> datVe(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @Valid @RequestBody YeuCauDatVe yeuCau) {
        return PhanHoiChung.ok(dichVuDatVe.datVe(nguoiDung.getUsername(), yeuCau));
    }

    @PostMapping("/{ma}/huy")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<Void> huy(@AuthenticationPrincipal UserDetails nguoiDung, @PathVariable Long ma) {
        dichVuDatVe.huyVe(nguoiDung.getUsername(), ma);
        return PhanHoiChung.ok("Đã hủy", null);
    }
}
