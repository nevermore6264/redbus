package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaXeKhach;
import com.redbus.mohinh.XeKhach;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuXeKhach {

    private final AnhXaXeKhach anhXaXeKhach;

    public List<XeKhach> tatCa() {
        return anhXaXeKhach.tatCa();
    }

    public XeKhach layTheoMa(Long ma) {
        XeKhach x = anhXaXeKhach.timTheoMa(ma);
        if (x == null) {
            throw new IllegalArgumentException("Không có xe");
        }
        return x;
    }

    public XeKhach them(XeKhach x) {
        chuanHoaVaKiemTra(x, null);
        if (x.getHoatDong() == null) {
            x.setHoatDong(true);
        }
        anhXaXeKhach.them(x);
        return x;
    }

    public XeKhach capNhat(XeKhach x) {
        if (x.getMa() == null) {
            throw new IllegalArgumentException("Thiếu mã xe");
        }
        layTheoMa(x.getMa());
        chuanHoaVaKiemTra(x, x.getMa());
        anhXaXeKhach.capNhat(x);
        return anhXaXeKhach.timTheoMa(x.getMa());
    }

    private void chuanHoaVaKiemTra(XeKhach x, Long maLoaiTru) {
        if (x.getBienSo() != null) {
            x.setBienSo(x.getBienSo().trim().replaceAll("\\s+", "").toUpperCase());
        }
        if (x.getHangXe() != null) {
            x.setHangXe(x.getHangXe().trim().replaceAll("\\s+", " "));
        }
        if (x.getMaLoaiXe() == null) {
            throw new IllegalArgumentException("Chọn loại xe");
        }
        if (x.getBienSo() == null || x.getBienSo().isBlank()) {
            throw new IllegalArgumentException("Biển số không được để trống");
        }
        if (x.getSoCho() == null || x.getSoCho() <= 0) {
            throw new IllegalArgumentException("Số chỗ phải lớn hơn 0");
        }
        XeKhach trung = anhXaXeKhach.timTheoBienSo(x.getBienSo(), maLoaiTru);
        if (trung != null) {
            throw new IllegalArgumentException("Biển số « " + trung.getBienSo() + " » đã tồn tại");
        }
    }

    public void xoa(Long ma) {
        anhXaXeKhach.xoa(ma);
    }
}
