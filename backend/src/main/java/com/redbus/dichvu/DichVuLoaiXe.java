package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaLoaiXe;
import com.redbus.anhxa.AnhXaLoaiXeAnh;
import com.redbus.mohinh.AnhLoaiXe;
import com.redbus.mohinh.LoaiXe;
import com.redbus.mohinh.LoaiXeAnhTomTat;
import com.redbus.truyen.AnhLoaiXePhanHoi;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichVuLoaiXe {

    private static final String TIEN_TO_CONG_KHAI = "tai-nguyen/";

    private final AnhXaLoaiXe anhXaLoaiXe;
    private final AnhXaLoaiXeAnh anhXaLoaiXeAnh;

    @Value("${app.upload.thu-muc:uploads}")
    private String thuMucUpload;

    public List<LoaiXe> tatCa() {
        List<LoaiXe> ds = anhXaLoaiXe.tatCa();
        ganDuongAnhChoDanhSach(ds);
        return ds;
    }

    public LoaiXe layTheoMa(Long ma) {
        LoaiXe x = anhXaLoaiXe.timTheoMa(ma);
        if (x == null) {
            throw new IllegalArgumentException("Không có loại xe");
        }
        ganDuongAnhChoMot(x);
        return x;
    }

    public LoaiXe them(LoaiXe x) {
        chuanHoaVaKiemTra(x, null);
        if (x.getHoatDong() == null) {
            x.setHoatDong(true);
        }
        x.setDsAnh(null);
        anhXaLoaiXe.them(x);
        return layTheoMa(x.getMa());
    }

    public LoaiXe capNhat(LoaiXe x) {
        if (x.getMa() == null) {
            throw new IllegalArgumentException("Thiếu mã loại xe");
        }
        layTheoMa(x.getMa());
        chuanHoaVaKiemTra(x, x.getMa());
        x.setDsAnh(null);
        anhXaLoaiXe.capNhat(x);
        return layTheoMa(x.getMa());
    }

    private void chuanHoaVaKiemTra(LoaiXe x, Long maLoaiTru) {
        if (x.getTen() != null) {
            x.setTen(x.getTen().trim().replaceAll("\\s+", " "));
        }
        if (x.getMoTa() != null) {
            x.setMoTa(x.getMoTa().trim());
        }
        if (x.getTen() == null || x.getTen().isBlank()) {
            throw new IllegalArgumentException("Tên loại xe không được để trống");
        }
        LoaiXe trung = anhXaLoaiXe.timTheoTen(x.getTen(), maLoaiTru);
        if (trung != null) {
            throw new IllegalArgumentException("Loại xe « " + trung.getTen() + " » đã tồn tại");
        }
    }

    @Transactional
    public void xoa(Long ma) {
        layTheoMa(ma);
        for (AnhLoaiXe a : anhXaLoaiXeAnh.timTheoMaLoaiXe(ma)) {
            xoaTepTrenDia(a.getTep());
        }
        anhXaLoaiXeAnh.xoaTheoMaLoaiXe(ma);
        anhXaLoaiXe.xoa(ma);
    }

    @Transactional
    public AnhLoaiXePhanHoi taiAnh(Long maLoaiXe, MultipartFile tep) {
        layTheoMa(maLoaiXe);
        if (tep == null || tep.isEmpty()) {
            throw new IllegalArgumentException("Chưa chọn tệp ảnh");
        }
        String tenGoc = tep.getOriginalFilename();
        String moRong = layMoRongAnToan(tenGoc);
        if (moRong.isEmpty()) {
            throw new IllegalArgumentException("Chỉ chấp nhận ảnh: jpg, jpeg, png, webp, gif");
        }
        if (tep.getSize() > 8 * 1024 * 1024) {
            throw new IllegalArgumentException("Ảnh tối đa 8MB");
        }
        String tenTep = UUID.randomUUID().toString().replace("-", "") + moRong;
        String duongTuongDoi = "loai-xe/" + maLoaiXe + "/" + tenTep;
        Path thuMuc = Path.of(thuMucUpload).resolve("loai-xe").resolve(String.valueOf(maLoaiXe));
        try {
            Files.createDirectories(thuMuc);
            Files.copy(tep.getInputStream(), thuMuc.resolve(tenTep), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Không ghi được ảnh", e);
        }
        int tt = anhXaLoaiXeAnh.timThuTuLonNhat(maLoaiXe) + 1;
        AnhLoaiXe banGhi = AnhLoaiXe.builder()
                .maLoaiXe(maLoaiXe)
                .tep(duongTuongDoi)
                .thuTu(tt)
                .build();
        anhXaLoaiXeAnh.them(banGhi);
        return AnhLoaiXePhanHoi.builder()
                .ma(banGhi.getMa())
                .maLoaiXe(maLoaiXe)
                .duongAnh(TIEN_TO_CONG_KHAI + duongTuongDoi)
                .build();
    }

    @Transactional
    public void xoaMotAnh(Long maLoaiXe, Long maAnh) {
        layTheoMa(maLoaiXe);
        AnhLoaiXe a = anhXaLoaiXeAnh.timTheoMa(maAnh);
        if (a == null || !maLoaiXe.equals(a.getMaLoaiXe())) {
            throw new IllegalArgumentException("Không có ảnh này");
        }
        xoaTepTrenDia(a.getTep());
        anhXaLoaiXeAnh.xoa(maAnh);
    }

    private void xoaTepTrenDia(String tepTuongDoi) {
        if (tepTuongDoi == null || tepTuongDoi.isBlank()) {
            return;
        }
        Path p = Path.of(thuMucUpload).resolve(tepTuongDoi).normalize();
        Path goc = Path.of(thuMucUpload).toAbsolutePath().normalize();
        if (!p.startsWith(goc)) {
            return;
        }
        try {
            Files.deleteIfExists(p);
        } catch (IOException ignored) {
            // best effort
        }
    }

    private static String layMoRongAnToan(String tenGoc) {
        if (tenGoc == null) {
            return "";
        }
        String t = tenGoc.toLowerCase();
        if (t.endsWith(".jpg") || t.endsWith(".jpeg")) {
            return ".jpg";
        }
        if (t.endsWith(".png")) {
            return ".png";
        }
        if (t.endsWith(".webp")) {
            return ".webp";
        }
        if (t.endsWith(".gif")) {
            return ".gif";
        }
        return "";
    }

    private void ganDuongAnhChoMot(LoaiXe lx) {
        List<AnhLoaiXe> imgs = anhXaLoaiXeAnh.timTheoMaLoaiXe(lx.getMa());
        imgs.sort(Comparator.comparing(AnhLoaiXe::getThuTu).thenComparing(AnhLoaiXe::getMa));
        lx.setDsAnh(imgs.stream()
                .map(a -> LoaiXeAnhTomTat.builder()
                        .ma(a.getMa())
                        .duongAnh(TIEN_TO_CONG_KHAI + a.getTep())
                        .build())
                .toList());
    }

    private void ganDuongAnhChoDanhSach(List<LoaiXe> ds) {
        if (ds == null || ds.isEmpty()) {
            return;
        }
        List<Long> mas = ds.stream().map(LoaiXe::getMa).filter(Objects::nonNull).toList();
        if (mas.isEmpty()) {
            return;
        }
        List<AnhLoaiXe> tatCa = anhXaLoaiXeAnh.timTheoDanhSachMaLoaiXe(mas);
        Map<Long, List<AnhLoaiXe>> gom = tatCa.stream().collect(Collectors.groupingBy(AnhLoaiXe::getMaLoaiXe));
        for (LoaiXe lx : ds) {
            List<AnhLoaiXe> imgs = gom.getOrDefault(lx.getMa(), List.of());
            imgs.sort(Comparator.comparing(AnhLoaiXe::getThuTu).thenComparing(AnhLoaiXe::getMa));
            lx.setDsAnh(imgs.stream()
                    .map(a -> LoaiXeAnhTomTat.builder()
                            .ma(a.getMa())
                            .duongAnh(TIEN_TO_CONG_KHAI + a.getTep())
                            .build())
                    .toList());
        }
    }
}
