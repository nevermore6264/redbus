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
public class TinNhanChat {

    private Long ma;
    private Long maNguoiGui;
    private Long maNguoiNhan;
    private String noiDung;
    private LocalDateTime thoiGianTao;
    private Boolean daDocNhan;
}
