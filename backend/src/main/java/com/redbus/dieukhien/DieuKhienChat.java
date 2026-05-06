package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuChat;
import com.redbus.mohinh.TinNhanChat;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.YeuCauGuiChat;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class DieuKhienChat {

    private final DichVuChat dichVuChat;

    @GetMapping("/hoi-thoai")
    @PreAuthorize("isAuthenticated()")
    public PhanHoiChung<List<TinNhanChat>> hoiThoai(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @RequestParam("doiPhuong") Long maDoiPhuongTaiKhoan) {
        return PhanHoiChung.ok(dichVuChat.hoiThoai(nguoiDung.getUsername(), maDoiPhuongTaiKhoan));
    }

    @PostMapping("/gui")
    @PreAuthorize("isAuthenticated()")
    public PhanHoiChung<TinNhanChat> gui(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @Valid @RequestBody YeuCauGuiChat yeuCau) {
        return PhanHoiChung.ok(dichVuChat.gui(nguoiDung.getUsername(), yeuCau));
    }
}
