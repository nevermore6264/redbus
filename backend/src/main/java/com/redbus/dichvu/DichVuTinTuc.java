package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTinTuc;
import com.redbus.mohinh.TinTuc;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuTinTuc {

    private final AnhXaTinTuc anhXaTinTuc;

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
}
