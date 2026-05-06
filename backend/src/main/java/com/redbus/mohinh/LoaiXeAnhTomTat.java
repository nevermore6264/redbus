package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoaiXeAnhTomTat {

    private Long ma;
    /** ví dụ tai-nguyen/loai-xe/3/uuid.jpg */
    private String duongAnh;
}
