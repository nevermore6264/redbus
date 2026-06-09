package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTinTuc;
import com.redbus.mohinh.TinTuc;
import com.redbus.truyen.DuongAnhPhanHoi;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DichVuTinTuc {

    private static final String TIEN_TO_CONG_KHAI = "tai-nguyen/";

    private final AnhXaTinTuc anhXaTinTuc;

    @Value("${app.upload.thu-muc:uploads}")
    private String thuMucUpload;

    public List<TinTuc> congKhai(int gioiHan) {
        return anhXaTinTuc.congKhai(Math.min(Math.max(gioiHan, 1), 50));
    }

    public List<TinTuc> tatCa() {
        return anhXaTinTuc.tatCa();
    }

    public TinTuc layTheoMa(Long ma) {
        TinTuc t = anhXaTinTuc.timTheoMa(ma);
        if (t == null) {
            throw new IllegalArgumentException("Không có tin tức");
        }
        return t;
    }

    public TinTuc them(TinTuc t) {
        chuanHoaVaKiemTra(t);
        if (t.getHoatDong() == null) {
            t.setHoatDong(true);
        }
        anhXaTinTuc.them(t);
        return anhXaTinTuc.timTheoMa(t.getMa());
    }

    public TinTuc capNhat(TinTuc t) {
        if (t.getMa() == null) {
            throw new IllegalArgumentException("Thiếu mã tin");
        }
        layTheoMa(t.getMa());
        chuanHoaVaKiemTra(t);
        anhXaTinTuc.capNhat(t);
        return layTheoMa(t.getMa());
    }

    private void chuanHoaVaKiemTra(TinTuc t) {
        if (t.getTieuDe() != null) {
            t.setTieuDe(t.getTieuDe().trim().replaceAll("\\s+", " "));
        }
        if (t.getTomTat() != null) {
            t.setTomTat(t.getTomTat().trim());
        }
        if (t.getNoiDung() != null) {
            t.setNoiDung(t.getNoiDung().trim());
        }
        if (t.getTieuDe() == null || t.getTieuDe().isBlank()) {
            throw new IllegalArgumentException("Tiêu đề không được để trống");
        }
        if (t.getNoiDung() == null || t.getNoiDung().isBlank()) {
            throw new IllegalArgumentException("Nội dung không được để trống");
        }
    }

    public void xoa(Long ma) {
        layTheoMa(ma);
        anhXaTinTuc.xoa(ma);
    }

    public DuongAnhPhanHoi taiAnh(MultipartFile tep) {
        if (tep == null || tep.isEmpty()) {
            throw new IllegalArgumentException("Chưa chọn tệp ảnh");
        }
        String moRong = layMoRongAnToan(tep.getOriginalFilename());
        if (moRong.isEmpty()) {
            throw new IllegalArgumentException("Chỉ chấp nhận ảnh: jpg, jpeg, png, webp, gif");
        }
        if (tep.getSize() > 8 * 1024 * 1024) {
            throw new IllegalArgumentException("Ảnh tối đa 8MB");
        }
        String tenTep = UUID.randomUUID().toString().replace("-", "") + moRong;
        String duongTuongDoi = "tin-tuc/" + tenTep;
        Path thuMuc = Path.of(thuMucUpload).resolve("tin-tuc");
        try {
            Files.createDirectories(thuMuc);
            Files.copy(tep.getInputStream(), thuMuc.resolve(tenTep), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Không ghi được ảnh", e);
        }
        return DuongAnhPhanHoi.builder().duongAnh(TIEN_TO_CONG_KHAI + duongTuongDoi).build();
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
}
