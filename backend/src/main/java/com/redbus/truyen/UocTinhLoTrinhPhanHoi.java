package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UocTinhLoTrinhPhanHoi {

    private int khoangCachKm;
    private int thoiGianUocTinhPhut;
    private String ghiChu;
}
