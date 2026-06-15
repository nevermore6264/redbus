package com.redbus.truyen;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class YeuCauBanDoLoTrinh {

    private String diemDi;
    private String diemDen;
    private List<DiemDungBanDo> diemDung = new ArrayList<>();

    @Data
    public static class DiemDungBanDo {
        private String tenDiem;
        private Double viDo;
        private Double kinhDo;
    }
}
