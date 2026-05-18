package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuDatVe;
import com.redbus.dichvu.DichVuDoiVe;
import com.redbus.dichvu.DichVuTraCuuVe;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.VeDienTuPhanHoi;
import com.redbus.truyen.YeuCauDatVe;
import com.redbus.truyen.YeuCauDoiChuyen;
import com.redbus.truyen.YeuCauDoiGhe;
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
    private final DichVuTraCuuVe dichVuTraCuuVe;
    private final DichVuDoiVe dichVuDoiVe;

    @GetMapping("/cua-toi")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<List<VeXe>> veCuaToi(@AuthenticationPrincipal UserDetails nguoiDung) {
        return PhanHoiChung.ok(dichVuDatVe.veCuaTaiKhoan(nguoiDung.getUsername()));
    }

    @PostMapping("/dat")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<List<VeXe>> datVe(
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

    @GetMapping("/tra-cuu")
    public PhanHoiChung<VeDienTuPhanHoi> traCuu(
            @RequestParam String maVe,
            @RequestParam String soDienThoai) {
        return PhanHoiChung.ok(dichVuTraCuuVe.traCuuCongKhai(maVe, soDienThoai));
    }

    @GetMapping("/{ma}/dien-tu")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<VeDienTuPhanHoi> dienTu(
            @AuthenticationPrincipal UserDetails nguoiDung, @PathVariable Long ma) {
        return PhanHoiChung.ok(dichVuTraCuuVe.veDienTuCuaToi(nguoiDung.getUsername(), ma));
    }

    @PostMapping("/{ma}/doi-ghe")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<VeXe> doiGhe(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @PathVariable Long ma,
            @Valid @RequestBody YeuCauDoiGhe yeuCau) {
        return PhanHoiChung.ok(dichVuDoiVe.doiGhe(nguoiDung.getUsername(), ma, yeuCau));
    }

    @PostMapping("/{ma}/doi-chuyen")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<VeXe> doiChuyen(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @PathVariable Long ma,
            @Valid @RequestBody YeuCauDoiChuyen yeuCau) {
        return PhanHoiChung.ok(dichVuDoiVe.doiChuyen(nguoiDung.getUsername(), ma, yeuCau));
    }
}
