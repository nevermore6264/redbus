package com.redbus.mohinh;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnhLoaiXe {

    private Long ma;
    private Long maLoaiXe;
    
    private String tep;
    private Integer thuTu;
}
