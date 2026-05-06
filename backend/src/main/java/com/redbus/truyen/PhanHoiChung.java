package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhanHoiChung<T> {

    private boolean thanhCong;
    private String thongDiep;
    private T duLieu;

    public static <T> PhanHoiChung<T> ok(T duLieu) {
        return PhanHoiChung.<T>builder().thanhCong(true).thongDiep("OK").duLieu(duLieu).build();
    }

    public static <T> PhanHoiChung<T> ok(String thongDiep, T duLieu) {
        return PhanHoiChung.<T>builder().thanhCong(true).thongDiep(thongDiep).duLieu(duLieu).build();
    }

    public static <T> PhanHoiChung<T> loi(String thongDiep) {
        return PhanHoiChung.<T>builder().thanhCong(false).thongDiep(thongDiep).duLieu(null).build();
    }
}
