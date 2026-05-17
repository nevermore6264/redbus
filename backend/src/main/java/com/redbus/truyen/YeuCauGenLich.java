package com.redbus.truyen;

import lombok.Data;

import java.time.LocalDate;

@Data
public class YeuCauGenLich {

    /** Ngày bắt đầu (mặc định hôm nay). */
    private LocalDate tuNgay;

    /** Số ngày liên tiếp cần xét (mặc định 7). */
    private Integer soNgay;

    /** Chỉ sinh cho tuyến này; null = tất cả tuyến hoạt động. */
    private Long maTuyen;
}
