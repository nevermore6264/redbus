package com.redbus.dichvu;

import com.redbus.anhxa.AnhXaChuyenXe;
import com.redbus.anhxa.AnhXaHinhThucThanhToan;
import com.redbus.anhxa.AnhXaKhachHang;
import com.redbus.anhxa.AnhXaKhuyenMai;
import com.redbus.anhxa.AnhXaTaiKhoan;
import com.redbus.anhxa.AnhXaVeXe;
import com.redbus.mohinh.ChuyenXe;
import com.redbus.mohinh.HinhThucThanhToan;
import com.redbus.mohinh.KhachHang;
import com.redbus.mohinh.TaiKhoan;
import com.redbus.mohinh.VeXe;
import com.redbus.truyen.KetQuaHuyVePhanHoi;
import com.redbus.truyen.VeHoanTienPhanHoi;
import com.redbus.truyen.YeuCauHuyVeHoanTien;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DichVuHuyVeHoanTien {

    private final AnhXaVeXe anhXaVeXe;
    private final AnhXaChuyenXe anhXaChuyenXe;
    private final AnhXaHinhThucThanhToan anhXaHinhThucThanhToan;
    private final AnhXaKhuyenMai anhXaKhuyenMai;
    private final AnhXaTaiKhoan anhXaTaiKhoan;
    private final AnhXaKhachHang anhXaKhachHang;
    private final DichVuThongBao dichVuThongBao;

    @Transactional
    public KetQuaHuyVePhanHoi huyVeDaThanhToan(
            String tenDangNhap, VeXe ve, YeuCauHuyVeHoanTien yeuCau) {
        kiemTraChuVe(tenDangNhap, ve);
        if (!"PAID".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Chỉ hủy được vé đã thanh toán");
        }
        if (yeuCau == null) {
            throw new IllegalArgumentException("Nhập thông tin tài khoản nhận hoàn tiền");
        }
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        if (cx == null || cx.getThoiDiemKhoiHanh().isBefore(LocalDateTime.now().plusHours(2))) {
            throw new IllegalStateException("Chỉ hủy vé trước giờ khởi hành ít nhất 2 giờ");
        }
        if (ve.getSoTienThanhToan() == null || ve.getSoTienThanhToan().signum() <= 0) {
            throw new IllegalStateException("Không xác định được số tiền hoàn");
        }

        String stk = chuanHoa(yeuCau.getStk());
        String tenNganHang = chuanHoa(yeuCau.getTenNganHang());
        String tenNguoiNhan = chuanHoaTenNguoiNhan(yeuCau.getTenNguoiNhan());
        if (stk.isEmpty()) {
            throw new IllegalArgumentException("Nhập số tài khoản");
        }
        if (tenNganHang.isEmpty()) {
            throw new IllegalArgumentException("Chọn ngân hàng");
        }
        if (tenNguoiNhan.isEmpty()) {
            throw new IllegalArgumentException("Nhập tên người nhận");
        }
        if (!tenNguoiNhan.matches("[A-Z ]+")) {
            throw new IllegalArgumentException("Tên người nhận phải in hoa không dấu (A–Z)");
        }
        if (!stk.matches("\\d{6,20}")) {
            throw new IllegalArgumentException("Số tài khoản không hợp lệ");
        }

        HinhThucThanhToan ht =
                ve.getMaHinhThuc() != null ? anhXaHinhThucThanhToan.timTheoMa(ve.getMaHinhThuc()) : null;
        String loai = ht != null ? ht.getMaLoai() : null;
        BigDecimal soTienHoan = ve.getSoTienThanhToan();
        LocalDateTime lucYeuCau = LocalDateTime.now();
        String thongBao =
                "Đã gửi yêu cầu hoàn "
                        + dinhDangTien(soTienHoan)
                        + " — admin sẽ chuyển khoản và xác nhận trong thời gian sớm nhất.";

        anhXaVeXe.capNhatYeuCauHoanTien(
                ve.getMa(), "REFUND_PENDING", soTienHoan, lucYeuCau, stk, tenNganHang, tenNguoiNhan);
        if (ve.getMaKhuyenMai() != null) {
            anhXaKhuyenMai.giamSoLanDung(ve.getMaKhuyenMai());
        }

        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk != null) {
            dichVuThongBao.guiNhanh(tk.getMa(), "Yêu cầu hủy vé & hoàn tiền", thongBao);
        }

        return KetQuaHuyVePhanHoi.builder()
                .maVe(ve.getMa())
                .trangThai("REFUND_PENDING")
                .soTienHoan(soTienHoan)
                .phuongThucHoan(loai)
                .thongBao(thongBao)
                .build();
    }

    public List<VeHoanTienPhanHoi> danhSachChoXuLy() {
        List<VeHoanTienPhanHoi> ketQua = new ArrayList<>();
        for (VeXe ve : anhXaVeXe.danhSachChoHoanTien()) {
            ketQua.add(sangPhanHoi(ve));
        }
        return ketQua;
    }

    @Transactional
    public VeHoanTienPhanHoi xacNhanHoanTien(Long maVe) {
        VeXe ve = anhXaVeXe.timTheoMa(maVe);
        if (ve == null) {
            throw new IllegalArgumentException("Không có vé");
        }
        if (!"REFUND_PENDING".equals(ve.getTrangThai())) {
            throw new IllegalStateException("Vé không ở trạng thái chờ hoàn tiền");
        }
        LocalDateTime lucHoan = LocalDateTime.now();
        int capNhat = anhXaVeXe.capNhatXacNhanHoanTien(maVe, lucHoan);
        if (capNhat == 0) {
            throw new IllegalStateException("Không thể xác nhận hoàn tiền");
        }
        VeXe moi = anhXaVeXe.timTheoMa(maVe);
        KhachHang kh = anhXaKhachHang.timTheoMa(moi.getMaKhach());
        if (kh != null && kh.getMaTaiKhoan() != null) {
            String tien = dinhDangTien(moi.getSoTienHoan());
            dichVuThongBao.guiNhanh(
                    kh.getMaTaiKhoan(),
                    "Đã hoàn tiền",
                    "Admin đã xác nhận chuyển hoàn " + tien + " vào tài khoản "
                            + moi.getTenNganHangHoan()
                            + " — "
                            + moi.getStkHoan()
                            + ".");
        }
        return sangPhanHoi(moi);
    }

    private VeHoanTienPhanHoi sangPhanHoi(VeXe ve) {
        KhachHang kh = anhXaKhachHang.timTheoMa(ve.getMaKhach());
        ChuyenXe cx = anhXaChuyenXe.timTheoMa(ve.getMaChuyen());
        HinhThucThanhToan ht =
                ve.getMaHinhThuc() != null ? anhXaHinhThucThanhToan.timTheoMa(ve.getMaHinhThuc()) : null;
        String phuongThuc = ht != null ? ht.getTen() : null;
        if (phuongThuc == null && ht != null) {
            phuongThuc = ht.getMaLoai();
        }
        return VeHoanTienPhanHoi.builder()
                .maVe(ve.getMa())
                .maVeHienThi(ve.getMaVeHienThi())
                .trangThai(ve.getTrangThai())
                .soTienHoan(ve.getSoTienHoan())
                .thoiGianYeuCauHoan(ve.getThoiGianYeuCauHoan())
                .stkHoan(ve.getStkHoan())
                .tenNganHangHoan(ve.getTenNganHangHoan())
                .tenNguoiNhanHoan(ve.getTenNguoiNhanHoan())
                .tenKhach(kh != null ? kh.getHoTen() : null)
                .soDienThoaiKhach(kh != null ? kh.getSoDienThoai() : null)
                .maChuyen(ve.getMaChuyen())
                .thoiDiemKhoiHanh(cx != null ? cx.getThoiDiemKhoiHanh() : null)
                .phuongThucThanhToan(phuongThuc)
                .build();
    }

    private void kiemTraChuVe(String tenDangNhap, VeXe ve) {
        TaiKhoan tk = anhXaTaiKhoan.timTheoTenDangNhap(tenDangNhap);
        if (tk == null) {
            throw new IllegalArgumentException("Không tìm thấy tài khoản");
        }
        KhachHang kh = anhXaKhachHang.timTheoMaTaiKhoan(tk.getMa());
        if (kh == null || !ve.getMaKhach().equals(kh.getMa())) {
            throw new IllegalStateException("Không phải vé của bạn");
        }
    }

    private String chuanHoa(String s) {
        return s == null ? "" : s.trim();
    }

    private String chuanHoaTenNguoiNhan(String s) {
        if (s == null) {
            return "";
        }
        String x = Normalizer.normalize(s.trim(), Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        x = x.replace('đ', 'd').replace('Đ', 'D').toUpperCase(Locale.ROOT);
        x = x.replaceAll("[^A-Z ]", "").replaceAll("\\s+", " ").trim();
        return x;
    }

    private String dinhDangTien(BigDecimal soTien) {
        return NumberFormat.getNumberInstance(new Locale("vi", "VN")).format(soTien) + " đ";
    }
}
