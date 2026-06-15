package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DiemBanDoPhanHoi {

    private String ten;
    private double viDo;
    private double kinhDo;
}
