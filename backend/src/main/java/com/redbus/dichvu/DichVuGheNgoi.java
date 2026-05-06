package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaGheNgoi;
import com.redbus.mohinh.GheNgoi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuGheNgoi {

    private final AnhXaGheNgoi anhXaGheNgoi;

    public List<GheNgoi> danhSachTheoXe(Long maXe) {
        return anhXaGheNgoi.timTheoMaXe(maXe);
    }

    public void doiTrangThai(Long maGhe, String trangThaiMoi) {
        GheNgoi g = anhXaGheNgoi.timTheoMa(maGhe);
        if (g == null) {
            throw new IllegalArgumentException("Không có ghế");
        }
        if (!"AVAILABLE".equalsIgnoreCase(trangThaiMoi) && !"BLOCKED".equalsIgnoreCase(trangThaiMoi)) {
            throw new IllegalArgumentException("Trạng thái chỉ có AVAILABLE hoặc BLOCKED");
        }
        anhXaGheNgoi.capNhatTrangThai(maGhe, trangThaiMoi.toUpperCase());
    }
}
