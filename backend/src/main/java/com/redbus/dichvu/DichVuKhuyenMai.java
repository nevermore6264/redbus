package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.mohinh.KhuyenMai;
import com.redbus.truyen.KetQuaApDungKhuyenMai;
import com.redbus.truyen.KetQuaTinhTongKhuyenMai;
import com.redbus.truyen.YeuCauTinhTongKhuyenMai;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
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

    public KetQuaApDungKhuyenMai apDungMaCode(String maCode, BigDecimal giaGoc) {
        if (giaGoc == null || giaGoc.signum() <= 0) {
            throw new IllegalArgumentException("Giá vé không hợp lệ");
        }
        if (maCode == null || maCode.isBlank()) {
            return KetQuaApDungKhuyenMai.builder()
                    .giaGoc(giaGoc)
                    .soTienGiam(BigDecimal.ZERO)
                    .giaSauGiam(giaGoc)
                    .build();
        }
        KhuyenMai km = layKhuyenMaiHopLe(chuanHoaMaCode(maCode));
        BigDecimal giam = tinhSoTienGiam(giaGoc, km);
        BigDecimal sau = giaGoc.subtract(giam);
        if (sau.signum() < 0) {
            sau = BigDecimal.ZERO;
        }
        return KetQuaApDungKhuyenMai.builder()
                .maCode(km.getMaCode())
                .maKhuyenMai(km.getMa())
                .tieuDe(km.getTieuDe())
                .phanTramGiam(km.getPhanTramGiam())
                .giaGoc(giaGoc)
                .soTienGiam(giam)
                .giaSauGiam(sau)
                .build();
    }

    public KetQuaTinhTongKhuyenMai tinhTong(YeuCauTinhTongKhuyenMai yeuCau) {
        if (yeuCau.getDsGiaVe() == null || yeuCau.getDsGiaVe().isEmpty()) {
            throw new IllegalArgumentException("Thiếu danh sách giá vé");
        }
        List<KetQuaApDungKhuyenMai> chiTiet = new ArrayList<>();
        BigDecimal tongGoc = BigDecimal.ZERO;
        BigDecimal tongSau = BigDecimal.ZERO;
        for (BigDecimal gia : yeuCau.getDsGiaVe()) {
            if (gia == null || gia.signum() <= 0) {
                throw new IllegalArgumentException("Giá vé không hợp lệ");
            }
            KetQuaApDungKhuyenMai tung = apDungMaCode(yeuCau.getMaCode(), gia);
            chiTiet.add(tung);
            tongGoc = tongGoc.add(gia);
            tongSau = tongSau.add(tung.getGiaSauGiam());
        }
        KetQuaApDungKhuyenMai mau = chiTiet.get(0);
        return KetQuaTinhTongKhuyenMai.builder()
                .maCode(mau.getMaCode())
                .maKhuyenMai(mau.getMaKhuyenMai())
                .tieuDe(mau.getTieuDe())
                .phanTramGiam(mau.getPhanTramGiam())
                .soVe(chiTiet.size())
                .tongGiaGoc(tongGoc)
                .tongGiam(tongGoc.subtract(tongSau))
                .tongSauGiam(tongSau)
                .chiTietTungVe(chiTiet)
                .build();
    }

    private KhuyenMai layKhuyenMaiHopLe(String maCode) {
        KhuyenMai km = anhXaKhuyenMai.timTheoMaCode(maCode, null);
        if (km == null || !Boolean.TRUE.equals(km.getHoatDong())) {
            throw new IllegalArgumentException("Mã khuyến mãi không hợp lệ");
        }
        LocalDateTime luc = LocalDateTime.now();
        if (luc.isBefore(km.getNgayBatDau()) || luc.isAfter(km.getNgayKetThuc())) {
            throw new IllegalStateException("Mã khuyến mãi hết hạn hoặc chưa hiệu lực");
        }
        if (km.getSoLanToiDa() != null
                && km.getSoLanDaDung() != null
                && km.getSoLanDaDung() >= km.getSoLanToiDa()) {
            throw new IllegalStateException("Mã khuyến mãi đã hết lượt dùng");
        }
        return km;
    }

    private BigDecimal tinhSoTienGiam(BigDecimal giaGoc, KhuyenMai km) {
        BigDecimal pct = km.getPhanTramGiam() != null ? km.getPhanTramGiam() : BigDecimal.ZERO;
        BigDecimal giam = giaGoc.multiply(pct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        if (km.getSoTienGiamToiDa() != null && giam.compareTo(km.getSoTienGiamToiDa()) > 0) {
            giam = km.getSoTienGiamToiDa();
        }
        return giam;
    }

    private String chuanHoaMaCode(String maCode) {
        return maCode.trim().replaceAll("\\s+", "").toUpperCase();
    }
}
