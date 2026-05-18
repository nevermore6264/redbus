package com.redbus.cauhinh;

import com.redbus.dichvu.DichVuHetHanVe;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TacVuHetHanThanhToanVe {

    private final DichVuHetHanVe dichVuHetHanVe;

    @Scheduled(fixedRate = 60_000)
    public void tuDongHuyVeQuaHan() {
        int soVe = dichVuHetHanVe.xuLyHetHanTatCa();
        if (soVe > 0) {
            log.info("Đã hủy {} vé quá hạn thanh toán", soVe);
        }
    }
}
