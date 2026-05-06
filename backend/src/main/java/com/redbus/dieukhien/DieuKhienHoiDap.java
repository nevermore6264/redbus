package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuHoiDap;
import com.redbus.mohinh.HoiDap;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.YeuCauHoiDap;
import com.redbus.truyen.YeuCauTraLoiHoiDap;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hoi-dap")
@RequiredArgsConstructor
public class DieuKhienHoiDap {

    private final DichVuHoiDap dichVuHoiDap;

    @GetMapping("/cong-khai")
    public PhanHoiChung<List<HoiDap>> congKhai() {
        return PhanHoiChung.ok(dichVuHoiDap.congKhai());
    }

    @GetMapping("/quan-tri/tat-ca")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<List<HoiDap>> tatCaQuanTri() {
        return PhanHoiChung.ok(dichVuHoiDap.tatCaChoQuanTri());
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<HoiDap> dat(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @Valid @RequestBody YeuCauHoiDap yeuCau) {
        return PhanHoiChung.ok(dichVuHoiDap.datCauHoi(nguoiDung.getUsername(), yeuCau));
    }

    @PutMapping("/{ma}/tra-loi")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<HoiDap> traLoi(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @PathVariable Long ma,
            @Valid @RequestBody YeuCauTraLoiHoiDap yeuCau) {
        return PhanHoiChung.ok(dichVuHoiDap.traLoi(ma, nguoiDung.getUsername(), yeuCau));
    }
}
