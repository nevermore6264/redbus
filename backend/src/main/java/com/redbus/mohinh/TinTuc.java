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
public class TinTuc {

    private Long ma;
    private String tieuDe;
    private String tomTat;
    private String noiDung;
    private String duongAnh;
    private LocalDateTime ngayXuatBan;
    private Boolean hoatDong;
}
