package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.mohinh.KhuyenMai;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        chuanHoaVaKiemTra(k, null);
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
        if (k.getMa() == null) {
            throw new IllegalArgumentException("Thiếu mã khuyến mãi");
        }
        layTheoMa(k.getMa());
        chuanHoaVaKiemTra(k, k.getMa());
        anhXaKhuyenMai.capNhat(k);
        return layTheoMa(k.getMa());
    }

    private void chuanHoaVaKiemTra(KhuyenMai k, Long maLoaiTru) {
        if (k.getMaCode() != null) {
            k.setMaCode(k.getMaCode().trim().replaceAll("\\s+", "").toUpperCase());
        }
        if (k.getTieuDe() != null) {
            k.setTieuDe(k.getTieuDe().trim().replaceAll("\\s+", " "));
        }
        if (k.getMaCode() == null || k.getMaCode().isBlank()) {
            throw new IllegalArgumentException("Mã code không được để trống");
        }
        if (k.getPhanTramGiam() == null
                || k.getPhanTramGiam().compareTo(BigDecimal.ZERO) <= 0
                || k.getPhanTramGiam().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("Phần trăm giảm phải từ 1 đến 100");
        }
        if (k.getNgayBatDau() == null || k.getNgayKetThuc() == null) {
            throw new IllegalArgumentException("Chọn thời hạn hiệu lực");
        }
        if (!k.getNgayKetThuc().isAfter(k.getNgayBatDau())) {
            throw new IllegalArgumentException("Ngày kết thúc phải sau ngày bắt đầu");
        }
        if (k.getSoTienGiamToiDa() != null && k.getSoTienGiamToiDa().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Số tiền giảm tối đa không hợp lệ");
        }
        KhuyenMai trung = anhXaKhuyenMai.timTheoMaCode(k.getMaCode(), maLoaiTru);
        if (trung != null) {
            throw new IllegalArgumentException("Mã « " + trung.getMaCode() + " » đã tồn tại");
        }
    }

    public void xoa(Long ma) {
        layTheoMa(ma);
        anhXaKhuyenMai.xoa(ma);
    }
}
