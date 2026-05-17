package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.mohinh.TuyenDuong;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuTuyenDuong {

    private final AnhXaTuyenDuong anhXaTuyenDuong;

    public List<TuyenDuong> danhSach(String diemDi, String diemDen) {
        if ((diemDi == null || diemDi.isBlank()) && (diemDen == null || diemDen.isBlank())) {
            return anhXaTuyenDuong.tatCa();
        }
        return anhXaTuyenDuong.timKiem(
                diemDi != null ? diemDi : "",
                diemDen != null ? diemDen : "");
    }

    public TuyenDuong layTheoMa(Long ma) {
        TuyenDuong t = anhXaTuyenDuong.timTheoMa(ma);
        if (t == null) {
            throw new IllegalArgumentException("Không có tuyến");
        }
        return t;
    }

    public TuyenDuong them(TuyenDuong t) {
        chuanHoaVaKiemTra(t, null);
        if (t.getHoatDong() == null) {
            t.setHoatDong(true);
        }
        anhXaTuyenDuong.them(t);
        return t;
    }

    public TuyenDuong capNhat(TuyenDuong t) {
        if (t.getMa() == null) {
            throw new IllegalArgumentException("Thiếu mã tuyến");
        }
        layTheoMa(t.getMa());
        chuanHoaVaKiemTra(t, t.getMa());
        anhXaTuyenDuong.capNhat(t);
        return anhXaTuyenDuong.timTheoMa(t.getMa());
    }

    private void chuanHoaVaKiemTra(TuyenDuong t, Long maLoaiTru) {
        if (t.getDiemDi() != null) {
            t.setDiemDi(t.getDiemDi().trim().replaceAll("\\s+", " "));
        }
        if (t.getDiemDen() != null) {
            t.setDiemDen(t.getDiemDen().trim().replaceAll("\\s+", " "));
        }
        if (t.getDiemDi() == null || t.getDiemDi().isBlank()) {
            throw new IllegalArgumentException("Điểm đi không được để trống");
        }
        if (t.getDiemDen() == null || t.getDiemDen().isBlank()) {
            throw new IllegalArgumentException("Điểm đến không được để trống");
        }
        if (t.getDiemDi().equalsIgnoreCase(t.getDiemDen())) {
            throw new IllegalArgumentException("Điểm đi và điểm đến phải khác nhau");
        }
        if (t.getKhoangCachKm() == null || t.getKhoangCachKm() <= 0) {
            throw new IllegalArgumentException("Khoảng cách (km) phải lớn hơn 0");
        }
        if (t.getThoiGianUocTinhPhut() == null || t.getThoiGianUocTinhPhut() <= 0) {
            throw new IllegalArgumentException("Thời gian ước tính (phút) phải lớn hơn 0");
        }
        TuyenDuong trung = anhXaTuyenDuong.timTheoCapDiem(t.getDiemDi(), t.getDiemDen(), maLoaiTru);
        if (trung != null) {
            throw new IllegalArgumentException(
                    "Tuyến « " + trung.getDiemDi() + " — " + trung.getDiemDen() + " » đã tồn tại");
        }
    }

    public void xoa(Long ma) {
        anhXaTuyenDuong.xoa(ma);
    }
}
