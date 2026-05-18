package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaBaoCao;
import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaDanhGiaChuyen;
import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.anhxa.AnhXaLoaiXe;
import com.redbus.anhxa.AnhXaThanhToan;
import com.redbus.anhxa.AnhXaTinTuc;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.GiaoDichThanhToan;
import com.redbus.truyen.BaoCaoBieuDoPhanHoi;
import com.redbus.truyen.BaoCaoMoRong;
import com.redbus.truyen.MucBieuDo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DichVuBaoCao {

    private final AnhXaThanhToan anhXaThanhToan;
    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaDanhGiaChuyen anhXaDanhGiaChuyen;
    private final AnhXaTinTuc anhXaTinTuc;
    private final AnhXaKhuyenMai anhXaKhuyenMai;
    private final AnhXaDiemDungChan anhXaDiemDungChan;
    private final AnhXaLoaiXe anhXaLoaiXe;
    private final AnhXaBaoCao anhXaBaoCao;

    private static final int SO_NGAY_BIEU_DO = 7;
    private static final int TOP_TUYEN = 5;

    public BaoCaoBieuDoPhanHoi bieuDo() {
        return BaoCaoBieuDoPhanHoi.builder()
                .doanhThuTheoNgay(dayDu7Ngay(anhXaBaoCao.doanhThuTheoNgay(SO_NGAY_BIEU_DO)))
                .trangThaiVe(chuanHoaTrangThai(anhXaBaoCao.demVeTheoTrangThai()))
                .phuongThucThanhToan(anhXaBaoCao.veTheoPhuongThuc())
                .topTuyenTheoVe(anhXaBaoCao.topTuyenTheoVe(TOP_TUYEN))
                .phanBoDanhGia(anhXaBaoCao.phanBoDiemDanhGia())
                .build();
    }

    private List<MucBieuDo> dayDu7Ngay(List<MucBieuDo> tuDb) {
        Map<String, MucBieuDo> map = new LinkedHashMap<>();
        for (MucBieuDo m : tuDb) {
            if (m.getNhan() != null) {
                map.put(m.getNhan(), m);
            }
        }
        List<MucBieuDo> ketQua = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM");
        LocalDate homNay = LocalDate.now();
        for (int i = SO_NGAY_BIEU_DO - 1; i >= 0; i--) {
            String nhan = homNay.minusDays(i).format(fmt);
            MucBieuDo co = map.get(nhan);
            if (co != null) {
                ketQua.add(co);
            } else {
                ketQua.add(MucBieuDo.builder().nhan(nhan).soLuong(0L).giaTri(BigDecimal.ZERO).build());
            }
        }
        return ketQua;
    }

    private List<MucBieuDo> chuanHoaTrangThai(List<MucBieuDo> ds) {
        Map<String, String> ten = Map.of(
                "PENDING", "Chờ thanh toán",
                "PAID", "Đã thanh toán",
                "CANCELLED", "Đã hủy",
                "EXPIRED", "Quá hạn");
        List<MucBieuDo> ketQua = new ArrayList<>();
        for (MucBieuDo m : ds) {
            String nhan = m.getNhan() != null ? ten.getOrDefault(m.getNhan(), m.getNhan()) : "Khác";
            ketQua.add(MucBieuDo.builder()
                    .nhan(nhan)
                    .soLuong(m.getSoLuong())
                    .giaTri(m.getGiaTri())
                    .build());
        }
        return ketQua;
    }

    public BaoCaoMoRong baoCaoMoRong() {
        List<GiaoDichThanhToan> tatCa = anhXaThanhToan.tatCa();
        BigDecimal doanhThu = tatCa.stream()
                .filter(p -> "SUCCESS".equals(p.getTrangThai()))
                .map(p -> p.getSoTien() != null ? p.getSoTien() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal diemTb = anhXaDanhGiaChuyen.diemTrungBinh();
        if (diemTb == null) {
            diemTb = BigDecimal.ZERO;
        }
        return BaoCaoMoRong.builder()
                .soGiaoDichThanhToan(tatCa.size())
                .tongDoanhThu(doanhThu)
                .soVeDaThanhToan(anhXaVeXe.demTheoTrangThai("PAID"))
                .soVeChoXuLy(anhXaVeXe.demTheoTrangThai("PENDING"))
                .soChuyenLichDinh(anhXaChuyenXe.demTheoTrangThai("SCHEDULED"))
                .soDanhGia(anhXaDanhGiaChuyen.demTatCa())
                .diemTrungBinhDanhGia(diemTb)
                .soTinTucHoatDong(anhXaTinTuc.demHoatDong())
                .soKhuyenMaiDangHieuLuc(anhXaKhuyenMai.demDangHoatDong(LocalDateTime.now()))
                .soDiemDungChan(anhXaDiemDungChan.demTatCa())
                .soLoaiXe(anhXaLoaiXe.demTatCa())
                .build();
    }

    public byte[] xuatCsv() {
        BaoCaoMoRong b = baoCaoMoRong();
        List<GiaoDichThanhToan> gd = anhXaThanhToan.tatCa();
        StringBuilder sb = new StringBuilder();
        sb.append("Bao cao RedBus,").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append('\n');
        sb.append("Chi tieu,Gia tri\n");
        sb.append("Tong giao dich,").append(b.getSoGiaoDichThanhToan()).append('\n');
        sb.append("Tong doanh thu (VND),").append(b.getTongDoanhThu()).append('\n');
        sb.append("Ve da thanh toan,").append(b.getSoVeDaThanhToan()).append('\n');
        sb.append("Ve cho xu ly,").append(b.getSoVeChoXuLy()).append('\n');
        sb.append("Chuyen da len lich,").append(b.getSoChuyenLichDinh()).append('\n');
        sb.append("So danh gia,").append(b.getSoDanhGia()).append('\n');
        sb.append("Diem TB danh gia,").append(b.getDiemTrungBinhDanhGia()).append('\n');
        sb.append('\n');
        sb.append("Ma giao dich,Ma ve,So tien,Trang thai,Thoi gian\n");
        for (GiaoDichThanhToan g : gd) {
            sb.append(g.getMa()).append(',');
            sb.append(g.getMaVe() != null ? g.getMaVe() : "").append(',');
            sb.append(g.getSoTien() != null ? g.getSoTien() : "").append(',');
            sb.append(g.getTrangThai() != null ? g.getTrangThai() : "").append(',');
            sb.append(g.getThoiGianTao() != null ? g.getThoiGianTao() : "").append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }
}
