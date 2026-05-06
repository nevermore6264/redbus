package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuHoSo;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.ThongTinHoSoCaNhan;
import com.redbus.truyen.YeuCauCapNhatHoSo;
import com.redbus.truyen.YeuCauDoiMatKhau;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ho-so")
@RequiredArgsConstructor
public class DieuKhienHoSo {

    private final DichVuHoSo dichVuHoSo;

    @GetMapping("/cua-toi")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<ThongTinHoSoCaNhan> xem(@AuthenticationPrincipal UserDetails nguoiDung) {
        return PhanHoiChung.ok(dichVuHoSo.xemHoSo(nguoiDung.getUsername()));
    }

    @PutMapping("/cua-toi")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<ThongTinHoSoCaNhan> capNhat(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @Valid @RequestBody YeuCauCapNhatHoSo yeuCau) {
        return PhanHoiChung.ok(dichVuHoSo.capNhat(nguoiDung.getUsername(), yeuCau));
    }

    @PutMapping("/mat-khau")
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<Void> doiMatKhau(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @Valid @RequestBody YeuCauDoiMatKhau yeuCau) {
        dichVuHoSo.doiMatKhau(nguoiDung.getUsername(), yeuCau);
        return PhanHoiChung.ok("Đổi mật khẩu thành công", null);
    }
}
