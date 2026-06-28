package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.VeXe;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DichVuHetHanVe {

    private final AnhXaVeXe anhXaVeXe;

    @Value("${app.ve.phut-cho-thanh-toan:5}")
    private int phutChoThanhToan;

    public int getPhutChoThanhToan() {
        return phutChoThanhToan;
    }

    @Transactional
    public int xuLyHetHanChoKhach(Long maKhach) {
        if (maKhach == null) {
            return 0;
        }
        return anhXaVeXe.huyPendingQuaHanTheoKhach(maKhach, phutChoThanhToan);
    }

    @Transactional
    public int xuLyHetHanTatCa() {
        return anhXaVeXe.huyPendingQuaHanTatCa(phutChoThanhToan);
    }

    public boolean daHetHan(VeXe ve) {
        if (ve == null || !"PENDING".equals(ve.getTrangThai()) || ve.getThoiGianDat() == null) {
            return false;
        }
        return ve.getThoiGianDat().plusMinutes(phutChoThanhToan).isBefore(LocalDateTime.now());
    }

    @Transactional
    public void damBaoChuaHetHan(VeXe ve) {
        if (ve == null) {
            throw new IllegalArgumentException("Không có vé");
        }
        if ("EXPIRED".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé đã quá hạn thanh toán (" + phutChoThanhToan + " phút)");
        }
        if ("CANCELLED".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé đã hủy");
        }
        if (daHetHan(ve)) {
            anhXaVeXe.capNhatTrangThai(ve.getMa(), "EXPIRED");
            throw new IllegalStateException("Vé đã quá hạn thanh toán (" + phutChoThanhToan + " phút)");
        }
    }

    public LocalDateTime lucHetHan(VeXe ve) {
        if (ve == null || ve.getThoiGianDat() == null) {
            return null;
        }
        return ve.getThoiGianDat().plusMinutes(phutChoThanhToan);
    }
}
