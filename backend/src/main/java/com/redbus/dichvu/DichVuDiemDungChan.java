package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaDiemDungChan;
import com.redbus.anhxa.AnhXaTuyenDuong;
import com.redbus.mohinh.DiemDungChan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuDiemDungChan {

    private final AnhXaDiemDungChan anhXaDiemDungChan;
    private final AnhXaTuyenDuong anhXaTuyenDuong;

    public List<DiemDungChan> theoMaTuyen(Long maTuyen) {
        if (anhXaTuyenDuong.timTheoMa(maTuyen) == null) {
            throw new IllegalArgumentException("Không có tuyến");
        }
        return anhXaDiemDungChan.theoMaTuyen(maTuyen);
    }

    public DiemDungChan layTheoMa(Long ma) {
        DiemDungChan d = anhXaDiemDungChan.timTheoMa(ma);
        if (d == null) {
            throw new IllegalArgumentException("Không có điểm dừng");
        }
        return d;
    }

    public DiemDungChan them(DiemDungChan d) {
        if (anhXaTuyenDuong.timTheoMa(d.getMaTuyen()) == null) {
            throw new IllegalArgumentException("Không có tuyến");
        }
        if (d.getThuTu() == null) {
            d.setThuTu(0);
        }
        if (d.getThoiGianDungPhut() == null) {
            d.setThoiGianDungPhut(5);
        }
        anhXaDiemDungChan.them(d);
        return anhXaDiemDungChan.timTheoMa(d.getMa());
    }

    public DiemDungChan capNhat(DiemDungChan d) {
        layTheoMa(d.getMa());
        if (anhXaTuyenDuong.timTheoMa(d.getMaTuyen()) == null) {
            throw new IllegalArgumentException("Không có tuyến");
        }
        anhXaDiemDungChan.capNhat(d);
        return layTheoMa(d.getMa());
    }

    public void xoa(Long ma) {
        layTheoMa(ma);
        anhXaDiemDungChan.xoa(ma);
    }
}
