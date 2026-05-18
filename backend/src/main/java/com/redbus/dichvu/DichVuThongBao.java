package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaThongBao;
import com.redbus.mohinh.ThongBao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuThongBao {

    private final AnhXaThongBao anhXaThongBao;
    private final DichVuThongBaoPhat dichVuThongBaoPhat;

    public List<ThongBao> danhSachCuaNguoiDung(Long maTaiKhoan) {
        return anhXaThongBao.danhSachTheoMaNguoiDung(maTaiKhoan);
    }

    @Transactional
    public void danhDauDaDoc(Long maThongBao, Long maTaiKhoan) {
        anhXaThongBao.danhDauDaDoc(maThongBao, maTaiKhoan);
    }

    @Transactional
    public void guiNhanh(Long maNguoiDung, String tieuDe, String noiDung) {
        ThongBao tb = ThongBao.builder()
                .maNguoiDung(maNguoiDung)
                .tieuDe(tieuDe)
                .noiDung(noiDung)
                .daDoc(false)
                .build();
        anhXaThongBao.them(tb);
        dichVuThongBaoPhat.phat(maNguoiDung, tieuDe, noiDung);
    }
}
