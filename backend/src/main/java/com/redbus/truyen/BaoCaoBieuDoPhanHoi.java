package com.redbus.truyen;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BaoCaoBieuDoPhanHoi {

    private List<MucBieuDo> doanhThuTheoNgay;
    private List<MucBieuDo> trangThaiVe;
    private List<MucBieuDo> phuongThucThanhToan;
    private List<MucBieuDo> topTuyenTheoVe;
    private List<MucBieuDo> phanBoDanhGia;
}
