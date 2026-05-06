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
        if (cx.getTrangThai() == null) {
            cx.setTrangThai("SCHEDULED");
        }
        anhXaChuyenXe.them(cx);
        return cx;
    }

    public ChuyenXe capNhat(ChuyenXe cx) {
        anhXaChuyenXe.capNhat(cx);
        return anhXaChuyenXe.timTheoMa(cx.getMa());
    }

    public void xoa(Long ma) {
        anhXaChuyenXe.xoa(ma);
    }
}
