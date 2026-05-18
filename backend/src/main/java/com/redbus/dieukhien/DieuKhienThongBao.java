package com.redbus.dieukhien;

import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.dichvu.DichVuThongBao;
import com.redbus.dichvu.DichVuThongBaoPhat;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.ThongBao;
import com.redbus.truyen.PhanHoiChung;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/thong-bao")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class DieuKhienThongBao {

    private final DichVuThongBao dichVuThongBao;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final DichVuThongBaoPhat dichVuThongBaoPhat;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal UserDetails nguoiDung) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(nguoiDung.getUsername());
        return dichVuThongBaoPhat.dangKy(tk.getMa());
    }

    @GetMapping
    public PhanHoiChung<List<ThongBao>> danhSach(@AuthenticationPrincipal UserDetails nguoiDung) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(nguoiDung.getUsername());
        return PhanHoiChung.ok(dichVuThongBao.danhSachCuaNguoiDung(tk.getMa()));
    }

    @PutMapping("/{ma}/da-doc")
    public PhanHoiChung<Void> danhDauDaDoc(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @PathVariable Long ma) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(nguoiDung.getUsername());
        dichVuThongBao.danhDauDaDoc(ma, tk.getMa());
        return PhanHoiChung.ok("Đã cập nhật", null);
    }
}
