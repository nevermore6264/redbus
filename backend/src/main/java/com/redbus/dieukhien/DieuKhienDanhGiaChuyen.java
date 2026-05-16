package com.redbus.dieukhien;

import com.redbus.anhxa.AnhXaDanhGiaChuyen;
import com.redbus.dichvu.DichVuDanhGiaChuyen;
import com.redbus.mohinh.DanhGiaChuyen;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.DanhGiaCongKhaiPhanHoi;
import com.redbus.truyen.YeuCauDanhGiaChuyen;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/danh-gia")
@RequiredArgsConstructor
public class DieuKhienDanhGiaChuyen {

    private final DichVuDanhGiaChuyen dichVuDanhGiaChuyen;
    private final AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;

    @GetMapping("/cong-khai")
    public PhanHoiChung<List<DanhGiaCongKhaiPhanHoi>> congKhai(
            @RequestParam(defaultValue = "12") int gioiHan) {
        return PhanHoiChung.ok(dichVuDanhGiaChuyen.congKhai(gioiHan));
    }

    @GetMapping("/chuyen/{maChuyen}")
    public PhanHoiChung<List<DanhGiaChuyen>> theoChuyen(@PathVariable Long maChuyen) {
        return PhanHoiChung.ok(dichVuDanhGiaChuyen.theoMaChuyen(maChuyen));
    }

    @GetMapping("/chuyen/{maChuyen}/tom-tat")
    public PhanHoiChung<Map<String, Object>> tomTat(@PathVariable Long maChuyen) {
        long n = anhXaDanhGiaChuyen.demTheoMaChuyen(maChuyen);
        List<DanhGiaChuyen> ds = dichVuDanhGiaChuyen.theoMaChuyen(maChuyen);
        BigDecimal tong = BigDecimal.ZERO;
        for (DanhGiaChuyen d : ds) {
            if (d.getDiemSo() != null) {
                tong = tong.add(BigDecimal.valueOf(d.getDiemSo()));
            }
        }
        BigDecimal tb = n > 0
                ? tong.divide(BigDecimal.valueOf(n), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        Map<String, Object> m = new HashMap<>();
        m.put("soLuong", n);
        m.put("diemTrungBinh", tb);
        return PhanHoiChung.ok(m);
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public PhanHoiChung<DanhGiaChuyen> viet(
            @AuthenticationPrincipal UserDetails nguoiDung,
            @Valid @RequestBody YeuCauDanhGiaChuyen yeuCau) {
        return PhanHoiChung.ok(dichVuDanhGiaChuyen.vietDanhGia(nguoiDung.getUsername(), yeuCau));
    }
}
