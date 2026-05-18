package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiemDungChan {

    private Long ma;
    private Long maTuyen;
    private String tenDiem;
    private Integer thuTu;
    private Integer thoiGianDungPhut;
    private Double viDo;
    private Double kinhDo;
}
