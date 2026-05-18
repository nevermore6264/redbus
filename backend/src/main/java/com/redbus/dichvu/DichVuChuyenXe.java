package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.anhxa.AnhXaLoaiXe;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.anhxa.AnhXaXeKhach;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.LoaiXe;
import com.redbus.mohinh.TuyenDuong;
import com.redbus.mohinh.XeKhach;
import com.redbus.truyen.ChuyenXeLocPhanHoi;
import com.redbus.truyen.KetQuaGenLich;
import com.redbus.truyen.YeuCauGenLich;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuChuyenXe {

    private static final int[] GIO_KHOI_HANH_MAC_DINH = {6, 9, 13, 17, 21};
    private static final DateTimeFormatter DINH_DANG_NGAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaTuyenDuong anhXaTuyenDuong;
    private final AnhXaXeKhach anhXaXeKhach;
    private final AnhXaGheNgoi anhXaGheNgoi;
    private final AnhXaLoaiXe anhXaLoaiXe;

    public List<ChuyenXeLocPhanHoi> timKiemNangCao(
            Long maTuyen,
            LocalDateTime tuLuc,
            BigDecimal giaMin,
            BigDecimal giaMax,
            Long maLoaiXe,
            Integer gioTu,
            Integer gioDen,
            String sapXep) {
        List<ChuyenXe> ds = timTheoTuyen(maTuyen, tuLuc);
        List<ChuyenXeLocPhanHoi> ketQua = new ArrayList<>();
        for (ChuyenXe cx : ds) {
            XeKhach xe = anhXaXeKhach.timTheoMa(cx.getMaXe());
            if (xe == null) {
                continue;
            }
            if (maLoaiXe != null && !maLoaiXe.equals(xe.getMaLoaiXe())) {
                continue;
            }
            if (giaMin != null && cx.getGiaVe().compareTo(giaMin) < 0) {
                continue;
            }
            if (giaMax != null && cx.getGiaVe().compareTo(giaMax) > 0) {
                continue;
            }
            int gio = cx.getThoiDiemKhoiHanh().getHour();
            if (gioTu != null && gio < gioTu) {
                continue;
            }
            if (gioDen != null && gio > gioDen) {
                continue;
            }
            int tongGhe = anhXaGheNgoi.timTheoMaXe(xe.getMa()).size();
            int daGiu = anhXaChuyenXe.danhSachMaGheDaGiu(cx.getMa()).size();
            String tenLoai = null;
            if (xe.getMaLoaiXe() != null) {
                LoaiXe lx = anhXaLoaiXe.timTheoMa(xe.getMaLoaiXe());
                tenLoai = lx != null ? lx.getTen() : null;
            }
            ketQua.add(
                    ChuyenXeLocPhanHoi.builder()
                            .chuyen(cx)
                            .tenLoaiXe(tenLoai)
                            .soGheTrong(Math.max(0, tongGhe - daGiu))
                            .build());
        }
        Comparator<ChuyenXeLocPhanHoi> cmp =
                Comparator.comparing(c -> c.getChuyen().getThoiDiemKhoiHanh());
        if ("gia_tang".equalsIgnoreCase(sapXep)) {
            cmp = Comparator.comparing(c -> c.getChuyen().getGiaVe());
        } else if ("gia_giam".equalsIgnoreCase(sapXep)) {
            cmp = Comparator.comparing((ChuyenXeLocPhanHoi c) -> c.getChuyen().getGiaVe()).reversed();
        } else if ("ghe_nhieu".equalsIgnoreCase(sapXep)) {
            cmp = Comparator.comparing(ChuyenXeLocPhanHoi::getSoGheTrong).reversed();
        }
        return ketQua.stream().sorted(cmp).collect(Collectors.toList());
    }

    public List<ChuyenXe> timTheoTuyen(Long maTuyen, LocalDateTime tuLuc) {
        LocalDateTime moc = tuLuc != null ? tuLuc : LocalDateTime.now().minusDays(1);
        return anhXaChuyenXe.timTheoTuyenVaSauThoiDiem(maTuyen, moc);
    }

    public List<ChuyenXe> tatCa() {
        return anhXaChuyenXe.tatCa();
    }

    public ChuyenXe layTheoMa(Long ma) {
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ma);
        if (cx == null) {
            throw new IllegalArgumentException("Không có chuyến xe");
        }
        return cx;
    }

    public List<Long> maGheDaGiu(Long maChuyen) {
        layTheoMa(maChuyen);
        return anhXaChuyenXe.danhSachMaGheDaGiu(maChuyen);
    }

    public ChuyenXe them(ChuyenXe cx) {
        chuanHoaVaKiemTra(cx, null);
        if (cx.getTrangThai() == null) {
            cx.setTrangThai("SCHEDULED");
        }
        anhXaChuyenXe.them(cx);
        return cx;
    }

    public ChuyenXe capNhat(ChuyenXe cx) {
        if (cx.getMa() == null) {
            throw new IllegalArgumentException("Thiếu mã chuyến");
        }
        layTheoMa(cx.getMa());
        chuanHoaVaKiemTra(cx, cx.getMa());
        anhXaChuyenXe.capNhat(cx);
        return anhXaChuyenXe.timTheoMa(cx.getMa());
    }

    private void chuanHoaVaKiemTra(ChuyenXe cx, Long maLoaiTru) {
        if (cx.getMaTuyen() == null) {
            throw new IllegalArgumentException("Chọn tuyến");
        }
        if (cx.getMaXe() == null) {
            throw new IllegalArgumentException("Chọn xe");
        }
        if (cx.getThoiDiemKhoiHanh() == null) {
            throw new IllegalArgumentException("Chọn giờ khởi hành");
        }
        if (cx.getGiaVe() == null || cx.getGiaVe().signum() <= 0) {
            throw new IllegalArgumentException("Giá vé phải lớn hơn 0");
        }
        if (cx.getThoiDiemDen() != null && !cx.getThoiDiemDen().isAfter(cx.getThoiDiemKhoiHanh())) {
            throw new IllegalArgumentException("Giờ đến phải sau giờ khởi hành");
        }
        ChuyenXe trung = anhXaChuyenXe.timTrungChuyen(
                cx.getMaTuyen(), cx.getMaXe(), cx.getThoiDiemKhoiHanh(), maLoaiTru);
        if (trung != null) {
            throw new IllegalArgumentException("Chuyến trùng tuyến, xe và giờ khởi hành đã tồn tại");
        }
    }

    public void xoa(Long ma) {
        anhXaChuyenXe.xoa(ma);
    }

    @Transactional
    public KetQuaGenLich genLich(YeuCauGenLich yeuCau) {
        LocalDate tuNgay = yeuCau.getTuNgay() != null ? yeuCau.getTuNgay() : LocalDate.now();
        int soNgay = yeuCau.getSoNgay() != null && yeuCau.getSoNgay() > 0 ? yeuCau.getSoNgay() : 7;
        if (soNgay > 31) {
            throw new IllegalArgumentException("Tối đa 31 ngày mỗi lần gen");
        }

        List<TuyenDuong> tuyen = locTuyenHoatDong(yeuCau.getMaTuyen());
        List<XeKhach> xe = locXeHoatDong();
        if (tuyen.isEmpty()) {
            throw new IllegalArgumentException("Không có tuyến hoạt động để gen lịch");
        }
        if (xe.isEmpty()) {
            throw new IllegalArgumentException("Không có xe hoạt động để gen lịch");
        }

        int daTao = 0;
        int ngayGen = 0;
        int ngayBoQua = 0;
        List<String> dsNgayGen = new ArrayList<>();
        List<String> dsNgayBoQua = new ArrayList<>();

        for (int i = 0; i < soNgay; i++) {
            LocalDate ngay = tuNgay.plusDays(i);
            if (anhXaChuyenXe.demTrongNgay(ngay, yeuCau.getMaTuyen()) > 0) {
                ngayBoQua++;
                dsNgayBoQua.add(ngay.format(DINH_DANG_NGAY));
                continue;
            }
            daTao += taoChuyenChoNgay(ngay, tuyen, xe);
            ngayGen++;
            dsNgayGen.add(ngay.format(DINH_DANG_NGAY));
        }

        return KetQuaGenLich.builder()
                .soChuyenDaTao(daTao)
                .soNgayDaGen(ngayGen)
                .soNgayDaBoQua(ngayBoQua)
                .cacNgayDaGen(dsNgayGen)
                .cacNgayDaBoQua(dsNgayBoQua)
                .build();
    }

    private List<TuyenDuong> locTuyenHoatDong(Long maTuyen) {
        if (maTuyen != null) {
            TuyenDuong t = anhXaTuyenDuong.timTheoMa(maTuyen);
            if (t == null) {
                throw new IllegalArgumentException("Không tìm thấy tuyến");
            }
            if (Boolean.FALSE.equals(t.getHoatDong())) {
                throw new IllegalArgumentException("Tuyến không hoạt động");
            }
            return List.of(t);
        }
        return anhXaTuyenDuong.tatCa().stream()
                .filter(t -> t.getHoatDong() == null || t.getHoatDong())
                .toList();
    }

    private List<XeKhach> locXeHoatDong() {
        return anhXaXeKhach.tatCa().stream()
                .filter(x -> x.getHoatDong() == null || x.getHoatDong())
                .toList();
    }

    private int taoChuyenChoNgay(LocalDate ngay, List<TuyenDuong> tuyen, List<XeKhach> xe) {
        int dem = 0;
        for (int r = 0; r < tuyen.size(); r++) {
            TuyenDuong t = tuyen.get(r);
            XeKhach x = xe.get(r % xe.size());
            int phut = t.getThoiGianUocTinhPhut() != null && t.getThoiGianUocTinhPhut() > 0
                    ? t.getThoiGianUocTinhPhut()
                    : 180;
            BigDecimal gia = tinhGiaVe(t);
            for (int h : GIO_KHOI_HANH_MAC_DINH) {
                LocalDateTime khoi = LocalDateTime.of(ngay, LocalTime.of(h, 0));
                if (anhXaChuyenXe.timTrungChuyen(t.getMa(), x.getMa(), khoi, null) != null) {
                    continue;
                }
                LocalDateTime den = khoi.plusMinutes(phut);
                ChuyenXe cx = ChuyenXe.builder()
                        .maTuyen(t.getMa())
                        .maXe(x.getMa())
                        .thoiDiemKhoiHanh(khoi)
                        .thoiDiemDen(den)
                        .giaVe(gia)
                        .trangThai("SCHEDULED")
                        .build();
                anhXaChuyenXe.them(cx);
                dem++;
            }
        }
        return dem;
    }

    private BigDecimal tinhGiaVe(TuyenDuong t) {
        int km = t.getKhoangCachKm() != null && t.getKhoangCachKm() > 0 ? t.getKhoangCachKm() : 100;
        long gia = Math.max(120_000L, km * 2_500L);
        return BigDecimal.valueOf(gia);
    }
}
