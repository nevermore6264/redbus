package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.mohinh.ChuyenXe;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuChuyenXe {

    private final AnhXaChuyenXe anhXaChuyenXe;

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
}
