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
public class HoiDap {

    private Long ma;
    private Long maKhach;
    private String tieuDe;
    private String noiDungHoi;
    private String noiDungTraLoi;
    private Long maNguoiTraLoi;
    private LocalDateTime thoiGianHoi;
    private LocalDateTime thoiGianTraLoi;
    private String trangThai;
}
