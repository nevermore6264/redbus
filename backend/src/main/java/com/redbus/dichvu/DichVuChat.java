package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaTinNhanChat;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.TinNhanChat;
import com.redbus.truyen.LienHeHoTroPhanHoi;
import com.redbus.truyen.YeuCauGuiChat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DichVuChat {

    private final AnhXaTinNhanChat anhXaTinNhanChat;
    private final AnhXaTaiKhoan anhXaTaiKhoan;

    public Long maTaiKhoanHienTai(String tenDangNhap) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        return tk.getMa();
    }

    public List<LienHeHoTroPhanHoi> danhSachLienHeHoTro() {
        return anhXaTaiKhoan.danhSachHoTro().stream()
                .map(tk -> LienHeHoTroPhanHoi.builder()
                        .ma(tk.getMa())
                        .tenDangNhap(tk.getTenDangNhap())
                        .vaiTro(tk.getVaiTro())
                        .build())
                .toList();
    }

    public List<TinNhanChat> hoiThoai(String tenDangNhap, Long maDoiPhuongTaiKhoan) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        if (maDoiPhuongTaiKhoan == null || maDoiPhuongTaiKhoan.equals(tk.getMa())) {
            throw new IllegalArgumentException("Đối phương không hợp lệ");
        }
        return anhXaTinNhanChat.tinTrongHoiThoai(tk.getMa(), maDoiPhuongTaiKhoan);
    }

    @Transactional
    public TinNhanChat gui(String tenDangNhap, YeuCauGuiChat yeuCau) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        TaiKhoan nhan = anhXaTaiKhoan.timTheoMa(yeuCau.getMaNguoiNhan());
        if (nhan == null) {
            throw new IllegalArgumentException("Người nhận không tồn tại");
        }
        TinNhanChat tin = TinNhanChat.builder()
                .maNguoiGui(tk.getMa())
                .maNguoiNhan(yeuCau.getMaNguoiNhan())
                .noiDung(yeuCau.getNoiDung().trim())
                .daDocNhan(false)
                .build();
        anhXaTinNhanChat.them(tin);
        return tin;
    }
}
