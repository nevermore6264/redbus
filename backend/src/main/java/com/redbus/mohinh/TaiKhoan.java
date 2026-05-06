package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaiKhoan {

    private Long ma;
    private String tenDangNhap;
    private String email;
    private String matKhauMaHoa;
    private String vaiTro;
    private Boolean hoatDong;
    private LocalDateTime thoiGianTao;
}
