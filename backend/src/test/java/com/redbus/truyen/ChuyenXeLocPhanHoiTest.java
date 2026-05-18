package com.redbus.truyen;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.redbus.mohinh.ChuyenXe;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ChuyenXeLocPhanHoi")
class ChuyenXeLocPhanHoiTest {
    @Test
    @DisplayName("builder gán trường chuyen")
    void builder_chuyen() {
        ChuyenXeLocPhanHoi o = ChuyenXeLocPhanHoi.builder().chuyen(com.redbus.mohinh.ChuyenXe.builder().ma(1L).build()).build();
        assertEquals(com.redbus.mohinh.ChuyenXe.builder().ma(1L).build(), o.getChuyen());
    }
}
