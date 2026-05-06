package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaXeKhach;
import com.redbus.mohinh.XeKhach;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuXeKhach {

    private final AnhXaXeKhach anhXaXeKhach;

    public List<XeKhach> tatCa() {
        return anhXaXeKhach.tatCa();
    }

    public XeKhach layTheoMa(Long ma) {
        XeKhach x = anhXaXeKhach.timTheoMa(ma);
        if (x == null) {
            throw new IllegalArgumentException("Không có xe");
        }
        return x;
    }

    public XeKhach them(XeKhach x) {
        if (x.getHoatDong() == null) {
            x.setHoatDong(true);
        }
        anhXaXeKhach.them(x);
        return x;
    }

    public XeKhach capNhat(XeKhach x) {
        anhXaXeKhach.capNhat(x);
        return anhXaXeKhach.timTheoMa(x.getMa());
    }

    public void xoa(Long ma) {
        anhXaXeKhach.xoa(ma);
    }
}
