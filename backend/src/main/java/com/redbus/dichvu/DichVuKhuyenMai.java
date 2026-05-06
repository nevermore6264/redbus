package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.mohinh.KhuyenMai;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuKhuyenMai {

    private final AnhXaKhuyenMai anhXaKhuyenMai;

    public List<KhuyenMai> tatCa() {
        return anhXaKhuyenMai.tatCa();
    }

    public List<KhuyenMai> dangHieuLuc() {
        LocalDateTime luc = LocalDateTime.now();
        return anhXaKhuyenMai.tatCa().stream()
                .filter(k -> Boolean.TRUE.equals(k.getHoatDong()))
                .filter(k -> !luc.isBefore(k.getNgayBatDau()) && !luc.isAfter(k.getNgayKetThuc()))
                .filter(k -> k.getSoLanToiDa() == null || k.getSoLanDaDung() < k.getSoLanToiDa())
                .collect(Collectors.toList());
    }

    public KhuyenMai layTheoMa(Long ma) {
        KhuyenMai k = anhXaKhuyenMai.timTheoMa(ma);
        if (k == null) {
            throw new IllegalArgumentException("Không có khuyến mãi");
        }
        return k;
    }

    public KhuyenMai them(KhuyenMai k) {
        if (k.getHoatDong() == null) {
            k.setHoatDong(true);
        }
        if (k.getSoLanDaDung() == null) {
            k.setSoLanDaDung(0);
        }
        anhXaKhuyenMai.them(k);
        return anhXaKhuyenMai.timTheoMa(k.getMa());
    }

    public KhuyenMai capNhat(KhuyenMai k) {
        layTheoMa(k.getMa());
        anhXaKhuyenMai.capNhat(k);
        return layTheoMa(k.getMa());
    }

    public void xoa(Long ma) {
        layTheoMa(ma);
        anhXaKhuyenMai.xoa(ma);
    }
}
