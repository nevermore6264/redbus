package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuQuenMatKhau;
import com.redbus.dichvu.DichVuXacThuc;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.PhanHoiDangNhap;
import com.redbus.truyen.YeuCauDatLaiMatKhau;
import com.redbus.truyen.YeuCauDangKy;
import com.redbus.truyen.YeuCauDangNhap;
import com.redbus.truyen.YeuCauGuiOtp;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/xac-thuc")
@RequiredArgsConstructor
public class DieuKhienXacThuc {

    private final DichVuXacThuc dichVuXacThuc;
    private final DichVuQuenMatKhau dichVuQuenMatKhau;

    @PostMapping("/dang-nhap")
    public PhanHoiChung<PhanHoiDangNhap> dangNhap(@Valid @RequestBody YeuCauDangNhap yeuCau) {
        return PhanHoiChung.ok(dichVuXacThuc.dangNhap(yeuCau));
    }

    @PostMapping("/dang-ky")
    public PhanHoiChung<PhanHoiDangNhap> dangKy(@Valid @RequestBody YeuCauDangKy yeuCau) {
        return PhanHoiChung.ok(dichVuXacThuc.dangKy(yeuCau));
    }

    @PostMapping("/quen-mat-khau/gui-otp")
    public PhanHoiChung<Void> guiOtp(@Valid @RequestBody YeuCauGuiOtp yeuCau) {
        dichVuQuenMatKhau.guiOtp(yeuCau.getEmail());
        return PhanHoiChung.ok("Đã gửi mã OTP", null);
    }

    @PostMapping("/quen-mat-khau/dat-lai")
    public PhanHoiChung<Void> datLaiMatKhau(@Valid @RequestBody YeuCauDatLaiMatKhau yeuCau) {
        dichVuQuenMatKhau.datLaiMatKhau(yeuCau);
        return PhanHoiChung.ok("Đã đặt lại mật khẩu", null);
    }
}
