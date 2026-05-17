package com.redbus.truyen;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class KetQuaGenLich {

    private int soChuyenDaTao;
    private int soNgayDaGen;
    private int soNgayDaBoQua;
    private List<String> cacNgayDaGen;
    private List<String> cacNgayDaBoQua;
}
