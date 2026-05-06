package com.redbus.mohinh;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoaiXe {

    private Long ma;
    private String ten;
    private String moTa;
    private String tienIch;
    private Boolean hoatDong;

    /** Ảnh minh họa (mã để xóa trong quản trị) — chỉ đọc JSON */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<LoaiXeAnhTomTat> dsAnh;
}
