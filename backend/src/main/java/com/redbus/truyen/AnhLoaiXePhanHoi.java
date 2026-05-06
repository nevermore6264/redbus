package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnhLoaiXePhanHoi {

    private Long ma;
    private Long maLoaiXe;
    /** Đường dẫn dùng cho thẻ img khi ghép với base URL API */
    private String duongAnh;
}
