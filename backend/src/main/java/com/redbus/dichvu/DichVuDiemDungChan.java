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
        chuanHoaVaKiemTra(d, null);
        anhXaDiemDungChan.them(d);
        return anhXaDiemDungChan.timTheoMa(d.getMa());
    }

    public DiemDungChan capNhat(DiemDungChan d) {
        layTheoMa(d.getMa());
        if (anhXaTuyenDuong.timTheoMa(d.getMaTuyen()) == null) {
            throw new IllegalArgumentException("Không có tuyến");
        }
        chuanHoaVaKiemTra(d, d.getMa());
        anhXaDiemDungChan.capNhat(d);
        return layTheoMa(d.getMa());
    }

    private void chuanHoaVaKiemTra(DiemDungChan d, Long maLoaiTru) {
        if (d.getTenDiem() != null) {
            d.setTenDiem(d.getTenDiem().trim().replaceAll("\\s+", " "));
        }
        if (d.getTenDiem() == null || d.getTenDiem().isBlank()) {
            throw new IllegalArgumentException("Tên điểm dừng không được để trống");
        }
        if (d.getThuTu() == null) {
            d.setThuTu(0);
        }
        if (d.getThuTu() < 0) {
            throw new IllegalArgumentException("Thứ tự phải từ 0 trở lên");
        }
        if (d.getThoiGianDungPhut() == null) {
            d.setThoiGianDungPhut(5);
        }
        if (d.getThoiGianDungPhut() < 0) {
            throw new IllegalArgumentException("Thời gian dừng không hợp lệ");
        }
        DiemDungChan trungThuTu = anhXaDiemDungChan.timTheoTuyenVaThuTu(d.getMaTuyen(), d.getThuTu(), maLoaiTru);
        if (trungThuTu != null) {
            throw new IllegalArgumentException("Thứ tự " + d.getThuTu() + " đã có trên tuyến này");
        }
        DiemDungChan trungTen = anhXaDiemDungChan.timTheoTuyenVaTenDiem(d.getMaTuyen(), d.getTenDiem(), maLoaiTru);
        if (trungTen != null) {
            throw new IllegalArgumentException("Điểm « " + trungTen.getTenDiem() + " » đã có trên tuyến này");
        }
    }

    public void xoa(Long ma) {
        layTheoMa(ma);
        anhXaDiemDungChan.xoa(ma);
    }
}
