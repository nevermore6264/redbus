package com.redbus.dieukhien;

import com.redbus.dichvu.DichVuChuyenXe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.truyen.ChuyenXeLocPhanHoi;
import com.redbus.truyen.KetQuaGenLich;
import com.redbus.truyen.PhanHoiChung;
import com.redbus.truyen.YeuCauGenLich;

import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/chuyen-xe")
@RequiredArgsConstructor
public class DieuKhienChuyenXe {

    private final DichVuChuyenXe dichVuChuyenXe;

    @GetMapping
    public PhanHoiChung<List<ChuyenXe>> timKiem(
            @RequestParam Long maTuyen,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime tuLuc) {
        return PhanHoiChung.ok(dichVuChuyenXe.timTheoTuyen(maTuyen, tuLuc));
    }

    @GetMapping("/tim-kiem")
    public PhanHoiChung<List<ChuyenXeLocPhanHoi>> timKiemNangCao(
            @RequestParam Long maTuyen,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime tuLuc,
            @RequestParam(required = false) BigDecimal giaMin,
            @RequestParam(required = false) BigDecimal giaMax,
            @RequestParam(required = false) Long maLoaiXe,
            @RequestParam(required = false) Integer gioTu,
            @RequestParam(required = false) Integer gioDen,
            @RequestParam(required = false) String sapXep) {
        return PhanHoiChung.ok(
                dichVuChuyenXe.timKiemNangCao(maTuyen, tuLuc, giaMin, giaMax, maLoaiXe, gioTu, gioDen, sapXep));
    }

    @GetMapping("/toan-bo")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<List<ChuyenXe>> tatCa() {
        return PhanHoiChung.ok(dichVuChuyenXe.tatCa());
    }

    @GetMapping("/{ma:\\d+}")
    public PhanHoiChung<ChuyenXe> chiTiet(@PathVariable Long ma) {
        return PhanHoiChung.ok(dichVuChuyenXe.layTheoMa(ma));
    }

    @GetMapping("/{ma:\\d+}/ghe-da-giu")
    public PhanHoiChung<List<Long>> gheDaGiu(@PathVariable Long ma) {
        return PhanHoiChung.ok(dichVuChuyenXe.maGheDaGiu(ma));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<ChuyenXe> them(@RequestBody ChuyenXe cx) {
        return PhanHoiChung.ok(dichVuChuyenXe.them(cx));
    }

    @PostMapping("/gen-lich")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<KetQuaGenLich> genLich(@RequestBody YeuCauGenLich yeuCau) {
        return PhanHoiChung.ok(dichVuChuyenXe.genLich(yeuCau));
    }

    @PutMapping("/{ma:\\d+}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public PhanHoiChung<ChuyenXe> capNhat(@PathVariable Long ma, @RequestBody ChuyenXe cx) {
        cx.setMa(ma);
        return PhanHoiChung.ok(dichVuChuyenXe.capNhat(cx));
    }

    @DeleteMapping("/{ma:\\d+}")
    @PreAuthorize("hasRole('ADMIN')")
    public PhanHoiChung<Void> xoa(@PathVariable Long ma) {
        dichVuChuyenXe.xoa(ma);
        return PhanHoiChung.ok("Đã xóa", null);
    }
}
