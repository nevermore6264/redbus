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
        if (t.getHoatDong() == null) {
            t.setHoatDong(true);
        }
        anhXaTuyenDuong.them(t);
        return t;
    }

    public TuyenDuong capNhat(TuyenDuong t) {
        anhXaTuyenDuong.capNhat(t);
        return anhXaTuyenDuong.timTheoMa(t.getMa());
    }

    public void xoa(Long ma) {
        anhXaTuyenDuong.xoa(ma);
    }
}
