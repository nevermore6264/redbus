package com.redbus.truyen;

import com.redbus.mohinh.ChuyenXe;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChuyenXeLocPhanHoi {

    private ChuyenXe chuyen;
    private String tenLoaiXe;
    private Integer soGheTrong;
}
