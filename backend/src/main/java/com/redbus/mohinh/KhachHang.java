package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang {

    private Long ma;
    private Long maTaiKhoan;
    private String hoTen;
    private String soDienThoai;
    private String diaChi;
}
