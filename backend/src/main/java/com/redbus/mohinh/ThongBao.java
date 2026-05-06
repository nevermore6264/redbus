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
public class ThongBao {

    private Long ma;
    private Long maNguoiDung;
    private String tieuDe;
    private String noiDung;
    private Boolean daDoc;
    private LocalDateTime thoiGianTao;
}
